# 🎨 Guida Completa: Sostituire Logo Zanichelli

## 📋 TL;DR (Riassunto Veloce)

1. Scarica logo Zanichelli (PNG o SVG)
2. Mettilo in cartella `images/` con nome `logo-zanichelli.png`
3. Ricarica pagina → Logo appare automaticamente nei PDF/HTML

**Oppure**: Usa URL diretto da internet (es: dal sito Zanichelli)

---

## 🎯 Opzione 1: Uso File Locale (Consigliato)

### Passo 1: Ottieni il Logo

**Dove trovarlo:**
- Sito Zanichelli: https://www.zanichelli.it/
  - Click destro su logo → "Salva immagine con nome"
- Materiale aziendale Zanichelli
- Chiedi al reparto marketing/comunicazione

**Formato preferito:**
- ✅ **PNG** trasparente (sfondo trasparente)
- ✅ **SVG** vettoriale (scala senza perdita qualità)
- ⚠️ JPG funziona ma sfondo bianco

**Dimensioni consigliate:**
- Larghezza: 400-600px
- Altezza: proporzionale (di solito 150-200px)
- Risoluzione: 300 DPI per stampa

---

### Passo 2: Carica il File

**Metodo A - Upload Manuale:**
1. Salva il logo sul tuo PC come `logo-zanichelli.png`
2. Metti il file nella cartella `images/` del progetto
3. Sostituisci il vecchio file `logo-zanichelli.svg`

**Metodo B - Durante il Deploy su Netlify:**
1. Quando carichi i file su Netlify
2. Includi anche `images/logo-zanichelli.png`
3. Il logo apparirà automaticamente

---

### Passo 3: Modifica il Codice (Facoltativo)

Se il tuo logo è PNG invece di SVG, devo modificare il codice per usare `<img>` invece di `<svg>`.

**Vuoi che lo faccia ora?** Dimmi e in 2 minuti aggiorno tutto!

---

## 🌐 Opzione 2: Uso URL Internet (Più Veloce)

Se il logo Zanichelli è disponibile online, posso usare l'URL diretto.

**Esempio:**
```
https://www.zanichelli.it/themes/custom/zanichelli/logo.png
```

**Vantaggi:**
- ✅ Nessun upload file
- ✅ Logo sempre aggiornato
- ✅ Funziona subito

**Svantaggi:**
- ⚠️ Serve internet per vedere il logo
- ⚠️ Se Zanichelli cambia URL, il logo sparisce

**Come fare:**
1. Trova URL del logo (click destro → "Copia indirizzo immagine")
2. Dimmi l'URL
3. Aggiorno il codice in 1 minuto

---

## 🔍 Dove Viene Usato il Logo

Il logo appare in **3 posti**:

### 1️⃣ Export HTML
- Header della pagina HTML esportata
- Dimensione: ~180px larghezza
- Sfondo: Header blu (#003057)

### 2️⃣ Export PDF
- Prima pagina del PDF
- Dimensione: ~180px larghezza
- Sfondo: Header blu (#003057)

### 3️⃣ Export Analisi Singole (Storico)
- Header HTML e PDF delle analisi esportate dallo storico
- Stesse dimensioni e stile

---

## 🛠️ Modifiche Codice Necessarie

### Se Usi PNG, Devo Cambiare Questo:

**File: js/app.js (2 occorrenze)**

**DA (SVG inline attuale):**
```html
<svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
    <rect width="200" height="60" fill="#FFFFFF" rx="4"/>
    <text x="100" y="38" font-family="Arial" font-size="24" fill="#003057">ZANICHELLI</text>
    <text x="100" y="50" font-family="Arial" font-size="9" fill="#005792">EDITORE</text>
</svg>
```

**A (IMG tag):**
```html
<img src="images/logo-zanichelli.png" alt="Zanichelli Editore" class="logo" style="width: 180px; height: auto;">
```

---

## 📝 Istruzioni Dettagliate

### Scenario A: Hai il Logo PNG

**Passo 1: Prepara il file**
```
Nome file: logo-zanichelli.png
Posizione: images/logo-zanichelli.png
```

**Passo 2: Dimmi "Ho il PNG pronto"**
→ Modifico il codice per usare IMG invece di SVG

**Passo 3: Test**
→ Ricarica pagina, genera analisi, esporta PDF/HTML
→ Vedi logo reale!

---

### Scenario B: Non Hai il Logo

**Opzione 1 - Cerca Online:**
1. Vai su https://www.zanichelli.it/
2. Click destro su logo in alto a sinistra
3. "Salva immagine con nome" → `logo-zanichelli.png`
4. Segui Scenario A

**Opzione 2 - Chiedi a Zanichelli:**
1. Email al reparto marketing
2. "Mi serve il logo aziendale ad alta risoluzione per un'app interna"
3. Ricevi file PNG/SVG
4. Segui Scenario A

**Opzione 3 - Usa Placeholder (Attuale):**
→ Lascia tutto com'è, il placeholder funziona benissimo!

---

## 🎨 Logo Zanichelli: Riferimenti

### Colori Ufficiali:
- **Blu Principale**: #003057 (blu scuro)
- **Blu Secondario**: #005792 (blu medio)
- **Blu Chiaro**: #B8D4E8

### Tipografia:
- Font ufficiale Zanichelli (se disponibile)
- Alternativa: Arial Bold

### Dimensioni Standard:
```
Larghezza massima header: 180-200px
Proporzione: ~3:1 (larghezza:altezza)
```

---

## ❓ FAQ

### "Il logo deve essere esattamente 200x60px?"
No! Qualsiasi dimensione va bene. Il browser la scalerà automaticamente a ~180px larghezza.

### "Posso usare un logo con sfondo colorato?"
Sì, ma consiglio sfondo trasparente (PNG) perché l'header è blu scuro.

### "Devo modificare il codice manualmente?"
No! Dimmi solo che hai il logo pronto e lo faccio io in 2 minuti.

### "Il placeholder attuale va bene?"
Per test sì! Per uso ufficiale con clienti, meglio logo reale.

### "Posso usare il logo da Wikipedia?"
Tecnicamente sì, ma meglio usare quello ufficiale ad alta risoluzione.

---

## 🚀 Azione Immediata

**Scegli lo scenario:**

### 🟢 Scenario 1: "Non mi importa del logo, va bene il placeholder"
→ Non fare nulla! Il placeholder è già elegante e professionale.

### 🟡 Scenario 2: "Voglio il logo vero, ma lo aggiungo dopo"
→ OK! Quando lo hai, dimmi e aggiorno il codice.

### 🔴 Scenario 3: "Voglio il logo SUBITO"
→ Dimmi:
- Ho il file PNG/SVG pronto: SÌ / NO
- Se SÌ: caricalo in `images/` e dimmi
- Se NO: cerco online e ti mando link

**Poi aggiorno il codice per te!**

---

## 🖼️ Esempio Visivo

### Come Appare Ora (Placeholder):
```
┌─────────────────────────┐
│ ┌─────────────────────┐ │
│ │   ZANICHELLI        │ │ ← Blu con testo bianco
│ │   EDITORE           │ │
│ └─────────────────────┘ │
│                         │
│ Analisi Manuale...      │
└─────────────────────────┘
```

### Come Apparirà con Logo Reale:
```
┌─────────────────────────┐
│ [LOGO ZANICHELLI REALE] │ ← Immagine PNG/SVG
│                         │
│ Analisi Manuale...      │
└─────────────────────────┘
```

---

**Dimmi cosa preferisci e procedo!** 🎨

**Opzioni:**
1. "Lascia placeholder" → OK, tutto pronto così
2. "Ho logo PNG pronto" → Caricalo e ti aggiorno codice
3. "Aiutami a trovare logo" → Cerco URL online per te
4. "Lo faccio dopo" → OK, quando vuoi!
