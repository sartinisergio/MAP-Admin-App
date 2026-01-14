# 🔒 WORKFLOW SICURO: Upload Framework/Manuali

## STEP 1: Abilita Scrittura (2 min)

1. Vai su: https://console.firebase.google.com/project/analisi-manuali-zanichelli/firestore/rules

2. Modifica la regola target:
   ```javascript
   match /manuals/{manualId} {
     allow read: if true;
     allow write: if true;  // ⚠️ TEMPORANEO per upload
   }
   ```

3. Clicca **"Pubblica"**

4. Aspetta conferma: "Rules deployed successfully"

---

## STEP 2: Carica Dati (5-10 min)

**Per Framework**:
1. Apri: `C:\Users\SARTINI\Desktop\MAP\MAP Manual Analyses Platform\upload-frameworks-to-firebase.html`
2. Drag & drop file CSV
3. Clicca **🚀 Upload su Firebase**
4. Aspetta "✅ Caricato"

**Per Manuali**:
1. Apri: `C:\Users\SARTINI\Desktop\MAP\MAP Manual Analyses Platform\upload-manuals-to-firebase.html`
2. Seleziona file JSON (multipli OK)
3. Clicca **🚀 Upload su Firebase**
4. Aspetta barra progresso completata

---

## STEP 3: Ripristina Sicurezza (2 min) ⚠️ IMPORTANTE!

1. Torna su Firebase Rules

2. Modifica di nuovo:
   ```javascript
   match /manuals/{manualId} {
     allow read: if true;
     allow write: if false;  // ✅ Sicurezza ripristinata
   }
   ```

3. Clicca **"Pubblica"**

4. Verifica timestamp aggiornato

---

## ✅ VERIFICA FINALE

1. Vai su: https://console.firebase.google.com/project/analisi-manuali-zanichelli/firestore/data

2. Apri collection `manuals` o `frameworks`

3. Verifica che i nuovi documenti siano presenti

4. Apri app: https://develop--map-manual-analyses-platform.netlify.app

5. Verifica dropdown aggiornati con nuovi dati

---

## 🚨 ATTENZIONE

**MAI dimenticare di ripristinare `write: if false` dopo l'upload!**

Altrimenti chiunque può:
- Modificare i tuoi dati
- Eliminare framework/manuali
- Sovraccaricare il database

---

## ⏱️ TEMPO MASSIMO `write: true`

**Consigliato**: MAX 15 minuti
- 2 min: abilita scrittura
- 10 min: upload dati
- 3 min: ripristina sicurezza

Se superi i 15 minuti, qualcuno potrebbe sfruttare l'accesso aperto.

---

*Documento creato: 14 Gennaio 2026*
*Progetto: MAP - Manual Analyses Platform v1.15.3*
