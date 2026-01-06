# 🚀 Guida Completa: Deploy su Netlify

## 📋 Panoramica

Questa guida ti spiega **passo-passo** come mettere online l'applicazione "Analizzatore Manuali Universitari" su Netlify gratuitamente.

---

## 🎯 Metodo Consigliato: Drag & Drop

### Step 1: Scaricare i File

**Opzione A: Download Manuale**
1. Dalla tab "Files" di questa piattaforma, scarica tutti i file:
   - `index.html`
   - `js/app.js`
   - `README.md`
   - `guida-rapida.html`
   - Tutti gli altri file `.md` e `.txt`

2. Crea una cartella sul tuo PC chiamata `analizzatore-zanichelli`
3. Inserisci tutti i file scaricati mantenendo la struttura:
   ```
   analizzatore-zanichelli/
   ├── index.html
   ├── guida-rapida.html
   ├── js/
   │   └── app.js
   ├── README.md
   ├── LEGGIMI.txt
   └── ... altri file
   ```

**Opzione B: Download da Tab "Publish"**
1. Vai nella tab "Publish" 
2. Clicca "Download Files" (se disponibile)
3. Estrai lo ZIP sul tuo PC

---

### Step 2: Creare Account Netlify

1. Vai su **[netlify.com](https://www.netlify.com/)**
2. Clicca "Sign up" in alto a destra
3. Registrati con:
   - Email (consigliato)
   - GitHub (se hai già un account)
   - GitLab o Bitbucket

4. Conferma l'email se richiesto

---

### Step 3: Deploy con Drag & Drop

1. **Dalla Dashboard Netlify**:
   - Vedrai scritto "Want to deploy a new site without connecting to Git?"
   - C'è una zona con scritto **"Drag and drop your site output folder here"**

2. **Trascina la cartella**:
   - Apri la cartella `analizzatore-zanichelli` sul tuo PC
   - Trascina **l'intera cartella** sulla zona di drop di Netlify
   - Aspetta che tutti i file vengano caricati (barra di progresso)

3. **Deploy Automatico**:
   - Netlify genera automaticamente un URL tipo:
     ```
     https://curious-fairy-a1b2c3.netlify.app
     ```
   - Il sito è **già online**!

---

### Step 4: Testare l'Applicazione

1. Clicca sul link generato
2. Verifica che:
   - ✅ La pagina si carica correttamente
   - ✅ Vedi il form per inserire la chiave API
   - ✅ Puoi caricare file (CSV e PDF)
   - ✅ L'analisi funziona
   - ✅ Lo storico si salva

---

### Step 5: Personalizzare il Nome (Opzionale)

Il nome random tipo `curious-fairy-a1b2c3` non è molto professionale. Cambialo!

1. Dalla dashboard del tuo sito, clicca **"Site settings"**
2. Clicca **"Change site name"**
3. Scegli un nome unico (es: `analizzatore-zanichelli`)
4. Il tuo URL diventerà:
   ```
   https://analizzatore-zanichelli.netlify.app
   ```

---

## 🔧 Configurazioni Avanzate

### Aggiungere un Dominio Personalizzato

Se Zanichelli ha un dominio (es: `analisi.zanichelli.com`):

1. Vai in **"Domain settings"** → **"Add custom domain"**
2. Inserisci il dominio (es: `analisi.zanichelli.com`)
3. Netlify ti darà le istruzioni DNS da configurare
4. Nel pannello del tuo provider DNS, aggiungi:
   ```
   Type: CNAME
   Name: analisi
   Value: analizzatore-zanichelli.netlify.app
   ```
5. Aspetta la propagazione DNS (5-60 minuti)
6. Netlify attiverà automaticamente HTTPS gratuito!

---

### Configurare HTTPS (Già Attivo!)

Netlify fornisce **HTTPS gratuito automatico** via Let's Encrypt:
- ✅ Nessuna configurazione richiesta
- ✅ Certificato si rinnova automaticamente
- ✅ Redirect HTTP → HTTPS attivato di default

---

### Protezione con Password (Opzionale)

Se vuoi limitare l'accesso solo al team Zanichelli:

1. Upgrade a **Netlify Pro** ($19/mese)
2. Vai in "Site settings" → "Access control"
3. Abilita "Password protection"
4. Imposta una password
5. Solo chi conosce la password potrà accedere

**Alternativa Gratuita**: Usa Basic Auth con un file `_headers`:
```
/*
  Basic-Auth: zanichelli:password123
```
(Non sicuro per uso pubblico, solo per demo interne)

---

## 🔄 Aggiornare l'Applicazione

Quando modifichi il codice:

### Metodo 1: Re-Upload Manuale
1. Scarica di nuovo tutti i file
2. Vai sul sito Netlify → "Deploys" tab
3. Trascina la nuova cartella su "Drop to upload"
4. Netlify sostituirà la vecchia versione

### Metodo 2: Deploy da Git (Consigliato per Sviluppo Continuo)

**Setup Iniziale**:
1. Crea un repository GitHub per il progetto
2. Carica i file su GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/tuoaccount/analizzatore.git
   git push -u origin main
   ```

**Connetti Netlify a GitHub**:
1. In Netlify: "Add new site" → "Import an existing project"
2. Scegli "Deploy with GitHub"
3. Autorizza Netlify
4. Seleziona il repository
5. Lascia le impostazioni di default:
   - Build command: (vuoto)
   - Publish directory: `/`
6. Clicca "Deploy"

**Deploy Automatico**:
- Ogni volta che fai `git push`, Netlify fa il deploy automatico!
- Vedi lo stato del deploy in tempo reale

---

## 📊 Monitoring e Analytics

### Build & Deploy Logs
Netlify mostra in tempo reale:
- Upload dei file
- Processing
- Publishing
- URL finale

Se qualcosa va storto, i log ti dicono esattamente cosa.

### Netlify Analytics (Opzionale - $9/mese)
Statistiche dettagliate:
- Visite uniche
- Pagine più visitate
- Provenienza geografica
- Performance

**Alternativa Gratuita**: Aggiungi Google Analytics:
```html
<!-- In index.html, prima di </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🛡️ Sicurezza e Privacy

### Chiave API OpenAI
⚠️ **IMPORTANTE**: La chiave API è **completamente sicura**:
- ✅ Gestita SOLO lato client (nel browser)
- ✅ Mai inviata a Netlify
- ✅ Non salvata nei file del progetto
- ✅ Salvata in `sessionStorage` (cancellata alla chiusura)

Ogni utente deve:
1. Aprire l'app
2. Inserire la propria chiave API
3. Cliccare "Verifica Chiave"

### File Caricati (CSV/PDF)
- ✅ Processati SOLO nel browser
- ✅ Non caricati su server
- ✅ Inviati solo a OpenAI per l'analisi
- ✅ Non salvati permanentemente

### Database Locale (IndexedDB)
- ✅ Le analisi sono salvate **nel browser dell'utente**
- ✅ Non sincronizzate su server
- ✅ Privacy totale

---

## 💰 Costi

### Netlify
- ✅ **Piano Free** sufficiente per questo progetto:
  - 100 GB bandwidth/mese
  - Deploy illimitati
  - HTTPS gratuito
  - Dominio custom gratuito (escluso dominio)

### OpenAI
- ❌ **Non incluso** - ogni utente usa la propria chiave
- Costo variabile in base all'uso:
  - GPT-4o: ~$0.01-0.03 per analisi (dipende dalla lunghezza)
  - Suggerimento: crea un account OpenAI di team con budget condiviso

---

## ❓ FAQ - Problemi Comuni

### "Il sito non si carica"
- Controlla che `index.html` sia nella root della cartella
- Verifica che il deploy sia completato (status "Published")
- Prova a ricaricare con Ctrl+F5 (cache refresh)

### "Gli script non funzionano"
- Controlla che la cartella `js/` sia presente
- Verifica che `app.js` sia nella posizione corretta
- Apri la console del browser (F12) per vedere errori

### "Errore 404 su alcune pagine"
Questo progetto ha una sola pagina (`index.html`), non ci sono route.
Se aggiungi pagine multiple, crea un file `_redirects`:
```
/* /index.html 200
```

### "Il deploy è lento"
- Netlify è molto veloce (<1 minuto)
- Se è lento, controlla la tua connessione
- Evita di caricare file enormi non necessari

---

## 🎓 Risorse Utili

### Documentazione Ufficiale
- [Netlify Docs](https://docs.netlify.com/)
- [Netlify Drag & Drop](https://docs.netlify.com/site-deploys/create-deploys/#drag-and-drop)
- [Custom Domains](https://docs.netlify.com/domains-https/custom-domains/)

### Video Tutorial (YouTube)
- "How to Deploy a Website on Netlify" (molti tutorial disponibili)
- Cerca: "Netlify drag and drop tutorial"

### Supporto
- [Netlify Community](https://answers.netlify.com/)
- [Netlify Support](https://www.netlify.com/support/)

---

## ✅ Checklist Post-Deploy

Dopo aver fatto il deploy, verifica:

- [ ] Il sito è raggiungibile dal link Netlify
- [ ] La pagina si carica senza errori
- [ ] Il form di upload funziona
- [ ] L'inserimento della chiave API funziona
- [ ] Il pulsante "Verifica Chiave" risponde
- [ ] Il caricamento CSV funziona
- [ ] Il caricamento PDF funziona
- [ ] L'analisi viene completata
- [ ] I risultati vengono visualizzati
- [ ] L'export Markdown/HTML funziona
- [ ] Lo "Storico Analisi" si apre
- [ ] Le analisi vengono salvate
- [ ] Il confronto side-by-side funziona
- [ ] La console non mostra errori critici (F12 → Console)

---

## 🎉 Fatto!

Il tuo sito è online e accessibile a tutto il team Zanichelli!

**URL Finale**: `https://tuosito.netlify.app`

Condividi il link con i colleghi e iniziate ad analizzare i manuali! 📚

---

**Versione Guida**: 1.0  
**Data**: Gennaio 2025  
**Contatti**: Team Sviluppo Zanichelli
