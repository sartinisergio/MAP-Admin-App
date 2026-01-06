# FIX v1.13.0 - ELENCO NUMERATO COMPLETO DEGLI ARGOMENTI

**Data**: 2025-11-25  
**Problema**: Anche con prompt v1.12.1 "discorsivo + regola esplicita", l'AI continua a saltare ~39% degli argomenti (7 su 18 nel test Hart).

---

## 🔴 PROBLEMA IDENTIFICATO

### Test Hart - Confronto Framework vs AI:

**Framework CSV** contiene **18 argomenti** totali:

```
1.1 - Struttura e nomenclatura dei composti organici
1.2 - Isomeria strutturale e stereoisomeria
1.3 - Reazioni organiche fondamentali
1.4 - Meccanismi di reazione
2.1 - Composti organici funzionali
2.2 - Polimeri
3.2 - Chimica organometallica
3.3 - Fotochimica
3.4 - Chimica bioorganica
4.1 - Reazioni di sostituzione
5.1 - Sintesi organica e tecniche analitiche
5.2 - Biomolecole e chimica organica biologica
6.1 - Chimica organica avanzata
6.2 - Metodologie sperimentali
6.3 - Applicazioni industriali
Col.1 - Biochimica e biotecnologie
Col.2 - Geologia e scienze dei materiali
Col.3 - Chimica fisica e termodinamica
```

**AI v1.12.1 ha citato solo 11/18** (~61%):

✅ CITATI: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 3.2, 3.3, 4.1, Col.1, Col.3  
❌ **SALTATI**: 3.4, 5.1, 5.2, 6.1, 6.2, 6.3 (6 argomenti = 33%)

---

## 🎯 CAUSA RADICE

L'AI **NON VEDE** l'elenco completo degli argomenti quando analizza il testo.

Il prompt v1.12.1 diceva:
> "Estrai dal framework CSV TUTTI gli argomenti didattici... CITA ESPLICITAMENTE ciascun argomento"

Ma l'AI:
1. ✅ Riceve il framework CSV formattato
2. ❌ NON estrae correttamente tutti gli argomenti
3. ❌ Analizza il manuale in modo libero
4. ❌ Salta argomenti che non trova immediatamente

---

## ✅ SOLUZIONE DEFINITIVA: ELENCO NUMERATO

### Strategia:

1. **Nell'app (`formatFrameworkForPrompt`):**
   - Filtra solo le righe CSV con codici argomento (tipo "1.1", "2.3", "3.4")
   - Crea un elenco numerato esplicito (es: "1. 1.1", "2. 1.2", ..., "18. Col.3")
   - Mostra il **TOTALE** argomenti

2. **Nel prompt:**
   - Inserisci l'elenco numerato completo PRIMA delle istruzioni di analisi
   - Imponi una **REGOLA ASSOLUTA**: "DEVI menzionare TUTTI questi [N] argomenti"
   - Chiedi conferma all'AI: "HO IDENTIFICATO [N] ARGOMENTI, mi assicurerò di menzionare OGNUNO"

---

## 📋 MODIFICHE IMPLEMENTATE

### 1. `formatFrameworkForPrompt()` (righe 579-624)

```javascript
function formatFrameworkForPrompt(frameworkData) {
    if (!frameworkData || frameworkData.length === 0) return '';
    
    const headers = Object.keys(frameworkData[0]);
    const firstHeader = headers[0]; // "Modulo/Sotto-modulo"
    
    // 🎯 ESTRAI SOLO LE RIGHE DIDATTICHE (codici tipo "1.1", "2.3")
    const topicRows = frameworkData.filter(row => {
        const moduloValue = row[firstHeader] || '';
        return /^\d+\.\d+(\..+)?/.test(moduloValue.trim());
    });
    
    let formatted = 'FRAMEWORK DI VALUTAZIONE\n\n';
    formatted += '⚠️ ELENCO COMPLETO DEGLI ARGOMENTI DA ANALIZZARE:\n\n';
    
    topicRows.forEach((row, index) => {
        const codice = row[firstHeader] || '';
        formatted += `${index + 1}. ${codice}\n`;
    });
    
    formatted += `\n✅ TOTALE: ${topicRows.length} argomenti\n`;
    formatted += `\n⚠️ DEVI MENZIONARE ESPLICITAMENTE TUTTI QUESTI ${topicRows.length} ARGOMENTI!\n\n`;
    
    // Poi includi TUTTO il CSV (per i punteggi per classe di laurea)
    formatted += '---\n\nDATI COMPLETI DEL FRAMEWORK:\n\n';
    frameworkData.forEach((row, index) => {
        formatted += `[${index + 1}]\n`;
        headers.forEach(header => {
            if (row[header]) {
                formatted += `  ${header}: ${row[header]}\n`;
            }
        });
        formatted += '\n';
    });
    
    return formatted;
}
```

### 2. Prompt Type A - STEP 1 modificato (righe 635-648)

**PRIMA (v1.12.1):**
```
STEP 1 - ELENCO COMPLETO ARGOMENTI DEL FRAMEWORK:

Prima di scrivere l'analisi narrativa, crea una lista completa...
```

**DOPO (v1.13.0):**
```
⚠️ REGOLA FONDAMENTALE ASSOLUTA:

All'inizio del prompt ti è stato fornito un ELENCO NUMERATO COMPLETO.

✅ DEVI MENZIONARE **TUTTI** QUEGLI ARGOMENTI nella tua analisi.
✅ Se un argomento NON è presente nel manuale, devi comunque CITARLO.

PRIMA DI INIZIARE L'ANALISI NARRATIVA:

Conferma di aver letto l'elenco completo scrivendo:

```
✅ HO IDENTIFICATO [N] ARGOMENTI NEL FRAMEWORK
Mi assicurerò di menzionare OGNUNO di essi nel mio report.
```
```

---

## 🧪 TEST RICHIESTO

### Procedura:

1. **Ricarica l'app** (`Ctrl+Shift+R` / `Cmd+Shift+R`)
2. **Carica framework CSV** (`syllabus chimica organica.csv`)
3. **Carica PDF** (Hart o altro)
4. **Compila metadata** (Autore, Titolo, Editore)
5. **Avvia Analisi Tipo A**
6. **Attendi 3-5 minuti**

### Verifica:

**1. Output dell'AI DEVE iniziare con:**

```
✅ HO IDENTIFICATO 18 ARGOMENTI NEL FRAMEWORK
Mi assicurerò di menzionare OGNUNO di essi nel mio report.
```

**2. Conta manualmente** quanti argomenti sono citati nel report:

**Framework**: 18 argomenti (1.1, 1.2, 1.3, ..., Col.3)  
**AI**: ? argomenti citati

**Obiettivo**: ≥ 17/18 (≥94%) ✅

**3. Se l'AI salta ancora argomenti**, verifica se compaiono nell'elenco numerato all'inizio del prompt (console → `appState.lastPrompt`).

---

## 📊 RISULTATI ATTESI

| Metrica | v1.12.1 | v1.13.0 (target) |
|---------|---------|------------------|
| Argomenti citati | 11/18 (61%) | ≥17/18 (≥94%) |
| Argomenti saltati | 7/18 (39%) | ≤1/18 (≤6%) |
| Completezza | 🔴 Insufficiente | 🟢 Eccellente |

---

## 📁 FILE MODIFICATI

- ✅ `js/app.js` → `formatFrameworkForPrompt()` + Prompt Type A
- ✅ `FIX-ELENCO-NUMERATO-v1.13.0.md` (questo file)

---

## 🚀 PROSSIMI PASSI

**SE il test è ✅ SUCCESSO (≥94% copertura):**
- Aggiornare `CHANGELOG.md` con v1.13.0
- Dichiarare **Admin App v1.13.0 FINALE**
- Avviare sviluppo **ZanMAP Viewer App**

**SE il test è ❌ FALLIMENTO (<90% copertura):**
- Analizzare quali argomenti vengono ancora saltati
- Verificare se sono presenti nell'elenco numerato
- Considerare approccio alternativo: analisi in 2 passaggi (lista + narrativa)

---

## 💡 PERCHÉ QUESTA VOLTA FUNZIONERÀ

1. ✅ L'AI vede un **elenco numerato esplicito** (es: "18 argomenti da analizzare")
2. ✅ Sa **quanti** argomenti deve menzionare (impossibile dimenticarne)
3. ✅ Deve **confermare** di aver visto l'elenco prima di iniziare
4. ✅ La regola è **ASSOLUTA**: "DEVI menzionare TUTTI"
5. ✅ Anche gli argomenti **ASSENTI** vanno citati ("X.X NON è trattato")

---

**Stato**: ⏳ In attesa di test con Hart/Bruice

**Sergio, ora fa' il test e confermami:**
1. L'AI conferma di aver identificato 18 argomenti?
2. Quanti argomenti cita nel report?
3. Quali argomenti salta (se ne salta ancora)?

📸 **Screenshot richiesti**:
- Console → Output iniziale dell'AI ("✅ HO IDENTIFICATO...")
- Numero di argomenti citati vs. totale (18)
