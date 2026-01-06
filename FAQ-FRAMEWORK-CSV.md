# FAQ - Formato Framework CSV

## Domande Frequenti sul Framework di Valutazione

### 📋 Cos'è il Framework CSV?

Il framework CSV è un file che contiene i criteri di valutazione per analizzare i manuali. Include gli argomenti che devono essere coperti, le classi di laurea di riferimento, e altre informazioni rilevanti.

---

## 🎯 Struttura del CSV

### Quali colonne deve avere il CSV?

**L'applicazione è FLESSIBILE** e accetta qualsiasi struttura di colonne. Tuttavia, ecco alcune strutture consigliate:

#### Struttura Base (Minima)
```csv
Argomento,Classi_Laurea
Meccanica Classica,"L-30, L-31"
Termodinamica,"L-30, L-31, L-27"
```

#### Struttura Consigliata (Completa)
```csv
Materia,Argomento,Dettagli,Classi_Laurea,Livello,Note
Fisica,Meccanica,Cinematica e dinamica,"L-30, L-31",Base,Fondamentale
Fisica,Termodinamica,Primo principio,"L-30",Intermedio,Essenziale per L-30
```

#### Struttura Avanzata (Per Analisi Dettagliate)
```csv
Materia,Macro_Argomento,Sotto_Argomento,Descrizione,Classi_Laurea,Livello,Ore_Stimate,Prerequisiti
Fisica,Meccanica,Cinematica,Studio del moto,"L-30, L-31",Base,12,Nessuno
Fisica,Meccanica,Dinamica,Leggi di Newton,"L-30, L-31",Base,16,Cinematica
```

---

## 📝 Formato dei Dati

### Come indicare più Classi di Laurea?

Usa la virgola come separatore (con o senza spazi):

```csv
✅ Corretto:
"L-30, L-31, L-27"
"L-30,L-31,L-27"
L-30; L-31; L-27

❌ Da evitare:
L-30 L-31 L-27 (spazio senza virgola)
```

### Come gestire testi con virgole?

Racchiudi il testo tra virgolette:

```csv
Argomento,Descrizione
Meccanica,"Studio del moto, delle forze, e dell'energia"
```

### Come gestire caratteri speciali?

Excel e altri editor gestiscono automaticamente i caratteri speciali. Assicurati di salvare come **UTF-8** per caratteri accentati:

```csv
Argomento,Dettagli
Termodinamica,Entropia e reversibilità
Ottica,Fenomeni di diffrazione e interferenza
```

---

## 🔧 Creazione del CSV

### Come creo un CSV da Excel?

1. Crea la tabella in Excel con le colonne desiderate
2. **File → Salva con nome**
3. Scegli formato: **CSV UTF-8 (delimitato da virgole) (.csv)**
4. Salva

### Come creo un CSV da Google Sheets?

1. Crea la tabella in Google Sheets
2. **File → Scarica → Valori separati da virgola (.csv)**
3. Il file è pronto per l'uso

### Posso usare un editor di testo?

Sì! Puoi creare il CSV con Notepad, VS Code, etc:

```csv
Materia,Argomento,Classi_Laurea,Livello
Fisica,Meccanica,"L-30, L-31",Base
Fisica,Termodinamica,"L-30, L-31",Intermedio
Matematica,Analisi,"L-35, L-31",Base
```

Salva con estensione **.csv** e encoding **UTF-8**.

---

## 📊 Esempi Pratici

### Esempio 1: Framework Fisica Base

```csv
Argomento,Classi_Laurea,Importanza
Meccanica del punto,"L-30, L-31",Alta
Meccanica dei sistemi,"L-30, L-31",Alta
Termodinamica,"L-30, L-31, L-27",Media
Elettromagnetismo,"L-30, L-31",Alta
Ottica,"L-30, L-27",Media
Fisica moderna,"L-30",Bassa
```

### Esempio 2: Framework Matematica Dettagliato

```csv
Corso,Argomento,Sotto_Argomento,Classi_Laurea,Semestre,Ore
Analisi 1,Limiti,Limite finito e infinito,"L-35, L-31",1,8
Analisi 1,Continuità,Funzioni continue,"L-35, L-31",1,6
Analisi 1,Derivate,Definizione e regole,"L-35, L-31",1,10
Analisi 2,Integrali,Integrali definiti,"L-35, L-31",2,12
Analisi 2,Serie,Serie numeriche,"L-35",2,10
```

### Esempio 3: Framework Multi-Disciplinare

```csv
Materia,Area,Argomento,L-30,L-31,L-27,Livello
Fisica,Meccanica,Cinematica,Sì,Sì,Sì,Base
Fisica,Meccanica,Dinamica,Sì,Sì,No,Base
Fisica,Termodinamica,Primo principio,Sì,Sì,No,Intermedio
Matematica,Analisi,Derivate,Sì,Sì,Sì,Base
Matematica,Algebra,Matrici,Sì,No,No,Avanzato
```

---

## 🎨 Personalizzazione

### Posso aggiungere colonne personalizzate?

**Assolutamente sì!** L'applicazione legge qualsiasi struttura. Alcune idee:

```csv
Materia,Argomento,Classi_Laurea,CFU,Obbligatorio,Bibliografia,Pagine_Stimate
Fisica,Meccanica,"L-30, L-31",6,Sì,"Halliday §2-5",80-120
```

Colonne utili aggiuntive:
- **CFU**: Crediti formativi
- **Obbligatorio**: Sì/No
- **Bibliografia**: Riferimenti consigliati
- **Pagine_Stimate**: Pagine previste nel manuale
- **Prerequisiti**: Argomenti necessari prima
- **Difficoltà**: Facile/Medio/Difficile
- **Modalità_Esame**: Scritto/Orale/Pratico

### Posso usare nomi colonne in inglese?

Sì, funziona ugualmente:

```csv
Subject,Topic,Details,Degree_Classes,Level
Physics,Mechanics,Kinematics,"L-30, L-31",Basic
```

---

## ⚠️ Errori Comuni

### Errore: "CSV vuoto o non valido"

**Causa**: File corrotto, formato errato, o righe vuote all'inizio

**Soluzione**:
```csv
❌ Errato (riga vuota all'inizio):

Materia,Argomento
Fisica,Meccanica

✅ Corretto (nessuna riga vuota):
Materia,Argomento
Fisica,Meccanica
```

### Errore: "Colonne non riconosciute"

**Non è un errore!** L'app legge qualsiasi colonna. Verifica solo che:
1. La prima riga contenga i nomi delle colonne (header)
2. Le righe successive contengano i dati

### Problema: Caratteri strani (�, ?, etc.)

**Causa**: Encoding errato

**Soluzione**: Salva il CSV come **UTF-8**:
- Excel: "CSV UTF-8 (delimitato da virgole)"
- Notepad++: Encoding → UTF-8
- VS Code: "Save with Encoding" → UTF-8

---

## 📚 Best Practices

### 1. Usa Header Descrittivi
```csv
✅ Chiaro:
Materia,Argomento_Principale,Sotto_Argomento,Classi_Laurea_Applicabili

❌ Poco chiaro:
M,A,S,C
```

### 2. Mantieni Consistenza
```csv
✅ Consistente:
L-30
L-31
L-27

❌ Inconsistente:
L-30
L31
Classe 27
```

### 3. Documenta le Colonne Personalizzate

Aggiungi un commento nella prima riga (se l'app lo supporta) o in un file separato:

**framework_legenda.txt:**
```
Colonne del Framework:
- Materia: Disciplina (Fisica, Matematica, etc.)
- Argomento: Macro-argomento
- Dettagli: Descrizione specifica
- Classi_Laurea: Codici classi separate da virgola
- Livello: Base/Intermedio/Avanzato
- Note: Osservazioni aggiuntive
```

### 4. Testa con File Piccoli

Prima di creare un framework completo con centinaia di righe, testa con un campione:

```csv
Materia,Argomento,Classi_Laurea
Fisica,Meccanica,"L-30, L-31"
Fisica,Termodinamica,"L-30"
```

Se funziona, espandi!

---

## 🔍 Validazione del CSV

### Come verifico che il CSV sia corretto?

1. **Apri con Excel/Google Sheets**
   - Se vedi colonne separate correttamente → ✅ OK

2. **Apri con Notepad**
   - Verifica che le virgole separino i campi
   - Verifica che non ci siano caratteri strani

3. **Prova nell'applicazione**
   - Carica il CSV
   - Verifica il messaggio di conferma
   - Console browser mostrerà eventuali errori

### Tool Online per Validazione

- [CSV Lint](https://csvlint.io/)
- [CSV Validator](https://www.csvvalidator.com/)

---

## 💡 Suggerimenti Avanzati

### Framework Gerarchici

Per framework molto strutturati:

```csv
Livello_1,Livello_2,Livello_3,Classi_Laurea,Priorità
Fisica,Meccanica,Cinematica,"L-30, L-31",Alta
Fisica,Meccanica,Dinamica,"L-30, L-31",Alta
Fisica,Meccanica,Statica,"L-30",Media
Fisica,Termodinamica,Calore,"L-30, L-31",Alta
```

### Framework con Pesi

Per analisi pesate:

```csv
Argomento,Classi_Laurea,Peso,Ore_Corso
Meccanica,"L-30, L-31",30,40
Termodinamica,"L-30, L-31",25,32
Elettromagnetismo,"L-30, L-31",45,56
```

### Framework Comparativi

Per confrontare più edizioni o manuali:

```csv
Argomento,Edizione_2020,Edizione_2023,Classi_Laurea
Meccanica,Presente,Presente,"L-30, L-31"
Relatività,Assente,Presente,"L-30"
Quantistica,Basico,Avanzato,"L-30, L-31"
```

---

## 📞 Supporto

Se hai difficoltà con il formato CSV:
1. Consulta il file **esempio-framework.csv** incluso
2. Leggi la **guida-rapida.html**
3. Contatta il supporto Zanichelli

---

**Ultima Modifica**: 2025-01-24  
**Versione**: 1.0
