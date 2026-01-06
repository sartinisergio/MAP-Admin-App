# 🎨 Aggiornamenti v1.4.0 - Organizzazione Storico & Confronto

**Data rilascio**: 24 Novembre 2025  
**Versione**: 1.4.0  
**Tipo aggiornamento**: Major Feature Release

---

## 📋 Panoramica Versione

La versione 1.4.0 rappresenta un **salto qualitativo significativo** nell'usabilità dell'applicazione, con un focus completo su:

1. **Organizzazione intelligente** dello storico analisi
2. **Confronto side-by-side** tra analisi multiple
3. **Correzione bug** upload file
4. **UX migliorata** con gerarchie informative ottimizzate

Questa versione risponde direttamente al feedback: *"ma dove vedo le analisi salvate?"* → ora con **organizzazione automatica per materia**!

---

## 🆕 Nuove Funzionalità

### 1. **Raggruppamento Automatico per Materia** ✨

#### Come Funziona
L'app ora **estrae automaticamente la materia** dal nome del file CSV caricato:

- **Input**: `esempio-chimica-organica.csv`  
- **Estrazione**: Rimuove prefissi (`esempio-`, `syllabus-`, `framework-`)  
- **Output**: `Chimica Organica`

**Algoritmo di estrazione**:
```javascript
// Da: "esempio-chimica-organica.csv"
// 1. Rimuove .csv
// 2. Rimuove prefissi comuni
// 3. Sostituisce trattini con spazi
// 4. Capitalizza ogni parola
// → "Chimica Organica"
```

#### UI Storico Riorganizzata

**Prima (v1.3.0)**:
```
┌─────────────────────────────────┐
│ Framework: chimica-organica.csv │
│ Volume: Bruice_Edises.pdf       │
│ Tipo B                          │
│ 24/11/2025 • 1723 parole        │
└─────────────────────────────────┘
```

**Dopo (v1.4.0)**:
```
╔════════════════════════════════════╗
║ ▼ CHIMICA ORGANICA (8)            ║  ← Sezione collassabile
╠════════════════════════════════════╣
║  ┌──────────────────────────────┐ ║
║  │ 🏷️ CHIMICA ORGANICA          │ ║  ← Badge materia colorato
║  │                              │ ║
║  │ Bruice, Edises               │ ║  ← Titolo volume (PROMINENTE)
║  │ Analisi Comparativa Classi   │ ║  ← Tipo analisi (testuale)
║  │                              │ ║
║  │ [Visualizza] [Esporta] [...]│ ║
║  └──────────────────────────────┘ ║
╚════════════════════════════════════╝
```

#### Benefici Organizzazione

1. **Scalabilità**: Con 50+ analisi, raggruppa per materia
2. **Navigazione veloce**: Click su sezione → espandi/collassa
3. **Colori distintivi**: 8 colori badge rotanti per materie
4. **Conteggio**: Mostra numero analisi per materia

**Esempio con multiple materie**:
```
▼ CHIMICA ORGANICA (8)
  └── 8 analisi collassate

▼ FISICA GENERALE (6)
  └── 6 analisi collassate

▼ DIRITTO CIVILE (4)
  └── 4 analisi collassate

▶ PROGRAMMAZIONE PYTHON (3)  ← Collassata
```

---

### 2. **Confronto Side-by-Side** 🔀

#### Funzionalità Completa

**Come Utilizzare**:
1. Apri "Storico Analisi"
2. Seleziona **checkbox** su 2 analisi (max 2)
3. Click bottone **"Confronta (2)"**
4. Si apre modal con analisi affiancate

**Caratteristiche**:
- ✅ Confronta analisi di **materie diverse** (es. Chimica vs Fisica)
- ✅ Confronta analisi di **manuali diversi** (es. Bruice vs McMurry)
- ✅ Confronta **tipo A vs tipo B** (es. Generale vs Per Classi)
- ✅ Header colorati (Blu/Verde) per distinguere le 2 analisi
- ✅ Scroll sincronizzato per confronto parallelo
- ✅ Export confronto in **singolo file Markdown**

#### UI Modal Confronto

```
╔════════════════════════════════════════════════════════╗
║  <i class="fas fa-columns"></i> Confronto Analisi                           ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  ┌────────────────┬────────────────────────┐         ║
║  │ 1️⃣ ANALISI 1   │ 2️⃣ ANALISI 2            │         ║
║  │ ─────────────  │ ──────────────────────  │         ║
║  │ Chimica Org.   │ Fisica Generale         │         ║
║  │ Bruice         │ Mazzoldi                │         ║
║  │ Tipo B         │ Tipo A                  │         ║
║  │                │                         │         ║
║  │ # Analisi...   │ # Analisi...            │         ║
║  │ ...contenuto   │ ...contenuto            │         ║
║  │ ...scroll      │ ...scroll               │         ║
║  └────────────────┴────────────────────────┘         ║
║                                                        ║
║              [💾 Esporta Confronto]                   ║
╚════════════════════════════════════════════════════════╝
```

#### Bottone "Confronta (N)"

**Stati dinamici**:
- `Confronta (0)` → **Disabilitato** (grigio)
- `Confronta (1)` → **Disabilitato** (grigio) - "Seleziona ancora 1"
- `Confronta (2)` → **Abilitato** (arancione) - Pronto!
- `Confronta (3)` → Deseleziona automaticamente il primo

**Comportamento intelligente**:
- Selezioni 3ª analisi → la 1ª si deseleziona automaticamente
- Sempre massimo 2 analisi selezionate

---

### 3. **Correzione Label Homepage** 📝

**Problema**: Label "Indice Volume 1" confondeva utenti con manuali a volume unico

**Soluzione**:

**Prima**:
```
Indice Volume 1 (PDF) *
[Clicca per caricare l'indice del Volume 1]
```

**Dopo**:
```
Indice volume unico oppure volume 1 (PDF) *
[Clicca per caricare l'indice del volume unico oppure volume 1]
```

**Beneficio**: Chiarisce che il campo accetta ENTRAMBI i casi d'uso.

---

### 4. **Fix Upload File** 🐛

**Problema Identificato**: Upload falliva al primo tentativo

**Causa**: Event listener duplicati sui label  
- Label con `for="..."` già triggera click su input
- Righe 85-93 aggiungevano listener duplicati  
- Risultato: doppio evento = comportamento imprevedibile

**Soluzione**: Rimosse righe 85-93 con listener manuali

**Prima** (js/app.js):
```javascript
// Label clicks for file inputs
document.querySelector('label[for="frameworkFile"]').addEventListener('click', () => {
    document.getElementById('frameworkFile').click();  // DUPLICATO!
});
// ... altri listener
```

**Dopo**:
```javascript
// RIMOSSO - il for="..." fa già il lavoro
```

**Risultato**: Upload **funziona al primo click** ✅

---

### 5. **Gerarchia Informazioni Card** 📊

**Problema**: Nome CSV prominente ma inutile, metadata visibile ma non necessario

**Nuova Gerarchia**:

1. **Badge Materia** (colorato, prominente)
   ```html
   🏷️ CHIMICA ORGANICA
   ```

2. **Titolo Volume** (bold, grande)
   ```html
   Bruice, Edises
   ```

3. **Tipo Analisi** (testo descrittivo)
   ```html
   Analisi Comparativa per Classi di Laurea
   ```

4. **Bottoni Azioni** (inline)
   ```html
   [Visualizza] [Esporta] [Prompt] [Elimina]
   ```

**Rimossi**:
- ❌ Nome CSV (es. "esempio-chimica-organica.csv")
- ❌ Metadata (data, conteggio parole, badge "2 Volumi")

**Benefici**:
- Focus su informazioni **utili**
- Design **pulito** e **scannable**
- Nome CSV **nascosto** completamente

---

## 🔧 Modifiche Tecniche

### Database Schema Aggiornato

**Nuovo campo `materia`**:

```javascript
// Prima (v1.3.0)
{
    id: 1,
    timestamp: 1732464000000,
    frameworkName: "esempio-chimica-organica.csv",
    volumeName: "Bruice_Edises.pdf",
    analysisType: "A",
    results: "...",
    prompt: "..."
}

// Dopo (v1.4.0)
{
    id: 1,
    timestamp: 1732464000000,
    materia: "Chimica Organica",  // ← NUOVO!
    frameworkName: "esempio-chimica-organica.csv",
    volumeName: "Bruice_Edises.pdf",
    analysisType: "A",
    results: "...",
    prompt: "..."
}
```

**Compatibilità retroattiva**: Analisi vecchie senza `materia` → fallback a `"Altra Materia"`

### Funzioni JavaScript Aggiunte

1. **`toggleMateriaSection(materia)`**  
   Espande/collassa sezione materia nello storico

2. **`toggleCompareSelection(id)`**  
   Gestisce selezione/deselezione analisi per confronto

3. **`updateCompareButton()`**  
   Aggiorna stato bottone "Confronta (N)"

4. **`showCompareModal()`**  
   Mostra modal confronto con 2 analisi affiancate

5. **`closeCompareModal()`**  
   Chiude modal confronto

6. **`exportCompare()`**  
   Esporta confronto in file Markdown unico

### HTML/CSS Aggiunte

**index.html**:
- Bottone "Confronta (N)" nel footer modal storico
- Modal `#compareModal` per confronto side-by-side
- Checkbox nelle card analisi per selezione

**Stili Inline**:
- Grid 2 colonne per confronto
- Sticky headers per analisi
- Border colorati (blu/verde)

---

## 📈 Statistiche Aggiornamenti

| Metrica | v1.3.0 | v1.4.0 | Δ |
|---------|--------|--------|---|
| **Righe HTML** | 340 | 365 | +25 |
| **Righe JS** | 1,079 | 1,221 | +142 |
| **Funzioni JS** | 28 | 34 | +6 |
| **Modal** | 3 | 4 | +1 |
| **Campi DB** | 7 | 8 | +1 |

---

## 🎯 Workflow Utente Aggiornato

### Scenario 1: Gestione Storico con 20+ Analisi

1. Click **"Storico Analisi (24)"**
2. Vede sezioni raggruppate:
   - ▼ CHIMICA ORGANICA (8)
   - ▼ FISICA GENERALE (6)
   - ▼ DIRITTO CIVILE (4)
   - ▼ PROGRAMMAZIONE PYTHON (3)
   - ▼ MATEMATICA (3)
3. Click su **"CHIMICA ORGANICA"** → espande 8 analisi
4. Scroll veloce tra analisi della stessa materia
5. Chiude sezione → layout compatto

### Scenario 2: Confronto Manuali Concorrenti

**Obiettivo**: Confrontare "Bruice" vs "McMurry" per Chimica Organica

1. Apri storico
2. Espandi **CHIMICA ORGANICA**
3. Seleziona checkbox su **"Bruice, Edises"**
4. Seleziona checkbox su **"McMurry, Zanichelli"**
5. Click **"Confronta (2)"**
6. Modal si apre con analisi affiancate:
   - Sinistra (Blu): Bruice
   - Destra (Verde): McMurry
7. Scrolla per comparare sezioni parallele
8. Click **"Esporta Confronto"** → download `confronto_2025-11-24.md`

### Scenario 3: Upload File Corretto

**Prima (v1.3.0)**:
1. Click su area upload CSV
2. Seleziona file
3. ❌ Niente succede
4. Click di nuovo
5. ✅ File caricato

**Dopo (v1.4.0)**:
1. Click su area upload CSV
2. Seleziona file
3. ✅ File caricato immediatamente

---

## 🔮 Considerazioni Future

### Analisi Vecchie (Pre-v1.4.0)

**Problema**: Analisi salvate prima di v1.4.0 non hanno campo `materia`

**Soluzione Automatica**:
```javascript
const materia = analysis.materia || 'Altra Materia';  // Fallback
```

**Opzione Manuale** (futura):
- Bottone "Riorganizza Storico"
- Ri-analizza `frameworkName` per tutte le analisi
- Aggiorna campo `materia` in batch

### Estensioni Possibili

1. **Tag Personalizzati**  
   Oltre alla materia automatica, permettere tag custom:
   - "Progetto 2025"
   - "Da revisionare"
   - "Approvato"

2. **Filtri Avanzati**  
   Barra di ricerca nello storico:
   - Per materia
   - Per volume
   - Per data
   - Per tipo analisi

3. **Statistiche Materia**  
   Nel header sezione materia:
   ```
   ▼ CHIMICA ORGANICA (8 analisi)
     └ 5 Tipo A, 3 Tipo B
     └ Media: 2,847 parole
     └ Ultima: 24/11/2025
   ```

4. **Confronto Multi (3+)**  
   Estendere confronto a 3-4 analisi in griglia

5. **Export Confronto Avanzato**  
   - PDF stilizzato
   - Excel con tabelle comparative
   - HTML interattivo

---

## 📚 File Modificati

### HTML
- `index.html` (+25 righe)
  - Footer modal storico: bottone "Confronta (N)"
  - Nuovo modal `#compareModal`

### JavaScript
- `js/app.js` (+142 righe)
  - Estrazione automatica materia in `saveAnalysis()`
  - Raggruppamento per materia in `showHistoryModal()`
  - 6 nuove funzioni per confronto
  - Fix upload: rimosse righe 85-93

### Nessuna Modifica
- `README.md` (da aggiornare separatamente)
- File CSV framework (invariati)
- File documentazione precedenti

---

## ✅ Testing Consigliato

### Test Organizzazione Storico

1. ✅ Crea analisi con 3+ materie diverse
2. ✅ Apri storico → verifica raggruppamento
3. ✅ Click su sezione → verifica collassa/espande
4. ✅ Verifica badge colorati (rotazione colori)
5. ✅ Verifica conteggio analisi per materia

### Test Confronto

1. ✅ Seleziona 1 analisi → bottone disabilitato
2. ✅ Seleziona 2 analisi → bottone abilitato (arancione)
3. ✅ Seleziona 3 analisi → prima si deseleziona automaticamente
4. ✅ Click "Confronta (2)" → modal apre
5. ✅ Verifica layout side-by-side
6. ✅ Esporta confronto → verifica file .md

### Test Upload

1. ✅ Upload CSV → funziona al primo tentativo
2. ✅ Upload PDF Volume 1 → funziona al primo tentativo
3. ✅ Upload PDF Volume 2 → funziona al primo tentativo

### Test Compatibilità

1. ✅ Analisi pre-v1.4.0 → appaiono in "Altra Materia"
2. ✅ Nuove analisi → materia estratta correttamente
3. ✅ Funzioni vecchie → ancora funzionanti (visualizza, esporta, elimina)

---

## 🎉 Conclusione v1.4.0

La versione 1.4.0 porta l'applicazione a un **livello professionale maturo**:

✅ **Organizzazione intelligente** → scalabile a 100+ analisi  
✅ **Confronto potente** → decisioni informate su manuali  
✅ **Bug critici risolti** → esperienza utente fluida  
✅ **Design pulito** → focus su informazioni rilevanti

**Feedback utente indirizzati**:
- ✅ "ma dove vedo le analisi salvate?" → Risolto con organizzazione per materia
- ✅ "upload non funziona al primo tentativo" → Risolto
- ✅ "nome CSV non serve" → Nascosto completamente
- ✅ "confronto side-by-side" → Implementato

**Prossimi step suggeriti**:
1. Testing completo con dati reali
2. Feedback utenti su UX confronto
3. Valutare implementazione tag personalizzati
4. Considerare filtri/ricerca avanzata

---

**© 2025 Zanichelli Editore - Analizzatore Manuali Universitari v1.4.0**
