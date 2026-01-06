# Note Tecniche - Analizzatore Manuali Universitari

## Architettura Tecnica

### Stack Tecnologico

```
Frontend:
├── HTML5
├── CSS3 (Tailwind CSS via CDN)
└── JavaScript ES6+ (Vanilla)

Librerie Esterne (CDN):
├── PDF.js 3.11.174 (Mozilla) - Parsing PDF
├── Papa Parse 5.4.1 - Parsing CSV  
├── Marked.js 9.1.6 - Rendering Markdown
└── Font Awesome 6.4.0 - Icone

API:
└── OpenAI GPT-4o - Analisi LLM
```

### Struttura Dati

#### App State
```javascript
{
    apiKey: string,           // Chiave API OpenAI
    frameworkData: Array,     // Dati parsed dal CSV
    volume1Text: string,      // Testo estratto da PDF Volume 1
    volume2Text: string,      // Testo estratto da PDF Volume 2
    hasVolume2: boolean,      // Flag per doppio volume
    analysisType: 'A'|'B',   // Tipo di analisi
    isProcessing: boolean,    // Flag elaborazione in corso
    lastResults: string       // Ultimo risultato (Markdown)
}
```

#### Framework CSV Schema (Flessibile)
Il parser accetta qualsiasi struttura CSV. Esempio consigliato:
```csv
Materia,Argomento,Dettagli,Classi_Laurea,Livello,Note
```

## Flusso di Elaborazione

### 1. Caricamento Framework (CSV)
```
File Upload → Papa.parse() → JSON Array → appState.frameworkData
```

### 2. Estrazione PDF
```
File Upload → ArrayBuffer → PDF.js getDocument() →
→ Loop su pagine → getTextContent() → Concatenazione testo →
→ appState.volume1Text / volume2Text
```

### 3. Costruzione Prompt
```
Framework Text (formatted) + Volume Text(s) + Analysis Type →
→ Structured Prompt → OpenAI API
```

### 4. Chiamata OpenAI
```
Prompt → fetch('https://api.openai.com/v1/chat/completions') →
→ Response JSON → Extract message.content → Markdown
```

### 5. Rendering Risultati
```
Markdown Text → marked.parse() → HTML → Inject in DOM
```

## Gestione Token OpenAI

### Limiti Modello GPT-4o
- **Input**: 128,000 tokens
- **Output**: 4,096 tokens
- **Costo**: ~$2.50/1M input tokens, ~$10/1M output tokens

### Stima Token per Analisi
```
Framework CSV (100 righe):     ~2,000 tokens
Indice PDF (30 pagine):        ~8,000 tokens  
System + User Prompt:          ~1,000 tokens
────────────────────────────────────────────
TOTALE INPUT:                  ~11,000 tokens
OUTPUT (analisi dettagliata):  ~2,500 tokens
────────────────────────────────────────────
Costo stimato:                 ~$0.03-0.05
```

### Ottimizzazione Token
Per indici molto lunghi (50+ pagine):
1. Estrarre solo sezioni principali dell'indice
2. Rimuovere numeri di pagina se non necessari
3. Usare `max_tokens` più basso per output concisi
4. Considerare chunking per analisi molto grandi

## Sicurezza e Privacy

### Gestione API Key
```javascript
// Salvata in sessionStorage (non persistent)
sessionStorage.setItem('openai_api_key', apiKey);

// Cancellata automaticamente alla chiusura tab
// MAI inviata a server terzi (solo OpenAI)
```

### CORS e Sicurezza Browser
```javascript
// OpenAI API supporta CORS da browser
// Header Authorization con Bearer token
// Nessun proxy server necessario
```

### Validazione Input
- File CSV: validazione tipo MIME
- File PDF: controllo estensione e parsing
- API Key: verifica formato "sk-..."
- Dimensioni file: gestite automaticamente da browser

## Performance

### Ottimizzazioni Implementate

1. **Parsing PDF Incrementale**
   - Progress bar durante estrazione pagine
   - Non blocca UI thread (async/await)

2. **CSV Parsing**
   - Papa Parse con streaming per file grandi
   - Skip empty lines automatico

3. **UI Responsiveness**
   - Async operations con loading states
   - Disabilitazione form durante elaborazione
   - Progress indicators

### Bottleneck Identificati
- **OpenAI API latency**: 30-120 secondi per analisi complesse
- **PDF parsing**: ~1-2 secondi per pagina (variabile)
- **Network**: dipende da velocità connessione utente

## Estensibilità

### Aggiunta Nuovi Provider LLM

Per aggiungere Claude o Perplexity:

```javascript
// In app.js, creare nuove funzioni:

async function callClaude(prompt) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': appState.claudeApiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-opus-20240229',
            max_tokens: 4096,
            messages: [{ role: 'user', content: prompt }]
        })
    });
    
    const data = await response.json();
    return data.content[0].text;
}

async function callPerplexity(prompt) {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${appState.perplexityApiKey}`
        },
        body: JSON.stringify({
            model: 'llama-3.1-sonar-large-128k-online',
            messages: [{ role: 'user', content: prompt }]
        })
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
}
```

### Nuovi Tipi di Analisi

Per aggiungere "Tipo C" (es: Analisi Comparativa):

1. Aggiungere radio button in HTML
2. Implementare prompt in `buildPrompt()`
3. Aggiungere case in `startAnalysis()`

### Export Formati Aggiuntivi

```javascript
// Export PDF con jsPDF
function exportPdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(appState.lastResults, 10, 10);
    doc.save('analisi.pdf');
}

// Export Word con docx.js
async function exportWord() {
    const doc = new docx.Document({
        sections: [{
            children: [
                new docx.Paragraph({ text: appState.lastResults })
            ]
        }]
    });
    
    const blob = await docx.Packer.toBlob(doc);
    saveAs(blob, 'analisi.docx');
}
```

## Testing

### Test Manuale Raccomandati

1. **Test API Key**
   - Key valida → successo
   - Key invalida → errore chiaro
   - Key senza credito → errore specifico

2. **Test Upload File**
   - CSV valido → parsing corretto
   - CSV malformato → errore gestito
   - PDF testuale → estrazione corretta
   - PDF scansionato → messaggio di errore

3. **Test Analisi**
   - Framework piccolo + indice breve → <1 min
   - Framework grande + 2 volumi → 2-3 min
   - Tipo A vs Tipo B → output diversi

4. **Test Export**
   - Markdown → file .md valido
   - HTML → file .html standalone funzionante

### Test di Carico

```javascript
// Limiti testati:
- Framework CSV: fino a 500 righe ✓
- PDF: fino a 100 pagine (~200k tokens) ✓
- Analisi simultanee: 1 (per design)
```

## Troubleshooting

### Errori Comuni

**"Failed to fetch"**
```
Causa: CORS o network issue
Soluzione: 
- Verifica connessione internet
- Controlla console per dettagli CORS
- Verifica API endpoint disponibile
```

**"Invalid API key"**
```
Causa: Key errata o senza credito
Soluzione:
- Verifica formato "sk-..."
- Controlla credito su OpenAI dashboard
- Rigenera key se necessario
```

**"PDF parsing error"**
```
Causa: PDF corrotto o scansione
Soluzione:
- Verifica che PDF abbia testo selezionabile
- Usa OCR per PDF scansionati
- Prova "Salva con nome" per rigenerare
```

### Debug Mode

Abilitare console logging per debug:

```javascript
// In app.js, aggiungere all'inizio:
const DEBUG = true;

// Poi nei punti chiave:
if (DEBUG) console.log('Framework data:', appState.frameworkData);
if (DEBUG) console.log('Prompt:', prompt);
if (DEBUG) console.log('API Response:', data);
```

## Deployment

### Opzioni di Hosting

1. **Hosting Statico**
   - GitHub Pages (gratuito)
   - Netlify (gratuito)
   - Vercel (gratuito)
   - Cloudflare Pages (gratuito)

2. **Server Interno**
   - Nginx/Apache
   - Nessuna configurazione server-side richiesta
   - Solo file statici

### Build Process

Nessun build necessario! Files pronti per deploy:
```bash
# Tutto il contenuto della cartella può essere deployato as-is
index.html
guida-rapida.html
js/app.js
esempio-framework.csv
README.md
```

### Variabili d'Ambiente

Non necessarie per l'applicazione base. 
Per versione con key preconfigurate (uso interno):

```javascript
// In app.js:
const DEFAULT_API_KEY = process.env.OPENAI_API_KEY || '';
```

## Roadmap Future Features

### V2.0 Pianificate
- [ ] Multi-provider (Claude, Perplexity)
- [ ] Salvataggio analisi in IndexedDB
- [ ] Confronto side-by-side tra manuali
- [ ] Template framework predefiniti
- [ ] Export PDF avanzato
- [ ] Analytics e statistiche

### V3.0 Idee
- [ ] Batch processing multipli manuali
- [ ] Dashboard con storico
- [ ] Condivisione via link
- [ ] Integrazione Google Drive
- [ ] API REST per automazione
- [ ] Mobile app (PWA)

## Contribuzione

Per contribuire al progetto:
1. Fork del repository
2. Branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Pull Request

### Code Style
- JavaScript: ES6+ syntax
- Indentazione: 4 spazi
- Naming: camelCase per funzioni/variabili
- Commenti: JSDoc per funzioni pubbliche

---

**Versione Documento**: 1.0  
**Ultima Modifica**: 2025-01-24  
**Autore**: Zanichelli Development Team
