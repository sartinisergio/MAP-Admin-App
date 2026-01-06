# 📤 Workflow Pubblicazione Analisi

## 🎯 Concetto Centrale

**Modello Centralizzato**: Tu (admin) generi le analisi, i colleghi le consultano in modalità read-only.

---

## 🔄 Flusso di Lavoro Completo

### 1️⃣ **TU: Generazione Analisi**

```
1. Apri l'app admin
2. Carica CSV framework + PDF indici
3. Clicca "Analizza"
4. Visualizza risultati
5. Salva automaticamente nel database locale
```

**Cosa succede:**
- ✅ Analisi salvata in IndexedDB
- ✅ Flag `pubblicata: false` (privata di default)
- ✅ Visibile solo a te nello "Storico Analisi"

---

### 2️⃣ **TU: Pubblicazione per Colleghi**

```
1. Vai in "Storico Analisi"
2. Trova l'analisi da condividere
3. Clicca "Pubblica" (pulsante teal/verde)
4. L'analisi diventa pubblica
```

**Cosa succede:**
- ✅ Flag cambiato a `pubblicata: true`
- ✅ Badge "🌐 Pubblica" appare sulla card
- ✅ Pulsante diventa "Privata" (arancione) per reversal
- ✅ L'analisi sarà visibile nella **Viewer App** (futura)

**Reversibile:**
- Clicca di nuovo "Privata" per renderla privata
- Il flag torna a `pubblicata: false`
- Sparisce dalla galleria pubblica

---

### 3️⃣ **TU: Export Professionale**

Prima di pubblicare, puoi esportare in formato elegante:

**Export PDF** (Consigliato):
```
1. Clicca dropdown "Esporta"
2. Seleziona "PDF"
3. Attendi generazione (5-15 secondi)
4. Scarica il file PDF professionale
```

**Caratteristiche PDF:**
- 📄 Layout A4 perfetto per stampa
- 🎨 Header con logo Zanichelli
- 📊 Formattazione professionale
- 🔒 Non modificabile (sicuro)

**Export HTML** (Alternativa):
```
1. Clicca dropdown "Esporta"
2. Seleziona "HTML"
3. Scarica file HTML standalone
```

**Caratteristiche HTML:**
- 🌐 Apribile ovunque (anche senza internet dopo download)
- 📱 Responsive (funziona su mobile/tablet)
- 🎨 Design moderno con colori Zanichelli
- 🖨️ Stampabile in PDF dal browser (Ctrl+P)

---

### 4️⃣ **COLLEGHI: Consultazione** (Futuro)

> ⚠️ La **Viewer App** è il prossimo step di sviluppo

**Quando sarà pronta:**
```
1. Colleghi aprono https://biblioteca.analisi.com
2. Vedono galleria con tutte le analisi pubblicate
3. Possono:
   - 📚 Sfogliare per materia
   - 🔍 Cercare per volume/editore
   - 👁️ Visualizzare analisi complete
   - 📥 Scaricare PDF/HTML
   - ⚖️ Confrontare due analisi
```

---

## 🗂️ Stati di un'Analisi

### 🔒 **Privata** (Default)
- Visibile solo a te nell'app admin
- Flag: `pubblicata: false`
- Pulsante: 🌐 "Pubblica" (teal/verde)
- Badge: nessuno

### 🌐 **Pubblica**
- Visibile nella galleria colleghi
- Flag: `pubblicata: true`
- Pulsante: 👁️‍🗨️ "Privata" (arancione)
- Badge: "🌐 Pubblica" (teal)

---

## 📊 Caso d'Uso Reale

### Scenario: Analisi Chimica Organica

**Richiesta del Collega:**
> "Sergio, mi serve un'analisi del Bruice vs Framework Zanichelli 2024"

**Tuo Workflow:**

1. **Generazione** (5 minuti):
   ```
   - Carica framework-chimica-organica.csv
   - Carica indice-bruice.pdf
   - Analizza (attendi AI)
   - Risultato: analisi completa 2000+ parole
   ```

2. **Opzione A - Pubblicazione in Galleria**:
   ```
   - Vai in "Storico Analisi"
   - Trova "Bruice_Edises.pdf - Chimica Organica"
   - Clicca "Pubblica"
   - Comunica al collega: "È online nella galleria"
   ```

3. **Opzione B - Invio Diretto** (attuale, prima della Viewer App):
   ```
   - Dropdown "Esporta" → "PDF"
   - Attendi 10 secondi
   - Scarica "Analisi_Bruice_2025-01-24.pdf"
   - Invia via email al collega
   ```

**Collega riceve:**
- ✅ PDF professionale con logo Zanichelli
- ✅ Analisi completa, ben formattata
- ✅ Pronto per stampa o presentazione

---

## 🔐 Sicurezza e Privacy

### Dati Riservati
- ✅ Tutte le analisi sono salvate **SOLO nel tuo browser**
- ✅ Nessun server esterno (tranne OpenAI per generazione)
- ✅ Flag "pubblicata" è solo metadata locale

### Quando Verrà Creata la Viewer App
Due opzioni di architettura:

**Opzione 1 - Condivisione Manuale** (più semplice):
- Esporti PDF/HTML delle analisi pubblicate
- Le carichi manualmente su una cartella Netlify
- La Viewer App legge da quella cartella

**Opzione 2 - Database Condiviso** (più avanzata):
- Le analisi "pubblicate" vengono sincronizzate su un database cloud
- La Viewer App legge da quel database
- Aggiornamento automatico in tempo reale

---

## 🎨 Design dei Pulsanti

### Pulsante "Pubblica/Privata"
```
STATO PRIVATO:
┌─────────────────┐
│ 🌐 Pubblica     │  ← Colore: Teal (#14b8a6)
└─────────────────┘

STATO PUBBLICO:
┌─────────────────┐
│ 👁️‍🗨️ Privata     │  ← Colore: Arancione (#ea580c)
└─────────────────┘
```

### Dropdown Export
```
┌─────────────────────┐
│ 📥 Esporta ▾        │
└─────────┬───────────┘
          │
          ├─ 📄 PDF (rosso)
          ├─ 🌐 HTML (blu)
          └─ 📝 Markdown (grigio)
```

---

## 📋 Checklist Pre-Pubblicazione

Prima di cliccare "Pubblica", verifica:

- [ ] L'analisi è completa e accurata
- [ ] I dati sono corretti (materia, volume, framework)
- [ ] Il contenuto è professionale
- [ ] Non contiene errori o refusi evidenti
- [ ] È rilevante per i colleghi

**Suggerimento**: Esporta in PDF/HTML e rileggi prima di pubblicare!

---

## 🔮 Roadmap Futura

### Fase 1 (✅ Completata)
- [x] Sistema flag "pubblicata"
- [x] Pulsante toggle pubblica/privata
- [x] Badge visivo sulle analisi pubbliche
- [x] Export PDF/HTML professionale

### Fase 2 (🔄 Prossimo Step)
- [ ] Creare Viewer App separata
- [ ] Galleria analisi pubblicate
- [ ] Ricerca e filtri per materia/volume
- [ ] Confronto side-by-side nella Viewer

### Fase 3 (📅 Futuro)
- [ ] Database cloud condiviso (opzionale)
- [ ] Sincronizzazione automatica
- [ ] Statistiche di visualizzazione
- [ ] Sistema di commenti/feedback

---

## ❓ FAQ

### "Posso pubblicare tutte le analisi in una volta?"
Attualmente no, ma posso aggiungere un pulsante "Pubblica tutte" se serve.

### "Come faccio a sapere quante analisi ho pubblicato?"
Lo storico mostra il badge "🌐 Pubblica" solo su quelle pubblicate. Posso aggiungere un contatore.

### "Posso modificare un'analisi pubblicata?"
No, le analisi sono immutabili. Puoi:
1. Renderla privata
2. Generarne una nuova
3. Pubblicare la nuova versione

### "I colleghi possono scaricare anche loro i PDF?"
Nella futura Viewer App: sì! Potranno scaricare PDF/HTML delle analisi pubblicate.

---

**Versione Documento**: 1.0  
**Data**: Gennaio 2025  
**Autore**: Sistema Analisi Zanichelli
