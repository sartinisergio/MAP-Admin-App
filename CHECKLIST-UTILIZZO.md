# ✅ Checklist per l'Utilizzo dell'Analizzatore

Una guida passo-passo per assicurarti di avere tutto pronto prima di iniziare l'analisi.

---

## 📋 Prima di Iniziare

### ☐ Chiave API OpenAI

- [ ] Ho creato un account su [OpenAI Platform](https://platform.openai.com)
- [ ] Ho generato una API key (inizia con "sk-...")
- [ ] Ho verificato di avere credito disponibile sul mio account
- [ ] Ho copiato la chiave in un posto sicuro

**Costo stimato per analisi**: €0.01 - €0.20

---

## 📁 Preparazione File

### ☐ Framework CSV

- [ ] Ho creato/ottenuto il framework di valutazione in formato CSV
- [ ] Il file CSV ha:
  - [ ] Una riga di intestazione con i nomi delle colonne
  - [ ] Almeno le colonne base (es: Argomento, Classi_Laurea)
  - [ ] Nessuna riga vuota all'inizio
- [ ] Ho salvato il file come CSV UTF-8
- [ ] Ho testato l'apertura con Excel/Google Sheets (colonne separate correttamente)

**Esempio**: Vedi `esempio-framework.csv`  
**Aiuto**: Leggi [FAQ-FRAMEWORK-CSV.md](FAQ-FRAMEWORK-CSV.md)

---

### ☐ Indice Volume 1 (PDF)

- [ ] Ho estratto l'indice completo del manuale (Capitoli, Sezioni, Sottosezioni)
- [ ] L'indice è in formato PDF
- [ ] Il PDF contiene testo selezionabile (non è una scansione)
  - [ ] Test: Apro il PDF e provo a selezionare il testo → funziona ✓
- [ ] Il file non è troppo grande (< 50 MB)
- [ ] Ho rinominato il file in modo chiaro (es: `Fisica_Vol1_Indice.pdf`)

**Se il PDF è una scansione**:
- [ ] Ho usato un software OCR per convertirlo in testo
- [ ] Oppure ho rigenerato il PDF dal documento originale

---

### ☐ Indice Volume 2 (Opzionale)

**Solo se il corso è diviso in più volumi** (es: Fisica 1 e Fisica 2, Analisi 1 e 2)

- [ ] Il corso è effettivamente in 2 volumi
- [ ] Ho estratto anche l'indice del Volume 2
- [ ] Anche questo PDF ha testo selezionabile
- [ ] Ho rinominato il file chiaramente (es: `Fisica_Vol2_Indice.pdf`)

**Se il corso è in 1 solo volume**: Salta questa sezione

---

## 💻 Preparazione Tecnica

### ☐ Browser

- [ ] Uso un browser moderno e aggiornato:
  - [ ] Chrome (consigliato)
  - [ ] Firefox
  - [ ] Edge
  - [ ] Safari
- [ ] Ho abilitato JavaScript nel browser
- [ ] Ho una connessione internet stabile

---

### ☐ File Applicazione

- [ ] Ho scaricato/ricevuto tutti i file del progetto
- [ ] Ho estratto i file in una cartella (se erano in ZIP)
- [ ] Vedo il file `index.html` nella cartella
- [ ] Vedo la cartella `js/` con `app.js` dentro

---

## 🎯 Scelta del Tipo di Analisi

### ☐ Tipo A - Analisi Generale

**Scegli questo se**:
- [ ] Voglio una valutazione complessiva del manuale
- [ ] Voglio sapere cosa copre e cosa manca rispetto al framework
- [ ] Voglio identificare punti di forza e debolezze generali
- [ ] Voglio un voto/valutazione numerica generale

**Output**: Copertura, lacune, punti di forza, struttura, voto 1-10

---

### ☐ Tipo B - Analisi per Classi di Laurea

**Scegli questo se**:
- [ ] Devo valutare l'adeguatezza per classi specifiche (L-30, L-31, etc.)
- [ ] Voglio raccomandazioni specifiche per ogni classe
- [ ] Voglio confrontare l'idoneità del manuale tra diverse classi
- [ ] Il framework CSV contiene informazioni sulle classi di laurea

**Output**: Analisi dettagliata per ogni classe, confronto, raccomandazioni

---

## 🚀 Esecuzione - Checklist Durante l'Uso

### Passo 1: Configurazione API

- [ ] Ho aperto `index.html` nel browser
- [ ] Ho incollato la chiave API OpenAI nel campo
- [ ] Ho cliccato "Verifica Chiave"
- [ ] Vedo il messaggio "✓ Chiave valida!"

---

### Passo 2: Caricamento File

- [ ] Ho cliccato su "Carica framework CSV"
- [ ] Ho selezionato il mio file CSV
- [ ] Vedo il nome del file e conferma di caricamento
- [ ] Ho cliccato su "Carica indice Volume 1"
- [ ] Ho selezionato il PDF dell'indice
- [ ] Vedo il progresso dell'estrazione del testo
- [ ] Se necessario: ho spuntato "2 volumi" e caricato Volume 2

---

### Passo 3: Selezione Analisi

- [ ] Ho selezionato:
  - [ ] Tipo A (Analisi Generale), oppure
  - [ ] Tipo B (Analisi per Classi di Laurea)

---

### Passo 4: Avvio

- [ ] Il pulsante "Avvia Analisi" è attivo (non grigio)
- [ ] Ho cliccato su "Avvia Analisi"
- [ ] Vedo la barra di progresso
- [ ] Vedo i messaggi di status (es: "Invio richiesta a OpenAI...")

**Attesa prevista**: 1-5 minuti (dipende dalla lunghezza)

---

### Passo 5: Risultati

- [ ] L'analisi è completata
- [ ] Vedo i risultati formattati nella pagina
- [ ] I risultati sono chiari e leggibili
- [ ] Ho letto i risultati e sono soddisfacente

---

### Passo 6: Export (Opzionale)

- [ ] Ho cliccato "Esporta Markdown" o "Esporta HTML"
- [ ] Il file è stato scaricato sul mio computer
- [ ] Ho aperto il file esportato per verificare
- [ ] Ho salvato il file in una cartella appropriata

---

## ⚠️ Risoluzione Problemi - Quick Check

### Se la chiave API non funziona:

- [ ] Ho copiato l'intera chiave (incluso "sk-")
- [ ] Non ci sono spazi prima/dopo la chiave
- [ ] Ho credito disponibile su OpenAI
- [ ] La chiave non è scaduta/revocata

---

### Se il CSV non viene caricato:

- [ ] Il file ha estensione .csv
- [ ] Il file si apre correttamente in Excel/Google Sheets
- [ ] Non ci sono righe vuote all'inizio
- [ ] È salvato come UTF-8 (per caratteri accentati)
- [ ] Ho provato a rigenerare il CSV

---

### Se il PDF non viene letto:

- [ ] Il PDF contiene testo selezionabile (non solo immagini)
- [ ] Ho provato "Salva con nome" per rigenerare il PDF
- [ ] Il file non è corrotto (si apre normalmente)
- [ ] Il file non è protetto da password
- [ ] Ho provato con un PDF più piccolo per testare

---

### Se l'analisi è troppo lenta o fallisce:

- [ ] Ho una connessione internet stabile
- [ ] L'indice non è troppo lungo (< 100 pagine)
- [ ] Non ho altre tab che consumano molta RAM
- [ ] Ho atteso almeno 3-5 minuti prima di preoccuparmi
- [ ] Ho controllato la Console del browser (F12) per errori

---

## 📊 Dopo l'Analisi

### ☐ Interpretazione Risultati

- [ ] Ho letto attentamente tutti i risultati
- [ ] Ho capito le sezioni principali dell'analisi
- [ ] Ho identificato le informazioni più rilevanti per il mio caso
- [ ] Ho preso nota di eventuali lacune identificate

---

### ☐ Archiviazione

- [ ] Ho esportato i risultati (Markdown o HTML)
- [ ] Ho salvato il file con un nome chiaro (es: `Analisi_Fisica_Vol1_20250124.md`)
- [ ] Ho archiviato il file in una cartella organizzata
- [ ] Ho salvato anche i file di input (CSV + PDF) per riferimento futuro

---

### ☐ Prossimi Passi

- [ ] Ho condiviso i risultati con i colleghi (se necessario)
- [ ] Ho pianificato azioni basate sull'analisi
- [ ] Ho documentato le decisioni prese
- [ ] Se serve, ho pianificato una nuova analisi con parametri diversi

---

## 🎓 Suggerimenti per Risultati Ottimali

### ✅ DO (Fai)

- ✓ Usa framework CSV dettagliati e ben strutturati
- ✓ Includi indici completi (non solo i capitoli principali)
- ✓ Specifica chiaramente le classi di laurea nel framework
- ✓ Usa Tipo B per analisi specifiche per classe
- ✓ Esporta sempre i risultati per archiviarli
- ✓ Leggi attentamente tutti i risultati prima di decidere

### ❌ DON'T (Non Fare)

- ✗ Non usare indici parziali o incompleti
- ✗ Non usare PDF scansionati senza OCR
- ✗ Non aspettarti risultati se il framework è troppo generico
- ✗ Non chiudere la pagina durante l'analisi
- ✗ Non fare analisi simultanee (aspetta che finisca una prima di iniziarne un'altra)

---

## 📞 Ho Bisogno di Aiuto?

### Risorse Disponibili

1. **Quick Fix**: [README.md](README.md) → Sezione "Gestione Errori Comuni"
2. **CSV Problems**: [FAQ-FRAMEWORK-CSV.md](FAQ-FRAMEWORK-CSV.md)
3. **Guida Completa**: [guida-rapida.html](guida-rapida.html)
4. **Supporto Tecnico**: Contatta il team Zanichelli

---

## ✅ Checklist Finale Prima di Iniziare

Ho tutto pronto?

- [ ] ✅ Chiave API OpenAI verificata
- [ ] ✅ Framework CSV preparato e testato
- [ ] ✅ Indice(i) PDF estratti e verificati (testo selezionabile)
- [ ] ✅ Browser moderno e connessione stabile
- [ ] ✅ Ho deciso il tipo di analisi (A o B)
- [ ] ✅ Ho letto questa checklist completa

---

**🎉 Sei pronto! Apri `index.html` e inizia la tua analisi!**

---

**Versione Checklist**: 1.0  
**Data**: 24 Gennaio 2025  
**Tempo Stimato per Preparazione**: 15-30 minuti
