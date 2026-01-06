# 📚 Libreria Framework Firebase - Guida Completa

**Versione**: v1.15.0  
**Data**: 2025-01-06  
**Autore**: MAP Development Team

---

## 🎯 Obiettivo

Implementare una libreria centralizzata di framework di valutazione su Firebase Firestore per:

✅ **Velocizzare l'upload** (da 2 minuti → 10 secondi)  
✅ **Centralizzare i dati** (framework disponibili per tutti)  
✅ **Migliorare l'UX** (dropdown invece di upload manuale)  
✅ **Standardizzare** (dati coerenti e riutilizzabili)

---

## 📊 Struttura Dati Firebase

### **Collection: `frameworks`**

```javascript
{
  // Identificazione
  id: "chimica-generale-2025-abc123",          // Auto-generato
  name: "Framework Unico Valutazione Chimica Generale",
  subject: "Chimica Generale",                 // Per filtri
  
  // Metadati
  version: "1.0",
  description: "Framework integrato per...",
  date: "2025-12-15",
  
  // Scala di valutazione
  scale: {
    "1": "livello minimo/assente",
    "2": "livello molto basso/sporadico",
    "3": "livello moderato/base",
    "4": "livello alto/articolato",
    "5": "livello massimo/avanzato"
  },
  
  // Moduli del syllabus
  syllabus_modules: [
    {
      id: 1,
      name: "Struttura atomica e tavola periodica",
      core_contents: [
        "Particelle subatomiche, isotopi, numero Avogadro",
        "Modello Bohr, spettri atomici",
        ...
      ],
      learning_outcomes: [
        "Predire configurazioni elettroniche",
        ...
      ]
    },
    ...
  ],
  
  // Sistema
  created_at: firebase.firestore.Timestamp,
  created_by: "sergio@zanichelli.it",
  public: true
}
```

---

## 🚀 Come Caricare Framework su Firebase

### **STEP 1: Prepara i file JSON**

Hai già preparato i file:
- ✅ `chimica_generale.json`
- ✅ `chimica_organica.json`
- ✅ `matematica_bioscienze.json`
- ✅ `economia_politica.json`
- ... (altri ~46 framework)

### **STEP 2: Apri tool di upload**

1. Apri: `upload-frameworks-to-firebase.html` nel browser
2. Clicca "Seleziona Framework JSON"
3. Seleziona tutti i file JSON (Ctrl+A)
4. Clicca "🚀 Upload su Firebase"

### **STEP 3: Attendi completamento**

L'upload richiede ~30-60 secondi per 50 framework.

Vedrai:
```
✅ chimica_generale.json
   ID: chimica-generale-2025-abc123
   Nome: Framework Unico Valutazione Chimica Generale

✅ economia_politica.json
   ID: economia-politica-2025-def456
   Nome: Framework Unico Valutazione Economia Politica

...
```

### **STEP 4: Verifica su Firebase Console**

1. Vai su: https://console.firebase.google.com/project/analisi-manuali-zanichelli/firestore
2. Cerca collection `frameworks`
3. Verifica che ci siano ~50 documenti

---

## 🔒 Regole di Sicurezza Firebase

### **Configurazione necessaria:**

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

### **Come applicare le regole:**

1. Vai su: https://console.firebase.google.com/project/analisi-manuali-zanichelli/firestore/rules
2. Aggiungi le regole sopra
3. Clicca "Pubblica"

---

## 🎨 Interfaccia Utente

### **Dropdown Framework**

Nell'app principale (`index.html`), l'utente vedrà:

```
┌─────────────────────────────────────────────┐
│ Framework di Valutazione *                  │
│                                             │
│ 📚 Seleziona framework dalla libreria... ▼ │
│ ┌─────────────────────────────────────────┐ │
│ │ 📂 Chimica Generale                     │ │
│ │   • Framework Unico Valutazione Chimi...│ │
│ │ 📂 Chimica Organica                     │ │
│ │   • Framework Unico Valutazione Chimi...│ │
│ │ 📂 Economia Politica                    │ │
│ │   • Framework Unico Valutazione Econo...│ │
│ │ 📂 Fisica                               │ │
│ │   • ...                                 │ │
│ │ 📂 Matematica                           │ │
│ │   • ...                                 │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ 💡 Oppure carica framework CSV personaliz... │
│    ▼ Espandi per upload CSV custom          │
└─────────────────────────────────────────────┘
```

### **Flusso Utente**

1. **Utente apre app**
2. **Dropdown carica framework da Firebase** (automatico)
3. **Utente seleziona framework** dal dropdown
   - ✅ Framework caricato istantaneamente
   - ✅ Materia auto-popolata
4. **OPPURE** Utente clicca "Espandi per upload CSV custom"
   - Mantiene possibilità di upload manuale

---

## 🧪 Test e Debugging

### **Test 1: Verifica caricamento framework**

```javascript
// Console Browser (index.html)
console.log(appState.frameworkData);
// Output atteso: Array di oggetti con Modulo, Contenuti, Obiettivi, etc.
```

### **Test 2: Verifica Firestore**

```javascript
// Firebase Console → Firestore → frameworks
// Verifica che ci siano ~50 documenti
```

### **Test 3: Dropdown popolato**

```html
<!-- Dropdown dovrebbe mostrare -->
<option value="">📚 Seleziona framework...</option>
<optgroup label="📂 Chimica Generale">
  <option value="chimica-generale-...">Framework Unico...</option>
</optgroup>
...
```

---

## 📈 Prestazioni

### **Prima (v1.14.6):**
```
1. Upload CSV (30 sec)
2. Parsing CSV (5 sec)
3. Upload PDF (30 sec)
4. Parsing PDF (30 sec)
5. Analizza (30 sec - 2 min)
────────────────────────────
Totale: ~2.5-3.5 minuti
```

### **Dopo (v1.15.0):**
```
1. Dropdown Framework (1 sec)
2. Dropdown Manuale (1 sec) [FUTURO]
3. Analizza (da cache se già fatta, altrimenti 30 sec)
────────────────────────────
Totale: ~2-40 secondi
```

**Risparmio: ~90-95%** ⚡

---

## 🐛 Troubleshooting

### **Errore: "Firebase non inizializzato"**

**Causa:** Firebase non caricato correttamente

**Soluzione:**
1. Verifica che `firebase-app-compat.js` e `firebase-firestore-compat.js` siano caricati
2. Controlla console browser per errori

### **Errore: "Missing or insufficient permissions"**

**Causa:** Regole Firebase non configurate

**Soluzione:**
1. Vai su Firebase Console → Firestore → Rules
2. Aggiungi regole come descritto sopra
3. Pubblica

### **Dropdown vuoto**

**Causa:** Nessun framework caricato su Firebase

**Soluzione:**
1. Usa `upload-frameworks-to-firebase.html` per caricare framework
2. Clicca "🔄 Ricarica" nell'app principale

---

## 🚀 Deployment

### **Branch Strategy**

```bash
# Sviluppo su branch develop
git checkout develop
git add .
git commit -m "feat: Libreria Framework Firebase v1.15.0"
git push origin develop

# Test su Netlify develop
# URL: https://develop--map-manual-analyses-platform.netlify.app

# Deploy in produzione (quando testato)
git checkout main
git merge develop
git push origin main

# URL: https://map-manual-analyses-platform.netlify.app
```

---

## 📝 TODO

- [✅] Struttura dati Firebase
- [✅] Funzioni caricamento framework
- [✅] UI dropdown framework
- [✅] Tool upload framework (`upload-frameworks-to-firebase.html`)
- [⏳] Upload framework JSON su Firebase
- [⏳] Configurare regole Firebase
- [⏳] Test completo
- [ ] Implementare Libreria Indici Manuali (simile)
- [ ] Deploy in produzione

---

## 🎯 Next Steps

**PER SERGIO:**

1. **Carica framework su Firebase:**
   - Apri `upload-frameworks-to-firebase.html`
   - Seleziona tutti i JSON
   - Upload

2. **Configura regole Firebase:**
   - Firebase Console → Firestore → Rules
   - Aggiungi regole lettura pubblica per `frameworks`

3. **Test app principale:**
   - Apri app
   - Verifica dropdown popolato
   - Seleziona framework
   - Verifica funzionamento

4. **Deploy su develop:**
   - `push-to-develop.bat`
   - Test online

5. **Deploy in produzione (quando OK):**
   - `push-to-production.bat`

---

**Fine documentazione Libreria Framework Firebase v1.15.0**
