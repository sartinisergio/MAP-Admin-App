# 🚀 PROCEDURA DEPLOY PRODUZIONE

## SITUAZIONE
- ✅ Branch `develop`: Aggiornato con tutte le novità
- ❌ Branch `main`: Vecchio, da aggiornare
- 🎯 Obiettivo: Portare novità da develop → main → produzione

---

## STEP-BY-STEP (10 minuti)

### STEP 1: Apri il Terminale (Git Bash)

1. Premi **Win+R**
2. Digita: `cmd` e premi INVIO
3. Oppure apri **Git Bash** se installato

---

### STEP 2: Vai nella cartella del progetto

```bash
cd "C:\Users\SARTINI\Desktop\MAP\MAP Manual Analyses Platform"
```

**Verifica di essere nella cartella giusta**:
```bash
dir
```
Dovresti vedere: `index.html`, `js`, `README.md`, ecc.

---

### STEP 3: Verifica branch attuale

```bash
git branch
```

**Output atteso**:
```
* develop
  main
```

La stellina `*` indica che sei su `develop`. **Perfetto!**

Se sei su `main`, torna su develop:
```bash
git checkout develop
```

---

### STEP 4: Assicurati che develop sia aggiornato

```bash
git status
```

**Output possibile 1** (tutto OK):
```
On branch develop
Your branch is up to date with 'origin/develop'.
nothing to commit, working tree clean
```
✅ **Vai allo STEP 5**

**Output possibile 2** (ci sono modifiche non salvate):
```
On branch develop
Changes not staged for commit:
  modified:   js/app.js
  modified:   index.html
```
⚠️ **Devi salvare le modifiche**:
```bash
git add .
git commit -m "ultimi aggiornamenti"
git push origin develop
```
✅ **Poi vai allo STEP 5**

---

### STEP 5: Passa a branch main

```bash
git checkout main
```

**Output**:
```
Switched to branch 'main'
Your branch is up to date with 'origin/main'.
```

---

### STEP 6: Scarica ultimi aggiornamenti da GitHub main

```bash
git pull origin main
```

Questo sincronizza la tua copia locale con GitHub (nel caso qualcun altro abbia fatto modifiche).

---

### STEP 7: Unisci develop in main (MERGE)

```bash
git merge develop
```

**Output possibile 1** (tutto OK):
```
Updating abc1234..def5678
Fast-forward
 js/app.js                               | 156 +++++++++++++++---
 index.html                              | 89 ++++++++++
 upload-manuals-to-firebase.html         | 521 ++++++++++++++++++++
 3 files changed, 766 insertions(+)
```
✅ **Perfetto! Vai allo STEP 8**

**Output possibile 2** (conflitti):
```
Auto-merging js/app.js
CONFLICT (content): Merge conflict in js/app.js
Automatic merge failed; fix conflicts and then commit the result.
```
⚠️ **STOP! Dimmi e ti aiuto a risolvere i conflitti**

---

### STEP 8: Publica su GitHub main

```bash
git push origin main
```

**Output**:
```
Enumerating objects: 15, done.
Counting objects: 100% (15/15), done.
...
To https://github.com/sartinisergio/MAP-Admin-App.git
   abc1234..def5678  main -> main
```

✅ **Push completato!**

---

### STEP 9: Torna su develop (per lavoro futuro)

```bash
git checkout develop
```

---

### STEP 10: Verifica deploy su Netlify (2-3 minuti)

1. Vai su: https://app.netlify.com/sites/map-manual-analyses-platform/deploys

2. Dovresti vedere un nuovo deploy in corso:
   ```
   🔵 Building...
   ```

3. Aspetta che diventi:
   ```
   ✅ Published
   ```

4. **Apri la produzione**:
   https://map-manual-analyses-platform.netlify.app

5. **Verifica**:
   - ✅ Dropdown manuali funziona
   - ✅ Filtri (Materia, Editore, Autore) presenti
   - ✅ Manuali ordinati per autore
   - ✅ Prova un'analisi rapida

---

## ✅ FATTO!

Ora hai:
- ✅ GitHub `main` aggiornato
- ✅ GitHub `develop` aggiornato
- ✅ Netlify production online con tutte le novità
- ✅ Netlify develop sempre aggiornato

---

## 📊 FLUSSO FUTURO

Per le prossime modifiche:

1. **Lavori sempre su `develop`**:
   ```bash
   git checkout develop
   # fai modifiche...
   git add .
   git commit -m "descrizione modifiche"
   git push origin develop
   ```

2. **Testi su**: https://develop--map-manual-analyses-platform.netlify.app

3. **Quando tutto OK, porti in produzione**:
   ```bash
   git checkout main
   git merge develop
   git push origin main
   ```

4. **Torni su develop per continuare a lavorare**:
   ```bash
   git checkout develop
   ```

---

## 🚨 SE QUALCOSA VA STORTO

**Non panico!** Prima di fare qualsiasi cosa:
1. **Scrivi qui il messaggio di errore**
2. **Non forzare nulla** (evita `git push -f`)
3. Ti aiuto a risolvere

---

## 📞 COMANDI UTILI

**Dove sono?**
```bash
git branch
```

**Cosa ho modificato?**
```bash
git status
```

**Annulla modifiche (se non hai ancora fatto commit)**:
```bash
git checkout -- .
```

**Torna indietro di un commit** (se hai sbagliato):
```bash
git reset --soft HEAD~1
```

---

*Documento creato: 14 Gennaio 2026*
*Versione MAP: v1.15.3*
