# 📚 MAP - Manual Analyses Platform

**Versione**: v1.15.3 "Libreria Framework e Manuali Firebase"

Piattaforma web professionale per l'analisi automatica di manuali universitari rispetto a framework di valutazione, utilizzando l'intelligenza artificiale di OpenAI, Anthropic Claude e Perplexity AI.

---

## 📑 Navigazione Rapida

**Nuovo qui?**
- 👉 [LEGGIMI.txt](LEGGIMI.txt) - Inizio rapido in 5 minuti
- 👉 [Guida Rapida (HTML)](guida-rapida.html) - Tutorial illustrato completo
- 👉 [Indice Documentazione](INDICE.md) - Mappa di tutti i documenti

**Documentazione Completa:**
- 📖 [README.md](README.md) - Questo file (documentazione principale)
- 🔧 [Note Tecniche](NOTE-TECNICHE.md) - Dettagli tecnici per sviluppatori
- 📚 [Guida Gestione Framework e Manuali](GUIDA-GESTIONE-FRAMEWORK-MANUALI.md) - **NUOVO!** Come aggiungere/modificare dati Firebase
- 🚀 [Guida Deploy Produzione](GUIDA-DEPLOY-PRODUZIONE.md) - Workflow Git per deploy
- 🔒 [Workflow Upload Sicuro](WORKFLOW-UPLOAD-SICURO.md) - Procedure sicurezza Firebase
- ❓ [FAQ Framework CSV](FAQ-FRAMEWORK-CSV.md) - Tutto sul formato CSV
- 📊 [Riepilogo Progetto](RIEPILOGO-PROGETTO.md) - Overview completo
- 📝 [Changelog](CHANGELOG.md) - Versioni e roadmap

---

## 🎯 Funzionalità Principali

### ✅ Features Implementate

1. **🆕 Libreria Framework Firebase (v1.15.0)**
   - **Dropdown framework precaricati**: Seleziona da ~50 framework già disponibili
   - **Filtro per materia**: Framework organizzati per disciplina
   - **Caricamento istantaneo**: Da 2 minuti → 10 secondi ⚡
   - **Fallback CSV custom**: Upload framework personalizzati sempre disponibile
   - Struttura dati: Collection `frameworks` su Firestore
   - Upload helper: `upload-frameworks-to-firebase.html`

1bis. **🆕 Libreria Manuali Firebase (v1.15.3)**
   - **Dropdown manuali precaricati**: Seleziona da ~80 manuali già disponibili
   - **Filtri avanzati**: Materia, Editore, Autore
   - **Ordinamento alfabetico**: Manuali ordinati per autore
   - **Anteprima indice**: Visualizza capitoli e sezioni prima di analizzare
   - **Supporto multi-volume**: Seleziona Volume 1 e Volume 2 separatamente
   - **Caricamento istantaneo**: Da 1-2 minuti → 5-10 secondi ⚡
   - **Fallback PDF custom**: Upload PDF personalizzati sempre disponibile
   - Struttura dati: Collection `manuals` su Firestore
   - Upload helper: `upload-manuals-to-firebase.html`
   - **📚 [Guida completa](GUIDA-GESTIONE-FRAMEWORK-MANUALI.md)** per aggiungere/modificare manuali

2. **Caricamento Multiplo di File**
   - Upload framework di valutazione in formato CSV (⭐ **qualsiasi struttura, qualsiasi materia!**)
   - **OPPURE** Selezione rapida da libreria Firebase (NEW)
   - Upload indice Volume 1 (PDF)
   - Upload opzionale indice Volume 2 (PDF) per corsi multi-volume

> 💡 **Nota Importante**: L'app funziona con **QUALSIASI materia universitaria**! Fisica, Chimica, Matematica, Diritto, Economia, Programmazione, Medicina, e qualsiasi altra disciplina. Vedi [FRAMEWORK-QUALSIASI-MATERIA.md](FRAMEWORK-QUALSIASI-MATERIA.md) per dettagli.

3. **Due Tipi di Analisi**
   - **Tipo A - Analisi Generale**: valutazione complessiva del manuale
   - **Tipo B - Analisi per Classi di Laurea**: valutazione specifica per ogni classe

3. **🌐 Multi-Provider AI (NEW v1.14.0)**
   - **3 Provider**: OpenAI, Anthropic Claude, Perplexity AI
   - **11 Modelli selezionabili**: da $0.003 a $0.383 per analisi
   - **Caching intelligente**: Analisi ripetute istantanee e gratuite (risparmio 80-95%)
   - Gestione sicura chiavi API (solo lato client, nessun server)
   - Supporto per indici lunghi (fino a 200K tokens con Claude)

4. **Gestione Corsi Multi-Volume**
   - Supporto specifico per Fisica 1/2, Analisi 1/2, etc.
   - Merge automatico degli indici
   - Analisi coordinata dei due volumi

5. **Export Risultati**
   - Esportazione in formato Markdown (.md)
   - Esportazione in formato HTML standalone
   - Risultati formattati e professionali

6. **Visualizzazione Prompt** (v1.1.0)
   - Bottone "Visualizza Prompt" per vedere la richiesta inviata all'AI
   - Copia prompt negli appunti con un click
   - Scarica prompt come file .txt
   - Temperature = 0 per massima consistenza

7. **Salvataggio Automatico** (v1.2.0)
   - Ogni analisi viene salvata automaticamente in IndexedDB
   - Analisi persistono anche chiudendo il browser
   - Output dettagliati: da 1,500 a 3,000+ parole
   - Max tokens aumentato a 16,384

8. **Storico Analisi Organizzato** (v1.3.0 → v1.4.0)
   - Bottone "Storico Analisi (N)" con contatore live
   - **Raggruppamento automatico per materia** (NEW!)
   - Sezioni collassabili con badge colorati
   - Gestione completa: visualizza, esporta, elimina
   - Esporta tutte le analisi in un file

9. **Confronto Side-by-Side** (v1.4.0 → v1.14.2)
   - Seleziona 2 analisi con checkbox
   - Modal dedicato con layout a 2 colonne
   - **🖱️ Scroll sincronizzato proporzionale** (NEW v1.14.2): scroll fluido anche per analisi di lunghezze diverse
   - **🔄 Pulsante "Azzera Selezione"** (NEW v1.14.2): 1 click per deselezionare tutto e ricominciare
   - Confronta anche manuali di materie diverse
   - Esporta confronto in singolo file Markdown

10. **Campo Materia Manuale** (v1.5.0)
    - Inserisci manualmente la materia nel form
    - Materia sempre corretta (no più "Altra Materia")
    - Campo obbligatorio con validazione

11. **Accordion Gerarchico Volume** (v1.5.0)
    - Storico organizzato: Materia → Volume → Analisi
    - Zero duplicati (volume appare 1 volta)
    - Espandi/collassa volumi per vedere analisi
    - Layout compatto e scannable

12. **Auto-Estrazione Materia** (v1.6.0)
    - Materia estratta automaticamente dal CSV framework
    - Fallback su nome file se colonna non presente
    - Campo modificabile manualmente se necessario
    - Zero input manuale richiesto

13. **Normalizzazione Materie** (v1.6.1)
    - Raggruppamento intelligente nello storico
    - Gestisce maiuscole/minuscole automaticamente
    - Una sola sezione per materia (no duplicati)
    - "CHIMICA ORGANICA" e "Chimica Organica" → stesso gruppo

14. **Export Professionali** (v1.7.0) ⭐ NUOVO
    - **Export PDF**: Layout professionale con logo Zanichelli, pronto per stampa
    - **Export HTML**: Design moderno responsive con colori aziendali
    - **Export Markdown**: Mantenuato per compatibilità
    - Dropdown menu per scegliere il formato preferito
    - Stessi formati disponibili per analisi singole e storico completo

15. **Sistema Pubblicazione** (v1.7.0) ⭐ NUOVO
    - Pulsante "Pubblica/Privata" per ogni analisi
    - Badge visivo "Pubblica" sulle analisi condivise
    - Sistema pronto per Viewer App dei colleghi
    - Flag `pubblicata` salvato nel database

16. **Integrazione Firebase Cloud** (v1.8.0) ☁️
    - Sincronizzazione automatica analisi pubblicate su Firebase Firestore
    - Backup cloud delle analisi condivise
    - Badge status Firebase in tempo reale
    - Architettura a due app: Admin (questa) + Viewer (colleghi)
    - Zero configurazione per i colleghi (solo lettura)
    - Dettagli: [FIREBASE-INTEGRATION.md](FIREBASE-INTEGRATION.md)

17. **Estrazione Automatica Metadata PDF** (v1.9.0) 📄 ULTIMO
    - Lettura automatica Autore/Titolo/Editore dalla prima pagina PDF
    - Box informativo mostra metadata estratti nel form
    - Pre-compilazione automatica campo Materia con titolo
    - Salvataggio automatico autore/editore nel database
    - Visualizzazione metadata nello Storico e negli export
    - Formato prima pagina PDF standardizzato

## 🚀 Come Utilizzare l'Applicazione

### Passo 1: Preparare i File

**Framework CSV:**
Il file CSV deve contenere il framework di valutazione. Può avere qualsiasi struttura, ad esempio:

```csv
Materia,Argomento,Dettagli,Classi_Laurea,Livello
Fisica,Meccanica,Cinematica e dinamica,"L-30, L-31",Avanzato
Fisica,Termodinamica,Principi fondamentali,"L-30, L-31, L-27",Base
Matematica,Analisi,Limiti e continuità,"L-35, L-31",Base
```

**Indici PDF:**
- Estrai l'indice dettagliato del manuale in formato PDF
- Per corsi multi-volume (es: Fisica 1 e Fisica 2), prepara due PDF separati

### Passo 2: Ottenere Chiave API OpenAI

1. Vai su [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Crea un account o effettua il login
3. Genera una nuova API key (inizia con "sk-...")
4. **IMPORTANTE**: Assicurati di avere credito disponibile sul tuo account OpenAI

### Passo 3: Utilizzare l'Applicazione

1. **Apri l'applicazione** nel browser (index.html)

2. **Inserisci la chiave API OpenAI**
   - Incolla la tua chiave nel campo "Chiave API OpenAI"
   - Clicca "Verifica Chiave" per testare la connessione
   - La chiave viene salvata solo nella sessione del browser (sicuro)

3. **Carica i file**
   - Carica il framework CSV
   - Carica l'indice del Volume 1 (PDF)
   - Se il corso è diviso in 2 volumi:
     - Spunta "Il manuale è diviso in 2 volumi"
     - Carica anche l'indice del Volume 2 (PDF)

4. **Seleziona il tipo di analisi**
   - **Tipo A**: per una valutazione generale del manuale
   - **Tipo B**: per un'analisi specifica per classi di laurea

5. **Avvia l'analisi**
   - Clicca "Avvia Analisi"
   - Attendi (può richiedere 1-3 minuti per indici lunghi)
   - Visualizza i risultati

6. **Esporta i risultati**
   - Clicca "Esporta Markdown" per file .md
   - Clicca "Esporta HTML" per file .html standalone

## 📊 Tipi di Analisi

### Analisi Tipo A - Generale

Fornisce una valutazione completa che include:

- **Copertura degli Argomenti**: quali argomenti del framework sono presenti
- **Lacune Identificate**: cosa manca rispetto al framework
- **Punti di Forza**: aspetti particolarmente positivi del manuale
- **Struttura e Organizzazione**: valutazione della progressione didattica
- **Valutazione Complessiva**: punteggio 1-10 e raccomandazioni

**Ideale per:**
- Valutazione iniziale di un nuovo manuale
- Confronto tra diversi manuali
- Decisioni sull'adozione di un testo

### Analisi Tipo B - Per Classi di Laurea

Fornisce una valutazione specifica per ogni classe di laurea, includendo:

- **Adeguatezza Complessiva**: quanto è adatto per ogni classe
- **Argomenti Rilevanti**: contenuti specifici per la classe
- **Argomenti Mancanti**: lacune specifiche per la classe
- **Raccomandazioni d'Uso**: come utilizzare il manuale per ogni classe
- **Valutazione Numerica**: punteggio 1-10 per classe
- **Comparative Assessment**: confronto tra le classi

**Ideale per:**
- Selezione mirata per corsi specifici
- Pianificazione di materiale integrativo
- Personalizzazione della didattica per classe

## 🔧 Caratteristiche Tecniche

### Tecnologie Utilizzate

- **Frontend**: HTML5, CSS3 (Tailwind CSS), JavaScript (ES6+)
- **Librerie**:
  - PDF.js (Mozilla) - parsing PDF
  - Papa Parse - parsing CSV
  - Marked.js - rendering Markdown
  - Font Awesome - icone
- **API**: OpenAI GPT-4o

### Compatibilità

- ✅ Chrome/Edge (consigliato)
- ✅ Firefox
- ✅ Safari
- ✅ Funziona offline dopo il primo caricamento
- ✅ Nessuna installazione richiesta

### Sicurezza

- ✅ La chiave API viene utilizzata solo nel browser
- ✅ Nessun dato viene inviato a server esterni (eccetto OpenAI)
- ✅ I file rimangono sul tuo dispositivo
- ✅ La chiave API è salvata solo in sessionStorage (cancellata alla chiusura)

## 💡 Consigli per l'Uso

### Per Risultati Ottimali

1. **Framework CSV Dettagliato**
   - Includi tutte le informazioni rilevanti (materia, argomenti, dettagli)
   - Specifica chiaramente le classi di laurea
   - Usa una struttura coerente

2. **Indici PDF Completi**
   - Assicurati che gli indici siano testuali (non scansioni)
   - Includi tutti i capitoli, sezioni e sottosezioni
   - Per multi-volume: usa indici separati e ben distinti

3. **Scelta del Tipo di Analisi**
   - Usa Tipo A per prime valutazioni o confronti generali
   - Usa Tipo B quando devi adottare il manuale per classi specifiche

4. **Gestione Token API**
   - Gli indici molto lunghi consumano più token
   - Considera di estrarre solo le sezioni rilevanti per analisi mirate
   - Monitora l'uso del tuo credito OpenAI

### Gestione Errori Comuni

**"Chiave API non valida"**
- Verifica di aver copiato l'intera chiave (inizia con "sk-")
- Controlla di avere credito disponibile su OpenAI
- Assicurati di non avere restrizioni sull'account

**"Errore nell'estrazione del PDF"**
- Assicurati che il PDF contenga testo (non solo immagini)
- Prova a rigenerare il PDF con "Salva con nome"
- Verifica che il file non sia corrotto

**"Analisi troppo lunga"**
- Per indici molto lunghi (>50 pagine), considera di:
  - Estrarre solo l'indice principale
  - Dividere l'analisi in sezioni
  - Utilizzare un modello più economico (se disponibile)

## 📁 Struttura del Progetto

```
analizzatore-manuali/
├── index.html          # Interfaccia principale
├── js/
│   └── app.js         # Logica applicazione
└── README.md          # Questa documentazione
```

## 🔮 Sviluppi Futuri (Non Ancora Implementati)

- [ ] Supporto per API Claude e Perplexity
- [ ] Salvataggio delle analisi nel browser (IndexedDB)
- [ ] Confronto diretto tra 2-3 manuali
- [ ] Template di framework predefiniti
- [ ] Export in formato PDF
- [ ] Analisi batch di più manuali
- [ ] Dashboard con storico analisi
- [ ] Condivisione risultati via link

## 📞 Supporto e Feedback

Per problemi, suggerimenti o richieste di nuove funzionalità, contatta il team di sviluppo Zanichelli.

## 📄 Licenza

© 2025 Zanichelli Editore - Uso interno per promotori editoriali universitari.

---

## 🌐 Deployment su Netlify

### Metodo 1: Drag & Drop (Più Semplice)

1. **Scarica i file dell'applicazione**
   - Vai nella tab "Publish" di questa piattaforma
   - Oppure scarica manualmente tutti i file:
     - `index.html`
     - `js/app.js`
     - Tutti i file di documentazione (README.md, guida-rapida.html, etc.)

2. **Accedi a Netlify**
   - Vai su [https://www.netlify.com/](https://www.netlify.com/)
   - Crea un account gratuito o fai login

3. **Deploy con Drag & Drop**
   - Dalla dashboard Netlify, trascina la cartella con i file
   - Netlify caricherà automaticamente l'app
   - Riceverai un URL tipo: `https://tuosito-random.netlify.app`

4. **Personalizza URL (opzionale)**
   - Vai in "Site settings" → "Change site name"
   - Scegli un nome: `analizzatore-zanichelli.netlify.app`

### Metodo 2: Deploy da Git (Più Avanzato)

Se usi Git/GitHub:

1. Carica il progetto su un repository GitHub
2. In Netlify: "New site from Git"
3. Connetti il repository
4. Netlify farà il deploy automatico ad ogni push

### ⚙️ Configurazione Build Settings

Per questo progetto **NON serve configurazione build**:
- Build command: (lascia vuoto)
- Publish directory: `/` (root)

Il progetto è 100% statico (HTML, CSS, JS) e funziona immediatamente!

### 🔒 Sicurezza della Chiave API

⚠️ **IMPORTANTE**: La chiave OpenAI è gestita **solo lato client**:
- Non viene mai salvata nei file
- Non viene inviata a Netlify
- Ogni utente deve inserire la propria chiave
- La chiave è salvata solo in sessionStorage (cancellata alla chiusura)

### ✅ Verifica Deployment

Dopo il deploy, verifica che:
1. ✅ La pagina si carica correttamente
2. ✅ Il form di upload funziona
3. ✅ L'inserimento della chiave API funziona
4. ✅ Le analisi vengono salvate in IndexedDB
5. ✅ Lo storico analisi persiste dopo il refresh

### 🌍 Domini Personalizzati

Netlify permette di usare il tuo dominio:
1. Vai in "Domain settings"
2. Aggiungi il tuo dominio (es: `analisi.zanichelli.com`)
3. Configura i DNS come indicato da Netlify

---

**Versione**: 1.7.0 🎉  
**Data Rilascio**: Gennaio 2025  
**Modello AI**: OpenAI GPT-4o  
**Ultimo Aggiornamento**: Export PDF/HTML professionali + Sistema pubblicazione colleghi
