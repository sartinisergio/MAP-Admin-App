# 🧪 Checklist Test Firebase

**Istruzioni:** Segui questi test uno per uno per verificare che Firebase funzioni correttamente.

---

## ✅ Test 1: Verifica Caricamento Pagina

**Obiettivo:** Verificare che l'app carichi senza errori

### Passi:
1. Apri l'app nel browser
2. Premi `F12` per aprire Developer Tools
3. Vai sulla tab **Console**

### Risultato Atteso:
✅ Vedi il messaggio: `✅ Firebase inizializzato con successo`

### Se c'è un errore:
❌ Annota l'errore e controlla la connessione internet

---

## ✅ Test 2: Badge Firebase

**Obiettivo:** Verificare che il badge Firebase mostri lo stato corretto

### Passi:
1. Guarda in alto a destra nell'interfaccia
2. Trova il pulsante con scritto "Firebase"
3. Osserva il colore e il testo

### Risultato Atteso:
🟢 Pulsante **verde** con testo: **"Firebase (✓ online)"**

### Altri stati possibili:
- 🟠 **Arancione** "Firebase (⚠ errore)" → Problema connessione
- ⚫ **Grigio** "Firebase (offline)" → Firebase disabilitato

---

## ✅ Test 3: Clicca Badge Firebase

**Obiettivo:** Verificare connessione attiva

### Passi:
1. Clicca sul pulsante **"Firebase"** in alto a destra
2. Aspetta 1-2 secondi

### Risultato Atteso:
✅ Appare notifica verde: **"✅ Firebase connesso - X analisi pubblicate nel cloud"**

(dove X = numero analisi già pubblicate)

### Se vedi altro:
- ⚠️ **"Firebase non disponibile"** → Controlla internet
- ❌ **"Firebase non raggiungibile"** → Problema Firestore

---

## ✅ Test 4: Crea Analisi di Test

**Obiettivo:** Creare un'analisi da pubblicare

### Passi:
1. Inserisci API Key OpenAI (se non già fatto)
2. Carica un file framework CSV di esempio
3. Carica un PDF di un manuale
4. Inserisci materia: **"TEST FIREBASE"**
5. Clicca **"Analizza"**
6. Aspetta il completamento

### Risultato Atteso:
✅ Analisi completata e salvata localmente

---

## ✅ Test 5: Pubblica l'Analisi

**Obiettivo:** Testare la sincronizzazione Firebase

### Passi:
1. Clicca su **"Storico Analisi"**
2. Trova l'analisi **"TEST FIREBASE"**
3. Clicca sul pulsante **"Privata 🔒"**
4. Osserva la notifica che appare

### Risultato Atteso:
✅ Notifica verde: **"🌐 Analisi pubblicata! Visibile nella galleria colleghi (sincronizzata con Firebase)"**

### Se vedi altro:
- ⚠️ **"Salvato localmente, ma errore sincronizzazione cloud"**  
  → Firebase non raggiungibile, controlla internet e riprova

---

## ✅ Test 6: Verifica su Firebase Console

**Obiettivo:** Confermare che i dati sono su Firebase

### Passi:
1. Apri una nuova tab browser
2. Vai su: https://console.firebase.google.com/
3. Seleziona progetto: **"analisi-manuali-zanichelli"**
4. Nel menu laterale, clicca su **"Firestore Database"**
5. Cerca la collezione **"analyses"**
6. Dovresti vedere almeno un documento

### Risultato Atteso:
✅ Vedi un documento con i dati dell'analisi pubblicata

**Esempio:**
```
analyses/
  └─ 1732464000000/   (ID univoco)
       ├─ materia: "TEST FIREBASE"
       ├─ volumeName: "..."
       ├─ results: "## ANALISI..."
       ├─ pubblicata: true
       ├─ timestamp: 1732464000000
       └─ version: "1.8.0"
```

### Se non vedi nulla:
❌ Problema sincronizzazione - torna al Test 5

---

## ✅ Test 7: Rendi Privata l'Analisi

**Obiettivo:** Verificare eliminazione da Firebase

### Passi:
1. Torna nell'app
2. Clicca **"Storico Analisi"**
3. Trova l'analisi pubblicata (badge **"Pubblica 🌐"**)
4. Clicca sul pulsante **"Pubblica 🌐"**

### Risultato Atteso:
✅ Notifica blu: **"🔒 Analisi resa privata (rimossa da Firebase)"**

---

## ✅ Test 8: Ricontrolla Firebase Console

**Obiettivo:** Verificare eliminazione dal cloud

### Passi:
1. Torna su Firebase Console
2. Ricarica la pagina (F5)
3. Guarda la collezione **"analyses"**

### Risultato Atteso:
✅ Il documento dell'analisi **non c'è più** (o è scomparso)

---

## ✅ Test 9: Pubblica di Nuovo

**Obiettivo:** Test completo del ciclo

### Passi:
1. Pubblica di nuovo l'analisi
2. Controlla notifica verde
3. Verifica su Firebase Console che il documento sia riapparso

### Risultato Atteso:
✅ Documento riappare su Firebase

---

## ✅ Test 10: Crea Seconda Analisi

**Obiettivo:** Verificare gestione multipla

### Passi:
1. Crea un'altra analisi (materia diversa)
2. Pubblicala
3. Controlla Firebase Console

### Risultato Atteso:
✅ **Due documenti** nella collezione `analyses`

---

## 📊 Riepilogo Risultati

Compila questa checklist:

- [ ] Test 1: Caricamento OK ✅
- [ ] Test 2: Badge verde ✅
- [ ] Test 3: Clic badge OK ✅
- [ ] Test 4: Analisi creata ✅
- [ ] Test 5: Pubblicazione OK ✅
- [ ] Test 6: Documento su Firebase ✅
- [ ] Test 7: Resa privata OK ✅
- [ ] Test 8: Documento rimosso ✅
- [ ] Test 9: Ripubblicazione OK ✅
- [ ] Test 10: Gestione multipla OK ✅

---

## 🎯 Esito Finale

### ✅ Tutti i test passati?
**CONGRATULAZIONI!** 🎉  
Firebase è integrato correttamente e funziona perfettamente!

**Prossimo passo:** Sviluppo Viewer App per i colleghi

---

### ❌ Alcuni test falliti?

**Cosa fare:**
1. Annota quali test sono falliti
2. Controlla i messaggi di errore nella console browser
3. Rileggi [FIREBASE-INTEGRATION.md](FIREBASE-INTEGRATION.md) sezione "Risoluzione Problemi"
4. Riprova i test falliti

---

## 🆘 Errori Comuni

### Errore: "Firebase non inizializzato"
**Causa:** Script Firebase non caricati  
**Soluzione:** Ricarica pagina (Ctrl+F5) o controlla connessione

### Errore: "Permission denied"
**Causa:** Security Rules non configurate  
**Soluzione:** Vai su Firebase Console > Firestore > Rules e verifica

### Errore: "Network error"
**Causa:** Firewall o connessione internet  
**Soluzione:** Controlla internet, disabilita VPN, riprova

---

**Domande?** Consulta [FIREBASE-INTEGRATION.md](FIREBASE-INTEGRATION.md) o [FAQ-RAPIDE.md](FAQ-RAPIDE.md)
