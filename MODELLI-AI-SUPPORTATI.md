# MODELLI AI SUPPORTATI - Admin App v1.14.0

**Data**: 2025-11-25  
**Feature**: Multi-provider AI model selector con caching intelligente

---

## 🎯 PROVIDER E MODELLI SUPPORTATI

### 1️⃣ **OpenAI**

| Modello | Context | Output max | Input | Output | Velocità | Qualità | Uso consigliato |
|---------|---------|------------|-------|--------|----------|---------|------------------|
| **gpt-4o** | 128K | 16K | $2.50 | $10.00 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Analisi complesse |
| **gpt-4o-mini** | 128K | 16K | $0.15 | $0.60 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Analisi standard |
| **gpt-4-turbo** | 128K | 4K | $10.00 | $30.00 | ⭐⭐ | ⭐⭐⭐⭐⭐ | Massima qualità |
| **gpt-3.5-turbo** | 16K | 4K | $0.50 | $1.50 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Test rapidi |

**API Key**: Ottieni su [platform.openai.com/api-keys](https://platform.openai.com/api-keys)  
**Endpoint**: `https://api.openai.com/v1/chat/completions`

---

### 2️⃣ **Anthropic Claude**

| Modello | Context | Output max | Input | Output | Velocità | Qualità | Uso consigliato |
|---------|---------|------------|-------|--------|----------|---------|------------------|
| **claude-3-5-sonnet-20241022** | 200K | 8K | $3.00 | $15.00 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **MIGLIORE per analisi** |
| **claude-3-opus-20240229** | 200K | 4K | $15.00 | $75.00 | ⭐⭐ | ⭐⭐⭐⭐⭐ | Massima intelligenza |
| **claude-3-sonnet-20240229** | 200K | 4K | $3.00 | $15.00 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Bilanciato |
| **claude-3-haiku-20240307** | 200K | 4K | $0.25 | $1.25 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Economico |

**API Key**: Ottieni su [console.anthropic.com](https://console.anthropic.com)  
**Endpoint**: `https://api.anthropic.com/v1/messages`  
**Versione API**: `2023-06-01`

**Nota**: Claude 3.5 Sonnet è considerato **il migliore per analisi testuali lunghe e dettagliate**

---

### 3️⃣ **Perplexity AI**

| Modello | Context | Output max | Input | Output | Velocità | Qualità | Uso consigliato |
|---------|---------|------------|-------|--------|----------|---------|------------------|
| **sonar** | 127K | 4K | $1.00 | $1.00 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Analisi con ricerca online |
| **sonar-pro** | 127K | 4K | $3.00 | $15.00 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Analisi approfondite |

**API Key**: Ottieni su [perplexity.ai/settings/api](https://www.perplexity.ai/settings/api)  
**Endpoint**: `https://api.perplexity.ai/chat/completions`

**Nota**: Perplexity ha accesso a internet in tempo reale (utile per confronti con fonti online)

---

## 💰 CONFRONTO COSTI (Analisi tipica: 5.5K input + 4K output tokens)

| Provider | Modello | Input | Output | **TOTALE** | Qualità | Velocità |
|----------|---------|-------|--------|------------|---------|----------|
| OpenAI | gpt-3.5-turbo | $0.003 | $0.006 | **$0.009** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| OpenAI | gpt-4o-mini | $0.001 | $0.002 | **$0.003** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| OpenAI | gpt-4o | $0.014 | $0.040 | **$0.054** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| OpenAI | gpt-4-turbo | $0.055 | $0.120 | **$0.175** | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Claude | claude-3-haiku | $0.001 | $0.005 | **$0.006** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Claude | claude-3-sonnet | $0.017 | $0.060 | **$0.077** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Claude | **claude-3.5-sonnet** | **$0.017** | **$0.060** | **$0.077** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Claude | claude-3-opus | $0.083 | $0.300 | **$0.383** | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Perplexity | sonar | $0.006 | $0.004 | **$0.010** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Perplexity | sonar-pro | $0.017 | $0.060 | **$0.077** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 🏆 RACCOMANDAZIONI PER SERGIO

### Per uso quotidiano (100-200 analisi/anno):

**1. MIGLIORE QUALITÀ/PREZZO**: 
- ✅ **Claude 3.5 Sonnet** ($0.077/analisi)
- Pro: Ottima qualità, context 200K, output eccellente per analisi lunghe
- Contro: Leggermente più costoso di gpt-4o-mini

**2. PIÙ ECONOMICO**:
- ✅ **GPT-4o-mini** ($0.003/analisi)
- Pro: 25x più economico di gpt-4o, velocissimo
- Contro: Qualità leggermente inferiore per analisi molto complesse

**3. MASSIMA QUALITÀ**:
- ✅ **GPT-4o** ($0.054/analisi) o **Claude 3.5 Sonnet** ($0.077/analisi)
- Pro: Output professionale, comprensione profonda
- Contro: Costo medio-alto

**4. TEST RAPIDI**:
- ✅ **GPT-3.5-turbo** ($0.009/analisi) o **Claude Haiku** ($0.006/analisi)
- Pro: Velocissimi, economici
- Contro: Qualità sufficiente ma non eccellente

---

## 📊 COSTO ANNUALE STIMATO (con caching)

### Scenario Sergio: 100 manuali nuovi/anno

| Modello | Costo/analisi | Prima analisi (100) | Cache hits (400) | **TOTALE/anno** |
|---------|---------------|---------------------|------------------|-----------------|
| gpt-4o-mini | $0.003 | $0.30 | $0 | **$0.30** ⚡ |
| gpt-3.5-turbo | $0.009 | $0.90 | $0 | **$0.90** |
| claude-haiku | $0.006 | $0.60 | $0 | **$0.60** |
| perplexity-sonar | $0.010 | $1.00 | $0 | **$1.00** |
| **gpt-4o** | $0.054 | $5.40 | $0 | **$5.40** |
| **claude-3.5-sonnet** | $0.077 | $7.70 | $0 | **$7.70** |
| claude-opus | $0.383 | $38.30 | $0 | **$38.30** |

**Con caching, anche il modello più costoso (Claude Opus) costa solo $38/anno!**

---

## 🔧 IMPLEMENTAZIONE TECNICA

### Struttura API calls:

```javascript
// OpenAI
{
  model: 'gpt-4o',
  messages: [{role: 'system', content: '...'}, {role: 'user', content: '...'}],
  temperature: 0,
  max_tokens: 16384
}

// Claude (Anthropic)
{
  model: 'claude-3-5-sonnet-20241022',
  messages: [{role: 'user', content: '...'}],
  system: '...',  // System prompt separato
  max_tokens: 8192,
  temperature: 0
}

// Perplexity
{
  model: 'sonar',
  messages: [{role: 'system', content: '...'}, {role: 'user', content: '...'}],
  temperature: 0,
  max_tokens: 4096
}
```

---

## 🎯 FEATURES IMPLEMENTATE

### 1. **Provider Selector**
```html
<select id="aiProvider">
  <option value="openai">OpenAI</option>
  <option value="claude">Anthropic Claude</option>
  <option value="perplexity">Perplexity AI</option>
</select>
```

### 2. **Model Selector dinamico**
```html
<!-- Si aggiorna in base al provider selezionato -->
<select id="aiModel">
  <!-- Se OpenAI -->
  <option value="gpt-4o">GPT-4o ($0.054/analisi)</option>
  <option value="gpt-4o-mini">GPT-4o-mini ($0.003/analisi)</option>
  
  <!-- Se Claude -->
  <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet ($0.077)</option>
  <option value="claude-3-haiku-20240307">Claude 3 Haiku ($0.006)</option>
</select>
```

### 3. **API Key per provider**
```javascript
appState = {
  apiKeys: {
    openai: '',
    claude: '',
    perplexity: ''
  },
  selectedProvider: 'openai',
  selectedModel: 'gpt-4o'
}
```

### 4. **Caching con hash completo**
```javascript
const cacheKey = hash(
  pdfText + 
  frameworkText + 
  provider + 
  model + 
  'v1.14.0'
);
```

**Nota**: Stesso PDF+Framework con modelli diversi = cache separata (utile per confrontare output)

---

## 🚀 VANTAGGI MULTI-PROVIDER

### 1. **Flessibilità**
- Usa gpt-4o-mini per test rapidi ($0.003)
- Usa claude-3.5-sonnet per analisi finali ($0.077)

### 2. **Risparmio**
- Risparmi fino a **95%** usando gpt-4o-mini invece di claude-opus

### 3. **Confronto qualità**
- Analizza stesso manuale con 2-3 modelli
- Scegli l'output migliore
- Cache evita costi ripetuti

### 4. **Resilienza**
- Se OpenAI è down → usa Claude
- Se hai esaurito crediti OpenAI → usa Perplexity

### 5. **Specializzazione**
- Claude: Eccellente per analisi testuali lunghe
- Perplexity: Utile se vuoi confronti con fonti online
- OpenAI: Equilibrio versatile

---

## 📋 PROSSIMI PASSI

1. ✅ Implementare UI selector (provider + model)
2. ✅ Implementare adapter API per Claude e Perplexity
3. ✅ Implementare caching intelligente con hash completo
4. ✅ Testare con tutti i provider
5. ✅ Documentare in CHANGELOG v1.14.0

---

**Tempo stimato implementazione**: 1.5-2 ore

**Sergio, procedo con l'implementazione?** 🚀
