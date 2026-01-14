# 🎯 PROMPT PER PROSSIMA SESSIONE

## 📋 COPIA E INCOLLA QUESTO PROMPT NELLA NUOVA CHAT:

---

**CONTESTO PROGETTO**:

Sono Sergio, funzionario commerciale e promotore editoriale per Zanichelli. Sto lavorando sul progetto **MAP - Manual Analyses Platform**, un'applicazione web per analizzare manuali universitari rispetto a framework di valutazione didattici usando AI (OpenAI, Anthropic, Google Gemini).

**VERSIONE ATTUALE**: v1.15.3

**STATO PROGETTO** (aggiornato 14/01/2026):
- ✅ PC Locale: `C:\Users\SARTINI\Desktop\MAP\MAP Manual Analyses Platform\`
- ✅ GitHub: `sartinisergio/MAP-Admin-App` (branch `develop`)
- ✅ Netlify develop: https://develop--map-manual-analyses-platform.netlify.app (ONLINE)
- ⚠️ Netlify production: https://map-manual-analyses-platform.netlify.app (da aggiornare)

**FUNZIONALITÀ IMPLEMENTATE**:
1. ✅ Libreria Framework Firebase (~50 framework pubblici)
2. ✅ Libreria Manuali Firebase (~80 manuali con filtri avanzati)
3. ✅ Analisi LLM completa di TUTTI i moduli del framework (fix recente)
4. ✅ Supporto multi-provider AI (OpenAI, Anthropic, Google)
5. ✅ Cache Firebase per analisi istantanee
6. ✅ Export HTML, Word, PDF

**TOOL AMMINISTRATIVI** (solo su PC locale, NON su GitHub):
- `upload-frameworks-to-firebase.html` - Carica framework CSV su Firebase
- `upload-manuals-to-firebase.html` - Carica manuali JSON su Firebase

**FIREBASE**:
- Project: `analisi-manuali-zanichelli`
- Collections: `frameworks` (~50), `manuals` (~80), `analyses` (cache)
- Console: https://console.firebase.google.com/project/analisi-manuali-zanichelli

---

## 🎯 OBIETTIVO SESSIONE:

Vorrei approfondire la **gestione di framework e manuali** su Firebase:

1. **Come aggiungere nuovi framework** (file CSV)
2. **Come aggiungere nuovi manuali** (file JSON)
3. **Come modificare framework/manuali esistenti**
4. **Come eliminare framework/manuali**
5. **Struttura corretta dei file CSV/JSON**
6. **Best practices per la gestione dati**

Se possibile, vorrei anche:
- Creare una **guida completa** per gestire framework e manuali
- Capire come **normalizzare i dati** (materie, autori, editori)
- Verificare la **struttura Firebase** attuale

---

## 📁 FILE DI RIFERIMENTO:

Per contestualizzare meglio, allego:
- `STATO-PROGETTO-2026-01-14.md` - Stato completo del progetto
- `upload-frameworks-to-firebase.html` (opzionale) - Tool upload framework
- `upload-manuals-to-firebase.html` (opzionale) - Tool upload manuali

Oppure posso fornirti accesso al repository GitHub se necessario.

---

## 🚨 NOTA IMPORTANTE:

C'è un **avviso di sicurezza GitHub** attivo per API Key Google esposta nel repository. Dobbiamo rimuovere i file tool dal tracking Git ma mantenerli sul PC locale.

---

## ❓ DOMANDE IMMEDIATE:

1. Hai bisogno di vedere il contenuto dei file tool?
2. Preferisci esempi pratici o una guida teorica?
3. Vuoi che creiamo anche script automatici per gestione bulk?

Grazie! 🚀

---

**STILE DI COMUNICAZIONE PREFERITO**: 
Italiano, pratico e diretto, con esempi concreti. Sono abituato a lavorare con codice e Firebase Console.

