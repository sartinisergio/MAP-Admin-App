# GUIDA: Come Ottenere le API Keys

**Versione**: v1.14.0  
**Per**: Sergio e utenti Admin App

---

## 🔑 OVERVIEW

L'Admin App v1.14.0 supporta **3 provider AI**:
- **OpenAI** (GPT-4o, GPT-4o-mini, etc.)
- **Anthropic Claude** (Claude 3.5 Sonnet, etc.)
- **Perplexity AI** (Sonar, Sonar Pro)

Hai bisogno di **almeno 1 API key** per usare l'app.

**Raccomandazione per iniziare**: **OpenAI GPT-4o-mini** (economico, veloce, ottima qualità)

---

## 1️⃣ OPENAI API KEY

### Costi:
- **gpt-4o-mini**: $0.003/analisi ⭐ **(RACCOMANDATO)**
- gpt-4o: $0.054/analisi
- gpt-3.5-turbo: $0.009/analisi
- gpt-4-turbo: $0.175/analisi

### Come ottenerla:

#### Passo 1: Crea account OpenAI
1. Vai su [platform.openai.com](https://platform.openai.com)
2. Clicca "Sign up" (o "Log in" se hai già un account)
3. Completa registrazione con email

#### Passo 2: Aggiungi credito
1. Vai su [platform.openai.com/settings/organization/billing](https://platform.openai.com/settings/organization/billing)
2. Clicca "Add payment method"
3. Inserisci carta di credito
4. Aggiungi credito iniziale (raccomandato: **$5-10**)
   - $5 = ~1,600 analisi con gpt-4o-mini
   - $10 = ~3,300 analisi con gpt-4o-mini

#### Passo 3: Genera API Key
1. Vai su [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Clicca "Create new secret key"
3. Dai un nome (es: "Zanichelli Admin App")
4. Clicca "Create secret key"
5. **COPIA LA CHIAVE SUBITO** (non la vedrai più!)
   - Formato: `sk-proj-...` (circa 50-60 caratteri)

#### Passo 4: Usa nell'app
1. Apri Admin App
2. Seleziona "OpenAI" dal menu Provider
3. Seleziona "GPT-4o-mini (Raccomandato)"
4. Incolla chiave nel campo "Chiave API OpenAI"
5. Clicca "Verifica Chiave"
6. Se vedi "✅ Chiave valida!", sei pronto!

### 💡 Tips:
- ✅ Usa **gpt-4o-mini** per test e analisi quotidiane (18x più economico di gpt-4o)
- ✅ Usa **gpt-4o** solo per analisi finali critiche
- ✅ Imposta budget limit su OpenAI (Settings → Billing → Usage limits)
- ✅ Monitora utilizzo: [platform.openai.com/usage](https://platform.openai.com/usage)

### ⚠️ Sicurezza:
- ❌ **NON condividere** la tua API key
- ❌ **NON pubblicarla** su GitHub/forum
- ✅ Ruota la chiave periodicamente (ogni 3-6 mesi)
- ✅ Revoca vecchie chiavi inutilizzate

---

## 2️⃣ ANTHROPIC CLAUDE API KEY

### Costi:
- **claude-3.5-sonnet**: $0.077/analisi ⭐ **(MIGLIORE QUALITÀ)**
- claude-3-haiku: $0.006/analisi (economico)
- claude-3-sonnet: $0.077/analisi
- claude-3-opus: $0.383/analisi (premium)

### Come ottenerla:

#### Passo 1: Crea account Anthropic
1. Vai su [console.anthropic.com](https://console.anthropic.com)
2. Clicca "Sign up"
3. Completa registrazione con email

#### Passo 2: Aggiungi credito
1. Vai su "Settings" → "Billing"
2. Clicca "Add credit"
3. Inserisci carta di credito
4. Aggiungi credito iniziale (raccomandato: **$5-10**)
   - $5 = ~65 analisi con claude-3.5-sonnet
   - $10 = ~130 analisi con claude-3.5-sonnet

#### Passo 3: Genera API Key
1. Vai su "Settings" → "API Keys"
2. Clicca "Create Key"
3. Dai un nome (es: "Zanichelli Admin")
4. Clicca "Create"
5. **COPIA LA CHIAVE SUBITO**
   - Formato: `sk-ant-...` (circa 80-100 caratteri)

#### Passo 4: Usa nell'app
1. Apri Admin App
2. Seleziona "Anthropic Claude" dal menu Provider
3. Seleziona "Claude 3.5 Sonnet (Migliore)"
4. Incolla chiave nel campo "Chiave API Anthropic Claude"
5. Clicca "Verifica Chiave"
6. Se vedi "✅ Chiave valida!", sei pronto!

### 💡 Tips:
- ✅ Claude 3.5 Sonnet è **ECCELLENTE per analisi testuali lunghe**
- ✅ Context window 200K tokens (vs 128K di OpenAI)
- ✅ Ottimo per analisi narrative e discorsive
- ✅ Usa **claude-3-haiku** per test rapidi ($0.006)

### ⚠️ Sicurezza:
- Stesse precauzioni di OpenAI

---

## 3️⃣ PERPLEXITY AI API KEY

### Costi:
- **sonar**: $0.010/analisi
- sonar-pro: $0.077/analisi

### Caratteristiche uniche:
- ✅ Accesso a **internet in tempo reale**
- ✅ Può citare fonti online
- ✅ Utile per confronti con fonti esterne

### Come ottenerla:

#### Passo 1: Crea account Perplexity
1. Vai su [perplexity.ai](https://www.perplexity.ai)
2. Clicca "Sign up"
3. Completa registrazione

#### Passo 2: Ottieni API Key
1. Vai su [perplexity.ai/settings/api](https://www.perplexity.ai/settings/api)
2. Se necessario, sottoscrivi piano API (potrebbero esserci crediti gratuiti iniziali)
3. Copia la tua API Key
   - Formato: `pplx-...`

#### Passo 3: Usa nell'app
1. Apri Admin App
2. Seleziona "Perplexity AI" dal menu Provider
3. Seleziona "Sonar"
4. Incolla chiave nel campo "Chiave API Perplexity AI"
5. Clicca "Verifica Chiave"
6. Se vedi "✅ Chiave valida!", sei pronto!

### 💡 Tips:
- ✅ Ottimo se vuoi che l'AI citi fonti online
- ✅ Utile per confronti con altri manuali disponibili online
- ⚠️ Meno documentazione rispetto a OpenAI/Claude

---

## 🎯 QUALE SCEGLIERE?

### Per iniziare:
**→ OpenAI gpt-4o-mini** ($0.003/analisi)
- ✅ Più economico
- ✅ Setup più semplice
- ✅ Velocissimo
- ✅ Qualità eccellente per 99% dei casi

### Per qualità massima:
**→ Claude 3.5 Sonnet** ($0.077/analisi)
- ✅ Migliore per analisi testuali lunghe
- ✅ Output più articolato e professionale
- ✅ Context window più grande (200K)

### Per confronti con fonti online:
**→ Perplexity Sonar** ($0.010/analisi)
- ✅ Accesso internet in tempo reale
- ✅ Può citare fonti esterne

---

## 💰 BUDGET STIMATO

### Scenario Sergio: 100 manuali/anno

| Provider | Modello | Prima analisi | Cache (400) | **TOTALE** |
|----------|---------|---------------|-------------|------------|
| OpenAI | gpt-4o-mini | $0.30 | $0 | **$0.30** ⭐ |
| Claude | claude-haiku | $0.60 | $0 | **$0.60** |
| Perplexity | sonar | $1.00 | $0 | **$1.00** |
| OpenAI | gpt-4o | $5.40 | $0 | **$5.40** |
| Claude | claude-3.5-sonnet | $7.70 | $0 | **$7.70** |

**Raccomandazione**: Inizia con **$5 su OpenAI** (gpt-4o-mini) → Dura ~2-3 anni!

---

## 🔐 SICUREZZA E BEST PRACTICES

### ✅ DO:
1. **Imposta budget limits** su ogni provider
2. **Monitora utilizzo** regolarmente
3. **Ruota chiavi** ogni 3-6 mesi
4. **Revoca chiavi** vecchie/inutilizzate
5. **Usa chiavi diverse** per progetti diversi

### ❌ DON'T:
1. **NON condividere** chiavi con altri
2. **NON pubblicare** chiavi su GitHub/forum/email
3. **NON usare** chiavi di produzione per test
4. **NON salvare** chiavi in file di testo semplice
5. **NON riutilizzare** chiavi su più app senza controllo

### 🛡️ In caso di leak:
1. **Revoca immediatamente** la chiave compromessa
2. **Genera nuova chiave**
3. **Controlla usage** per attività sospette
4. **Contatta support** del provider se necessario

---

## 🆘 TROUBLESHOOTING

### "Chiave non valida"
- ✅ Verifica di aver copiato l'intera chiave (no spazi)
- ✅ Controlla di aver selezionato il provider corretto
- ✅ Verifica che la chiave non sia stata revocata
- ✅ Controlla di aver credito sufficiente nell'account

### "Errore di connessione"
- ✅ Verifica connessione internet
- ✅ Controlla se il provider è online (status page)
- ✅ Prova con browser diverso
- ✅ Disabilita VPN/proxy temporaneamente

### "Errore quota exceeded"
- ✅ Hai esaurito il credito → Ricarica account
- ✅ Hai raggiunto rate limit → Attendi qualche minuto
- ✅ Verifica usage limit impostati

### "Modello non disponibile"
- ✅ Alcuni modelli richiedono accesso speciale
- ✅ Controlla documentazione provider
- ✅ Prova con modello diverso

---

## 📞 SUPPORT

### OpenAI:
- Docs: [platform.openai.com/docs](https://platform.openai.com/docs)
- Support: [help.openai.com](https://help.openai.com)
- Status: [status.openai.com](https://status.openai.com)

### Anthropic Claude:
- Docs: [docs.anthropic.com](https://docs.anthropic.com)
- Support: [support.anthropic.com](https://support.anthropic.com)
- Status: [status.anthropic.com](https://status.anthropic.com)

### Perplexity:
- Docs: [docs.perplexity.ai](https://docs.perplexity.ai)
- Support: Via dashboard

---

## ✅ CHECKLIST FINALE

Prima di usare l'app, verifica di avere:
- [ ] Account creato su almeno 1 provider
- [ ] Credito aggiunto (raccomandato: $5-10)
- [ ] API Key generata e copiata
- [ ] Chiave verificata nell'app (✅ verde)
- [ ] Budget limit impostato (opzionale ma raccomandato)

**Sei pronto per analizzare!** 🚀

---

**Documento aggiornato**: 2025-11-25  
**Versione app**: v1.14.0 "Multi-Provider + Smart Cache"
