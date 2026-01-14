# 📚 GUIDA: Gestione Framework e Manuali Firebase

**Versione**: v1.15.3  
**Data**: 14 Gennaio 2026  
**Autore**: Sergio Sartini (Zanichelli)

---

## 🎯 INTRODUZIONE

Questa guida ti spiega come **aggiungere**, **modificare** ed **eliminare** framework di valutazione e manuali universitari su Firebase.

---

## 📋 INDICE

1. [Requisiti](#requisiti)
2. [Gestione Framework](#gestione-framework)
3. [Gestione Manuali](#gestione-manuali)
4. [Firebase Security Rules](#firebase-security-rules)
5. [Troubleshooting](#troubleshooting)

---

## 🔧 REQUISITI

### **Accesso**:
- ✅ Account Firebase con permessi di Editor/Owner
- ✅ Console Firebase: https://console.firebase.google.com/project/analisi-manuali-zanichelli

### **Tool Locali** (già sul tuo PC):
- ✅ `upload-frameworks-to-firebase.html`
- ✅ `upload-manuals-to-firebase.html`

**Path**: `C:\Users\SARTINI\Desktop\MAP\MAP Manual Analyses Platform\`

⚠️ **Questi file NON sono su GitHub per sicurezza** (contengono API keys)

---

## 📚 GESTIONE FRAMEWORK

### **STRUTTURA FILE CSV**

I framework sono file CSV con questa struttura:

```csv
Modulo/Sotto-modulo,L-13 Biologia,L-2 Biotecnologie,L-27 Chimica
1 Fondamenti,,,
1.1 Struttura atomica,3,2,5
1.2 Legami chimici,4,3,5
1.3 Nomenclatura,3,3,4
2 Meccanismi,,,
2.1 Reazioni organiche,5,4,5
2.2 Stereochimica,4,3,4
...
```

**Colonne**:
- **Prima colonna**: Codice modulo/argomento (es: "1.1", "2.3")
- **Altre colonne**: Classi di laurea con punteggi (1-5)

**Righe speciali**:
- **Moduli** (es: "1 Fondamenti"): Intestazioni, punteggi vuoti
- **Argomenti** (es: "1.1 Struttura"): Con punteggi

---

### **AGGIUNGERE FRAMEWORK**

#### **STEP 1: Prepara il file CSV**

Crea/modifica il CSV con la struttura sopra.

**Esempio**: `framework-fisica-generale.csv`

#### **STEP 2: Abilita scrittura Firebase**

1. Vai su: https://console.firebase.google.com/project/analisi-manuali-zanichelli/firestore/rules

2. Modifica:
   ```javascript
   match /frameworks/{frameworkId} {
     allow read: if true;
     allow write: if true;  // ⚠️ TEMPORANEO
   }
   ```

3. Clicca **"Pubblica"**

#### **STEP 3: Upload**

1. Apri: `upload-frameworks-to-firebase.html`
2. Drag & drop del file CSV
3. Clicca **🚀 Upload su Firebase**
4. Aspetta "✅ Framework caricato"

#### **STEP 4: Ripristina sicurezza**

1. Torna su Firebase Rules
2. Cambia:
   ```javascript
   match /frameworks/{frameworkId} {
     allow read: if true;
     allow write: if false;  // ✅ SICURO
   }
   ```
3. Clicca **"Pubblica"**

⏱️ **Tempo totale**: ~5 minuti  
⚠️ **MAX tempo con write: true**: 15 minuti

---

### **MODIFICARE FRAMEWORK**

#### **Metodo 1: Modifica Minore (Firebase Console)**

Per piccole correzioni (es: cambiare un punteggio):

1. Vai su: https://console.firebase.google.com/project/analisi-manuali-zanichelli/firestore/data
2. Apri collection `frameworks`
3. Trova il documento (usa filtri se necessario)
4. Clicca icona ✏️ accanto al campo da modificare
5. Modifica valore
6. Salva

#### **Metodo 2: Modifica Completa (Re-upload)**

Per modifiche sostanziali:

1. Scarica/ricrea il CSV con modifiche
2. Abilita `write: true` su Firebase
3. Re-upload con lo stesso nome (sovrascrive)
4. Ripristina `write: false`

---

### **ELIMINARE FRAMEWORK**

#### **Firebase Console**:

1. Vai su: https://console.firebase.google.com/project/analisi-manuali-zanichelli/firestore/data
2. Collection `frameworks`
3. Trova documento
4. Clicca 3 puntini → **Delete document**
5. Conferma

#### **Script Bulk** (eliminare multipli):

Console Browser (F12) nell'app:
```javascript
firestoreDb.collection('frameworks')
  .where('subject', '==', 'Chimica Generale')
  .get()
  .then(snapshot => {
    const batch = firestoreDb.batch();
    snapshot.forEach(doc => batch.delete(doc.ref));
    return batch.commit();
  })
  .then(() => console.log('✅ Eliminati'));
```

---

## 📖 GESTIONE MANUALI

### **STRUTTURA FILE JSON**

I manuali sono file JSON con questa struttura:

```json
{
  "title": "Principi di Chimica",
  "author": "Atkins",
  "publisher": "Zanichelli",
  "subject": "Chimica_Generale",
  "edition": "2a edizione italiana",
  "year": 2024,
  "volume": 1,
  "type": "zanichelli",
  "chapters": [
    {
      "number": 1,
      "title": "Struttura atomica",
      "page_start": 1,
      "sections": [
        {
          "number": "1.1",
          "title": "Gli atomi",
          "page_start": 5
        },
        {
          "number": "1.2",
          "title": "Elettroni",
          "page_start": 12
        }
      ]
    },
    {
      "number": 2,
      "title": "Legami chimici",
      "page_start": 45,
      "sections": [
        {
          "number": "2.1",
          "title": "Legame ionico",
          "page_start": 47
        }
      ]
    }
  ]
}
```

**Campi obbligatori**:
- `title`: Titolo manuale
- `author`: Autore principale

**Campi opzionali** (ma consigliati):
- `publisher`: Editore (Zanichelli, McGraw-Hill, Pearson, ecc.)
- `subject`: Materia (Chimica_Generale, Fisica_Generale, ecc.)
- `edition`: Edizione
- `year`: Anno pubblicazione
- `volume`: 1 o 2
- `type`: "zanichelli" o "competitor"
- `chapters`: Array di capitoli con sezioni

**Materie supportate** (normalizzate):
- `Chimica_Generale` → "Chimica Generale"
- `Chimica_Organica` → "Chimica Organica"
- `Fisica_Generale` / `Fisica` → "Fisica Generale"
- `Matematica` / `Analisi_1` / `Analisi_2` → "Matematica"
- `Economia_Politica` → "Economia Politica"
- `Macroeconomia` → "Macroeconomia"
- `Microeconomia` → "Microeconomia"
- `Istologia` → "Istologia ed Embriologia"

---

### **AGGIUNGERE MANUALI**

#### **STEP 1: Prepara file JSON**

Crea uno o più file JSON con la struttura sopra.

**Esempio**: `Atkins_Principi_Zanichelli.json`

**Convenzione nomi**:
- `Autore_Titolo_Editore.json`
- Es: `Giambattista_Fisica_McGrawHill.json`

#### **STEP 2: Abilita scrittura Firebase**

```javascript
match /manuals/{manualId} {
  allow read: if true;
  allow write: if true;  // ⚠️ TEMPORANEO
}
```

Pubblica regole.

#### **STEP 3: Upload**

1. Apri: `upload-manuals-to-firebase.html`
2. Seleziona uno o più file JSON (multipli OK!)
3. Clicca **🚀 Upload su Firebase**
4. Barra progresso mostrerà stato
5. Aspetta "✅ Upload completato"

**Note**:
- Supporta **upload multiplo** (puoi selezionare 10-20 file insieme)
- Progress bar mostra avanzamento
- Se un file ha errori, continua con gli altri

#### **STEP 4: Ripristina sicurezza**

```javascript
match /manuals/{manualId} {
  allow read: if true;
  allow write: if false;  // ✅ SICURO
}
```

---

### **MODIFICARE MANUALI**

#### **Metodo 1: Firebase Console (correzioni rapide)**

1. Vai su: https://console.firebase.google.com/project/analisi-manuali-zanichelli/firestore/data
2. Collection `manuals`
3. Trova documento
4. Modifica campi (title, author, subject, publisher)
5. Salva

**Campi modificabili facilmente**:
- `title`: Titolo
- `author`: Autore
- `subject`: Materia (usa nomi normalizzati!)
- `publisher`: Editore
- `edition`: Edizione
- `year`: Anno

#### **Metodo 2: Script Bulk (aggiornamento multiplo)**

Esempio: aggiornare tutti i manuali di Giambattista:

```javascript
firestoreDb.collection('manuals')
  .where('author', '==', 'Giambattista')
  .get()
  .then(snapshot => {
    const batch = firestoreDb.batch();
    snapshot.forEach(doc => {
      batch.update(doc.ref, {
        subject: 'Fisica Generale',  // Nuovo valore
        updated_at: Date.now()
      });
    });
    return batch.commit();
  })
  .then(() => console.log('✅ Aggiornati', snapshot.size, 'manuali'));
```

---

### **ELIMINARE MANUALI**

#### **Singolo documento**:

Firebase Console → Collection `manuals` → Documento → Delete

#### **Multipli (script)**:

```javascript
// Elimina tutti i manuali di un autore
firestoreDb.collection('manuals')
  .where('author', '==', 'NomeAutore')
  .get()
  .then(snapshot => {
    const batch = firestoreDb.batch();
    snapshot.forEach(doc => batch.delete(doc.ref));
    return batch.commit();
  })
  .then(() => console.log('✅ Eliminati', snapshot.size, 'manuali'));
```

---

## 🔒 FIREBASE SECURITY RULES

### **Configurazione Corretta**:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Framework pubblici: solo lettura
    match /frameworks/{frameworkId} {
      allow read: if true;
      allow write: if false;  // ✅ SICURO
    }
    
    // Manuali pubblici: solo lettura
    match /manuals/{manualId} {
      allow read: if true;
      allow write: if false;  // ✅ SICURO
    }
    
    // Analisi: lettura/scrittura (per cache)
    match /analyses/{analysisId} {
      allow read: if true;
      allow write: if true;  // ✅ NECESSARIO
    }
  }
}
```

### **⚠️ IMPORTANTE**:

- **MAI lasciare `write: true`** per framework/manuals oltre 15 minuti
- **Sempre ripristinare `write: false`** dopo upload
- **Solo `analyses` può avere `write: true`** permanente (per salvare cache)

---

## 🧪 VERIFICA DATI

### **Nell'app MAP**:

1. Apri: https://map-manual-analyses-platform.netlify.app
2. **Step 1**: Dropdown framework → verifica nuovo framework
3. **Step 2**: Dropdown manuali → verifica nuovo manuale
4. Usa filtri: Materia, Editore, Autore
5. Verifica anteprima indice

### **Su Firebase Console**:

https://console.firebase.google.com/project/analisi-manuali-zanichelli/firestore/data

- Collection `frameworks`: ~50 documenti
- Collection `manuals`: ~80 documenti
- Collection `analyses`: cache (varia)

---

## 🆘 TROUBLESHOOTING

### **Problema: "Upload fallito"**

**Causa**: Firebase Rules con `write: false`

**Soluzione**: Abilita temporaneamente `write: true`, riprova upload, ripristina `write: false`

---

### **Problema: "Manuale non appare nell'app"**

**Possibili cause**:
1. Cache browser → Apri in incognito (Ctrl+Shift+N)
2. Campo `subject` errato → Verifica spelling
3. Campo `public` = false → Cambia a true (o rimuovi)

**Verifica**:
```javascript
// Console browser nell'app
firestoreDb.collection('manuals')
  .where('title', '==', 'Titolo Manuale')
  .get()
  .then(snap => console.log(snap.docs[0].data()));
```

---

### **Problema: "File JSON non carica - Errore sintassi"**

**Causa**: JSON malformato

**Soluzione**:
1. Copia contenuto JSON
2. Vai su: https://jsonlint.com/
3. Incolla e valida
4. Correggi errori indicati

**Errori comuni**:
- Virgola finale: `"field": "value",}` ❌
- Virgolette doppie: `'field': 'value'` ❌ (usa `"`)
- Chiavi non quotate: `{field: "value"}` ❌

---

### **Problema: "Materia 'Altro' invece della materia corretta"**

**Causa**: Nome materia non normalizzato

**Soluzione**:
Usa questi nomi esatti nel campo `subject`:
- `Chimica Generale` (no underscore!)
- `Chimica Organica`
- `Fisica Generale`
- `Matematica`
- `Economia Politica`
- Ecc.

Se usi underscore (`Chimica_Generale`), il tool li converte automaticamente.

---

## 📞 SUPPORTO

**Documentazione aggiuntiva**:
- `STATO-PROGETTO-2026-01-14.md` - Stato progetto completo
- `WORKFLOW-UPLOAD-SICURO.md` - Workflow sicurezza
- `README.md` - Overview generale

**Link utili**:
- Firebase Console: https://console.firebase.google.com/project/analisi-manuali-zanichelli
- App Produzione: https://map-manual-analyses-platform.netlify.app
- GitHub Repo: https://github.com/sartinisergio/MAP-Admin-App

---

## 📊 STATISTICHE ATTUALI

**Dati su Firebase** (14/01/2026):
- Framework: ~50
- Manuali: ~80
  - Zanichelli: ~50
  - Competitor: ~30
- Materie: Chimica Generale, Chimica Organica, Fisica Generale, Matematica, Economia

---

*Documento creato: 14 Gennaio 2026*  
*Versione MAP: v1.15.3*  
*Autore: Sergio Sartini (Zanichelli)*
