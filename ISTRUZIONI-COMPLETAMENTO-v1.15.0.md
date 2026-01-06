# 🚀 Istruzioni Rapide - Completamento Libreria Framework v1.15.0

**Per**: Sergio  
**Obiettivo**: Completare implementazione Libreria Framework Firebase  
**Tempo stimato**: 20-30 minuti

---

## ✅ **FATTO**

1. ✅ UI dropdown framework implementata (`index.html`)
2. ✅ Funzioni JavaScript per caricamento framework (`js/app.js`)
3. ✅ Tool upload framework (`upload-frameworks-to-firebase.html`)
4. ✅ Documentazione completa (`FRAMEWORK-LIBRARY-FIREBASE-v1.15.0.md`)
5. ✅ CHANGELOG aggiornato
6. ✅ README aggiornato

---

## 📋 **DA FARE (3 step)**

### **STEP 1: Configurare Firebase Rules (5 minuti)**

1. **Apri Firebase Console:**  
   👉 https://console.firebase.google.com/project/analisi-manuali-zanichelli/firestore/rules

2. **Modifica le regole** aggiungendo questo blocco:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    match /frameworks/{frameworkId} {
      allow read: if true;
      allow write: if false;
    }
    
    match /analyses/{analysisId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

3. **Clicca "Pubblica"**

---

### **STEP 2: Caricare Framework su Firebase (10 minuti)**

1. **Apri il tool di upload** nel browser:

```batch
# Nel tuo PC:
C:\Users\SARTINI\Desktop\MAP\MAP Manual Analyses Platform\

# Doppio click su:
upload-frameworks-to-firebase.html
```

2. **Clicca "Seleziona Framework JSON"**

3. **Seleziona TUTTI i file JSON** dei framework:
   - `chimica_generale.json`
   - `chimica_organica.json`
   - `matematica_bioscienze.json`
   - `economia_politica.json`
   - ... (tutti gli altri ~46 framework)

   **Tip**: Usa `Ctrl+A` per selezionare tutti i file nella cartella

4. **Clicca "🚀 Upload su Firebase"**

5. **Attendi completamento** (~30-60 secondi per 50 framework)

6. **Verifica risultati:**
   - ✅ Tutti i file dovrebbero mostrare "✅ Success"
   - Se ci sono errori ❌, riprova per quei file specifici

---

### **STEP 3: Test nell'app principale (5 minuti)**

1. **Apri l'app** nel browser:

```batch
# URL locale (se sviluppo):
file:///C:/Users/SARTINI/Desktop/MAP/MAP Manual Analyses Platform/index.html

# OPPURE URL Netlify develop (dopo deploy):
https://develop--map-manual-analyses-platform.netlify.app
```

2. **Verifica dropdown framework:**
   - Dovresti vedere "📚 Seleziona framework dalla libreria..."
   - Clicca sul dropdown
   - Dovresti vedere framework raggruppati per materia:
     ```
     📂 Chimica Generale
       • Framework Unico Valutazione Chimica Generale
     📂 Chimica Organica
       • Framework Unico Valutazione Chimica Organica
     📂 Economia Politica
       • Framework Unico Valutazione Economia Politica
     ...
     ```

3. **Test selezione framework:**
   - Seleziona un framework dal dropdown
   - Verifica che:
     - ✅ Il campo "Materia" si popola automaticamente
     - ✅ Appare notifica "✅ Framework '[nome]' caricato"
     - ✅ Il form si abilita per l'analisi

4. **Test fallback CSV custom:**
   - Clicca "Oppure carica un framework CSV personalizzato"
   - Verifica che la sezione si espanda
   - Verifica che puoi ancora caricare un CSV manualmente

---

## 🎯 **Deploy su Develop per Test Online**

Dopo aver verificato che tutto funziona localmente:

```batch
# Dal terminale nella cartella progetto
cd "C:\Users\SARTINI\Desktop\MAP\MAP Manual Analyses Platform"

# Assicurati di essere su branch develop
git branch --show-current
# Output atteso: develop

# Oppure usa il file .bat
push-to-develop.bat

# Messaggio commit suggerito:
feat: Libreria Framework Firebase v1.15.0

# Test online:
# https://develop--map-manual-analyses-platform.netlify.app
```

---

## 🐛 **Troubleshooting**

### **Errore: "Firebase non inizializzato"**

**Causa:** Firebase non caricato

**Soluzione:**
- Verifica console browser (F12) per errori
- Ricarica pagina (Ctrl+Shift+R)

---

### **Errore: "Missing or insufficient permissions"**

**Causa:** Firebase Rules non configurate

**Soluzione:**
- Vai su STEP 1 e configura le regole
- Pubblica le regole
- Ricarica app

---

### **Dropdown vuoto: "Nessun framework disponibile"**

**Causa:** Framework non caricati su Firebase

**Soluzione:**
- Vai su STEP 2 e carica i framework
- Clicca pulsante "🔄" refresh nell'app

---

### **Upload framework fallisce**

**Causa:** File JSON malformato

**Soluzione:**
- Verifica che i file JSON siano validi
- Apri file in editor e controlla sintassi
- Riprova upload per i file falliti

---

## 📊 **Verifica Finale**

### **Checklist:**

- [ ] Firebase Rules configurate e pubblicate
- [ ] ~50 framework caricati su Firestore
- [ ] Dropdown popolato nell'app
- [ ] Test selezione framework funzionante
- [ ] Campo "Materia" si popola automaticamente
- [ ] Fallback CSV custom disponibile
- [ ] Deploy su branch `develop` completato
- [ ] Test online su Netlify develop OK

---

## 🎉 **Quando Tutto Funziona**

1. **Segnala completamento** 
2. **Feedback su funzionamento**
3. **Procediamo con Libreria Indici Manuali** (simile implementazione)

---

## 📞 **Hai Problemi?**

Se incontri problemi, fornisci:

1. **Screenshot** dell'errore
2. **Console browser** (F12 → Console tab)
3. **Step specifico** dove si è verificato l'errore

---

**Fine istruzioni - Buon lavoro! 🚀**
