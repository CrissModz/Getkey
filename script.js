// DOM Elements
const lengthSlider = document.getElementById('length');
const lengthInput = document.getElementById('lengthValue');
const uppercaseCheckbox = document.getElementById('uppercase');
const lowercaseCheckbox = document.getElementById('lowercase');
const numbersCheckbox = document.getElementById('numbers');
const symbolsCheckbox = document.getElementById('symbols');
const keyOutput = document.getElementById('keyOutput');
const historyDiv = document.getElementById('history');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// Character sets
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// History array
let keyHistory = [];

// Load history from localStorage
function loadHistory() {
    const saved = localStorage.getItem('keyHistory');
    if (saved) {
        keyHistory = JSON.parse(saved);
        updateHistoryDisplay();
    }
}

// Save history to localStorage
function saveHistory() {
    localStorage.setItem('keyHistory', JSON.stringify(keyHistory));
}

// Link slider and input
lengthSlider.addEventListener('input', (e) => {
    lengthInput.value = e.target.value;
});

lengthInput.addEventListener('input', (e) => {
    let value = parseInt(e.target.value);
    if (value < 8) value = 8;
    if (value > 128) value = 128;
    lengthInput.value = value;
    lengthSlider.value = value;
});

// Generate key function
function generateKey() {
    // Validate at least one checkbox is selected
    if (!uppercaseCheckbox.checked && !lowercaseCheckbox.checked && 
        !numbersCheckbox.checked && !symbolsCheckbox.checked) {
        alert('Por favor selecciona al menos un tipo de carácter');
        return;
    }

    // Build character set
    let characters = '';
    if (uppercaseCheckbox.checked) characters += UPPERCASE;
    if (lowercaseCheckbox.checked) characters += LOWERCASE;
    if (numbersCheckbox.checked) characters += NUMBERS;
    if (symbolsCheckbox.checked) characters += SYMBOLS;

    // Get desired length
    const length = parseInt(lengthInput.value);

    // Generate key
    let key = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        key += characters[randomIndex];
    }

    // Display key
    keyOutput.value = key;

    // Add to history
    addToHistory(key);
}

// Add to history function
function addToHistory(key) {
    // Avoid duplicates and limit to 20 items
    if (keyHistory.length >= 20) {
        keyHistory.shift();
    }

    // Check if key already exists at the beginning
    if (keyHistory.length === 0 || keyHistory[keyHistory.length - 1] !== key) {
        keyHistory.push(key);
        saveHistory();
        updateHistoryDisplay();
    }
}

// Update history display
function updateHistoryDisplay() {
    if (keyHistory.length === 0) {
        historyDiv.innerHTML = '<div class="empty-history">El histórico estará vacío hasta que generes tu primera clave</div>';
        clearHistoryBtn.style.display = 'none';
    } else {
        clearHistoryBtn.style.display = 'block';
        historyDiv.innerHTML = keyHistory.map((key, index) => `
            <div class="history-item">
                <span>${key}</span>
                <button onclick="copyHistoryKey('${key}')" title="Copiar clave">Copiar</button>
            </div>
        `).reverse().join('');
    }
}

// Copy history key
function copyHistoryKey(key) {
    navigator.clipboard.writeText(key).then(() => {
        showCopyNotification();
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}

// Copy to clipboard function
function copyToClipboard() {
    if (keyOutput.value === '') {
        alert('Primero genera una clave');
        return;
    }

    navigator.clipboard.writeText(keyOutput.value).then(() => {
        showCopyNotification();
    }).catch(err => {
        console.error('Error al copiar: ', err);
        // Fallback for older browsers
        keyOutput.select();
        document.execCommand('copy');
    });
}

// Show copy notification
function showCopyNotification() {
    const copyBtn = document.getElementById('copyBtn');
    const originalText = copyBtn.textContent;
    
    copyBtn.textContent = '✓ ¡Copiado!';
    copyBtn.style.background = '#4caf50';
    
    setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.background = '';
    }, 2000);
}

// Clear history function
function clearHistory() {
    if (confirm('¿Estás seguro de que deseas limpiar todo el histórico?')) {
        keyHistory = [];
        saveHistory();
        updateHistoryDisplay();
    }
}

// Generate key on Enter key
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && 
        (e.target === lengthInput || 
         e.target === uppercaseCheckbox || 
         e.target === lowercaseCheckbox || 
         e.target === numbersCheckbox || 
         e.target === symbolsCheckbox)) {
        generateKey();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    // Generate initial key
    generateKey();
});
