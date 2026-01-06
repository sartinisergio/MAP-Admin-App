# 🔧 PROMPT DISCORSIVO PROFESSIONALE (v1.12.0)

**Data:** 2025-01-25  
**Versione:** Admin App v1.12.0 "Analisi Editoriale Professionale"

---

## 🐛 PROBLEMI v1.11.x

**L'AI generava analisi troppo schematiche e confuse:**

### 1. **Analizzava righe NON significative del CSV**
```
❌ "Punteggio argomenti chiave per classi di laurea" → LEGENDA, non argomento
❌ "Significato didattico" → DESCRIZIONE, non argomento
❌ "1-2 Presenza marginale" → LEGENDA PUNTEGGI, non argomento
```
**Risultato**: Statistiche falsate (es: "18 su 32 argomenti = 56%")

### 2. **Percentuali inutili**
> "56.25% argomenti coperti"

**Commento Sergio**: "Le percentuali non hanno nessun significato per la comprensione del valore del testo"

### 3. **Troppo schematico**
```
| # | Argomento | Presente? | Dove | Livello | Note |
|---|-----------|-----------|------|---------|------|
| 1 | ...       | ✅        | ...  | ...     | ...  |
```
→ **Tabelle rigide** invece di **analisi narrativa professionale**

### 4. **Manca il CONTESTO**
- Non spiega PERCHÉ un argomento è importante
- Non analizza le scelte editoriali
- Non valuta l'adeguatezza didattica

---

## ✅ SOLUZIONE v1.12.0

### **Nuovo Approccio: "ANALISI EDITORIALE PROFESSIONALE"**

**Cambio completo di paradigma:**

| Aspetto | v1.11.x | v1.12.0 |
|---------|---------|---------|
| **Formato** | Tabelle + Statistiche | Paragrafi discorsivi |
| **Tono** | Schematico, tecnico | Professionale, narrativo |
| **Percentuali** | Sì (inutili) | No |
| **Stile** | Bot/automatico | Analista senior esperto |
| **Focus** | Cosa manca | Perché manca, impatto didattico |
| **Lunghezza** | 3000-5000 parole (tabelle) | 2500-3500 parole (testo fluido) |

---

## 📝 NUOVA STRUTTURA REPORT

### **1. PANORAMICA DEL MANUALE** (2-3 paragrafi)
- A chi è destinato (corso, anno, livello)
- Approccio didattico (teorico/pratico/bilanciato)
- Filosofia editoriale

### **2. COPERTURA ARGOMENTI** (paragrafi discorsivi per macro-area)
⚠️ **NOVITÀ CHIAVE**: Ignora righe CSV non significative (punteggi, legenda, righe vuote)

**Per ogni macro-area**:
```
### Fondamenti di Chimica Organica

Il manuale copre in modo ECCELLENTE i fondamenti di struttura e 
nomenclatura (Cap. 1-2, p. 1-65), con una progressione didattica 
chiara che parte dagli alcani per arrivare agli aromatici. La 
trattazione dell'isomeria (Cap. 5, p. 140-159) è particolarmente 
approfondita, includendo non solo isomeria configurazionale ma anche 
concetti avanzati come le convenzioni R-S ed E-Z. Tuttavia, si nota 
l'ASSENZA completa della fotochimica, probabilmente una scelta 
deliberata per mantenere il focus sulle reazioni termiche fondamentali...
```

### **3. PUNTI DI FORZA** (3-4 paragrafi)
- Argomenti trattati in modo efficace
- Capitoli distintivi
- Elementi innovativi
- Supporti didattici

### **4. LACUNE E CRITICITÀ** (2-3 paragrafi)
- Argomenti importanti mancanti
- Perché sono problematiche (o accettabili)
- Come compensare

### **5. VALUTAZIONE FINALE** (2-3 paragrafi)
- Giudizio generale
- Destinatari ideali
- Raccomandazioni d'uso
- **Voto motivato** (non "8/10", ma "Assegno 8/10 perché...")

---

## 🎯 ESEMPIO STILE CORRETTO

**PRIMA (v1.11.x - SBAGLIATO):**
```
| 5 | Composti organici funzionali | ✅ SÌ | Cap. 7, p. 193-207 | Approfondito | Discussione su alcoli |
```

**DOPO (v1.12.0 - CORRETTO):**
```
La sezione dedicata agli alcani (Cap. 2, p. 35-64) rappresenta uno 
dei punti di forza del manuale. Non si limita a presentare la 
nomenclatura IUPAC, ma contestualizza ogni composto con esempi pratici 
e applicazioni industriali. Particolarmente apprezzabile è la trattazione 
del meccanismo radicalico a catena per l'alogenazione, con diagrammi 
energetici che aiutano lo studente a visualizzare il processo. Rispetto 
ad altri manuali introduttivi, Hart dedica più spazio alle proprietà 
fisiche e alle interazioni intermolecolari, preparando efficacemente il 
terreno per i capitoli successivi sulla reattività.
```

---

## 🔧 ISTRUZIONI CHIAVE PER L'AI

### **1. Filtro CSV Intelligente**
```javascript
"Nel framework CSV, analizza SOLO le righe che rappresentano argomenti 
didattici veri (es: '1.1 Struttura e nomenclatura'). IGNORA:
- Intestazioni di tabella
- Righe di punteggio totale
- Legenda (es: 'Significato didattico', '1-2 Presenza marginale')
- Righe vuote"
```

### **2. NO Tabelle, NO Percentuali**
```javascript
"NON usare tabelle, NON fare elenchi puntati rigidi, NON calcolare percentuali.
Scrivi paragrafi discorsivi e narrativi."
```

### **3. Tono Professionale**
```javascript
"Scrivi come un analista editoriale senior esperto, non come un bot.
Spiega il PERCHÉ delle scelte editoriali, non solo il COSA manca."
```

---

## 📊 CONFRONTO OUTPUT

### **v1.11.x (Tabellare)**
```
### Statistiche Copertura
- Totale argomenti: 32
- Presenti: 18 (56.25%)
- Assenti: 14 (43.75%)

| # | Argomento | Presente? |
|---|-----------|-----------|
| 1 | Struttura | ✅ SÌ     |
| 9 | Fotochimica | ❌ NO   |
```

### **v1.12.0 (Discorsivo)**
```
## Copertura Argomenti

Il manuale Hart offre una trattazione solida e ben strutturata dei 
fondamenti di chimica organica. La sezione introduttiva (Cap. 1-3) 
copre efficacemente struttura molecolare, nomenclatura IUPAC e 
stereoisomeria, con un approccio didattico che privilegia la 
visualizzazione tridimensionale attraverso modelli molecolari e 
proiezioni di Newman.

Particolarmente apprezzabile è la copertura delle reazioni organiche 
fondamentali (Cap. 4-8), dove l'autore dedica ampio spazio ai meccanismi 
di reazione, un aspetto spesso trascurato nei manuali introduttivi...

Una lacuna significativa è l'assenza della fotochimica. Questa scelta 
editoriale è comprensibile per un testo introduttivo, ma limita l'uso 
del manuale in corsi avanzati di sintesi organica dove le reazioni 
fotochimiche giocano un ruolo chiave. Docenti che adottano questo 
manuale dovranno integrare con materiale supplementare se desiderano...
```

---

## ✅ FILE MODIFICATI

- `js/app.js` (funzione `buildPrompt()` - Tipo A) → Prompt completamente riscritto
- `FIX-PROMPT-DISCORSIVO-v1.12.0.md` (nuovo) → Documentazione

---

## 🧪 TEST DI VERIFICA

### Passaggi:
1. **Ricarica** (Ctrl+Shift+R)
2. **Carica framework + PDF Hart**
3. **Avvia Analisi Tipo A**
4. **Aspetta 3-5 minuti**

### Cosa Verificare:
- ✅ Output è **tutto testo discorsivo** (NO tabelle)?
- ✅ **NO percentuali** tipo "56.25%"?
- ✅ Tono è **professionale e narrativo** (come analista senior)?
- ✅ Spiega il **PERCHÉ** delle scelte editoriali?
- ✅ **NON analizza** righe CSV di legenda/punteggio?

---

## 🎯 PROSSIMI PASSI

1. **TEST con Hart** → Sergio verifica se l'output è discorsivo e professionale
2. **Confronto v1.11.x vs v1.12.0** → Valutazione qualità narrativa
3. **Se OK**: v1.12.0 **FINALE** per Admin App
4. **Poi**: **ZanMAP Viewer** 🚀

---

**Versione:** Admin App v1.12.0 "Analisi Editoriale Professionale"  
**Status:** ✅ PRONTO PER TEST
