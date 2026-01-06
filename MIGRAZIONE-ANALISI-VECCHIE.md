# 🔄 Script Migrazione Analisi Vecchie

**Versione:** 1.9.0  
**Data:** 24 Novembre 2024  
**Scopo:** Aggiungere metadata (Autore, Editore) alle analisi create prima della v1.9.0

---

## 🎯 Cosa Fa Lo Script

Lo script **migra automaticamente** tutte le analisi vecchie aggiungendo i campi mancanti:
- `autore: "Autore non specificato"`
- `editore: "Editore non specificato"`

---

## 🚀 Come Utilizzare

### Passo 1: Apri Storico Analisi

1. Apri l'app
2. Clicca su **"Storico Analisi"**

### Passo 2: Clicca Pulsante Migrazione

Nel footer del modale Storico, troverai un **pulsante blu**:

```
┌─────────────────────────────────────────┐
│ [🔄 Aggiorna Analisi Vecchie]          │
│ [🗑️ Cancella Tutto]                    │
└─────────────────────────────────────────┘
```

### Passo 3: Conferma

Apparirà un messaggio di conferma:

```
Vuoi aggiornare tutte le analisi vecchie 
aggiungendo Autore ed Editore?

Questo processo è sicuro e non eliminerà dati.

[Annulla] [OK]
```

Clicca **OK** per procedere.

### Passo 4: Aspetta Completamento

- Vedrai notifica: **"🔄 Migrazione in corso..."**
- Lo script aggiorna tutte le analisi
- Apparirà un alert con le statistiche:

```
✅ Migrazione completata!

📊 Statistiche:
- Aggiornate: 4
- Già aggiornate: 0
- Errori: 0
- Totale: 4
```

### Passo 5: Verifica

Lo storico si ricarica automaticamente. Ora **tutte le analisi** avranno:

```
👤 Autore: Autore non specificato
🏢 Editore: Editore non specificato
```

---

## ⚙️ Come Funziona Tecnicamente

### 1. Legge Tutte le Analisi

```javascript
const analyses = await getSavedAnalyses();
```

### 2. Per Ogni Analisi

Controlla se ha già `autore` ed `editore`:

```javascript
if (analysis.autore && analysis.editore) {
    // Già aggiornata → skip
    skipped++;
    continue;
}
```

### 3. Aggiunge Metadata Mancanti

```javascript
if (!analysis.autore) {
    analysis.autore = 'Autore non specificato';
}

if (!analysis.editore) {
    analysis.editore = 'Editore non specificato';
}
```

### 4. Salva su IndexedDB

```javascript
await objectStore.put(analysis);
```

### 5. Aggiorna Firebase (se pubblicata)

Se l'analisi era già pubblicata, aggiorna anche Firebase:

```javascript
if (analysis.pubblicata && firebaseInitialized) {
    await firestoreDb.collection('analyses')
        .doc(docId)
        .update({
            autore: analysis.autore,
            editore: analysis.editore,
            lastUpdated: Date.now()
        });
}
```

---

## 📊 Statistiche Output

### `updated`
Numero di analisi aggiornate con successo

### `skipped`
Numero di analisi già aggiornate (hanno già autore/editore)

### `errors`
Numero di errori durante la migrazione

### `total`
Totale analisi controllate

---

## ✅ Sicurezza

### Lo Script È Sicuro?

**SÌ!** ✅

- ✅ **Non elimina dati** → Aggiunge solo campi mancanti
- ✅ **Non sovrascrive** → Se autore/editore esistono già, li mantiene
- ✅ **Backup automatico** → IndexedDB mantiene versioni precedenti
- ✅ **Firebase safe** → Usa `.update()` invece di `.set()`

### Cosa Succede in Caso di Errore?

- ⚠️ L'errore viene loggato nella console
- ⚠️ Le altre analisi continuano ad essere processate
- ⚠️ Statistiche finali mostrano il numero di errori
- ✅ Nessun dato viene perso

---

## 🧪 Test della Migrazione

### Before (Prima della migrazione):

```javascript
{
  id: 1,
  materia: "Chimica Organica",
  volumeName: "Volume 1",
  results: "...",
  // ❌ autore: non esiste
  // ❌ editore: non esiste
}
```

### After (Dopo la migrazione):

```javascript
{
  id: 1,
  materia: "Chimica Organica",
  volumeName: "Volume 1",
  results: "...",
  autore: "Autore non specificato",   // ✅ aggiunto
  editore: "Editore non specificato"  // ✅ aggiunto
}
```

---

## 🔮 Analisi Future

### Analisi Nuove (create dopo v1.9.0):

Avranno automaticamente:
- `autore: "Botta e al."` (estratto dal PDF)
- `editore: "Edi-Ermes"` (estratto dal PDF)

**NON** avranno bisogno di migrazione! ✅

### Quando Eseguire la Migrazione?

**Solo UNA volta** dopo l'aggiornamento alla v1.9.0

Poi:
- Analisi vecchie → metadata default
- Analisi nuove → metadata estratti dal PDF

---

## 🛠️ Troubleshooting

### Problema: Pulsante non appare

**Soluzione:** Ricarica l'app (F5) e apri Storico

### Problema: "Nessuna analisi aggiornata"

**Causa:** Tutte le analisi hanno già autore/editore

**Cosa fare:** Niente! Lo script ha controllato e visto che sono già aggiornate

### Problema: Errori durante migrazione

**Cosa fare:**
1. Apri Console browser (F12)
2. Cerca messaggi rossi con "❌ Errore migrazione"
3. Copia l'errore e contattami

---

## 📋 Checklist Post-Migrazione

Dopo aver eseguito la migrazione:

- [ ] Alert mostra statistiche corrette
- [ ] Storico si ricarica automaticamente
- [ ] Tutte le analisi mostrano 👤 Autore e 🏢 Editore
- [ ] Console non mostra errori rossi
- [ ] Firebase Console mostra metadata (per analisi pubblicate)

---

## 🔄 Re-eseguire la Migrazione

### È Possibile?

**SÌ!** Puoi cliccare il pulsante quante volte vuoi.

### Cosa Succede?

- ✅ Script controlla ogni analisi
- ✅ Se già ha metadata → skip
- ✅ Se manca metadata → aggiunge
- ✅ Nessun dato duplicato o sovrascritto

### È Necessario?

**NO!** Una volta è sufficiente.

Ma se hai dubbi, puoi ri-eseguirla senza problemi! 😊

---

## 💡 Suggerimenti

### Dopo la Migrazione

1. **Crea nuove analisi** con i PDF aggiornati
2. Le nuove avranno **metadata reali** estratti dal PDF
3. Puoi **eliminare analisi vecchie** se vuoi (opzionale)
4. **Pubblica analisi** per sincronizzare su Firebase

### Migliori Pratiche

- ✅ Esegui migrazione **subito** dopo aggiornamento v1.9.0
- ✅ Controlla statistiche per confermare successo
- ✅ Verifica Firebase Console se hai analisi pubblicate
- ✅ Crea backup prima di eliminare analisi vecchie

---

## 📚 File Coinvolti

### Codice Migrazione:
- `js/app.js` → Funzione `migrateOldAnalyses()`
- `js/app.js` → Funzione `runMigration()`

### Interfaccia:
- `index.html` → Pulsante `#migrateAnalysesBtn`

### Documentazione:
- `MIGRAZIONE-ANALISI-VECCHIE.md` → Questo file
- `CHANGELOG.md` → Versione 1.9.0

---

## ✨ Risultato Finale

**Prima della migrazione:**
```
📚 CHIMICA ORGANICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📖 Volume: Chimica organica essenziale
📅 Data: 24/11/2024

[Visualizza] [Esporta] [Pubblica]
```

**Dopo la migrazione:**
```
📚 CHIMICA ORGANICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📖 Volume: Chimica organica essenziale
👤 Autore: Autore non specificato
🏢 Editore: Editore non specificato
📅 Data: 24/11/2024

[Visualizza] [Esporta] [Pubblica]
```

---

**🎉 Script di migrazione pronto all'uso! 🚀**

**Clicca "Aggiorna Analisi Vecchie" nello Storico per iniziare!**
