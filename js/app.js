// Configurazione PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

// ========================================
// CONFIGURAZIONE FIREBASE
// ========================================
const firebaseConfig = {
    apiKey: "AIzaSyB4dkch9sbJ7-nggyie64_ztv8RBduqazE",
    authDomain: "analisi-manuali-zanichelli.firebaseapp.com",
    databaseURL: "https://analisi-manuali-zanichelli-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "analisi-manuali-zanichelli",
    storageBucket: "analisi-manuali-zanichelli.firebasestorage.app",
    messagingSenderId: "444991481658",
    appId: "1:444991481658:web:8ca983f79532b8b3ab5203",
    measurementId: "G-0WY4VC8FSQ"
};

// Inizializza Firebase
let firebaseApp;
let firestoreDb;
let firebaseInitialized = false;

try {
    firebaseApp = firebase.initializeApp(firebaseConfig);
    firestoreDb = firebase.firestore();
    firebaseInitialized = true;
    console.log('✅ Firebase inizializzato con successo');
} catch (error) {
    console.error('❌ Errore inizializzazione Firebase:', error);
    firebaseInitialized = false;
}

// Configurazione modelli AI
const AI_MODELS = {
    openai: [
        { id: 'gpt-4o', name: 'GPT-4o', cost: '$0.054', quality: 5, speed: 3 },
        { id: 'gpt-4o-mini', name: 'GPT-4o-mini (Raccomandato)', cost: '$0.003', quality: 4, speed: 5 },
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', cost: '$0.175', quality: 5, speed: 2 },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', cost: '$0.009', quality: 3, speed: 5 }
    ],
    claude: [
        { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet (Migliore)', cost: '$0.077', quality: 5, speed: 4 },
        { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', cost: '$0.077', quality: 4, speed: 4 },
        { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku (Economico)', cost: '$0.006', quality: 3, speed: 5 },
        { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', cost: '$0.383', quality: 5, speed: 2 }
    ],
    perplexity: [
        { id: 'sonar', name: 'Sonar', cost: '$0.010', quality: 4, speed: 4 },
        { id: 'sonar-pro', name: 'Sonar Pro', cost: '$0.077', quality: 5, speed: 3 }
    ]
};

const API_ENDPOINTS = {
    openai: 'https://api.openai.com/v1/chat/completions',
    claude: 'https://api.anthropic.com/v1/messages',
    perplexity: 'https://api.perplexity.ai/chat/completions'
};

const API_KEY_LINKS = {
    openai: 'https://platform.openai.com/api-keys',
    claude: 'https://console.anthropic.com',
    perplexity: 'https://www.perplexity.ai/settings/api'
};

// Stato dell'applicazione
const appState = {
    apiKeys: {
        openai: '',
        claude: '',
        perplexity: ''
    },
    selectedProvider: 'openai',
    selectedModel: 'gpt-4o-mini',
    frameworkData: null,
    volume1Text: '',
    volume2Text: '',
    hasVolume2: false,
    analysisType: 'A',
    isProcessing: false,
    lastPrompt: '', // Salva l'ultimo prompt inviato
    materia: '', // Materia inserita dall'utente
    pdfMetadata: null // Metadata estratti dal PDF (autore, titolo, editore)
};

// Inizializzazione
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadSavedApiKey();
    // Aggiorna UI Firebase all'avvio con un piccolo ritardo per dare tempo a Firestore
    setTimeout(() => {
        updateFirebaseStatusUI();
        loadFrameworksFromFirebase(); // Carica framework da Firebase
    }, 1000);
});

// Event Listeners
function initializeEventListeners() {
    // Provider e Model selectors
    document.getElementById('aiProvider').addEventListener('change', handleProviderChange);
    document.getElementById('aiModel').addEventListener('change', handleModelChange);
    
    // API Key
    document.getElementById('apiKey').addEventListener('input', handleApiKeyInput);
    document.getElementById('testApiBtn').addEventListener('click', testApiKey);
    
    // Inizializza selettori
    populateModelSelector();
    updateAPIKeyUI();
    
    // File uploads
    document.getElementById('frameworkFile').addEventListener('change', handleFrameworkUpload);
    document.getElementById('volume1File').addEventListener('change', (e) => handlePdfUpload(e, 'volume1'));
    document.getElementById('volume2File').addEventListener('change', (e) => handlePdfUpload(e, 'volume2'));
    
    // Framework library
    document.getElementById('frameworkSelect').addEventListener('change', handleFrameworkSelect);
    document.getElementById('refreshFrameworksBtn').addEventListener('click', loadFrameworksFromFirebase);
    
    // Materia input
    document.getElementById('materiaInput').addEventListener('input', function() {
        appState.materia = this.value.trim();
        validateForm();
    });
    
    // Volume 2 checkbox
    document.getElementById('hasVolume2').addEventListener('change', function() {
        const volume2Section = document.getElementById('volume2Section');
        appState.hasVolume2 = this.checked;
        volume2Section.classList.toggle('hidden', !this.checked);
        validateForm();
    });
    
    // Analysis type
    document.querySelectorAll('input[name="analysisType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            appState.analysisType = this.value;
        });
    });
    
    // Analyze button
    document.getElementById('analyzeBtn').addEventListener('click', startAnalysis);
    
    // Export buttons
    document.getElementById('exportPdfBtn').addEventListener('click', exportPDF);
    document.getElementById('exportHtmlBtn').addEventListener('click', exportHtml);
    document.getElementById('exportMarkdownBtn').addEventListener('click', exportMarkdown);
    document.getElementById('newAnalysisBtn').addEventListener('click', resetAnalysis);
    
    // Prompt modal buttons
    document.getElementById('viewPromptBtn').addEventListener('click', showPromptModal);
    document.getElementById('closePromptBtn').addEventListener('click', closePromptModal);
    document.getElementById('copyPromptBtn').addEventListener('click', copyPrompt);
    document.getElementById('downloadPromptBtn').addEventListener('click', downloadPrompt);
    
    // History modal buttons
    document.getElementById('viewHistoryBtn').addEventListener('click', showHistoryModal);
    document.getElementById('closeHistoryBtn').addEventListener('click', closeHistoryModal);
    document.getElementById('migrateAnalysesBtn').addEventListener('click', runMigration);
    document.getElementById('clearHistoryBtn').addEventListener('click', clearAllHistory);
    document.getElementById('exportAllBtn').addEventListener('click', exportAllAnalyses);
    document.getElementById('compareBtn').addEventListener('click', showCompareModal);
    
    // Compare modal buttons
    document.getElementById('closeCompareBtn').addEventListener('click', closeCompareModal);
    document.getElementById('closeCompareModal').addEventListener('click', closeCompareModal);
    document.getElementById('resetCompareBtn').addEventListener('click', resetCompareSelection);
    document.getElementById('exportCompareWordBtn').addEventListener('click', exportCompareWord);
    
    // Chiudi modal cliccando fuori
    document.getElementById('promptModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closePromptModal();
        }
    });
    
    document.getElementById('historyModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeHistoryModal();
        }
    });
    
    document.getElementById('compareModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeCompareModal();
        }
    });
    
    // Aggiorna contatore analisi all'avvio
    updateHistoryCount();
}

// API Key Management
function handleApiKeyInput(e) {
    appState.apiKey = e.target.value.trim();
    sessionStorage.setItem('openai_api_key', appState.apiKey);
    validateForm();
}

function loadSavedApiKey() {
    // Carica API keys salvate per tutti i provider
    const providers = ['openai', 'claude', 'perplexity'];
    providers.forEach(provider => {
        const savedKey = sessionStorage.getItem(`${provider}_api_key`);
        if (savedKey) {
            appState.apiKeys[provider] = savedKey;
        }
    });
    
    // Carica provider e modello selezionati
    const savedProvider = sessionStorage.getItem('selected_provider') || 'openai';
    const savedModel = sessionStorage.getItem('selected_model') || 'gpt-4o-mini';
    
    appState.selectedProvider = savedProvider;
    appState.selectedModel = savedModel;
    
    document.getElementById('aiProvider').value = savedProvider;
    populateModelSelector();
    document.getElementById('aiModel').value = savedModel;
    
    // Popola campo API key corrente
    const currentKey = appState.apiKeys[savedProvider];
    if (currentKey) {
        document.getElementById('apiKey').value = currentKey;
    }
    
    updateAPIKeyUI();
    validateForm();
}

function handleProviderChange(e) {
    const provider = e.target.value;
    appState.selectedProvider = provider;
    sessionStorage.setItem('selected_provider', provider);
    
    // Aggiorna selector modelli
    populateModelSelector();
    
    // Carica API key salvata per questo provider
    const savedKey = appState.apiKeys[provider];
    document.getElementById('apiKey').value = savedKey || '';
    
    // Aggiorna UI (label, link)
    updateAPIKeyUI();
    validateForm();
}

function handleModelChange(e) {
    const model = e.target.value;
    appState.selectedModel = model;
    sessionStorage.setItem('selected_model', model);
    
    // Aggiorna costo visualizzato
    updateModelCostDisplay();
    validateForm();
}

function populateModelSelector() {
    const provider = appState.selectedProvider;
    const modelSelect = document.getElementById('aiModel');
    const models = AI_MODELS[provider];
    
    modelSelect.innerHTML = '';
    
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.id;
        option.textContent = `${model.name} (${model.cost}/analisi)`;
        modelSelect.appendChild(option);
    });
    
    // Seleziona il modello salvato o il primo della lista
    const savedModel = appState.selectedModel;
    const modelExists = models.find(m => m.id === savedModel);
    
    if (modelExists) {
        modelSelect.value = savedModel;
    } else {
        modelSelect.value = models[0].id;
        appState.selectedModel = models[0].id;
    }
    
    updateModelCostDisplay();
}

function updateModelCostDisplay() {
    const provider = appState.selectedProvider;
    const modelId = appState.selectedModel;
    const model = AI_MODELS[provider].find(m => m.id === modelId);
    
    if (model) {
        const costSpan = document.getElementById('modelCost');
        costSpan.textContent = `Costo: ${model.cost}/analisi`;
    }
}

function updateAPIKeyUI() {
    const provider = appState.selectedProvider;
    const providerNames = {
        openai: 'OpenAI',
        claude: 'Anthropic Claude',
        perplexity: 'Perplexity AI'
    };
    
    // Aggiorna label
    document.getElementById('apiKeyLabel').textContent = `Chiave API ${providerNames[provider]}`;
    
    // Aggiorna link
    const link = document.getElementById('apiKeyLink');
    link.href = API_KEY_LINKS[provider];
    link.textContent = 'Ottieni la tua chiave API';
}

function handleApiKeyInput(e) {
    const key = e.target.value.trim();
    const provider = appState.selectedProvider;
    
    appState.apiKeys[provider] = key;
    sessionStorage.setItem(`${provider}_api_key`, key);
    validateForm();
}

async function testApiKey() {
    const provider = appState.selectedProvider;
    const apiKey = appState.apiKeys[provider];
    
    if (!apiKey) {
        showApiStatus('error', 'Inserisci una chiave API');
        return;
    }
    
    const btn = document.getElementById('testApiBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Verifica...';
    
    try {
        let response;
        
        if (provider === 'openai') {
            response = await fetch('https://api.openai.com/v1/models', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });
        } else if (provider === 'claude') {
            response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-haiku-20240307',
                    max_tokens: 10,
                    messages: [{ role: 'user', content: 'test' }]
                })
            });
        } else if (provider === 'perplexity') {
            response = await fetch('https://api.perplexity.ai/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'sonar',
                    messages: [{ role: 'user', content: 'test' }],
                    max_tokens: 10
                })
            });
        }
        
        if (response && response.ok) {
            showApiStatus('success', 'Chiave valida!');
        } else {
            const errorData = await response.json();
            showApiStatus('error', `Chiave non valida: ${errorData.error?.message || 'Errore sconosciuto'}`);
        }
    } catch (error) {
        showApiStatus('error', `Errore: ${error.message}`);
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Verifica Chiave';
    }
}

function showApiStatus(type, message) {
    const statusEl = document.getElementById('apiStatus');
    statusEl.className = type === 'success' ? 'text-green-600' : 'text-red-600';
    statusEl.innerHTML = type === 'success' 
        ? `<i class="fas fa-check-circle"></i> ${message}`
        : `<i class="fas fa-times-circle"></i> ${message}`;
    
    setTimeout(() => {
        statusEl.innerHTML = '';
    }, 5000);
}

// CSV Framework Upload
async function handleFrameworkUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    updateProgress(10, 'Caricamento framework CSV...');
    document.getElementById('frameworkFileName').textContent = file.name;
    
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            appState.frameworkData = results.data;
            console.log('Framework caricato:', appState.frameworkData);
            
            // NUOVO: Estrai materia dal CSV
            const materia = extractMateriaFromFramework(results.data, file.name);
            if (materia) {
                appState.materia = materia;
                document.getElementById('materiaInput').value = materia;
                showNotification('success', `✨ Materia rilevata: ${materia}`);
            }
            
            updateProgress(0, '');
            validateForm();
            
            // Mostra info sul framework
            const recordCount = results.data.length;
            const columns = Object.keys(results.data[0] || {}).join(', ');
            showNotification('success', `Framework caricato: ${recordCount} righe. Colonne: ${columns}`);
        },
        error: function(error) {
            console.error('Errore parsing CSV:', error);
            showNotification('error', 'Errore nel caricamento del CSV');
            updateProgress(0, '');
        }
    });
}

// Estrae materia dal framework CSV
function extractMateriaFromFramework(data, fileName) {
    if (!data || data.length === 0) return null;
    
    // METODO 1: Cerca colonna "Materia" nel CSV
    const firstRow = data[0];
    const columns = Object.keys(firstRow);
    
    // Varianti possibili della colonna materia
    const materiaColumns = ['Materia', 'materia', 'MATERIA', 'Subject', 'Disciplina', 'disciplina'];
    const materiaCol = columns.find(col => materiaColumns.includes(col));
    
    if (materiaCol) {
        // Trova il valore più comune nella colonna
        const materiaValues = data
            .map(row => row[materiaCol])
            .filter(val => val && val.trim());
        
        if (materiaValues.length > 0) {
            // Conta occorrenze
            const counts = {};
            materiaValues.forEach(val => {
                counts[val] = (counts[val] || 0) + 1;
            });
            // Prendi il più frequente
            const mostCommon = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
            console.log('✅ Materia estratta da colonna CSV:', mostCommon);
            return mostCommon;
        }
    }
    
    // METODO 2: Estrai dal nome file con algoritmo migliorato
    if (fileName) {
        let cleanName = fileName
            .replace('.csv', '')
            .replace(/^(esempio|syllabus|framework|schema|griglia)[-_\s]/i, '');
        
        // Gestisci casi comuni
        const materiaMap = {
            'chimica-organica': 'Chimica Organica',
            'chimica organica': 'Chimica Organica',
            'fisica-generale': 'Fisica Generale',
            'fisica generale': 'Fisica Generale',
            'fisica': 'Fisica',
            'matematica': 'Matematica',
            'analisi-matematica': 'Analisi Matematica',
            'diritto-civile': 'Diritto Civile',
            'diritto civile': 'Diritto Civile',
            'programmazione-python': 'Programmazione Python',
            'programmazione python': 'Programmazione Python'
        };
        
        const lowerName = cleanName.toLowerCase().replace(/-/g, ' ').replace(/_/g, ' ');
        
        // Cerca match esatto
        if (materiaMap[lowerName]) {
            console.log('✅ Materia estratta da nome file (match):', materiaMap[lowerName]);
            return materiaMap[lowerName];
        }
        
        // Altrimenti capitalizza
        const capitalized = cleanName
            .replace(/[-_]/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        
        if (capitalized && capitalized.length > 2) {
            console.log('✅ Materia estratta da nome file (capitalizzata):', capitalized);
            return capitalized;
        }
    }
    
    // METODO 3: Nessuna materia trovata
    console.log('⚠️ Materia non rilevata, richiesta input utente');
    return null;
}

// ========================================
// FRAMEWORK LIBRARY (Firebase)
// ========================================

// Carica framework da Firebase
async function loadFrameworksFromFirebase() {
    const select = document.getElementById('frameworkSelect');
    
    if (!firebaseInitialized) {
        console.warn('⚠️ Firebase non inizializzato');
        select.innerHTML = '<option value="">❌ Firebase non disponibile - Carica CSV manuale</option>';
        return;
    }
    
    try {
        select.innerHTML = '<option value="">⏳ Caricamento framework...</option>';
        
        const snapshot = await firestoreDb.collection('frameworks')
            .where('public', '==', true)
            .get();
        
        if (snapshot.empty) {
            select.innerHTML = '<option value="">📚 Nessun framework disponibile - Carica CSV</option>';
            console.log('⚠️ Nessun framework trovato su Firebase');
            return;
        }
        
        // Raccogli tutti i framework in un array
        const frameworks = [];
        snapshot.forEach(doc => {
            const fw = doc.data();
            fw.id = doc.id;
            frameworks.push(fw);
        });
        
        // Ordina alfabeticamente per nome
        frameworks.sort((a, b) => a.name.localeCompare(b.name));
        
        // Popola select con lista semplice
        let html = '<option value="">📚 Seleziona framework dalla libreria...</option>';
        
        frameworks.forEach(fw => {
            html += `<option value="${fw.id}">${fw.name}</option>`;
        });
        
        select.innerHTML = html;
        
        console.log(`✅ Caricati ${snapshot.size} framework da Firebase`);
        showNotification('success', `✅ ${snapshot.size} framework disponibili`);
        
    } catch (error) {
        console.error('❌ Errore caricamento framework:', error);
        select.innerHTML = '<option value="">❌ Errore caricamento - Carica CSV manuale</option>';
        showNotification('error', 'Errore caricamento framework da Firebase');
    }
}

// Gestisce selezione framework da dropdown
async function handleFrameworkSelect(e) {
    const frameworkId = e.target.value;
    
    if (!frameworkId) {
        // Deselezionato
        appState.frameworkData = null;
        document.getElementById('materiaInput').value = '';
        appState.materia = '';
        validateForm();
        return;
    }
    
    if (!firebaseInitialized) {
        showNotification('error', 'Firebase non disponibile');
        return;
    }
    
    try {
        updateProgress(10, 'Caricamento framework...');
        
        const doc = await firestoreDb.collection('frameworks').doc(frameworkId).get();
        
        if (!doc.exists) {
            showNotification('error', 'Framework non trovato');
            updateProgress(0, '');
            return;
        }
        
        const framework = doc.data();
        
        // Converti da formato JSON a formato CSV (array di oggetti)
        const csvData = convertFrameworkToCSV(framework);
        appState.frameworkData = csvData;
        
        // Imposta materia
        if (framework.subject) {
            appState.materia = framework.subject;
            document.getElementById('materiaInput').value = framework.subject;
        }
        
        // Aggiorna UI
        document.getElementById('frameworkFileName').textContent = `✅ ${framework.name} (dalla libreria)`;
        
        updateProgress(0, '');
        validateForm();
        
        showNotification('success', `✅ Framework "${framework.name}" caricato`);
        console.log('✅ Framework caricato:', framework);
        
    } catch (error) {
        console.error('❌ Errore caricamento framework:', error);
        showNotification('error', 'Errore caricamento framework');
        updateProgress(0, '');
    }
}

// Converte framework JSON (da Firebase) in formato CSV (array di oggetti)
function convertFrameworkToCSV(framework) {
    const csvData = [];
    
    // Estrai moduli dal framework
    const modules = framework.syllabus_modules || [];
    
    modules.forEach((module, index) => {
        const row = {
            'Modulo': module.name || `Modulo ${index + 1}`,
            'ID': module.id || index + 1,
            'Contenuti': Array.isArray(module.core_contents) ? module.core_contents.join('; ') : '',
            'Obiettivi': Array.isArray(module.learning_outcomes) ? module.learning_outcomes.join('; ') : '',
            'Materia': framework.subject || ''
        };
        csvData.push(row);
    });
    
    return csvData;
}

// PDF Upload and Parsing
async function handlePdfUpload(e, volumeNumber) {
    const file = e.target.files[0];
    if (!file) return;
    
    const fileNameId = volumeNumber === 'volume1' ? 'volume1FileName' : 'volume2FileName';
    document.getElementById(fileNameId).textContent = file.name;
    
    updateProgress(20, `Estrazione testo da ${volumeNumber}...`);
    
    try {
        // 1. Estrai metadata dalla prima pagina (solo per volume1)
        if (volumeNumber === 'volume1') {
            updateProgress(10, 'Estrazione metadata dal PDF...');
            const metadata = await extractMetadataFromPDF(file);
            
            // Salva metadata nello stato
            appState.pdfMetadata = metadata;
            
            // Mostra box metadata (sempre, anche se alcuni campi sono vuoti)
            const metadataBox = document.getElementById('pdfMetadataBox');
            metadataBox.classList.remove('hidden');
            
            // Pre-compila i campi editabili con i valori estratti (se disponibili)
            document.getElementById('autoreInput').value = metadata.autore || '';
            document.getElementById('titoloInput').value = metadata.titolo || '';
            document.getElementById('editoreInput').value = metadata.editore || '';
            
            // Pre-compila campo materia con il titolo se presente
            if (metadata.titolo && !appState.materia) {
                document.getElementById('materiaInput').value = metadata.titolo;
                appState.materia = metadata.titolo;
            }
            
            console.log('✅ Metadata editabili visualizzati:', metadata);
        }
        
        // 2. Estrai tutto il testo del PDF
        updateProgress(20, `Estrazione testo da ${volumeNumber}...`);
        const text = await extractTextFromPDF(file);
        
        if (volumeNumber === 'volume1') {
            appState.volume1Text = text;
        } else {
            appState.volume2Text = text;
        }
        
        console.log(`${volumeNumber} testo estratto:`, text.substring(0, 500) + '...');
        updateProgress(0, '');
        validateForm();
        
        const wordCount = text.split(/\s+/).length;
        showNotification('success', `${volumeNumber} caricato: ~${wordCount} parole estratte`);
    } catch (error) {
        console.error(`Errore estrazione PDF ${volumeNumber}:`, error);
        showNotification('error', `Errore nell'estrazione del PDF ${volumeNumber}`);
        updateProgress(0, '');
    }
}

/**
 * Estrae metadata (Autore, Titolo, Editore) dalla prima pagina del PDF
 * @param {File} file - File PDF
 * @returns {Promise<Object>} - Oggetto con autore, titolo, editore
 */
async function extractMetadataFromPDF(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        // Estrai testo SOLO dalla prima pagina
        const page = await pdf.getPage(1);
        const textContent = await page.getTextContent();
        const firstPageText = textContent.items.map(item => item.str).join(' ');
        
        console.log('📄 Prima pagina PDF (RAW - primi 400 caratteri):', firstPageText.substring(0, 400));
        
        // ✅ FIX v1.9.10: ZERO REGEX - SOLO indexOf() E substring()
        // Normalizza spazi multipli → singoli (mantieni gli spazi tra parole)
        const normalizedText = firstPageText.replace(/\s+/g, ' ');
        console.log('📝 Testo normalizzato (primi 300 caratteri):', normalizedText.substring(0, 300));
        
        // Trova posizioni esatte (case-insensitive manuale)
        const textLower = normalizedText.toLowerCase();
        
        let autoreStart = textLower.indexOf('autore:');
        let titoloStart = textLower.indexOf('titolo:');
        let editoreStart = textLower.indexOf('editore:');
        
        console.log('🔍 DEBUG Posizioni trovate:', { 
            autoreStart, 
            titoloStart, 
            editoreStart 
        });
        
        let autore = null;
        let titolo = null;
        let editore = null;
        
        // Estrai AUTORE (da "Autore:" fino a "Titolo:")
        if (autoreStart !== -1 && titoloStart !== -1) {
            const start = autoreStart + 7; // "autore:".length
            autore = normalizedText.substring(start, titoloStart).trim();
        }
        
        // Estrai TITOLO (da "Titolo:" fino a "Editore:")
        if (titoloStart !== -1 && editoreStart !== -1) {
            const start = titoloStart + 7; // "titolo:".length
            titolo = normalizedText.substring(start, editoreStart).trim();
        }
        
        // Estrai EDITORE (da "Editore:" fino al primo punto o max 100 caratteri)
        if (editoreStart !== -1) {
            const start = editoreStart + 8; // "editore:".length
            const rest = normalizedText.substring(start, start + 100);
            const dotPos = rest.indexOf('.');
            editore = (dotPos !== -1 ? rest.substring(0, dotPos) : rest).trim();
        }
        
        console.log('🔍 DEBUG Estratti (RAW):', { autore, titolo, editore });
        
        const metadata = {
            autore: autore,
            titolo: titolo,
            editore: editore
        };
        
        // 🔧 Fallback - estrai da nome file se metadata mancanti
        if (!metadata.autore || !metadata.editore) {
            const fileMetadata = extractMetadataFromFilename(file.name);
            metadata.autore = metadata.autore || fileMetadata.autore;
            metadata.editore = metadata.editore || fileMetadata.editore;
            if (fileMetadata.autore || fileMetadata.editore) {
                console.log('📝 Metadata integrati da nome file:', fileMetadata);
            }
        }
        
        console.log('✅ Metadata estratti (FINALI):', metadata);
        
        return metadata;
    } catch (error) {
        console.error('⚠️ Errore estrazione metadata:', error);
        return { autore: null, titolo: null, editore: null };
    }
}

// 🆕 NUOVA FUNZIONE: Estrae autore/editore da nome file (fallback)
function extractMetadataFromFilename(filename) {
    // Rimuovi estensione
    const name = filename.replace(/\.pdf$/i, '');
    
    // Pattern: Autore_Editore.pdf
    const match = name.match(/^([^_]+)_([^_]+)$/);
    
    if (match) {
        return {
            autore: match[1].trim(),
            editore: match[2].trim()
        };
    }
    
    return { autore: null, editore: null };
}

async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    const totalPages = pdf.numPages;
    
    for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
        
        // Aggiorna progresso
        const progress = 20 + (i / totalPages) * 30;
        updateProgress(progress, `Estrazione pagina ${i}/${totalPages}...`);
    }
    
    return fullText.trim();
}

// Form Validation
function validateForm() {
    const provider = appState.selectedProvider;
    const hasApiKey = appState.apiKeys[provider] && appState.apiKeys[provider].length > 0;
    const hasFramework = appState.frameworkData !== null;
    // Materia NON più obbligatoria - userà fallback se vuota
    const hasVolume1 = appState.volume1Text.length > 0;
    const hasVolume2Valid = !appState.hasVolume2 || appState.volume2Text.length > 0;
    
    const isValid = hasApiKey && hasFramework && hasVolume1 && hasVolume2Valid;
    
    document.getElementById('analyzeBtn').disabled = !isValid;
}

// Analysis
async function startAnalysis() {
    if (appState.isProcessing) return;
    
    appState.isProcessing = true;
    document.getElementById('analyzeBtn').disabled = true;
    document.getElementById('progressSection').classList.remove('hidden');
    document.getElementById('resultsSection').classList.add('hidden');
    
    updateProgress(10, 'Preparazione dati...');
    
    try {
        // 🔧 Leggi i metadata dai campi editabili (non da appState.pdfMetadata)
        const autore = document.getElementById('autoreInput')?.value.trim() || null;
        const titolo = document.getElementById('titoloInput')?.value.trim() || null;
        const editore = document.getElementById('editoreInput')?.value.trim() || null;
        
        // Aggiorna appState con i valori finali (editati o estratti)
        appState.pdfMetadata = {
            autore: autore,
            titolo: titolo,
            editore: editore
        };
        
        console.log('📝 Metadata finali (dopo eventuali modifiche manuali):', appState.pdfMetadata);
        
        // Prepara i dati
        const frameworkText = formatFrameworkForPrompt(appState.frameworkData);
        const volumeText = appState.hasVolume2 
            ? `VOLUME 1:\n\n${appState.volume1Text}\n\n---\n\nVOLUME 2:\n\n${appState.volume2Text}`
            : appState.volume1Text;
        
        updateProgress(30, 'Costruzione prompt...');
        
        // Costruisci il prompt
        const prompt = buildPrompt(frameworkText, volumeText, appState.analysisType);
        
        // Salva il prompt per visualizzazione
        appState.lastPrompt = prompt;
        
        updateProgress(35, 'Verifica cache analisi...');
        
        // Genera cache key (hash di: framework + volume + provider + model + version)
        const cacheKey = await generateCacheKey(frameworkText, volumeText, appState.selectedProvider, appState.selectedModel);
        
        // Verifica se esiste in cache
        const cachedResult = await getCachedAnalysis(cacheKey);
        
        let result;
        if (cachedResult) {
            console.log('✅ Analisi recuperata da cache (istantanea e gratuita!)');
            updateProgress(40, 'Analisi recuperata da cache (istantanea!)');
            result = cachedResult;
        } else {
            console.log(`💰 Analisi non in cache. Chiamata API ${appState.selectedProvider}...`);
            updateProgress(40, `Invio richiesta a ${appState.selectedProvider} (questo può richiedere alcuni minuti)...`);
            
            // Chiama API
            result = await callOpenAI(prompt);
            
            // Salva in cache per il futuro
            await saveCachedAnalysis(cacheKey, result, {
                provider: appState.selectedProvider,
                model: appState.selectedModel,
                frameworkName: document.getElementById('frameworkFile').files[0]?.name,
                volumeName: document.getElementById('volume1File').files[0]?.name
            });
        }
        
        updateProgress(90, 'Formattazione risultati...');
        
        // Mostra risultati
        displayResults(result);
        
        updateProgress(100, 'Analisi completata!');
        
        setTimeout(() => {
            document.getElementById('progressSection').classList.add('hidden');
        }, 1000);
        
    } catch (error) {
        console.error('Errore durante l\'analisi:', error);
        showNotification('error', `Errore: ${error.message}`);
        updateProgress(0, '');
        document.getElementById('progressSection').classList.add('hidden');
    } finally {
        appState.isProcessing = false;
        document.getElementById('analyzeBtn').disabled = false;
    }
}

function formatFrameworkForPrompt(frameworkData) {
    // Converti il CSV in un formato leggibile
    if (!frameworkData || frameworkData.length === 0) return '';
    
    const headers = Object.keys(frameworkData[0]);
    const firstHeader = headers[0]; // Tipicamente "Modulo/Sotto-modulo"
    
    // ESTRAI SOLO LE RIGHE DIDATTICHE (hanno codici tipo "1.1", "1.2", "2.3", etc.)
    const topicRows = frameworkData.filter(row => {
        const moduloValue = row[firstHeader] || '';
        // Regex: "N.N" oppure "N.N.N" (es: "1.1", "3.4", "5.2.1")
        return /^\d+\.\d+(\..+)?/.test(moduloValue.trim());
    });
    
    // Crea elenco numerato degli argomenti
    let formatted = 'FRAMEWORK DI VALUTAZIONE\n\n';
    formatted += 'ELENCO COMPLETO DEGLI ARGOMENTI DA ANALIZZARE:\n\n';
    
    topicRows.forEach((row, index) => {
        const codice = row[firstHeader] || '';
        formatted += `${index + 1}. ${codice}\n`;
    });
    
    formatted += `\nTOTALE: ${topicRows.length} argomenti\n`;
    formatted += `\nDEVI MENZIONARE ESPLICITAMENTE TUTTI QUESTI ${topicRows.length} ARGOMENTI NELLA TUA ANALISI!\n\n`;
    formatted += '---\n\n';
    formatted += 'DATI COMPLETI DEL FRAMEWORK:\n\n';
    
    // Poi includi TUTTO il framework (per i punteggi per classe di laurea)
    frameworkData.forEach((row, index) => {
        formatted += `[${index + 1}]\n`;
        headers.forEach(header => {
            if (row[header]) {
                formatted += `  ${header}: ${row[header]}\n`;
            }
        });
        formatted += '\n';
    });
    
    return formatted;
}

function buildPrompt(frameworkText, volumeText, analysisType) {
    const basePrompt = `Sei un esperto analista editoriale senior per manuali universitari con oltre 20 anni di esperienza nella valutazione di testi accademici. Il tuo compito è analizzare in modo ESTREMAMENTE DETTAGLIATO e APPROFONDITO l'indice di un manuale universitario rispetto a un framework di valutazione fornito.

IMPORTANTE: Fornisci un'analisi COMPLETA, ARTICOLATA e MOLTO DETTAGLIATA. Ogni sezione deve contenere analisi approfondite, esempi specifici, e valutazioni circostanziate. NON essere sintetico, ma ESAURIENTE.

${frameworkText}

INDICE DEL MANUALE DA ANALIZZARE:
${volumeText}

`;

    if (analysisType === 'A') {
        return basePrompt + `TIPO DI ANALISI RICHIESTA: ANALISI EDITORIALE PROFESSIONALE

Scrivi un report editoriale dettagliato e discorsivo, come lo farebbe un analista senior per valutare l'adozione di un manuale universitario in contesto universitario.

**STRUTTURA DEL REPORT:**

## 1. PANORAMICA DEL MANUALE

Descrivi in 2-3 paragrafi:
- A quale tipologia di corso è destinato questo manuale
- Quale approccio didattico adotta (teorico, pratico, bilanciato)
- Chi sono gli studenti target (anno, livello, prerequisiti)
- Quale filosofia editoriale sembra guidare la struttura

## 2. COPERTURA DEGLI ARGOMENTI RISPETTO AL FRAMEWORK

**PRIMA DI INIZIARE L'ANALISI**: Estrai dal framework CSV TUTTI gli argomenti didattici (righe con codici tipo "1.1", "1.2", "2.1", "3.4", etc.). IGNORA:
- Intestazioni ("Modulo/Sotto-modulo", "L-13 Biologia", etc.)
- Righe di punteggio totale
- Legenda ("Punteggio", "Significato didattico", "1-2 Presenza marginale")
- Righe vuote
- Collegamenti interdisciplinari (analizzali separatamente alla fine)

**REGOLA FONDAMENTALE ASSOLUTA:**

All'inizio del prompt ti e' stato fornito un ELENCO NUMERATO COMPLETO degli argomenti da analizzare.

DEVI MENZIONARE **TUTTI** QUEGLI ARGOMENTI nella tua analisi discorsiva.
Se un argomento NON e' presente nel manuale, devi comunque CITARLO e dire "Il [Nome argomento] (X.X) NON e' trattato nel manuale".

**PRIMA DI INIZIARE L'ANALISI NARRATIVA:**

Conferma di aver letto l'elenco completo scrivendo:

"HO IDENTIFICATO [N] ARGOMENTI NEL FRAMEWORK. Mi assicurero' di menzionare OGNUNO di essi nel mio report."

**STEP 2 - ANALISI NARRATIVA PER MACRO-AREA:**

Ora scrivi paragrafi discorsivi organizzati per macro-area. All'interno di ogni paragrafo, CITA ESPLICITAMENTE ogni argomento della lista sopra:

### [Nome Macro-Area] (es: "Modulo 1 - Fondamenti")

Per ogni argomento specifico del framework in questa area (es: 1.1, 1.2, 1.3, 1.4):

**SCRIVI UN PARAGRAFO NARRATIVO che menzioni ESPLICITAMENTE ciascun argomento:**

Esempio di stile CORRETTO (menziona OGNI argomento):
"Il manuale copre in modo eccellente l'**argomento 1.1**, con una trattazione approfondita nei capitoli iniziali (Cap. 1-2, p. 1-65). La progressione didattica e' chiara e ben strutturata, con esempi concreti che contestualizzano i concetti teorici.

Anche l'**argomento 1.2** e' trattato in modo particolarmente dettagliato (Cap. 5, p. 140-159), includendo non solo i concetti base ma anche approfondimenti avanzati, fondamentali per determinati corsi di laurea.

L'**argomento 1.3** e' coperto nei capitoli 3-4 (p. 68-121) con un approccio che combina teoria e pratica. Tuttavia, la trattazione dell'**argomento 1.4** e' meno approfondita per quanto riguarda alcuni aspetti avanzati, che vengono solo accennati.

Si nota invece l'ASSENZA dell'**argomento 3.3**, probabilmente una scelta deliberata per mantenere il focus su altri temi, ma che limita l'uso del manuale in corsi avanzati che richiedono questa competenza."

ESEMPIO SBAGLIATO (troppo generico):
"Il manuale copre i fondamenti della materia in modo eccellente, con vari argomenti trattati." Questo NON va bene! Devi specificare QUALE argomento (1.1, 1.2, 1.3, etc.)

## 3. PUNTI DI FORZA DEL MANUALE

Scrivi 3-4 paragrafi sui maggiori pregi:
- Argomenti trattati in modo particolarmente efficace
- Capitoli/sezioni che si distinguono per qualità didattica
- Elementi innovativi o distintivi rispetto ad altri manuali
- Supporti didattici (esercizi, esempi, approfondimenti)

## 4. LACUNE E CRITICITÀ

Scrivi 2-3 paragrafi sulle principali mancanze:
- Quali argomenti importanti del framework NON sono coperti
- Perché queste lacune sono problematiche (o accettabili)
- Come un docente potrebbe compensare (materiali integrativi)
- Se ci sono sezioni troppo sintetiche o superficiali

## 5. VALUTAZIONE COMPLESSIVA E RACCOMANDAZIONI

Scrivi 2-3 paragrafi finali con:
- **Giudizio generale** → Il manuale è adeguato per il framework? Per quali corsi?
- **Destinatari ideali** → Quale classe di laurea, anno, livello
- **Confronto implicito** → Se hai familiarità con altri manuali, come si posiziona?
- **Raccomandazioni d'uso** → Come integrare, cosa aggiungere
- **Voto finale** (1-10) con motivazione discorsiva (NON dire solo "8/10", ma "Assegno un voto di 8/10 perché...")

3. **PUNTI DI FORZA** (Analisi dettagliata dei meriti)
   - Identifica e descrivi IN DETTAGLIO i maggiori punti di forza del manuale
   - Per ogni punto di forza, fornisci ESEMPI CONCRETI e MOTIVAZIONI
   - Elenca argomenti EXTRA non previsti dal framework che aggiungono valore
   - Analizza l'ORIGINALITÀ e l'INNOVAZIONE del manuale rispetto a testi concorrenti
   - Valuta la QUALITÀ DIDATTICA (esempi, esercizi, approfondimenti)

4. **STRUTTURA E ORGANIZZAZIONE** (Valutazione pedagogica)
   - Analizza IN DETTAGLIO come è organizzato il manuale (moduli, capitoli, sezioni)
   - Valuta la PROGRESSIONE DIDATTICA degli argomenti (prerequisiti rispettati?)
   - Analizza l'EFFICACIA PEDAGOGICA della struttura
   - Commenta su APPARATI DIDATTICI (esercizi, riepiloghi, approfondimenti, bibliografia)
   - Valuta ACCESSIBILITÀ e LEGGIBILITÀ per gli studenti target

5. **VALUTAZIONE COMPLESSIVA** (Sintesi dettagliata)
   - Fornisci una valutazione generale ARTICOLATA del manuale rispetto al framework (scala 1-10 con MOTIVAZIONE DETTAGLIATA)
   - Specifica per quali CORSI è più adatto (anno, livello, tipologia)
   - Fornisci RACCOMANDAZIONI DETTAGLIATE per l'uso didattico
   - Suggerisci INTEGRAZIONI SPECIFICHE necessarie
   - Confronta (se possibile) con altri manuali simili
   - Indica DESTINATARI IDEALI (studenti, docenti, professionisti)

6. **CONSIDERAZIONI AGGIUNTIVE** (Sezione bonus)
   - Valuta AGGIORNAMENTO dei contenuti (riferimenti recenti?)
   - Commenta su ASPETTI PRATICI (esercizi, casi studio, applicazioni)
   - Analizza BIBLIOGRAFIA e riferimenti
   - Note su EDIZIONE, APPENDICI, MATERIALE SUPPLEMENTARE

**VERIFICA FINALE:**

Prima di consegnare l'analisi, controlla:
- ✅ Hai elencato TUTTI gli argomenti del framework nello STEP 1?
- ✅ Ogni argomento della lista è citato nell'analisi narrativa (STEP 2)?
- ✅ Se un argomento è ASSENTE nel manuale, l'hai comunque menzionato nella sezione "Lacune"?

**STILE E TONO:**
- Scrivi come un **analista editoriale senior esperto**, non come un bot
- Usa linguaggio **professionale ma accessibile**
- **NON usare tabelle rigide** nello STEP 2 (solo lista nello STEP 1)
- **NON calcolare percentuali** (es: "56%")
- Scrivi paragrafi discorsivi e narrativi
- Analizza ogni argomento in modo critico e contestualizzato
- Spiega il PERCHÉ delle scelte editoriali, non solo il COSA manca
- Fornisci **ALMENO 2500-3500 parole** di analisi approfondita

**ESEMPIO DI TONO CORRETTO:**
"La sezione dedicata all'argomento X (Cap. 2, p. 35-64) rappresenta uno dei punti di forza del manuale. Non si limita a presentare i concetti base, ma li contestualizza con esempi pratici e applicazioni concrete. Particolarmente apprezzabile e' la trattazione dei meccanismi fondamentali, con diagrammi ed esempi che aiutano lo studente a visualizzare i concetti complessi. Rispetto ad altri manuali introduttivi, questo testo dedica piu' spazio agli aspetti applicativi, preparando efficacemente il terreno per i capitoli successivi piu' avanzati."

Fornisci una risposta in Markdown ben strutturata, fluida e professionale.`;
    } else {
        return basePrompt + `TIPO DI ANALISI RICHIESTA: ANALISI PER CLASSI DI LAUREA

Analizza l'adeguatezza del manuale per ciascuna classe di laurea indicata nel framework.

Per ogni classe di laurea identificata nel framework, fornisci:

1. **NOME CLASSE DI LAUREA**

2. **ADEGUATEZZA COMPLESSIVA**
   - Il manuale è adeguato per questa classe? (Scala: Eccellente/Buono/Sufficiente/Insufficiente)
   - Motivazione della valutazione

3. **ARGOMENTI RILEVANTI PRESENTI**
   - Lista degli argomenti del manuale particolarmente rilevanti per questa classe
   - Livello di approfondimento appropriato?

4. **ARGOMENTI MANCANTI O INSUFFICIENTI**
   - Cosa manca per questa specifica classe di laurea?
   - Quanto impatta l'assenza di questi argomenti?

5. **RACCOMANDAZIONI D'USO**
   - Come utilizzare al meglio questo manuale per questa classe?
   - Necessità di materiale integrativo?
   - Suggerimenti specifici per i docenti

6. **VALUTAZIONE NUMERICA**
   - Punteggio 1-10 per questa classe di laurea

Ripeti questa analisi per OGNI classe di laurea presente nel framework.

Concludi con:
- **COMPARATIVE ASSESSMENT**: confronto tra le diverse classi di laurea
- **RACCOMANDAZIONI GENERALI**: per quali classi il manuale è più/meno adatto

Fornisci una risposta strutturata, dettagliata e ben formattata in Markdown. Per ogni classe fornisci almeno 300-400 parole di analisi. Usa tabelle per confronti, elenchi puntati per chiarezza, grassetto per evidenziare concetti chiave. Totale: almeno 3000-4000 parole.`;
    }
}

async function callAI(prompt) {
    const provider = appState.selectedProvider;
    const model = appState.selectedModel;
    const apiKey = appState.apiKeys[provider];
    
    const systemPrompt = 'Sei un esperto analista editoriale per manuali universitari. Fornisci analisi dettagliate, strutturate e professionali in italiano.';
    
    let response;
    
    if (provider === 'openai') {
        response = await fetch(API_ENDPOINTS.openai, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                temperature: 0,
                max_tokens: 16384
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Errore nella chiamata API OpenAI');
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
        
    } else if (provider === 'claude') {
        response = await fetch(API_ENDPOINTS.claude, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: model,
                system: systemPrompt,
                messages: [
                    { role: 'user', content: prompt }
                ],
                max_tokens: 8192,
                temperature: 0
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Errore nella chiamata API Claude');
        }
        
        const data = await response.json();
        return data.content[0].text;
        
    } else if (provider === 'perplexity') {
        response = await fetch(API_ENDPOINTS.perplexity, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                temperature: 0,
                max_tokens: 4096
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Errore nella chiamata API Perplexity');
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    }
    
    throw new Error(`Provider ${provider} non supportato`);
}

// Alias per retrocompatibilita
async function callOpenAI(prompt) {
    return await callAI(prompt);
}

// Caching System
async function generateCacheKey(frameworkText, volumeText, provider, model) {
    // Combina tutti i parametri che identificano univocamente un'analisi
    const data = `${frameworkText}|${volumeText}|${provider}|${model}|v1.14.0`;
    
    // Genera hash SHA-256
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
}

async function getCachedAnalysis(cacheKey) {
    if (!firebaseInitialized || !db) {
        return null;
    }
    
    try {
        const cacheDoc = await db.collection('analysis_cache').doc(cacheKey).get();
        
        if (cacheDoc.exists) {
            const cacheData = cacheDoc.data();
            console.log(`📦 Cache hit: ${cacheData.provider} ${cacheData.model} - ${cacheData.frameworkName} x ${cacheData.volumeName}`);
            return cacheData.result;
        }
        
        console.log('❌ Cache miss: analisi non trovata in cache');
        return null;
    } catch (error) {
        console.error('Errore recupero cache:', error);
        return null;
    }
}

async function saveCachedAnalysis(cacheKey, result, metadata) {
    if (!firebaseInitialized || !db) {
        console.warn('⚠️ Firebase non inizializzato, skip caching');
        return;
    }
    
    try {
        await db.collection('analysis_cache').doc(cacheKey).set({
            result: result,
            provider: metadata.provider,
            model: metadata.model,
            frameworkName: metadata.frameworkName || 'Unknown',
            volumeName: metadata.volumeName || 'Unknown',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            cacheVersion: 'v1.14.0'
        });
        
        console.log(`💾 Analisi salvata in cache: ${metadata.provider} ${metadata.model}`);
    } catch (error) {
        console.error('Errore salvataggio cache:', error);
    }
}

function displayResults(markdownText) {
    const resultsContent = document.getElementById('resultsContent');
    const htmlContent = marked.parse(markdownText);
    resultsContent.innerHTML = htmlContent;
    
    document.getElementById('resultsSection').classList.remove('hidden');
    
    // Scroll to results
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Salva per export
    appState.lastResults = markdownText;
    
    // Salva automaticamente l'analisi
    const frameworkFileName = document.getElementById('frameworkFile').files[0]?.name || 'Framework';
    const volume1FileName = document.getElementById('volume1File').files[0]?.name || 'Volume 1';
    saveAnalysis(markdownText, frameworkFileName, volume1FileName);
}

// Export Functions
function exportMarkdown() {
    if (!appState.lastResults) return;
    
    const blob = new Blob([appState.lastResults], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analisi_manuale_${new Date().toISOString().slice(0,10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('success', 'File Markdown scaricato!');
}

function exportHtml() {
    if (!appState.lastResults) return;
    
    const htmlContent = marked.parse(appState.lastResults);
    const dataOggi = new Date().toLocaleDateString('it-IT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    
    const fullHtml = `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analisi Manuale Universitario - MAP</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.7;
            color: #1a1a1a;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 40px 20px;
        }
        
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
            overflow: hidden;
        }
        
        /* Header con logo */
        .header {
            background: linear-gradient(135deg, #003057 0%, #005792 100%);
            color: white;
            padding: 40px 50px;
            position: relative;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.05" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') no-repeat bottom;
            background-size: cover;
            opacity: 0.3;
        }
        
        .logo {
            max-width: 280px !important;
            height: auto !important;
            object-fit: contain !important;
            position: relative;
            z-index: 1;
        }
        
        .logo {
            width: 180px;
            height: auto;
            margin-bottom: 20px;
            position: relative;
            z-index: 1;
        }
        
        .header h1 {
            font-size: 2.2rem;
            font-weight: 700;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
        }
        
        .header .subtitle {
            font-size: 1rem;
            opacity: 0.9;
            font-weight: 300;
            position: relative;
            z-index: 1;
        }
        
        /* Content */
        .content {
            padding: 50px;
        }
        
        h1 {
            color: #003057;
            font-size: 2rem;
            font-weight: 700;
            margin: 2.5rem 0 1.2rem;
            padding-bottom: 0.8rem;
            border-bottom: 3px solid #005792;
        }
        
        h2 {
            color: #005792;
            font-size: 1.6rem;
            font-weight: 600;
            margin: 2rem 0 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #e0e0e0;
        }
        
        h3 {
            color: #00689d;
            font-size: 1.3rem;
            font-weight: 600;
            margin: 1.8rem 0 0.8rem;
        }
        
        h4 {
            color: #333;
            font-size: 1.1rem;
            font-weight: 600;
            margin: 1.5rem 0 0.6rem;
        }
        
        p {
            margin-bottom: 1.2rem;
            text-align: justify;
        }
        
        ul, ol {
            margin: 1rem 0 1.5rem 2rem;
        }
        
        li {
            margin-bottom: 0.6rem;
            line-height: 1.8;
        }
        
        strong {
            color: #003057;
            font-weight: 600;
        }
        
        em {
            color: #555;
            font-style: italic;
        }
        
        code {
            background: #f4f6f9;
            color: #d63384;
            padding: 3px 8px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }
        
        blockquote {
            border-left: 4px solid #005792;
            background: #f8f9fa;
            padding: 1rem 1.5rem;
            margin: 1.5rem 0;
            font-style: italic;
            color: #555;
        }
        
        /* Footer */
        .footer {
            background: #f8f9fa;
            border-top: 1px solid #e0e0e0;
            padding: 30px 50px;
            text-align: center;
            color: #666;
            font-size: 0.9rem;
        }
        
        .footer-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
            margin-bottom: 15px;
        }
        
        .footer-logo {
            font-weight: 700;
            color: #003057;
            font-size: 1.1rem;
        }
        
        .footer-date {
            color: #888;
        }
        
        .copyright {
            color: #999;
            font-size: 0.85rem;
            margin-top: 10px;
        }
        
        /* Print styles */
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .container {
                box-shadow: none;
                border-radius: 0;
            }
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .header, .content, .footer {
                padding: 30px 25px;
            }
            h1 { font-size: 1.6rem; }
            h2 { font-size: 1.3rem; }
            h3 { font-size: 1.1rem; }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 530.27 257.98" preserveAspectRatio="xMidYMid meet" style="max-width: 280px; width: 100%; height: auto; display: block; margin-bottom: 15px;">
                <defs>
                    <style>
                        .logo-cls-1 { fill: #003882; }
                        .logo-cls-2 { fill: #fff; }
                        .logo-cls-3 { fill: #e2001a; }
                    </style>
                </defs>
                <rect class="logo-cls-1" y="137.09" width="530.27" height="120.89"/>
                <g>
                    <path class="logo-cls-2" d="M363.49,330.79c0,7.1.91,11.57,5.64,11.57,4.43,0,5-5.29,5-11.9v-4h19.68V329c0,19.5-8.24,31.24-24.72,31.24-17.85,0-27-12.73-27-36.37v-3.63c0-23.64,9.16-36.37,27-36.37,16.48,0,24.72,11.74,24.72,31.24v2.48H374.17v-4c0-6.61-.61-11.9-5-11.9-4.73,0-5.64,4.46-5.64,11.57Z" transform="translate(-162.1 -124.6)"/>
                    <path class="logo-cls-2" d="M426.2,301.53c-4.58,0-5.65,4.3-5.65,12.73h11c0-8.43-.92-12.73-5.34-12.73m-26.86,18.68c0-21,7.48-36.37,26.86-36.37,19.22,0,25.93,15.21,25.93,36.21v7.59H420.55V331c0,7.11,1.07,11.57,5.95,11.57,4,0,5.49-3,5.49-8.43v-1.65h19.69v1.16c0,15.7-9,26.61-24.87,26.61-18.61,0-27.47-12.9-27.47-36.36Z" transform="translate(-162.1 -124.6)"/>
                    <path class="logo-cls-2" d="M486.71,327.15l-4,2.81c-3.51,2.31-5.95,4.13-5.95,8.26,0,3.14,1.68,5,4.42,5,3.82,0,5.5-3.8,5.5-8.93Zm20.75,13.06c0,2.15.45,3.14,2.29,3.14a8.7,8.7,0,0,0,2.59-.5v13.72A17.7,17.7,0,0,1,501.5,360c-6.25,0-11.14-3-13.27-9.26-2.29,5.62-7.93,9.26-14.8,9.26-11.29,0-16.93-7.77-16.93-18,0-11.91,7.63-17.36,18.92-24l11.29-6.61V309c0-4.3-.61-7.28-4.13-7.28s-4.26,3.31-4.26,7.28v3.47H458.63v-4c0-14.54,7.63-24.63,24.57-24.63,16.33,0,24.26,8.93,24.26,26.45Z" transform="translate(-162.1 -124.6)"/>
                </g>
                <polygon class="logo-cls-3" points="0 0 530.27 0 530.27 137.26 0 137.26 0 0 0 0"/>
                <path class="logo-cls-2" d="M644.64,152.76v81.13h19.57V152.76Zm-44.27,81.13H640.2V219.52H620.05V152.76H600.37v81.13Zm-45.62,0h39.83V219.52H574.43V152.76H554.75v81.13Zm-47.06-81.13v81.13h41.78V219.52H527.26V200h21V185.5h-21V167.12h22.21V152.76Zm-59.46,81.13H467.8V200h13.62v33.91H501V152.76H481.42V185.5H467.8V152.76H448.23v81.13ZM363.3,152.76v81.13h19.57V152.76Zm-86.21,49H266.21l5.5-36.08,5.38,36.08Zm-35,32.18h19.11l2.86-18.5h15l2.75,18.5h19.11l-16.36-81.13h-26.1l-16.36,81.13Zm98.23-28.5-16.93-52.63H304v81.13h16.48V181l16.82,52.87H357V152.76H340.3v52.63Zm47.94-11.73c0-5.37,0-10.18.44-15.12a42.68,42.68,0,0,1,3.11-13.64c3.66-8.18,11-13.42,25.14-13.42,17.82,0,25,10.1,24.35,27.84l0,.93H422.86v-1c0-10.92-2-13.79-5.93-13.79-8.29,0-9.72,7-9.72,28.17s1.43,28.16,9.72,28.16c3.28,0,4.89-2,5.75-5.12a26.24,26.24,0,0,0,.77-5.15c.12-1.83.14-3.64.2-5.22l0-.94h18.49v1c0,22-8.94,29.48-25.24,29.48-14.16,0-21.49-5.3-25.14-13.5a42.93,42.93,0,0,1-3.11-13.65c-.44-4.93-.44-9.72-.44-15ZM193.5,167.12H218L190,218v15.86h49V219.52H210.21l28-50.68V152.76H193.5v14.36Z" transform="translate(-162.1 -124.6)"/>
            </svg>
            <h1>Analisi Comparativa Manuale Universitario</h1>
            <div class="subtitle">Report professionale per promotori editoriali</div>
        </div>
        
        <!-- Content -->
        <div class="content">
            ${htmlContent}
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-meta">
                <div class="footer-logo">📚 ZANICHELLI EDITORE</div>
                <div class="footer-date">
                    <strong>Generato:</strong> ${dataOggi}
                </div>
            </div>
            <div class="copyright">
                © ${new Date().getFullYear()} MAP - Manual Analyses Platform | Documento professionale
            </div>
        </div>
    </div>
</body>
</html>`;
    
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const fileName = `Analisi_MAP_${new Date().toISOString().slice(0,10)}.html`;
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('success', '✅ File HTML Professionale scaricato!');
}

// Export PDF Professionale
async function exportPDF() {
    if (!appState.lastResults) {
        showNotification('error', 'Nessuna analisi da esportare!');
        return;
    }
    
    showNotification('info', '📄 Generazione PDF in corso...');
    
    try {
        // 🔧 LEGGI METADATA DAI CAMPI EDITABILI (valori aggiornati)
        const autore = document.getElementById('autoreInput')?.value.trim() || null;
        const titolo = document.getElementById('titoloInput')?.value.trim() || null;
        const editore = document.getElementById('editoreInput')?.value.trim() || null;
        
        console.log('📄 Metadata per PDF export:', { autore, titolo, editore });
        
        // Crea un container temporaneo per il rendering
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.width = '210mm'; // A4 width
        tempContainer.style.background = 'white';
        tempContainer.style.padding = '20mm';
        document.body.appendChild(tempContainer);
        
        const htmlContent = marked.parse(appState.lastResults);
        const dataOggi = new Date().toLocaleDateString('it-IT', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        
        tempContainer.innerHTML = `
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: Arial, sans-serif; }
                .pdf-header {
                    background: linear-gradient(135deg, #003057 0%, #005792 100%);
                    color: white;
                    padding: 30px;
                    margin: -20mm -20mm 30px -20mm;
                    border-radius: 0;
                }
                .pdf-logo {
                    font-size: 28px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    letter-spacing: 2px;
                }
                .pdf-subtitle {
                    font-size: 14px;
                    opacity: 0.9;
                    font-weight: 300;
                }
                .pdf-content {
                    color: #1a1a1a;
                    line-height: 1.6;
                    font-size: 11pt;
                }
                .pdf-content h1 {
                    color: #003057;
                    font-size: 20pt;
                    margin: 20px 0 12px;
                    padding-bottom: 8px;
                    border-bottom: 3px solid #005792;
                }
                .pdf-content h2 {
                    color: #005792;
                    font-size: 16pt;
                    margin: 18px 0 10px;
                    padding-bottom: 5px;
                    border-bottom: 2px solid #e0e0e0;
                }
                .pdf-content h3 {
                    color: #00689d;
                    font-size: 13pt;
                    margin: 15px 0 8px;
                }
                .pdf-content p {
                    margin-bottom: 10px;
                    text-align: justify;
                }
                .pdf-content ul, .pdf-content ol {
                    margin: 10px 0 12px 25px;
                }
                .pdf-content li {
                    margin-bottom: 6px;
                }
                .pdf-content strong {
                    color: #003057;
                    font-weight: 600;
                }
                .pdf-footer {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #e0e0e0;
                    text-align: center;
                    font-size: 9pt;
                    color: #666;
                }
            </style>
            <div class="pdf-header">
                <div style="margin-bottom: 20px;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 530.27 257.98" preserveAspectRatio="xMidYMid meet" style="max-width: 220px; width: 100%; height: auto; display: block;">
                    <defs><style>.logo-cls-1{fill:#003882}.logo-cls-2{fill:#fff}.logo-cls-3{fill:#e2001a}</style></defs>
                    <rect class="logo-cls-1" y="137.09" width="530.27" height="120.89"/>
                    <g><path class="logo-cls-2" d="M363.49,330.79c0,7.1.91,11.57,5.64,11.57,4.43,0,5-5.29,5-11.9v-4h19.68V329c0,19.5-8.24,31.24-24.72,31.24-17.85,0-27-12.73-27-36.37v-3.63c0-23.64,9.16-36.37,27-36.37,16.48,0,24.72,11.74,24.72,31.24v2.48H374.17v-4c0-6.61-.61-11.9-5-11.9-4.73,0-5.64,4.46-5.64,11.57Z" transform="translate(-162.1 -124.6)"/><path class="logo-cls-2" d="M426.2,301.53c-4.58,0-5.65,4.3-5.65,12.73h11c0-8.43-.92-12.73-5.34-12.73m-26.86,18.68c0-21,7.48-36.37,26.86-36.37,19.22,0,25.93,15.21,25.93,36.21v7.59H420.55V331c0,7.11,1.07,11.57,5.95,11.57,4,0,5.49-3,5.49-8.43v-1.65h19.69v1.16c0,15.7-9,26.61-24.87,26.61-18.61,0-27.47-12.9-27.47-36.36Z" transform="translate(-162.1 -124.6)"/><path class="logo-cls-2" d="M486.71,327.15l-4,2.81c-3.51,2.31-5.95,4.13-5.95,8.26,0,3.14,1.68,5,4.42,5,3.82,0,5.5-3.8,5.5-8.93Zm20.75,13.06c0,2.15.45,3.14,2.29,3.14a8.7,8.7,0,0,0,2.59-.5v13.72A17.7,17.7,0,0,1,501.5,360c-6.25,0-11.14-3-13.27-9.26-2.29,5.62-7.93,9.26-14.8,9.26-11.29,0-16.93-7.77-16.93-18,0-11.91,7.63-17.36,18.92-24l11.29-6.61V309c0-4.3-.61-7.28-4.13-7.28s-4.26,3.31-4.26,7.28v3.47H458.63v-4c0-14.54,7.63-24.63,24.57-24.63,16.33,0,24.26,8.93,24.26,26.45Z" transform="translate(-162.1 -124.6)"/></g>
                    <polygon class="logo-cls-3" points="0 0 530.27 0 530.27 137.26 0 137.26 0 0 0 0"/>
                    <path class="logo-cls-2" d="M644.64,152.76v81.13h19.57V152.76Zm-44.27,81.13H640.2V219.52H620.05V152.76H600.37v81.13Zm-45.62,0h39.83V219.52H574.43V152.76H554.75v81.13Zm-47.06-81.13v81.13h41.78V219.52H527.26V200h21V185.5h-21V167.12h22.21V152.76Zm-59.46,81.13H467.8V200h13.62v33.91H501V152.76H481.42V185.5H467.8V152.76H448.23v81.13ZM363.3,152.76v81.13h19.57V152.76Zm-86.21,49H266.21l5.5-36.08,5.38,36.08Zm-35,32.18h19.11l2.86-18.5h15l2.75,18.5h19.11l-16.36-81.13h-26.1l-16.36,81.13Zm98.23-28.5-16.93-52.63H304v81.13h16.48V181l16.82,52.87H357V152.76H340.3v52.63Zm47.94-11.73c0-5.37,0-10.18.44-15.12a42.68,42.68,0,0,1,3.11-13.64c3.66-8.18,11-13.42,25.14-13.42,17.82,0,25,10.1,24.35,27.84l0,.93H422.86v-1c0-10.92-2-13.79-5.93-13.79-8.29,0-9.72,7-9.72,28.17s1.43,28.16,9.72,28.16c3.28,0,4.89-2,5.75-5.12a26.24,26.24,0,0,0,.77-5.15c.12-1.83.14-3.64.2-5.22l0-.94h18.49v1c0,22-8.94,29.48-25.24,29.48-14.16,0-21.49-5.3-25.14-13.5a42.93,42.93,0,0,1-3.11-13.65c-.44-4.93-.44-9.72-.44-15ZM193.5,167.12H218L190,218v15.86h49V219.52H210.21l28-50.68V152.76H193.5v14.36Z" transform="translate(-162.1 -124.6)"/>
                </svg>
                </div>
                <div style="font-size: 18px; font-weight: 600; margin-top: 10px;">
                    ${titolo || appState.materia || 'Analisi Manuale Universitario'}
                </div>
                <div class="pdf-subtitle">
                    ${autore ? '👤 ' + autore : ''} 
                    ${editore ? '• 🏢 ' + editore : ''}
                    ${(!autore && !editore) ? 'Report professionale per promotori editoriali' : ''}
                </div>
            </div>
            <div class="pdf-content">
                ${htmlContent}
            </div>
            <div class="pdf-footer">
                <div style="font-weight: 600; color: #003057; margin-bottom: 5px;">
                    📚 ZANICHELLI EDITORE
                </div>
                <div>Generato il ${dataOggi}</div>
                <div style="font-size: 8pt; color: #999; margin-top: 8px;">
                    © ${new Date().getFullYear()} MAP - Manual Analyses Platform | Documento professionale
                </div>
            </div>
        `;
        
        // Genera il PDF usando html2canvas + jsPDF
        const canvas = await html2canvas(tempContainer, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });
        
        document.body.removeChild(tempContainer);
        
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        // Prima pagina
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // Aggiungi pagine successive se necessario
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        const fileName = `Analisi_MAP_${new Date().toISOString().slice(0,10)}.pdf`;
        pdf.save(fileName);
        
        showNotification('success', '✅ PDF Professionale scaricato!');
        
    } catch (error) {
        console.error('Errore generazione PDF:', error);
        showNotification('error', '❌ Errore nella generazione del PDF');
    }
}

// Reset Analysis
function resetAnalysis() {
    document.getElementById('resultsSection').classList.add('hidden');
    document.getElementById('resultsContent').innerHTML = '';
    appState.lastResults = null;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Utility Functions
function updateProgress(percent, message) {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    if (percent === 0) {
        document.getElementById('progressSection').classList.add('hidden');
        return;
    }
    
    document.getElementById('progressSection').classList.remove('hidden');
    progressBar.style.width = `${percent}%`;
    progressText.textContent = message;
}

function showNotification(type, message) {
    // Crea un toast notification
    const toast = document.createElement('div');
    
    // Colori e icone per tipo
    const typeConfig = {
        success: { bg: 'bg-green-500', icon: 'check-circle' },
        error: { bg: 'bg-red-500', icon: 'exclamation-circle' },
        warning: { bg: 'bg-yellow-500', icon: 'exclamation-triangle' },
        info: { bg: 'bg-blue-500', icon: 'info-circle' }
    };
    
    const config = typeConfig[type] || typeConfig.info;
    
    toast.className = `fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg text-white z-50 transform transition-all duration-300 ${config.bg}`;
    toast.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${config.icon} mr-3"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('opacity-0'), 3000);
    setTimeout(() => document.body.removeChild(toast), 3500);
}

// ========================================
// FIREBASE HELPER FUNCTIONS
// ========================================

/**
 * Testa la connessione a Firebase Firestore
 * @returns {Promise<boolean>} true se connesso, false altrimenti
 */
async function testFirebaseConnection() {
    if (!firebaseInitialized) {
        console.error('Firebase non inizializzato');
        return false;
    }
    
    try {
        // Tenta di leggere una collezione (anche se vuota)
        const testQuery = await firestoreDb.collection('analyses').limit(1).get();
        console.log('✅ Connessione Firebase OK - Documenti trovati:', testQuery.size);
        return true;
    } catch (error) {
        // Ignora errore "missing permissions" se la collezione è vuota - è normale all'inizio
        if (error.code === 'permission-denied' && error.message.includes('Missing or insufficient permissions')) {
            console.log('⚠️ Firestore richiede prima lettura/scrittura per attivare le rules. Pubblica un\'analisi per inizializzare.');
            return true; // Considera comunque connesso
        }
        console.error('❌ Errore connessione Firebase:', error);
        return false;
    }
}

/**
 * Ottiene statistiche Firebase (numero analisi pubblicate)
 * @returns {Promise<number>} Numero di analisi pubblicate
 */
async function getPublishedAnalysesCount() {
    if (!firebaseInitialized) return 0;
    
    try {
        const snapshot = await firestoreDb.collection('analyses').where('pubblicata', '==', true).get();
        return snapshot.size;
    } catch (error) {
        console.error('Errore conteggio Firebase:', error);
        return 0;
    }
}

/**
 * Mostra stato connessione Firebase all'utente
 */
async function showFirebaseStatus() {
    if (!firebaseInitialized) {
        showNotification('warning', '⚠️ Firebase non disponibile - le analisi saranno solo locali');
        return;
    }
    
    const isConnected = await testFirebaseConnection();
    
    if (isConnected) {
        const count = await getPublishedAnalysesCount();
        showNotification('success', `✅ Firebase connesso - ${count} analisi pubblicate nel cloud`);
    } else {
        showNotification('error', '❌ Firebase non raggiungibile - controlla la connessione');
    }
}

/**
 * Aggiorna l'interfaccia utente con lo stato Firebase
 */
async function updateFirebaseStatusUI() {
    const statusBtn = document.getElementById('firebaseStatusBtn');
    const statusText = document.getElementById('firebaseStatusText');
    
    if (!statusBtn || !statusText) return;
    
    if (!firebaseInitialized) {
        // Firebase non inizializzato
        statusBtn.className = 'inline-block px-4 py-2 bg-gray-100 text-gray-600 rounded-lg transition text-sm cursor-not-allowed';
        statusText.innerHTML = 'Firebase <span class="text-xs">(offline)</span>';
        statusBtn.title = 'Firebase non disponibile - analisi solo locali';
        return;
    }
    
    try {
        // Test connessione
        const isConnected = await testFirebaseConnection();
        
        if (isConnected) {
            statusBtn.className = 'inline-block px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm';
            statusText.innerHTML = 'Firebase <span class="text-xs">(✓ online)</span>';
            statusBtn.title = 'Firebase connesso - clicca per dettagli';
        } else {
            statusBtn.className = 'inline-block px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition text-sm';
            statusText.innerHTML = 'Firebase <span class="text-xs">(⚠ errore)</span>';
            statusBtn.title = 'Errore connessione Firebase - clicca per dettagli';
        }
    } catch (error) {
        console.error('Errore aggiornamento UI Firebase:', error);
        statusBtn.className = 'inline-block px-4 py-2 bg-red-100 text-red-600 rounded-lg transition text-sm';
        statusText.innerHTML = 'Firebase <span class="text-xs">(✗ errore)</span>';
        statusBtn.title = 'Errore Firebase';
    }
}

// Prompt Modal Functions
function showPromptModal() {
    if (!appState.lastPrompt) {
        showNotification('error', 'Nessun prompt disponibile. Esegui prima un\'analisi.');
        return;
    }
    
    const modal = document.getElementById('promptModal');
    const promptContent = document.getElementById('promptContent');
    
    promptContent.textContent = appState.lastPrompt;
    modal.classList.remove('hidden');
    
    // Chiudi modal con ESC
    document.addEventListener('keydown', handleEscKey);
}

function closePromptModal() {
    const modal = document.getElementById('promptModal');
    modal.classList.add('hidden');
    document.removeEventListener('keydown', handleEscKey);
}

function handleEscKey(e) {
    if (e.key === 'Escape') {
        closePromptModal();
    }
}

function copyPrompt() {
    if (!appState.lastPrompt) return;
    
    navigator.clipboard.writeText(appState.lastPrompt).then(() => {
        showNotification('success', 'Prompt copiato negli appunti!');
    }).catch(err => {
        console.error('Errore copia:', err);
        showNotification('error', 'Impossibile copiare il prompt');
    });
}

function downloadPrompt() {
    if (!appState.lastPrompt) return;
    
    const blob = new Blob([appState.lastPrompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt_analisi_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('success', 'Prompt scaricato!');
}

// ====================
// SISTEMA DI SALVATAGGIO AUTOMATICO
// ====================

// Inizializza IndexedDB per salvare le analisi
let db = null;

function initDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('AnalizzatoreManualDB', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('analyses')) {
                const objectStore = db.createObjectStore('analyses', { keyPath: 'id', autoIncrement: true });
                objectStore.createIndex('timestamp', 'timestamp', { unique: false });
                objectStore.createIndex('analysisType', 'analysisType', { unique: false });
            }
        };
    });
}

// Salva analisi automaticamente
async function saveAnalysis(results, frameworkName, volumeName) {
    try {
        if (!db) await initDatabase();
        
        // Usa materia con fallback intelligente
        let materia = appState.materia;
        
        // Se non c'è materia, prova a estrarla
        if (!materia || materia.trim() === '') {
            // Prova dal framework
            if (appState.frameworkData && appState.frameworkData.length > 0) {
                materia = extractMateriaFromFramework(appState.frameworkData, frameworkName);
            }
            // Fallback finale
            if (!materia) {
                materia = 'Altra Materia';
            }
        }
        
        // Estrai metadata PDF se disponibili
        const autore = appState.pdfMetadata?.autore || 'Autore non specificato';
        const editore = appState.pdfMetadata?.editore || 'Editore non specificato';
        const titolo = appState.pdfMetadata?.titolo || materia; // Usa titolo estratto o fallback su materia
        
        const analysis = {
            timestamp: Date.now(),
            date: new Date().toISOString(),
            materia: materia,
            titolo: titolo, // 🆕 Campo titolo separato
            frameworkName: frameworkName || 'Framework senza nome',
            volumeName: volumeName || 'Volume senza nome',
            autore: autore,
            editore: editore,
            analysisType: appState.analysisType,
            hasVolume2: appState.hasVolume2,
            results: results,
            prompt: appState.lastPrompt,
            pubblicata: false // Flag per pubblicazione nella galleria colleghi
        };
        
        const transaction = db.transaction(['analyses'], 'readwrite');
        const objectStore = transaction.objectStore('analyses');
        const request = objectStore.add(analysis);
        
        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                console.log('Analisi salvata automaticamente con ID:', request.result);
                showNotification('success', '💾 Analisi salvata automaticamente!');
                updateHistoryCount(); // Aggiorna contatore
                resolve(request.result);
            };
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('Errore salvataggio analisi:', error);
    }
}

// Recupera tutte le analisi salvate
async function getSavedAnalyses() {
    try {
        if (!db) await initDatabase();
        
        const transaction = db.transaction(['analyses'], 'readonly');
        const objectStore = transaction.objectStore('analyses');
        const request = objectStore.getAll();
        
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('Errore recupero analisi:', error);
        return [];
    }
}

// Elimina un'analisi
async function deleteAnalysis(id) {
    try {
        if (!db) await initDatabase();
        
        const transaction = db.transaction(['analyses'], 'readwrite');
        const objectStore = transaction.objectStore('analyses');
        const request = objectStore.delete(id);
        
        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                showNotification('success', 'Analisi eliminata');
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('Errore eliminazione analisi:', error);
    }
}

/**
 * Esegue la migrazione delle analisi vecchie (chiamata dal pulsante UI)
 */
async function runMigration() {
    if (!confirm('Vuoi aggiornare tutte le analisi vecchie aggiungendo Autore ed Editore?\n\nQuesto processo è sicuro e non eliminerà dati.')) {
        return;
    }
    
    showNotification('info', '🔄 Migrazione in corso...');
    
    try {
        const stats = await migrateOldAnalyses();
        
        let message = `✅ Migrazione completata!\n\n`;
        message += `📊 Statistiche:\n`;
        message += `- Aggiornate: ${stats.updated}\n`;
        message += `- Già aggiornate: ${stats.skipped}\n`;
        message += `- Errori: ${stats.errors}\n`;
        message += `- Totale: ${stats.total}`;
        
        alert(message);
        
        showNotification('success', `✅ ${stats.updated} analisi aggiornate con successo!`);
        
        // Ricarica lo storico per mostrare i metadata
        showHistoryModal();
        
    } catch (error) {
        console.error('Errore migrazione:', error);
        showNotification('error', '❌ Errore durante la migrazione: ' + error.message);
    }
}

/**
 * Migra analisi vecchie aggiungendo metadata mancanti (autore, editore)
 * @returns {Promise<Object>} Statistiche migrazione
 */
async function migrateOldAnalyses() {
    try {
        if (!db) await initDatabase();
        
        const analyses = await getSavedAnalyses();
        
        let updated = 0;
        let skipped = 0;
        let errors = 0;
        
        console.log('🔄 === INIZIO MIGRAZIONE ANALISI ===');
        console.log(`Totale analisi da controllare: ${analyses.length}`);
        
        // FASE 1: Aggiorna IndexedDB (una transazione per analisi)
        for (const analysis of analyses) {
            try {
                // Controlla se ha già i metadata
                if (analysis.autore && analysis.editore) {
                    console.log(`⏭️ Analisi ${analysis.id} già aggiornata - skip`);
                    skipped++;
                    continue;
                }
                
                // Aggiungi metadata mancanti
                let needsUpdate = false;
                
                if (!analysis.autore) {
                    analysis.autore = 'Autore non specificato';
                    needsUpdate = true;
                }
                
                if (!analysis.editore) {
                    analysis.editore = 'Editore non specificato';
                    needsUpdate = true;
                }
                
                if (needsUpdate) {
                    // Crea NUOVA transazione per ogni analisi (evita timeout)
                    const transaction = db.transaction(['analyses'], 'readwrite');
                    const objectStore = transaction.objectStore('analyses');
                    
                    // Salva analisi aggiornata
                    await new Promise((resolve, reject) => {
                        const request = objectStore.put(analysis);
                        request.onsuccess = () => resolve();
                        request.onerror = () => reject(request.error);
                    });
                    
                    console.log(`✅ Analisi ${analysis.id} aggiornata:`, {
                        autore: analysis.autore,
                        editore: analysis.editore
                    });
                    
                    updated++;
                }
                
            } catch (error) {
                console.error(`❌ Errore migrazione analisi ${analysis.id}:`, error);
                errors++;
            }
        }
        
        // FASE 2: Aggiorna Firebase (dopo IndexedDB)
        console.log('☁️ Aggiornamento Firebase per analisi pubblicate...');
        for (const analysis of analyses) {
            if (analysis.pubblicata && firebaseInitialized && (analysis.autore || analysis.editore)) {
                try {
                    const docId = analysis.id.toString();
                    await firestoreDb.collection('analyses').doc(docId).update({
                        autore: analysis.autore || 'Autore non specificato',
                        editore: analysis.editore || 'Editore non specificato',
                        lastUpdated: Date.now()
                    });
                    console.log(`☁️ Firebase aggiornato per analisi ${analysis.id}`);
                } catch (fbError) {
                    console.warn(`⚠️ Errore aggiornamento Firebase per ${analysis.id}:`, fbError);
                }
            }
        }
        
        console.log('✅ === MIGRAZIONE COMPLETATA ===');
        console.log(`Aggiornate: ${updated}`);
        console.log(`Già aggiornate: ${skipped}`);
        console.log(`Errori: ${errors}`);
        
        return { updated, skipped, errors, total: analyses.length };
        
    } catch (error) {
        console.error('❌ Errore generale migrazione:', error);
        throw error;
    }
}

// Inizializza database all'avvio
initDatabase().catch(err => console.error('Errore inizializzazione DB:', err));

// ====================
// UI STORICO ANALISI
// ====================

async function updateHistoryCount() {
    try {
        const analyses = await getSavedAnalyses();
        const count = analyses.length;
        document.getElementById('historyCount').textContent = count;
        document.getElementById('historyModalCount').textContent = count;
    } catch (error) {
        console.error('Errore conteggio analisi:', error);
    }
}

async function showHistoryModal() {
    try {
        const analyses = await getSavedAnalyses();
        const modal = document.getElementById('historyModal');
        const content = document.getElementById('historyContent');
        const empty = document.getElementById('historyEmpty');
        
        if (analyses.length === 0) {
            content.classList.add('hidden');
            empty.classList.remove('hidden');
        } else {
            empty.classList.add('hidden');
            content.classList.remove('hidden');
            
            // Raggruppa PRIMA per materia, POI per volume
            const groupedByMateria = {};
            
            console.log('🔍 === INIZIO ANALISI RAGGRUPPAMENTO ===');
            console.log('Totale analisi da raggruppare:', analyses.length);
            
            analyses.forEach((analysis, index) => {
                const materiaRaw = analysis.materia;
                // Normalizza: trim + Title Case (Prima Lettera Maiuscola)
                let materia = (materiaRaw || 'Altra Materia').trim();
                // Converti in formato standard: "Chimica Organica" (non "CHIMICA ORGANICA" o "chimica organica")
                materia = materia.split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ');
                
                const volumeName = analysis.volumeName || 'Volume senza nome';
                
                // DIAGNOSTIC LOG
                console.log(`🔍 Analisi #${index + 1}:`, {
                    materiaOriginale: materiaRaw,
                    materiaPulita: materia,
                    tipoMateria: typeof materiaRaw,
                    volumeName: volumeName,
                    data: new Date(analysis.timestamp).toLocaleString('it-IT')
                });
                
                if (!groupedByMateria[materia]) {
                    console.log(`✨ CREATO nuovo gruppo materia: "${materia}"`);
                    groupedByMateria[materia] = {};
                }
                if (!groupedByMateria[materia][volumeName]) {
                    console.log(`✨ CREATO nuovo volume in "${materia}": "${volumeName}"`);
                    groupedByMateria[materia][volumeName] = [];
                }
                groupedByMateria[materia][volumeName].push(analysis);
            });
            
            // Log struttura finale
            console.log('📊 === STRUTTURA FINALE groupedByMateria ===');
            Object.keys(groupedByMateria).forEach(materia => {
                const volumes = groupedByMateria[materia];
                const totalAnalyses = Object.values(volumes).reduce((sum, arr) => sum + arr.length, 0);
                console.log(`📚 "${materia}" → ${totalAnalyses} analisi totali`);
                Object.keys(volumes).forEach(vol => {
                    console.log(`  ├─ ${vol}: ${volumes[vol].length} analisi`);
                });
            });
            
            // Ordina analisi per data (più recenti prima)
            Object.keys(groupedByMateria).forEach(materia => {
                Object.keys(groupedByMateria[materia]).forEach(volume => {
                    groupedByMateria[materia][volume].sort((a, b) => b.timestamp - a.timestamp);
                });
            });
            
            // Colori badge per materie
            const materiaColors = [
                'bg-blue-600',
                'bg-green-600', 
                'bg-purple-600',
                'bg-orange-600',
                'bg-pink-600',
                'bg-teal-600',
                'bg-indigo-600',
                'bg-red-600'
            ];
            
            // Genera HTML con sezioni collassabili
            let html = '';
            let colorIndex = 0;
            
            Object.keys(groupedByMateria).sort().forEach(materia => {
                const volumes = groupedByMateria[materia];
                const materiaColor = materiaColors[colorIndex % materiaColors.length];
                colorIndex++;
                
                // Conta totale analisi per materia
                const totalAnalyses = Object.values(volumes).reduce((sum, arr) => sum + arr.length, 0);
                
                const materiaSafeId = materia.replace(/[^a-zA-Z0-9]/g, '-');
                
                html += `
                    <div class="mb-6 border border-gray-300 rounded-lg overflow-hidden" data-materia="${materia}">
                        <!-- Header materia collassabile -->
                        <div class="bg-gray-100 px-6 py-4 hover:bg-gray-200 transition flex justify-between items-center">
                            <div class="flex items-center gap-3 flex-1 cursor-pointer" onclick="toggleMateriaSection('${materiaSafeId}')">
                                <span class="${materiaColor} text-white px-3 py-1 rounded-full text-sm font-bold">
                                    ${totalAnalyses}
                                </span>
                                <h3 class="text-xl font-bold text-gray-800">
                                    <i class="fas fa-book-open mr-2"></i>
                                    ${materia.toUpperCase()}
                                </h3>
                            </div>
                            <div class="flex items-center gap-3">
                                <button onclick="editMateriaFromButton(this); event.stopPropagation();" class="px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition text-xs" title="Modifica materia per tutte le analisi">
                                    <i class="fas fa-edit mr-1"></i>
                                    Modifica
                                </button>
                                <i id="icon-${materiaSafeId}" class="fas fa-chevron-down text-gray-600 cursor-pointer" onclick="toggleMateriaSection('${materiaSafeId}')" ></i>
                            </div>
                        </div>
                        
                        <!-- Volumi della materia -->
                        <div id="section-${materiaSafeId}" class="bg-white p-4">
                            ${Object.keys(volumes).map(volumeName => {
                                const volumeAnalyses = volumes[volumeName];
                                const volumeId = `${materia}-${volumeName}`.replace(/[^a-zA-Z0-9]/g, '-');
                                
                                return `
                                    <div class="mb-4 border-l-4 ${materiaColor.replace('bg-', 'border-')} pl-4">
                                        <!-- Header volume collassabile -->
                                        <div class="cursor-pointer py-2 flex justify-between items-center hover:bg-gray-50 rounded transition"
                                             onclick="toggleVolumeSection('${volumeId}')">
                                            <div class="flex items-center gap-2">
                                                <i id="icon-vol-${volumeId}" class="fas fa-chevron-right text-gray-600 text-sm"></i>
                                                <div class="flex flex-col">
                                                    <h4 class="text-lg font-bold text-indigo-900">
                                                        ${volumeAnalyses[0]?.autore ? '👤 ' + volumeAnalyses[0].autore : ''}
                                                        ${volumeAnalyses[0]?.titolo ? ' | 📚 ' + volumeAnalyses[0].titolo : ''}
                                                        ${volumeAnalyses[0]?.editore ? ' | 🏢 ' + volumeAnalyses[0].editore : ''}
                                                    </h4>
                                                    <span class="text-xs text-gray-500 font-normal">
                                                        ${volumeName} • ${volumeAnalyses.length} analisi
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- Analisi del volume (collassate per default) -->
                                        <div id="section-vol-${volumeId}" class="hidden mt-3 ml-6 space-y-3">
                                            ${volumeAnalyses.map(analysis => {
                                                const tipoAnalisiText = analysis.analysisType === 'A' 
                                                    ? 'Analisi Generale' 
                                                    : 'Analisi Comparativa per Classi di Laurea';
                                                const dataFormatted = new Date(analysis.timestamp).toLocaleDateString('it-IT', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                });
                                                
                                                return `
                                                    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 relative">
                                                        <!-- Checkbox confronto -->
                                                        <div class="absolute top-3 right-3">
                                                            <input type="checkbox" 
                                                                   id="compare-${analysis.id}" 
                                                                   class="compare-checkbox w-5 h-5 text-orange-600 rounded focus:ring-orange-500" 
                                                                   onchange="toggleCompareSelection(${analysis.id})">
                                                        </div>
                                                        
                                                        <!-- Tipo + Data + Badge Pubblicata -->
                                                        <div class="mb-3 pr-8 flex items-center gap-2 flex-wrap">
                                                            <span class="text-sm font-semibold text-gray-700">
                                                                ${tipoAnalisiText}
                                                            </span>
                                                            ${analysis.pubblicata ? '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-800"><i class="fas fa-globe mr-1"></i>Pubblica</span>' : ''}
                                                            <span class="text-xs text-gray-500 ml-3">
                                                                <i class="fas fa-calendar mr-1"></i>
                                                                ${dataFormatted}
                                                            </span>
                                                        </div>
                                                        
                                                        <!-- Autore ed Editore -->
                                                        ${analysis.autore || analysis.editore ? `
                                                        <div class="mb-3 text-xs text-gray-600 flex items-center gap-3 flex-wrap">
                                                            ${analysis.autore ? `<span><i class="fas fa-user mr-1 text-gray-400"></i><strong>Autore:</strong> ${analysis.autore}</span>` : ''}
                                                            ${analysis.editore ? `<span><i class="fas fa-building mr-1 text-gray-400"></i><strong>Editore:</strong> ${analysis.editore}</span>` : ''}
                                                        </div>
                                                        ` : ''}
                                                        
                                                        <!-- Bottoni azioni -->
                                                        <div class="flex gap-2 flex-wrap">
                                                            <button onclick="viewAnalysis(${analysis.id})" class="px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition text-xs">
                                                                <i class="fas fa-eye mr-1"></i>
                                                                Visualizza
                                                            </button>
                                                            <div class="relative inline-block">
                                                                <button onclick="toggleExportMenu(${analysis.id}); event.stopPropagation();" 
                                                                        class="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition text-xs">
                                                                    <i class="fas fa-download mr-1"></i>
                                                                    Esporta
                                                                    <i class="fas fa-chevron-down ml-1 text-xs"></i>
                                                                </button>
                                                                <div id="export-menu-${analysis.id}" 
                                                                     class="hidden absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10 min-w-[140px]">
                                                                    <button onclick="exportSingleAnalysisPDF(${analysis.id}); event.stopPropagation();" 
                                                                            class="w-full text-left px-3 py-2 hover:bg-red-50 text-xs flex items-center gap-2">
                                                                        <i class="fas fa-file-pdf text-red-600"></i>
                                                                        <span>PDF</span>
                                                                    </button>
                                                                    <button onclick="exportSingleAnalysisHTML(${analysis.id}); event.stopPropagation();" 
                                                                            class="w-full text-left px-3 py-2 hover:bg-blue-50 text-xs flex items-center gap-2">
                                                                        <i class="fas fa-file-code text-blue-600"></i>
                                                                        <span>HTML</span>
                                                                    </button>
                                                                    <button onclick="exportSingleAnalysis(${analysis.id}); event.stopPropagation();" 
                                                                            class="w-full text-left px-3 py-2 hover:bg-gray-50 text-xs flex items-center gap-2">
                                                                        <i class="fas fa-file-alt text-gray-600"></i>
                                                                        <span>Markdown</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <button onclick="viewAnalysisPrompt(${analysis.id})" class="px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-xs">
                                                                <i class="fas fa-code mr-1"></i>
                                                                Prompt
                                                            </button>
                                                            <button onclick="togglePubblica(${analysis.id})" 
                                                                    id="pubblica-btn-${analysis.id}"
                                                                    class="px-3 py-1.5 ${analysis.pubblicata ? 'bg-orange-600' : 'bg-teal-600'} text-white rounded hover:opacity-90 transition text-xs">
                                                                <i class="fas ${analysis.pubblicata ? 'fa-eye-slash' : 'fa-globe'} mr-1"></i>
                                                                ${analysis.pubblicata ? 'Privata' : 'Pubblica'}
                                                            </button>
                                                            <button onclick="deleteAndRefresh(${analysis.id})" class="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition text-xs">
                                                                <i class="fas fa-trash mr-1"></i>
                                                                Elimina
                                                            </button>
                                                        </div>
                                                    </div>
                                                `;
                                            }).join('')}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            });
            
            content.innerHTML = html;
        }
        
        modal.classList.remove('hidden');
        updateHistoryCount();
    } catch (error) {
        console.error('Errore caricamento storico:', error);
        showNotification('error', 'Errore nel caricamento dello storico');
    }
}

function closeHistoryModal() {
    document.getElementById('historyModal').classList.add('hidden');
}

// Toggle sezione materia (collassa/espandi)
function toggleMateriaSection(materiaSafeId) {
    const section = document.getElementById(`section-${materiaSafeId}`);
    const icon = document.getElementById(`icon-${materiaSafeId}`);
    
    if (section.classList.contains('hidden')) {
        section.classList.remove('hidden');
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    } else {
        section.classList.add('hidden');
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    }
}

// Toggle sezione volume (collassa/espandi analisi)
function toggleVolumeSection(volumeId) {
    const section = document.getElementById(`section-vol-${volumeId}`);
    const icon = document.getElementById(`icon-vol-${volumeId}`);
    
    if (section.classList.contains('hidden')) {
        section.classList.remove('hidden');
        icon.classList.remove('fa-chevron-right');
        icon.classList.add('fa-chevron-down');
    } else {
        section.classList.add('hidden');
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-right');
    }
}

async function viewAnalysis(id) {
    try {
        const analyses = await getSavedAnalyses();
        const analysis = analyses.find(a => a.id === id);
        
        if (analysis) {
            // Mostra l'analisi nella sezione risultati
            const resultsContent = document.getElementById('resultsContent');
            const htmlContent = marked.parse(analysis.results);
            resultsContent.innerHTML = htmlContent;
            
            document.getElementById('resultsSection').classList.remove('hidden');
            appState.lastResults = analysis.results;
            appState.lastPrompt = analysis.prompt;
            
            // Chiudi modal e scrolla ai risultati
            closeHistoryModal();
            document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
            
            showNotification('success', 'Analisi caricata!');
        }
    } catch (error) {
        console.error('Errore visualizzazione analisi:', error);
        showNotification('error', 'Errore nel caricamento dell\'analisi');
    }
}

// Toggle menu export dropdown
function toggleExportMenu(id) {
    const menu = document.getElementById(`export-menu-${id}`);
    // Chiudi tutti gli altri menu
    document.querySelectorAll('[id^="export-menu-"]').forEach(m => {
        if (m.id !== `export-menu-${id}`) {
            m.classList.add('hidden');
        }
    });
    menu.classList.toggle('hidden');
}

// Chiudi menu quando si clicca fuori
document.addEventListener('click', function() {
    document.querySelectorAll('[id^="export-menu-"]').forEach(m => {
        m.classList.add('hidden');
    });
});

async function exportSingleAnalysis(id) {
    toggleExportMenu(id); // Chiudi menu
    try {
        const analyses = await getSavedAnalyses();
        const analysis = analyses.find(a => a.id === id);
        
        if (analysis) {
            const blob = new Blob([analysis.results], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const date = new Date(analysis.timestamp).toISOString().slice(0,10);
            a.download = `analisi_${analysis.frameworkName.replace('.csv', '')}_${date}.md`;
            a.click();
            URL.revokeObjectURL(url);
            
            showNotification('success', 'Analisi Markdown esportata!');
        }
    } catch (error) {
        console.error('Errore export analisi:', error);
        showNotification('error', 'Errore nell\'export');
    }
}

async function exportSingleAnalysisHTML(id) {
    toggleExportMenu(id); // Chiudi menu
    try {
        const analyses = await getSavedAnalyses();
        const analysis = analyses.find(a => a.id === id);
        
        if (!analysis) {
            showNotification('error', 'Analisi non trovata');
            return;
        }
        
        // Usa la stessa logica di exportHtml() ma con i dati dell'analisi
        const htmlContent = marked.parse(analysis.results);
        const dataOggi = new Date(analysis.timestamp).toLocaleDateString('it-IT', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        
        const fullHtml = `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${analysis.materia || 'Analisi'} - ${analysis.volumeName} - Zanichelli</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.7;
            color: #1a1a1a;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 40px 20px;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #003057 0%, #005792 100%);
            color: white;
            padding: 40px 50px;
            position: relative;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.05" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') no-repeat bottom;
            background-size: cover;
            opacity: 0.3;
        }
        
        .logo {
            max-width: 280px !important;
            height: auto !important;
            object-fit: contain !important;
            position: relative;
            z-index: 1;
        }
        .logo { width: 180px; height: auto; margin-bottom: 20px; position: relative; z-index: 1; }
        .header h1 { font-size: 2.2rem; font-weight: 700; margin-bottom: 8px; position: relative; z-index: 1; }
        .header .subtitle { font-size: 1rem; opacity: 0.9; font-weight: 300; position: relative; z-index: 1; }
        .content { padding: 50px; }
        h1 { color: #003057; font-size: 2rem; font-weight: 700; margin: 2.5rem 0 1.2rem; padding-bottom: 0.8rem; border-bottom: 3px solid #005792; }
        h2 { color: #005792; font-size: 1.6rem; font-weight: 600; margin: 2rem 0 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e0e0e0; }
        h3 { color: #00689d; font-size: 1.3rem; font-weight: 600; margin: 1.8rem 0 0.8rem; }
        h4 { color: #333; font-size: 1.1rem; font-weight: 600; margin: 1.5rem 0 0.6rem; }
        p { margin-bottom: 1.2rem; text-align: justify; }
        ul, ol { margin: 1rem 0 1.5rem 2rem; }
        li { margin-bottom: 0.6rem; line-height: 1.8; }
        strong { color: #003057; font-weight: 600; }
        em { color: #555; font-style: italic; }
        code { background: #f4f6f9; color: #d63384; padding: 3px 8px; border-radius: 4px; font-family: 'Courier New', monospace; font-size: 0.9em; }
        blockquote { border-left: 4px solid #005792; background: #f8f9fa; padding: 1rem 1.5rem; margin: 1.5rem 0; font-style: italic; color: #555; }
        .footer { background: #f8f9fa; border-top: 1px solid #e0e0e0; padding: 30px 50px; text-align: center; color: #666; font-size: 0.9rem; }
        .footer-meta { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; margin-bottom: 15px; }
        .footer-logo { font-weight: 700; color: #003057; font-size: 1.1rem; }
        .footer-date { color: #888; }
        .copyright { color: #999; font-size: 0.85rem; margin-top: 10px; }
        @media print { body { background: white; padding: 0; } .container { box-shadow: none; border-radius: 0; } }
        @media (max-width: 768px) { .header, .content, .footer { padding: 30px 25px; } h1 { font-size: 1.6rem; } h2 { font-size: 1.3rem; } h3 { font-size: 1.1rem; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 530.27 257.98" preserveAspectRatio="xMidYMid meet" style="max-width: 280px; width: 100%; height: auto; display: block; margin-bottom: 15px;">
                <defs>
                    <style>
                        .logo-cls-1 { fill: #003882; }
                        .logo-cls-2 { fill: #fff; }
                        .logo-cls-3 { fill: #e2001a; }
                    </style>
                </defs>
                <rect class="logo-cls-1" y="137.09" width="530.27" height="120.89"/>
                <g>
                    <path class="logo-cls-2" d="M363.49,330.79c0,7.1.91,11.57,5.64,11.57,4.43,0,5-5.29,5-11.9v-4h19.68V329c0,19.5-8.24,31.24-24.72,31.24-17.85,0-27-12.73-27-36.37v-3.63c0-23.64,9.16-36.37,27-36.37,16.48,0,24.72,11.74,24.72,31.24v2.48H374.17v-4c0-6.61-.61-11.9-5-11.9-4.73,0-5.64,4.46-5.64,11.57Z" transform="translate(-162.1 -124.6)"/>
                    <path class="logo-cls-2" d="M426.2,301.53c-4.58,0-5.65,4.3-5.65,12.73h11c0-8.43-.92-12.73-5.34-12.73m-26.86,18.68c0-21,7.48-36.37,26.86-36.37,19.22,0,25.93,15.21,25.93,36.21v7.59H420.55V331c0,7.11,1.07,11.57,5.95,11.57,4,0,5.49-3,5.49-8.43v-1.65h19.69v1.16c0,15.7-9,26.61-24.87,26.61-18.61,0-27.47-12.9-27.47-36.36Z" transform="translate(-162.1 -124.6)"/>
                    <path class="logo-cls-2" d="M486.71,327.15l-4,2.81c-3.51,2.31-5.95,4.13-5.95,8.26,0,3.14,1.68,5,4.42,5,3.82,0,5.5-3.8,5.5-8.93Zm20.75,13.06c0,2.15.45,3.14,2.29,3.14a8.7,8.7,0,0,0,2.59-.5v13.72A17.7,17.7,0,0,1,501.5,360c-6.25,0-11.14-3-13.27-9.26-2.29,5.62-7.93,9.26-14.8,9.26-11.29,0-16.93-7.77-16.93-18,0-11.91,7.63-17.36,18.92-24l11.29-6.61V309c0-4.3-.61-7.28-4.13-7.28s-4.26,3.31-4.26,7.28v3.47H458.63v-4c0-14.54,7.63-24.63,24.57-24.63,16.33,0,24.26,8.93,24.26,26.45Z" transform="translate(-162.1 -124.6)"/>
                </g>
                <polygon class="logo-cls-3" points="0 0 530.27 0 530.27 137.26 0 137.26 0 0 0 0"/>
                <path class="logo-cls-2" d="M644.64,152.76v81.13h19.57V152.76Zm-44.27,81.13H640.2V219.52H620.05V152.76H600.37v81.13Zm-45.62,0h39.83V219.52H574.43V152.76H554.75v81.13Zm-47.06-81.13v81.13h41.78V219.52H527.26V200h21V185.5h-21V167.12h22.21V152.76Zm-59.46,81.13H467.8V200h13.62v33.91H501V152.76H481.42V185.5H467.8V152.76H448.23v81.13ZM363.3,152.76v81.13h19.57V152.76Zm-86.21,49H266.21l5.5-36.08,5.38,36.08Zm-35,32.18h19.11l2.86-18.5h15l2.75,18.5h19.11l-16.36-81.13h-26.1l-16.36,81.13Zm98.23-28.5-16.93-52.63H304v81.13h16.48V181l16.82,52.87H357V152.76H340.3v52.63Zm47.94-11.73c0-5.37,0-10.18.44-15.12a42.68,42.68,0,0,1,3.11-13.64c3.66-8.18,11-13.42,25.14-13.42,17.82,0,25,10.1,24.35,27.84l0,.93H422.86v-1c0-10.92-2-13.79-5.93-13.79-8.29,0-9.72,7-9.72,28.17s1.43,28.16,9.72,28.16c3.28,0,4.89-2,5.75-5.12a26.24,26.24,0,0,0,.77-5.15c.12-1.83.14-3.64.2-5.22l0-.94h18.49v1c0,22-8.94,29.48-25.24,29.48-14.16,0-21.49-5.3-25.14-13.5a42.93,42.93,0,0,1-3.11-13.65c-.44-4.93-.44-9.72-.44-15ZM193.5,167.12H218L190,218v15.86h49V219.52H210.21l28-50.68V152.76H193.5v14.36Z" transform="translate(-162.1 -124.6)"/>
            </svg>
            <h1>${analysis.materia || 'Analisi Manuale'} - ${analysis.volumeName}</h1>
            <div class="subtitle">Report professionale per promotori editoriali</div>
        </div>
        <div class="content">${htmlContent}</div>
        <div class="footer">
            <div class="footer-meta">
                <div class="footer-logo">📚 ZANICHELLI EDITORE</div>
                <div class="footer-date"><strong>Generato:</strong> ${dataOggi}</div>
            </div>
            <div class="copyright">
                © ${new Date().getFullYear()} MAP - Manual Analyses Platform | Documento professionale
            </div>
        </div>
    </div>
</body>
</html>`;
        
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const date = new Date(analysis.timestamp).toISOString().slice(0,10);
        a.href = url;
        a.download = `Analisi_${analysis.frameworkName.replace('.csv', '')}_${date}.html`;
        a.click();
        URL.revokeObjectURL(url);
        
        showNotification('success', '✅ HTML Professionale esportato!');
        
    } catch (error) {
        console.error('Errore export HTML:', error);
        showNotification('error', 'Errore nell\'export HTML');
    }
}

async function exportSingleAnalysisPDF(id) {
    toggleExportMenu(id); // Chiudi menu
    showNotification('info', '📄 Generazione PDF in corso...');
    
    try {
        const analyses = await getSavedAnalyses();
        const analysis = analyses.find(a => a.id === id);
        
        if (!analysis) {
            showNotification('error', 'Analisi non trovata');
            return;
        }
        
        // Crea container temporaneo
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.width = '210mm';
        tempContainer.style.background = 'white';
        tempContainer.style.padding = '20mm';
        document.body.appendChild(tempContainer);
        
        const htmlContent = marked.parse(analysis.results);
        const dataOggi = new Date(analysis.timestamp).toLocaleDateString('it-IT', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        
        tempContainer.innerHTML = `
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: Arial, sans-serif; }
                .pdf-header { background: linear-gradient(135deg, #003057 0%, #005792 100%); color: white; padding: 30px; margin: -20mm -20mm 30px -20mm; }
                .pdf-logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; letter-spacing: 2px; }
                .pdf-content { color: #1a1a1a; line-height: 1.6; font-size: 11pt; }
                .pdf-content h1 { color: #003057; font-size: 20pt; margin: 20px 0 12px; padding-bottom: 8px; border-bottom: 3px solid #005792; }
                .pdf-content h2 { color: #005792; font-size: 16pt; margin: 18px 0 10px; padding-bottom: 5px; border-bottom: 2px solid #e0e0e0; }
                .pdf-content h3 { color: #00689d; font-size: 13pt; margin: 15px 0 8px; }
                .pdf-content p { margin-bottom: 10px; text-align: justify; }
                .pdf-content ul, .pdf-content ol { margin: 10px 0 12px 25px; }
                .pdf-content li { margin-bottom: 6px; }
                .pdf-content strong { color: #003057; font-weight: 600; }
                .pdf-footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 9pt; color: #666; }
            </style>
            <div class="pdf-header">
                <div style="margin-bottom: 20px;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 530.27 257.98" preserveAspectRatio="xMidYMid meet" style="max-width: 220px; width: 100%; height: auto; display: block;">
                    <defs><style>.logo-cls-1{fill:#003882}.logo-cls-2{fill:#fff}.logo-cls-3{fill:#e2001a}</style></defs>
                    <rect class="logo-cls-1" y="137.09" width="530.27" height="120.89"/>
                    <g><path class="logo-cls-2" d="M363.49,330.79c0,7.1.91,11.57,5.64,11.57,4.43,0,5-5.29,5-11.9v-4h19.68V329c0,19.5-8.24,31.24-24.72,31.24-17.85,0-27-12.73-27-36.37v-3.63c0-23.64,9.16-36.37,27-36.37,16.48,0,24.72,11.74,24.72,31.24v2.48H374.17v-4c0-6.61-.61-11.9-5-11.9-4.73,0-5.64,4.46-5.64,11.57Z" transform="translate(-162.1 -124.6)"/><path class="logo-cls-2" d="M426.2,301.53c-4.58,0-5.65,4.3-5.65,12.73h11c0-8.43-.92-12.73-5.34-12.73m-26.86,18.68c0-21,7.48-36.37,26.86-36.37,19.22,0,25.93,15.21,25.93,36.21v7.59H420.55V331c0,7.11,1.07,11.57,5.95,11.57,4,0,5.49-3,5.49-8.43v-1.65h19.69v1.16c0,15.7-9,26.61-24.87,26.61-18.61,0-27.47-12.9-27.47-36.36Z" transform="translate(-162.1 -124.6)"/><path class="logo-cls-2" d="M486.71,327.15l-4,2.81c-3.51,2.31-5.95,4.13-5.95,8.26,0,3.14,1.68,5,4.42,5,3.82,0,5.5-3.8,5.5-8.93Zm20.75,13.06c0,2.15.45,3.14,2.29,3.14a8.7,8.7,0,0,0,2.59-.5v13.72A17.7,17.7,0,0,1,501.5,360c-6.25,0-11.14-3-13.27-9.26-2.29,5.62-7.93,9.26-14.8,9.26-11.29,0-16.93-7.77-16.93-18,0-11.91,7.63-17.36,18.92-24l11.29-6.61V309c0-4.3-.61-7.28-4.13-7.28s-4.26,3.31-4.26,7.28v3.47H458.63v-4c0-14.54,7.63-24.63,24.57-24.63,16.33,0,24.26,8.93,24.26,26.45Z" transform="translate(-162.1 -124.6)"/></g>
                    <polygon class="logo-cls-3" points="0 0 530.27 0 530.27 137.26 0 137.26 0 0 0 0"/>
                    <path class="logo-cls-2" d="M644.64,152.76v81.13h19.57V152.76Zm-44.27,81.13H640.2V219.52H620.05V152.76H600.37v81.13Zm-45.62,0h39.83V219.52H574.43V152.76H554.75v81.13Zm-47.06-81.13v81.13h41.78V219.52H527.26V200h21V185.5h-21V167.12h22.21V152.76Zm-59.46,81.13H467.8V200h13.62v33.91H501V152.76H481.42V185.5H467.8V152.76H448.23v81.13ZM363.3,152.76v81.13h19.57V152.76Zm-86.21,49H266.21l5.5-36.08,5.38,36.08Zm-35,32.18h19.11l2.86-18.5h15l2.75,18.5h19.11l-16.36-81.13h-26.1l-16.36,81.13Zm98.23-28.5-16.93-52.63H304v81.13h16.48V181l16.82,52.87H357V152.76H340.3v52.63Zm47.94-11.73c0-5.37,0-10.18.44-15.12a42.68,42.68,0,0,1,3.11-13.64c3.66-8.18,11-13.42,25.14-13.42,17.82,0,25,10.1,24.35,27.84l0,.93H422.86v-1c0-10.92-2-13.79-5.93-13.79-8.29,0-9.72,7-9.72,28.17s1.43,28.16,9.72,28.16c3.28,0,4.89-2,5.75-5.12a26.24,26.24,0,0,0,.77-5.15c.12-1.83.14-3.64.2-5.22l0-.94h18.49v1c0,22-8.94,29.48-25.24,29.48-14.16,0-21.49-5.3-25.14-13.5a42.93,42.93,0,0,1-3.11-13.65c-.44-4.93-.44-9.72-.44-15ZM193.5,167.12H218L190,218v15.86h49V219.52H210.21l28-50.68V152.76H193.5v14.36Z" transform="translate(-162.1 -124.6)"/>
                </svg>
                </div>
                <div style="font-size: 18px; font-weight: 600; margin-top: 10px;">
                    ${analysis.titolo || analysis.materia || 'Analisi Manuale'}
                </div>
                <div style="font-size: 14px; opacity: 0.9; margin-top: 5px;">
                    ${analysis.autore ? '👤 ' + analysis.autore : ''} 
                    ${analysis.editore ? '• 🏢 ' + analysis.editore : ''}
                    ${(!analysis.autore && !analysis.editore) ? 'Report professionale per promotori editoriali' : ''}
                </div>
            </div>
            <div class="pdf-content">${htmlContent}</div>
            <div class="pdf-footer">
                <div style="font-weight: 600; color: #003057; margin-bottom: 5px;">📚 ZANICHELLI EDITORE</div>
                <div>Generato il ${dataOggi}</div>
                <div style="font-size: 8pt; color: #999; margin-top: 8px;">© ${new Date().getFullYear()} MAP - Manual Analyses Platform | Documento professionale</div>
            </div>
        `;
        
        const canvas = await html2canvas(tempContainer, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });
        
        document.body.removeChild(tempContainer);
        
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        const date = new Date(analysis.timestamp).toISOString().slice(0,10);
        const fileName = `Analisi_${analysis.frameworkName.replace('.csv', '')}_${date}.pdf`;
        pdf.save(fileName);
        
        showNotification('success', '✅ PDF Professionale esportato!');
        
    } catch (error) {
        console.error('Errore export PDF:', error);
        showNotification('error', '❌ Errore nella generazione del PDF');
    }
}

async function viewAnalysisPrompt(id) {
    try {
        const analyses = await getSavedAnalyses();
        const analysis = analyses.find(a => a.id === id);
        
        if (analysis && analysis.prompt) {
            appState.lastPrompt = analysis.prompt;
            closeHistoryModal();
            showPromptModal();
        } else {
            showNotification('error', 'Prompt non disponibile per questa analisi');
        }
    } catch (error) {
        console.error('Errore visualizzazione prompt:', error);
    }
}

async function togglePubblica(id) {
    try {
        const analyses = await getSavedAnalyses();
        const analysis = analyses.find(a => a.id === id);
        
        if (!analysis) {
            showNotification('error', 'Analisi non trovata');
            return;
        }
        
        // Toggle stato pubblicata
        analysis.pubblicata = !analysis.pubblicata;
        
        // 1. Salva nel database locale IndexedDB
        if (!db) await initDatabase();
        const transaction = db.transaction(['analyses'], 'readwrite');
        const objectStore = transaction.objectStore('analyses');
        await objectStore.put(analysis);
        
        // 2. Sincronizza con Firebase Firestore
        if (firebaseInitialized) {
            try {
                const docId = id.toString();
                
                if (analysis.pubblicata) {
                    // PUBBLICA: Salva su Firestore
                    const dataToPublish = {
                        // Info base
                        materia: analysis.materia || 'Non specificata',
                        volumeName: analysis.volumeName || 'Volume senza nome',
                        frameworkName: analysis.frameworkName || 'Framework non specificato',
                        autore: analysis.autore || 'Autore non specificato',
                        editore: analysis.editore || 'Editore non specificato',
                        
                        // Risultati analisi
                        results: analysis.results || '',
                        
                        // Metadata
                        timestamp: analysis.timestamp || Date.now(),
                        analysisType: analysis.analysisType || 'A',
                        pubblicata: true,
                        
                        // Info aggiuntive per Viewer App
                        lastUpdated: Date.now(),
                        version: '1.8.1'
                    };
                    
                    await firestoreDb.collection('analyses').doc(docId).set(dataToPublish);
                    console.log('✅ Analisi pubblicata su Firebase:', docId);
                    showNotification('success', '🌐 Analisi pubblicata! Visibile nella galleria colleghi (sincronizzata con Firebase)');
                    
                } else {
                    // RENDI PRIVATA: Rimuovi da Firestore
                    await firestoreDb.collection('analyses').doc(docId).delete();
                    console.log('🔒 Analisi rimossa da Firebase:', docId);
                    showNotification('info', '🔒 Analisi resa privata (rimossa da Firebase)');
                }
                
            } catch (firebaseError) {
                console.error('⚠️ Errore sincronizzazione Firebase:', firebaseError);
                showNotification('warning', '⚠️ Salvato localmente, ma errore sincronizzazione cloud: ' + firebaseError.message);
            }
        } else {
            // Firebase non disponibile
            if (analysis.pubblicata) {
                showNotification('warning', '⚠️ Analisi salvata localmente, ma Firebase non disponibile per sincronizzazione cloud');
            } else {
                showNotification('info', '🔒 Analisi resa privata localmente');
            }
        }
        
        // Ricarica lo storico per aggiornare il pulsante
        showHistoryModal();
        
        // Aggiorna badge Firebase dopo operazione riuscita
        if (firebaseInitialized) {
            setTimeout(() => updateFirebaseStatusUI(), 500);
        }
        
    } catch (error) {
        console.error('Errore toggle pubblica:', error);
        showNotification('error', 'Errore nel cambio stato pubblicazione: ' + error.message);
    }
}

async function deleteAndRefresh(id) {
    if (confirm('Sei sicuro di voler eliminare questa analisi?')) {
        try {
            await deleteAnalysis(id);
            showHistoryModal(); // Ricarica la lista
            updateHistoryCount();
        } catch (error) {
            console.error('Errore eliminazione:', error);
        }
    }
}

// Wrapper per prendere materia dal data-attribute
function editMateriaFromButton(button) {
    // Risale al parent div che ha data-materia
    const materiaDiv = button.closest('[data-materia]');
    if (!materiaDiv) {
        console.error('Div materia non trovato');
        showNotification('error', 'Errore: elemento non trovato');
        return;
    }
    const oldMateria = materiaDiv.getAttribute('data-materia');
    console.log('Materia trovata da data-attribute:', oldMateria);
    editMateria(oldMateria);
}

// Modifica materia per tutte le analisi di una materia
async function editMateria(oldMateria) {
    console.log('editMateria chiamata con:', oldMateria);
    
    const newMateria = prompt(`Modifica materia da "${oldMateria}" a:`, oldMateria);
    
    if (!newMateria || newMateria.trim() === '' || newMateria === oldMateria) {
        return; // Cancellato o uguale
    }
    
    try {
        const analyses = await getSavedAnalyses();
        console.log('Tutte le analisi:', analyses);
        console.log('Cerco analisi con materia:', oldMateria);
        
        const toUpdate = analyses.filter(a => {
            // Gestisci analisi vecchie senza campo materia
            const materiaAnalisi = a.materia || 'Altra Materia';
            console.log('Analisi materia:', materiaAnalisi, 'Cerca:', oldMateria, 'Match:', materiaAnalisi === oldMateria);
            return materiaAnalisi === oldMateria;
        });
        
        console.log('Analisi da aggiornare:', toUpdate.length);
        
        if (toUpdate.length === 0) {
            showNotification('error', `Nessuna analisi trovata per "${oldMateria}"`);
            return;
        }
        
        if (confirm(`Modificare la materia per ${toUpdate.length} analisi da "${oldMateria}" a "${newMateria}"?`)) {
            if (!db) await initDatabase();
            
            const transaction = db.transaction(['analyses'], 'readwrite');
            const objectStore = transaction.objectStore('analyses');
            
            // Aggiorna tutte le analisi
            for (const analysis of toUpdate) {
                analysis.materia = newMateria.trim();
                await objectStore.put(analysis);
            }
            
            showNotification('success', `✅ ${toUpdate.length} analisi aggiornate!`);
            showHistoryModal(); // Ricarica
            updateHistoryCount();
        }
    } catch (error) {
        console.error('Errore modifica materia:', error);
        showNotification('error', 'Errore nella modifica della materia');
    }
}

async function clearAllHistory() {
    const analyses = await getSavedAnalyses();
    if (analyses.length === 0) {
        showNotification('error', 'Nessuna analisi da eliminare');
        return;
    }
    
    if (confirm(`Sei sicuro di voler eliminare TUTTE le ${analyses.length} analisi salvate? Questa azione non può essere annullata.`)) {
        try {
            if (!db) await initDatabase();
            
            const transaction = db.transaction(['analyses'], 'readwrite');
            const objectStore = transaction.objectStore('analyses');
            const request = objectStore.clear();
            
            request.onsuccess = () => {
                showNotification('success', 'Tutte le analisi sono state eliminate');
                closeHistoryModal();
                updateHistoryCount();
            };
            
            request.onerror = () => {
                showNotification('error', 'Errore nell\'eliminazione');
            };
        } catch (error) {
            console.error('Errore clear all:', error);
            showNotification('error', 'Errore nell\'eliminazione');
        }
    }
}

async function exportAllAnalyses() {
    try {
        const analyses = await getSavedAnalyses();
        
        if (analyses.length === 0) {
            showNotification('error', 'Nessuna analisi da esportare');
            return;
        }
        
        // Crea un documento markdown con tutte le analisi
        let allContent = '# Storico Analisi - Zanichelli\n\n';
        allContent += `Esportato il: ${new Date().toLocaleString('it-IT')}\n\n`;
        allContent += `Totale analisi: ${analyses.length}\n\n`;
        allContent += '---\n\n';
        
        analyses.sort((a, b) => b.timestamp - a.timestamp).forEach((analysis, index) => {
            allContent += `## Analisi ${index + 1}\n\n`;
            allContent += `**Framework**: ${analysis.frameworkName}\n`;
            allContent += `**Volume**: ${analysis.volumeName}\n`;
            allContent += `**Tipo**: ${analysis.analysisType === 'A' ? 'Generale' : 'Per Classi di Laurea'}\n`;
            allContent += `**Data**: ${new Date(analysis.timestamp).toLocaleString('it-IT')}\n\n`;
            allContent += '### Risultati\n\n';
            allContent += analysis.results;
            allContent += '\n\n---\n\n';
        });
        
        const blob = new Blob([allContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `storico_completo_${new Date().toISOString().slice(0,10)}.md`;
        a.click();
        URL.revokeObjectURL(url);
        
        showNotification('success', `${analyses.length} analisi esportate!`);
    } catch (error) {
        console.error('Errore export all:', error);
        showNotification('error', 'Errore nell\'export');
    }
}

// Aggiorna contatore quando salvi un'analisi
const originalSaveAnalysis = saveAnalysis;
window.saveAnalysis = async function(...args) {
    const result = await originalSaveAnalysis.apply(this, args);
    updateHistoryCount();
    return result;
};

// ====================
// CONFRONTO SIDE-BY-SIDE
// ====================

let selectedForComparison = [];

function toggleCompareSelection(id) {
    const checkbox = document.getElementById(`compare-${id}`);
    
    if (checkbox.checked) {
        if (selectedForComparison.length >= 2) {
            // Deseleziona il primo elemento selezionato
            const firstId = selectedForComparison.shift();
            const firstCheckbox = document.getElementById(`compare-${firstId}`);
            if (firstCheckbox) firstCheckbox.checked = false;
        }
        selectedForComparison.push(id);
    } else {
        selectedForComparison = selectedForComparison.filter(selectedId => selectedId !== id);
    }
    
    updateCompareButton();
}

function updateCompareButton() {
    const compareBtn = document.getElementById('compareBtn');
    const compareCount = document.getElementById('compareCount');
    const count = selectedForComparison.length;
    
    compareCount.textContent = count;
    compareBtn.disabled = count !== 2;
    
    if (count === 2) {
        compareBtn.classList.remove('bg-gray-400', 'cursor-not-allowed');
        compareBtn.classList.add('bg-orange-600', 'hover:bg-orange-700');
    } else {
        compareBtn.classList.remove('bg-orange-600', 'hover:bg-orange-700');
        compareBtn.classList.add('bg-gray-400', 'cursor-not-allowed');
    }
}

async function showCompareModal() {
    if (selectedForComparison.length !== 2) {
        showNotification('error', 'Seleziona esattamente 2 analisi da confrontare');
        return;
    }
    
    try {
        const analyses = await getSavedAnalyses();
        const analysis1 = analyses.find(a => a.id === selectedForComparison[0]);
        const analysis2 = analyses.find(a => a.id === selectedForComparison[1]);
        
        if (!analysis1 || !analysis2) {
            showNotification('error', 'Errore nel caricamento delle analisi');
            return;
        }
        
        const modal = document.getElementById('compareModal');
        const content = document.getElementById('compareContent');
        
        // Genera HTML confronto con colonne scrollabili sincronizzate
        content.innerHTML = `
            <!-- Analisi 1 -->
            <div class="border-r border-gray-300 pr-6 overflow-y-auto" id="compareColumn1" style="max-height: 60vh;">
                <div class="sticky top-0 bg-white pb-4 mb-4 border-b-2 border-blue-600 z-10">
                    <h4 class="text-lg font-bold text-blue-900 mb-2">
                        <span class="bg-blue-600 text-white px-3 py-1 rounded-full text-xs mr-2">1</span>
                        ${analysis1.materia || 'Altra Materia'}
                    </h4>
                    <p class="text-sm font-medium text-gray-700">${analysis1.volumeName}</p>
                    <p class="text-xs text-gray-500">${analysis1.analysisType === 'A' ? 'Analisi Generale' : 'Analisi Comparativa per Classi'}</p>
                    <p class="text-xs text-gray-400">${new Date(analysis1.timestamp).toLocaleDateString('it-IT')}</p>
                </div>
                <div class="prose prose-sm max-w-none result-section">
                    ${marked.parse(analysis1.results)}
                </div>
            </div>
            
            <!-- Analisi 2 -->
            <div class="pl-6 overflow-y-auto" id="compareColumn2" style="max-height: 60vh;">
                <div class="sticky top-0 bg-white pb-4 mb-4 border-b-2 border-green-600 z-10">
                    <h4 class="text-lg font-bold text-green-900 mb-2">
                        <span class="bg-green-600 text-white px-3 py-1 rounded-full text-xs mr-2">2</span>
                        ${analysis2.materia || 'Altra Materia'}
                    </h4>
                    <p class="text-sm font-medium text-gray-700">${analysis2.volumeName}</p>
                    <p class="text-xs text-gray-500">${analysis2.analysisType === 'A' ? 'Analisi Generale' : 'Analisi Comparativa per Classi'}</p>
                    <p class="text-xs text-gray-400">${new Date(analysis2.timestamp).toLocaleDateString('it-IT')}</p>
                </div>
                <div class="prose prose-sm max-w-none result-section">
                    ${marked.parse(analysis2.results)}
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
        closeHistoryModal();
        
        // Attiva sincronizzazione scroll
        setupScrollSync();
    } catch (error) {
        console.error('Errore confronto:', error);
        showNotification('error', 'Errore nel confronto delle analisi');
    }
}

function closeCompareModal() {
    document.getElementById('compareModal').classList.add('hidden');
    
    // Rimuovi listener scroll per evitare memory leak
    const col1 = document.getElementById('compareColumn1');
    const col2 = document.getElementById('compareColumn2');
    if (col1) col1.onscroll = null;
    if (col2) col2.onscroll = null;
}

function resetCompareSelection() {
    // Azzera array selezione
    selectedForComparison = [];
    
    // Deseleziona tutte le checkbox nel modal storico
    document.querySelectorAll('.compare-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Chiudi il modal di confronto
    closeCompareModal();
    
    // Aggiorna il pulsante "Confronta" (disabilitalo se non ci sono 2 analisi)
    const compareBtn = document.getElementById('compareBtn');
    if (compareBtn) {
        compareBtn.disabled = true;
        compareBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
    
    showNotification('success', 'Selezione azzerata');
    console.log('Confronto azzerato');
}

function setupScrollSync() {
    const col1 = document.getElementById('compareColumn1');
    const col2 = document.getElementById('compareColumn2');
    
    if (!col1 || !col2) return;
    
    let isSyncing = false;
    
    // Sincronizza scroll da colonna 1 a colonna 2
    col1.onscroll = function() {
        if (isSyncing) return;
        isSyncing = true;
        
        // Calcola percentuale scroll
        const scrollPercentage = col1.scrollTop / (col1.scrollHeight - col1.clientHeight);
        
        // Applica stesso percentuale a colonna 2
        col2.scrollTop = scrollPercentage * (col2.scrollHeight - col2.clientHeight);
        
        setTimeout(() => { isSyncing = false; }, 10);
    };
    
    // Sincronizza scroll da colonna 2 a colonna 1
    col2.onscroll = function() {
        if (isSyncing) return;
        isSyncing = true;
        
        // Calcola percentuale scroll
        const scrollPercentage = col2.scrollTop / (col2.scrollHeight - col2.clientHeight);
        
        // Applica stesso percentuale a colonna 1
        col1.scrollTop = scrollPercentage * (col1.scrollHeight - col1.clientHeight);
        
        setTimeout(() => { isSyncing = false; }, 10);
    };
    
    console.log('✅ Scroll sync attivato per confronto');
}

async function exportCompare() {
    if (selectedForComparison.length !== 2) return;
    
    try {
        const analyses = await getSavedAnalyses();
        const analysis1 = analyses.find(a => a.id === selectedForComparison[0]);
        const analysis2 = analyses.find(a => a.id === selectedForComparison[1]);
        
        if (!analysis1 || !analysis2) return;
        
        // Genera HTML con layout side-by-side e scroll sincronizzato
        const htmlContent = `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confronto Analisi - MAP</title>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 1600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 32px;
            margin-bottom: 10px;
        }
        .header p {
            opacity: 0.9;
            font-size: 14px;
        }
        .comparison {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0;
            height: calc(100vh - 200px);
        }
        .comparison.print-mode {
            height: auto !important;
        }
        .column {
            overflow-y: auto;
            padding: 30px;
            border-right: 2px solid #e5e7eb;
        }
        .column.print-mode {
            overflow: visible !important;
            height: auto !important;
        }
        .column:last-child {
            border-right: none;
        }
        .column-header {
            position: sticky;
            top: 0;
            background: white;
            padding-bottom: 20px;
            margin-bottom: 20px;
            border-bottom: 3px solid #667eea;
            z-index: 10;
        }
        .column:last-child .column-header {
            border-bottom-color: #10b981;
        }
        .badge {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        .column:last-child .badge {
            background: #10b981;
        }
        /* Stile elementi editabili */
        .editable {
            border: 2px dashed #10b981 !important;
            padding: 8px !important;
            margin: 4px 0 !important;
            background: #f0fdf4 !important;
            border-radius: 4px;
            transition: all 0.2s;
        }
        .editable:hover {
            background: #dcfce7 !important;
            border-color: #059669 !important;
        }
        .editable:focus {
            outline: none;
            border-color: #059669 !important;
            background: #ffffff !important;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
        /* Spacer per allineamento automatico */
        .auto-spacer {
            height: 20px;
            background: repeating-linear-gradient(
                90deg,
                transparent,
                transparent 10px,
                rgba(139, 92, 246, 0.1) 10px,
                rgba(139, 92, 246, 0.1) 20px
            );
            border-top: 1px dashed rgba(139, 92, 246, 0.3);
            border-bottom: 1px dashed rgba(139, 92, 246, 0.3);
            margin: 5px 0;
            position: relative;
        }
        .auto-spacer::after {
            content: "↕️ auto-align";
            position: absolute;
            right: 5px;
            top: 2px;
            font-size: 10px;
            color: rgba(139, 92, 246, 0.6);
        }
        .column h2 {
            font-size: 24px;
            color: #1f2937;
            margin-bottom: 8px;
        }
        .meta {
            font-size: 13px;
            color: #6b7280;
            line-height: 1.6;
        }
        .content {
            color: #374151;
            line-height: 1.8;
        }
        .content h1 { font-size: 28px; margin: 30px 0 15px 0; color: #1f2937; }
        .content h2 { font-size: 24px; margin: 25px 0 12px 0; color: #374151; }
        .content h3 { font-size: 20px; margin: 20px 0 10px 0; color: #4b5563; }
        .content p { margin-bottom: 15px; }
        .content ul, .content ol { margin-left: 25px; margin-bottom: 15px; }
        .content li { margin-bottom: 8px; }
        .content strong { color: #1f2937; font-weight: 600; }
        .content code {
            background: #f3f4f6;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }
        .footer {
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            color: #6b7280;
            font-size: 13px;
            border-top: 1px solid #e5e7eb;
        }
        @media print {
            @page {
                size: A4 landscape;
                margin: 15mm;
            }
            
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            body { 
                background: white; 
                padding: 0;
                margin: 0;
            }
            
            .container { 
                box-shadow: none;
                max-width: 100%;
                border-radius: 0;
            }
            
            .header {
                padding: 15px;
                page-break-after: avoid;
            }
            
            /* Usa table display per stampa - funziona meglio di grid */
            .comparison { 
                display: table !important;
                width: 100% !important;
                height: auto !important;
                table-layout: fixed !important;
                border-collapse: collapse !important;
            }
            
            .column { 
                display: table-cell !important;
                width: 50% !important;
                overflow: visible !important;
                height: auto !important;
                max-height: none !important;
                padding: 10px !important;
                border-right: 1px solid #ddd !important;
                vertical-align: top !important;
            }
            
            .column:last-child {
                border-right: none !important;
            }
            
            .column-header {
                position: relative !important;
                page-break-after: avoid;
            }
            
            .content {
                page-break-before: avoid;
            }
            
            .content h1 { 
                font-size: 20px !important;
                page-break-after: avoid;
            }
            
            .content h2 { 
                font-size: 16px !important;
                page-break-after: avoid;
            }
            
            .content h3 { 
                font-size: 14px !important;
                page-break-after: avoid;
            }
            
            .content p {
                font-size: 10px !important;
                line-height: 1.4 !important;
            }
            
            .footer {
                display: block !important;
                page-break-before: always;
                padding: 15px;
            }
            
            #printBtn, #editBtn, #saveBtn, #editInstructions, #autoAlignBtn {
                display: none !important;
            }
            
            /* Rimuovi stili editing in stampa */
            .editable {
                border: none !important;
                background: transparent !important;
                padding: 0 !important;
                margin: 0 !important;
            }
            
            /* Mantieni spacer ma rendili invisibili in stampa */
            .auto-spacer {
                background: none !important;
                border: none !important;
            }
            .auto-spacer::after {
                display: none !important;
            }
        }
        /* Scrollbar styling */
        .column::-webkit-scrollbar { width: 8px; }
        .column::-webkit-scrollbar-track { background: #f1f1f1; }
        .column::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
        }
        .column::-webkit-scrollbar-thumb:hover { background: #555; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Confronto Analisi Manuali</h1>
            <p>MAP - Manual Analyses Platform | Esportato il ${new Date().toLocaleString('it-IT')}</p>
        </div>
        
        <div class="comparison">
            <!-- Colonna 1 -->
            <div class="column" id="col1">
                <div class="column-header">
                    <span class="badge">ANALISI 1</span>
                    <h2>${analysis1.materia || 'Altra Materia'}</h2>
                    <div class="meta">
                        <strong>Volume:</strong> ${analysis1.volumeName}<br>
                        <strong>Tipo:</strong> ${analysis1.analysisType === 'A' ? 'Analisi Generale' : 'Analisi Comparativa per Classi'}<br>
                        <strong>Data:</strong> ${new Date(analysis1.timestamp).toLocaleString('it-IT')}
                    </div>
                </div>
                <div class="content" id="content1"></div>
            </div>
            
            <!-- Colonna 2 -->
            <div class="column" id="col2">
                <div class="column-header">
                    <span class="badge">ANALISI 2</span>
                    <h2>${analysis2.materia || 'Altra Materia'}</h2>
                    <div class="meta">
                        <strong>Volume:</strong> ${analysis2.volumeName}<br>
                        <strong>Tipo:</strong> ${analysis2.analysisType === 'A' ? 'Analisi Generale' : 'Analisi Comparativa per Classi'}<br>
                        <strong>Data:</strong> ${new Date(analysis2.timestamp).toLocaleString('it-IT')}
                    </div>
                </div>
                <div class="content" id="content2"></div>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>MAP - Manual Analyses Platform</strong> v1.15.2</p>
            <p style="margin-top: 15px; margin-bottom: 15px;">
                <button id="autoAlignBtn" onclick="autoAlignSections()" style="background: #8b5cf6; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; margin-right: 10px;">
                    🎯 Auto-Allinea Sezioni
                </button>
                <button id="editBtn" onclick="toggleEditMode()" style="background: #10b981; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; margin-right: 10px;">
                    📝 Modalità Modifica
                </button>
                <button id="saveBtn" onclick="saveModifiedHTML()" style="background: #f59e0b; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; margin-right: 10px; display: none;">
                    💾 Salva HTML Modificato
                </button>
                <button id="printBtn" onclick="prepareAndPrint()" style="background: #667eea; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600;">
                    🖨️ Stampa PDF
                </button>
            </p>
            <p id="editInstructions" style="font-size: 12px; color: #10b981; margin-top: 8px; display: none; font-weight: 600;">
                ✏️ Modalità editing attiva: <strong>Clicca</strong> per modificare testo | <strong>Passa il mouse</strong> per controlli avanzati (⬆️⬇️ sposta, ➕ aggiungi spazio, 🗑️ rimuovi)
            </p>
            <p style="font-size: 11px; color: #888; margin-top: 8px;">
                Usa "Modalità Modifica" per allineare i contenuti manualmente, poi "Stampa PDF" per salvare
            </p>
        </div>
    </div>
    
    <script>
        // Render markdown content
        document.getElementById('content1').innerHTML = marked.parse(\`${analysis1.results.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`);
        document.getElementById('content2').innerHTML = marked.parse(\`${analysis2.results.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`);
        
        // Scroll sincronizzato proporzionale (RIPRISTINATO - v1.14.3 funzionante)
        const col1 = document.getElementById('col1');
        const col2 = document.getElementById('col2');
        let isSyncing = false;
        
        col1.addEventListener('scroll', function() {
            if (isSyncing) return;
            isSyncing = true;
            const scrollPercentage = col1.scrollTop / (col1.scrollHeight - col1.clientHeight);
            col2.scrollTop = scrollPercentage * (col2.scrollHeight - col2.clientHeight);
            setTimeout(() => { isSyncing = false; }, 10);
        });
        
        col2.addEventListener('scroll', function() {
            if (isSyncing) return;
            isSyncing = true;
            const scrollPercentage = col2.scrollTop / (col2.scrollHeight - col2.clientHeight);
            col1.scrollTop = scrollPercentage * (col1.scrollHeight - col1.clientHeight);
            setTimeout(() => { isSyncing = false; }, 10);
        });
        
        console.log('Confronto caricato. Scroll sincronizzato proporzionale attivo.');
        
        // Carica modifiche salvate (se esistono)
        loadSavedEdits();
        
        // Stato editing
        let editModeActive = false;
        let currentEditControls = null;
        
        // Funzione per caricare modifiche salvate
        function loadSavedEdits() {
            const storageKey = 'map_edits_' + window.location.pathname;
            const savedEdits = localStorage.getItem(storageKey);
            
            if (savedEdits) {
                try {
                    const edits = JSON.parse(savedEdits);
                    
                    // Ripristina contenuto modificato
                    if (edits.content1) {
                        document.getElementById('content1').innerHTML = edits.content1;
                    }
                    if (edits.content2) {
                        document.getElementById('content2').innerHTML = edits.content2;
                    }
                    
                    console.log('✅ Modifiche precedenti caricate da localStorage');
                    
                    // Mostra notifica
                    setTimeout(() => {
                        if (confirm('Ho trovato modifiche precedenti salvate. Vuoi mantenerle?\\n\\nClicca OK per mantenerle, Annulla per ricominciare da zero.')) {
                            console.log('Modifiche mantenute');
                        } else {
                            // Rimuovi modifiche salvate
                            localStorage.removeItem(storageKey);
                            location.reload();
                        }
                    }, 500);
                } catch (e) {
                    console.error('Errore caricamento modifiche:', e);
                }
            }
        }
        
        // Funzione per salvare modifiche correnti
        function saveCurrentEdits() {
            const storageKey = 'map_edits_' + window.location.pathname;
            const edits = {
                content1: document.getElementById('content1').innerHTML,
                content2: document.getElementById('content2').innerHTML,
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem(storageKey, JSON.stringify(edits));
            console.log('💾 Modifiche salvate in localStorage');
        }
        
        // Funzione per attivare/disattivare modalità editing
        function toggleEditMode() {
            editModeActive = !editModeActive;
            const editBtn = document.getElementById('editBtn');
            const saveBtn = document.getElementById('saveBtn');
            const instructions = document.getElementById('editInstructions');
            
            // Seleziona tutti gli elementi editabili (paragrafi, titoli, liste)
            const editableElements = document.querySelectorAll('.content p, .content h2, .content h3, .content li');
            
            if (editModeActive) {
                // ATTIVA editing
                editBtn.textContent = '✅ Esci da Modifica';
                editBtn.style.background = '#ef4444';
                saveBtn.style.display = 'inline-block';
                instructions.style.display = 'block';
                
                editableElements.forEach(el => {
                    el.contentEditable = true;
                    el.classList.add('editable');
                    el.title = 'Clicca per modificare | Passa il mouse per controlli avanzati';
                    
                    // Aggiungi event listener per mostrare controlli
                    el.addEventListener('mouseenter', function() {
                        showEditControls(this);
                    });
                    
                    // Nascondi controlli quando esci dall'elemento (con delay)
                    el.addEventListener('mouseleave', function() {
                        window.hideControlsTimeout = setTimeout(() => {
                            hideEditControls();
                        }, 300);
                    });
                });
                
                console.log('✏️ Modalità editing ATTIVATA - ' + editableElements.length + ' elementi editabili');
            } else {
                // DISATTIVA editing
                editBtn.textContent = '📝 Modalità Modifica';
                editBtn.style.background = '#10b981';
                saveBtn.style.display = 'none';
                instructions.style.display = 'none';
                
                editableElements.forEach(el => {
                    el.contentEditable = false;
                    el.classList.remove('editable');
                    el.removeAttribute('title');
                });
                
                // Salva automaticamente le modifiche
                saveCurrentEdits();
                
                console.log('❌ Modalità editing DISATTIVATA + modifiche salvate');
            }
        }
        
        // === EDITING MANUALE AVANZATO ===
        
        // Mostra controlli editing quando si passa il mouse su un elemento
        function showEditControls(element) {
            if (!editModeActive) return;
            
            // Rimuovi controlli precedenti
            hideEditControls();
            
            // Crea pannello controlli
            const controls = document.createElement('div');
            controls.className = 'edit-controls';
            controls.style.cssText = 'position: absolute; background: white; border: 2px solid #8b5cf6; border-radius: 8px; padding: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 10000; display: flex; gap: 5px;';
            
            // Pulsante: Sposta Su
            const btnUp = document.createElement('button');
            btnUp.innerHTML = '⬆️';
            btnUp.title = 'Sposta questo elemento verso l\'alto';
            btnUp.style.cssText = 'padding: 6px 12px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;';
            btnUp.onclick = () => moveElementUp(element);
            
            // Pulsante: Sposta Giù
            const btnDown = document.createElement('button');
            btnDown.innerHTML = '⬇️';
            btnDown.title = 'Sposta questo elemento verso il basso';
            btnDown.style.cssText = 'padding: 6px 12px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;';
            btnDown.onclick = () => moveElementDown(element);
            
            // Pulsante: Aggiungi Spazio Sopra
            const btnSpace = document.createElement('button');
            btnSpace.innerHTML = '➕ Spazio';
            btnSpace.title = 'Aggiungi spazio vuoto sopra questo elemento';
            btnSpace.style.cssText = 'padding: 6px 12px; background: #8b5cf6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold;';
            btnSpace.onclick = () => addSpaceAbove(element);
            
            // Pulsante: Rimuovi Elemento
            const btnDelete = document.createElement('button');
            btnDelete.innerHTML = '🗑️';
            btnDelete.title = 'Rimuovi questo elemento';
            btnDelete.style.cssText = 'padding: 6px 12px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;';
            btnDelete.onclick = () => {
                if (confirm('Vuoi davvero rimuovere questo elemento?')) {
                    element.remove();
                    hideEditControls();
                    saveCurrentEdits();
                }
            };
            
            controls.appendChild(btnUp);
            controls.appendChild(btnDown);
            controls.appendChild(btnSpace);
            controls.appendChild(btnDelete);
            
            // Mantieni controlli visibili quando ci passi sopra
            controls.addEventListener('mouseenter', function() {
                // Cancella timeout di nascondimento
                if (window.hideControlsTimeout) {
                    clearTimeout(window.hideControlsTimeout);
                }
            });
            
            controls.addEventListener('mouseleave', function() {
                window.hideControlsTimeout = setTimeout(() => {
                    hideEditControls();
                }, 300);
            });
            
            // Posiziona controlli sopra l'elemento
            document.body.appendChild(controls);
            const rect = element.getBoundingClientRect();
            controls.style.left = (rect.left + window.scrollX) + 'px';
            controls.style.top = (rect.top + window.scrollY - controls.offsetHeight - 5) + 'px';
            
            currentEditControls = controls;
            
            // Evidenzia elemento selezionato
            element.style.outline = '3px solid #8b5cf6';
            element.dataset.editSelected = 'true';
        }
        
        function hideEditControls() {
            if (currentEditControls) {
                currentEditControls.remove();
                currentEditControls = null;
            }
            
            // Rimuovi evidenziazione
            const selected = document.querySelector('[data-edit-selected="true"]');
            if (selected) {
                selected.style.outline = '';
                delete selected.dataset.editSelected;
            }
        }
        
        function moveElementUp(element) {
            const prev = element.previousElementSibling;
            if (prev) {
                element.parentNode.insertBefore(element, prev);
                saveCurrentEdits();
                console.log('⬆️ Elemento spostato verso l\'alto');
                // Riposiziona controlli
                setTimeout(() => showEditControls(element), 10);
            } else {
                alert('⚠️ Questo è già il primo elemento!');
            }
        }
        
        function moveElementDown(element) {
            const next = element.nextElementSibling;
            if (next) {
                element.parentNode.insertBefore(next, element);
                saveCurrentEdits();
                console.log('⬇️ Elemento spostato verso il basso');
                // Riposiziona controlli
                setTimeout(() => showEditControls(element), 10);
            } else {
                alert('⚠️ Questo è già l\'ultimo elemento!');
            }
        }
        
        function addSpaceAbove(element) {
            const spacer = document.createElement('div');
            spacer.className = 'manual-spacer';
            spacer.style.cssText = 'height: 40px; background: rgba(139, 92, 246, 0.1); border: 1px dashed #8b5cf6; margin: 5px 0; position: relative; cursor: pointer;';
            spacer.contentEditable = false;
            spacer.title = 'Spazio manuale (clicca per rimuovere)';
            
            // Aggiungi label
            const label = document.createElement('span');
            label.textContent = '[ Spazio 40px - clicca per rimuovere ]';
            label.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 11px; color: #8b5cf6; pointer-events: none;';
            spacer.appendChild(label);
            
            // Clicca per rimuovere
            spacer.onclick = function() {
                if (confirm('Rimuovere questo spazio?')) {
                    spacer.remove();
                    saveCurrentEdits();
                }
            };
            
            element.parentNode.insertBefore(spacer, element);
            saveCurrentEdits();
            console.log('➕ Spazio aggiunto sopra l\'elemento');
            hideEditControls();
        }
        
        // Funzione per salvare HTML modificato
        function saveModifiedHTML() {
            // Salva modifiche correnti
            saveCurrentEdits();
            
            // Disattiva modalità editing prima di salvare
            if (editModeActive) {
                toggleEditMode();
            }
            
            // Ottieni HTML completo della pagina
            const htmlContent = document.documentElement.outerHTML;
            
            // Crea blob e download
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Confronto_MAP_Modificato_' + new Date().toISOString().slice(0,10) + '.html';
            a.click();
            URL.revokeObjectURL(url);
            
            alert('✅ HTML modificato salvato!\\n\\nPuoi riaprire il file salvato per vedere le tue modifiche.');
            console.log('💾 HTML modificato salvato');
        }
        
        // Funzione per preparare e stampare
        function prepareAndPrint() {
            // Se editing è attivo, disattivalo prima di stampare
            if (editModeActive) {
                toggleEditMode();
            }
            
            // Aggiungi classe print-mode per espandere tutto
            document.querySelector('.comparison').classList.add('print-mode');
            document.querySelectorAll('.column').forEach(col => col.classList.add('print-mode'));
            
            // Nascondi pulsanti
            document.getElementById('printBtn').style.display = 'none';
            document.getElementById('editBtn').style.display = 'none';
            document.getElementById('saveBtn').style.display = 'none';
            
            // Attendi che il DOM si aggiorni, poi stampa
            setTimeout(function() {
                window.print();
                
                // Dopo la stampa, ripristina lo stato normale
                setTimeout(function() {
                    document.querySelector('.comparison').classList.remove('print-mode');
                    document.querySelectorAll('.column').forEach(col => col.classList.remove('print-mode'));
                    document.getElementById('printBtn').style.display = 'inline-block';
                    document.getElementById('editBtn').style.display = 'inline-block';
                }, 500);
            }, 500);
        }
        
        // Funzione per auto-allineamento strutturato
        function autoAlignSections() {
            console.log('🎯 Inizio auto-allineamento migliorato...');
            
            const content1 = document.getElementById('content1');
            const content2 = document.getElementById('content2');
            
            // Rimuovi spacer precedenti se esistono
            document.querySelectorAll('.auto-spacer').forEach(el => el.remove());
            
            // 1. Trova tutte le sezioni numerate in entrambe le analisi
            const sections1 = findNumberedSections(content1);
            const sections2 = findNumberedSections(content2);
            
            console.log('Sezioni trovate - Analisi 1:', sections1.length, 'Analisi 2:', sections2.length);
            
            let alignedSections = 0;
            let alignedModules = 0;
            let skippedSections = 0;
            
            // 2. Per ogni sezione in analisi 1, cerca corrispondente in analisi 2
            sections1.forEach((section1, index) => {
                // Cerca sezione corrispondente per numero
                let section2 = sections2.find(s => s.number === section1.number);
                
                // Se non trovata per numero, prova fuzzy matching sul titolo
                if (!section2 && sections2[index]) {
                    const similarity = calculateTitleSimilarity(section1.text, sections2[index].text);
                    if (similarity > 0.4) { // 40% di similarità minima
                        section2 = sections2[index];
                        console.log('⚠️ Fallback: allineamento fuzzy tra "' + section1.text + '" e "' + section2.text + '" (similarità: ' + Math.round(similarity * 100) + '%)');
                    }
                }
                
                if (section2) {
                    // Calcola differenza di altezza
                    const offset1 = section1.element.offsetTop;
                    const offset2 = section2.element.offsetTop;
                    const diff = offset1 - offset2;
                    
                    console.log('Sezione ' + section1.number + ': offset1=' + offset1 + ', offset2=' + offset2 + ', diff=' + diff);
                    
                    // Se analisi 2 è più in alto, aggiungi spacer
                    if (diff > 20) { // Soglia ridotta a 20px per allineamento più preciso
                        const spacerHeight = diff - 5; // -5px per margine
                        const spacer = document.createElement('div');
                        spacer.className = 'auto-spacer';
                        spacer.style.height = spacerHeight + 'px';
                        spacer.style.backgroundColor = 'rgba(139, 92, 246, 0.05)'; // Viola trasparente per debug visivo
                        spacer.style.borderTop = '1px dashed rgba(139, 92, 246, 0.2)';
                        spacer.title = 'Spazio automatico: ' + spacerHeight + 'px (Sezione ' + section1.number + ')';
                        
                        // Inserisci spacer prima del titolo in analisi 2
                        section2.element.parentNode.insertBefore(spacer, section2.element);
                        alignedSections++;
                        
                        console.log('✅ Aggiunto spacer di ' + spacerHeight + 'px prima della sezione ' + section2.number);
                    } else if (diff < -20) {
                        // Se analisi 1 è più in alto, aggiungi spacer in analisi 1
                        const spacerHeight = Math.abs(diff) - 5;
                        const spacer = document.createElement('div');
                        spacer.className = 'auto-spacer';
                        spacer.style.height = spacerHeight + 'px';
                        spacer.style.backgroundColor = 'rgba(139, 92, 246, 0.05)';
                        spacer.style.borderTop = '1px dashed rgba(139, 92, 246, 0.2)';
                        spacer.title = 'Spazio automatico: ' + spacerHeight + 'px (Sezione ' + section2.number + ')';
                        
                        section1.element.parentNode.insertBefore(spacer, section1.element);
                        alignedSections++;
                        
                        console.log('✅ Aggiunto spacer di ' + spacerHeight + 'px prima della sezione ' + section1.number + ' (analisi 1)');
                    }
                    
                    // 3. All'interno della sezione, allinea i moduli
                    const modules1 = findModulesInSection(content1, section1.element);
                    const modules2 = findModulesInSection(content2, section2.element);
                    
                    console.log('Moduli sezione ' + section1.number + ' - Analisi 1:', modules1.length, 'Analisi 2:', modules2.length);
                    
                    modules1.forEach(module1 => {
                        const module2 = modules2.find(m => m.number === module1.number);
                        
                        if (module2) {
                            const moduleOffset1 = module1.element.offsetTop;
                            const moduleOffset2 = module2.element.offsetTop;
                            const moduleDiff = moduleOffset1 - moduleOffset2;
                            
                            if (moduleDiff > 20) {
                                const moduleSpacerHeight = moduleDiff - 5;
                                const moduleSpacer = document.createElement('div');
                                moduleSpacer.className = 'auto-spacer';
                                moduleSpacer.style.height = moduleSpacerHeight + 'px';
                                moduleSpacer.title = 'Spazio automatico per allineare modulo ' + module1.number;
                                
                                module2.element.parentNode.insertBefore(moduleSpacer, module2.element);
                                alignedModules++;
                                
                                console.log('✅ Aggiunto spacer modulo ' + moduleSpacerHeight + 'px prima del modulo ' + module2.number);
                            }
                        }
                    });
                } else {
                    skippedSections++;
                    console.log('⚠️ Sezione "' + section1.text + '" non trovata in analisi 2 (saltata)');
                }
            });
            
            // Salva automaticamente
            saveCurrentEdits();
            
            // Mostra risultato
            let message = '✅ Auto-allineamento completato!\\n\\n' +
                         '📊 Sezioni allineate: ' + alignedSections + '\\n' +
                         '📦 Moduli allineati: ' + alignedModules;
            
            if (skippedSections > 0) {
                message += '\\n⚠️ Sezioni saltate: ' + skippedSections + ' (titoli troppo diversi)';
            }
            
            message += '\\n\\n💡 Usa "Modalità Modifica" per perfezionare manualmente.\\nLe modifiche sono state salvate automaticamente.';
            
            alert(message);
            console.log('🎉 Auto-allineamento completato: ' + alignedSections + ' sezioni, ' + alignedModules + ' moduli, ' + skippedSections + ' saltate');
        }
        
        // Funzione helper: calcola similarità tra due titoli (0-1)
        function calculateTitleSimilarity(text1, text2) {
            // Normalizza i testi: lowercase, rimuovi numeri e punteggiatura
            const normalize = (str) => str.toLowerCase().replace(/[0-9\.\-]/g, '').trim();
            const norm1 = normalize(text1);
            const norm2 = normalize(text2);
            
            // Se uno è vuoto, similarità 0
            if (!norm1 || !norm2) return 0;
            
            // Conta parole in comune
            const words1 = norm1.split(/\s+/);
            const words2 = norm2.split(/\s+/);
            
            let commonWords = 0;
            words1.forEach(word => {
                if (words2.includes(word) && word.length > 2) { // Ignora parole corte (e, di, a, etc.)
                    commonWords++;
                }
            });
            
            // Similarità = parole in comune / media lunghezza
            const avgLength = (words1.length + words2.length) / 2;
            return commonWords / avgLength;
        }
        
        // Funzione helper: trova sezioni numerate (## 1., ## 2., etc.)
        function findNumberedSections(container) {
            const sections = [];
            const h2Elements = container.querySelectorAll('h2');
            
            h2Elements.forEach(h2 => {
                const text = h2.textContent.trim();
                const match = text.match(/^(\d+)\./); // Cerca "1.", "2.", "3.", etc.
                
                if (match) {
                    sections.push({
                        number: match[1],
                        element: h2,
                        text: text
                    });
                }
            });
            
            return sections;
        }
        
        // Funzione helper: trova moduli all'interno di una sezione
        function findModulesInSection(container, sectionElement) {
            const modules = [];
            const allElements = Array.from(container.querySelectorAll('h3, strong, p'));
            
            // Trova indice della sezione corrente
            const allH2 = Array.from(container.querySelectorAll('h2'));
            const sectionIndex = allH2.indexOf(sectionElement);
            const nextSection = allH2[sectionIndex + 1];
            
            // Cerca "Modulo 1", "Modulo 2", etc. tra questa sezione e la prossima
            allElements.forEach(el => {
                // Se abbiamo passato la prossima sezione, ferma
                if (nextSection && el.offsetTop > nextSection.offsetTop) return;
                
                // Se siamo prima della sezione corrente, salta
                if (el.offsetTop < sectionElement.offsetTop) return;
                
                const text = el.textContent.trim();
                const match = text.match(/Modulo\\s+(\\d+)/i); // Cerca "Modulo 1", "Modulo 2", etc.
                
                if (match) {
                    modules.push({
                        number: match[1],
                        element: el,
                        text: text
                    });
                }
            });
            
            return modules;
        }
    </script>
</body>
</html>`;
        
        // Esporta HTML
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Confronto_MAP_${new Date().toISOString().slice(0,10)}.html`;
        a.click();
        URL.revokeObjectURL(url);
        
        showNotification('success', 'Confronto esportato in HTML side-by-side!');
    } catch (error) {
        console.error('Errore export confronto:', error);
        showNotification('error', 'Errore nell\'export del confronto');
    }
}

// Export confronto in formato Word-compatibile (HTML che Word può aprire)
async function exportCompareWord() {
    if (selectedForComparison.length !== 2) {
        showNotification('error', 'Seleziona esattamente 2 analisi per il confronto');
        return;
    }
    
    try {
        const analyses = await getSavedAnalyses();
        const analysis1 = analyses.find(a => a.id === selectedForComparison[0]);
        const analysis2 = analyses.find(a => a.id === selectedForComparison[1]);
        
        if (!analysis1 || !analysis2) {
            showNotification('error', 'Impossibile caricare le analisi selezionate');
            return;
        }
        
        showNotification('info', '⏳ Generazione documento Word in corso...');
        
        // Converte markdown in HTML pulito per Word
        function markdownToHTML(markdown) {
            // Usa marked per convertire markdown in HTML
            let html = marked.parse(markdown);
            // Pulisci e migliora per Word
            html = html.replace(/<\/?code>/g, ''); // Rimuovi tag code
            return html;
        }
        
        // Crea documento HTML che Word può aprire come .doc
        const wordHTML = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
    <meta charset='utf-8'>
    <title>Confronto Analisi Manuali</title>
    <!--[if gte mso 9]>
    <xml>
        <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
    </xml>
    <![endif]-->
    <style>
        body { font-family: Arial, sans-serif; font-size: 11pt; }
        h1 { font-size: 18pt; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt; }
        h2 { font-size: 14pt; font-weight: bold; margin-top: 10pt; margin-bottom: 5pt; }
        h3 { font-size: 12pt; font-weight: bold; margin-top: 8pt; margin-bottom: 4pt; }
        p { margin-bottom: 6pt; line-height: 1.5; }
        table { width: 100%; border-collapse: collapse; margin-top: 20pt; }
        td { border: 1px solid #000; padding: 10pt; vertical-align: top; }
        .header-cell { background-color: #f0f0f0; font-weight: bold; padding: 15pt; }
        .meta { font-size: 10pt; color: #666; margin-bottom: 3pt; }
        .title { text-align: center; font-size: 20pt; font-weight: bold; margin-bottom: 10pt; }
        .subtitle { text-align: center; font-size: 10pt; color: #666; margin-bottom: 20pt; }
    </style>
</head>
<body>
    <p class="title">📊 Confronto Analisi Manuali</p>
    <p class="subtitle">MAP - Manual Analyses Platform | Esportato il ${new Date().toLocaleString('it-IT')}</p>
    
    <table>
        <tr>
            <td class="header-cell" style="background-color: #E8EAF6; width: 50%;">
                <p style="text-align: center; font-size: 14pt; margin-bottom: 10pt;"><strong>ANALISI 1</strong></p>
                <p style="text-align: center; font-size: 16pt; margin-bottom: 10pt;"><strong>${analysis1.materia || 'Altra Materia'}</strong></p>
                <p class="meta"><strong>Volume:</strong> ${analysis1.volumeName}</p>
                <p class="meta"><strong>Tipo:</strong> ${analysis1.analysisType === 'A' ? 'Analisi Generale' : 'Analisi Comparativa per Classi'}</p>
                <p class="meta"><strong>Data:</strong> ${new Date(analysis1.timestamp).toLocaleString('it-IT')}</p>
            </td>
            <td class="header-cell" style="background-color: #C8E6C9; width: 50%;">
                <p style="text-align: center; font-size: 14pt; margin-bottom: 10pt;"><strong>ANALISI 2</strong></p>
                <p style="text-align: center; font-size: 16pt; margin-bottom: 10pt;"><strong>${analysis2.materia || 'Altra Materia'}</strong></p>
                <p class="meta"><strong>Volume:</strong> ${analysis2.volumeName}</p>
                <p class="meta"><strong>Tipo:</strong> ${analysis2.analysisType === 'A' ? 'Analisi Generale' : 'Analisi Comparativa per Classi'}</p>
                <p class="meta"><strong>Data:</strong> ${new Date(analysis2.timestamp).toLocaleString('it-IT')}</p>
            </td>
        </tr>
        <tr>
            <td style="width: 50%;">
                ${markdownToHTML(analysis1.results)}
            </td>
            <td style="width: 50%;">
                ${markdownToHTML(analysis2.results)}
            </td>
        </tr>
    </table>
    
    <p style="text-align: center; margin-top: 20pt; font-size: 9pt; color: #999;">
        ---<br>
        Documento generato da MAP - Manual Analyses Platform v1.14.5
    </p>
</body>
</html>`;
        
        // Crea e scarica file .doc (Word può aprirlo e salvarlo come .docx)
        const blob = new Blob([wordHTML], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Confronto_MAP_${new Date().toISOString().slice(0,10)}.doc`;
        a.click();
        URL.revokeObjectURL(url);
        
        showNotification('success', '✅ Confronto esportato! Aprilo in Word, poi Salva come → PDF.');
        
    } catch (error) {
        console.error('Errore export Word:', error);
        showNotification('error', 'Errore nell\'export Word: ' + error.message);
    }
}
