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

// Current step
let currentStep = 1;

// Track if WhatsApp has been verified
let whatsappVerified = localStorage.getItem('whatsappVerified') === 'true';

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

// Navigate between steps
function goToStep(stepNumber) {
    // Hide all step contents
    document.getElementById('stepContent1').style.display = 'none';
    document.getElementById('stepContent2').style.display = 'none';
    document.getElementById('stepContent3').style.display = 'none';

    // Show the selected step
    document.getElementById(`stepContent${stepNumber}`).style.display = 'block';

    // Update step indicator
    updateStepIndicator(stepNumber);

    // Scroll to generator
    document.getElementById('generator').scrollIntoView({ behavior: 'smooth' });

    currentStep = stepNumber;
}

// Update step indicator styling
function updateStepIndicator(stepNumber) {
    // Reset all steps
    document.getElementById('step1').classList.remove('active', 'completed');
    document.getElementById('step2').classList.remove('active', 'completed');
    document.getElementById('step3').classList.remove('active', 'completed');
    document.getElementById('connector1').classList.remove('filled');
    document.getElementById('connector2').classList.remove('filled');

    // Mark completed and active steps
    if (stepNumber >= 1) document.getElementById('step1').classList.add('completed');
    if (stepNumber >= 2) {
        document.getElementById('connector1').classList.add('filled');
        document.getElementById('step2').classList.add('completed');
    }
    if (stepNumber >= 3) {
        document.getElementById('connector2').classList.add('filled');
        document.getElementById('step3').classList.add('completed');
    }
    if (whatsappVerified && stepNumber >= 1) {
        document.getElementById('step1').classList.add('completed');
        document.getElementById('connector1').classList.add('filled');
    }

    // Mark current step as active
    document.getElementById(`step${stepNumber}`).classList.add('active');
}

// Verify WhatsApp
function verifyWhatsApp() {
    // In a real scenario, you would verify if the user actually followed the channel
    // For now, we'll use localStorage to track verification
    // You could implement a more sophisticated verification system later
    
    const userConfirm = confirm('¿Ya has seguido nuestro canal de WhatsApp? Si continúas, confirmas que lo has hecho.');
    
    if (userConfirm) {
        whatsappVerified = true;
        localStorage.setItem('whatsappVerified', 'true');
        
        // Show success notification
        showNotification('¡Verificación completada! Continúa al siguiente paso.', 'success');
        
        // Move to step 2
        setTimeout(() => {
            goToStep(2);
        }, 1000);
    }
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4caf50' : '#ff4444'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Generate key function
function generateKey() {
    // Validate at least one checkbox is selected
    if (!uppercaseCheckbox.checked && !lowercaseCheckbox.checked && 
        !numbersCheckbox.checked && !symbolsCheckbox.checked) {
        showNotification('Por favor selecciona al menos un tipo de carácter', 'error');
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

    // Show success notification
    showNotification('¡Clave generada exitosamente!', 'success');
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
        showNotification('Primero genera una clave', 'error');
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
        showNotification('Histórico limpiado', 'success');
    }
}

// Generate key on Enter key
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && currentStep === 3) {
        generateKey();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    
    // Check if WhatsApp was already verified
    if (whatsappVerified) {
        goToStep(2);
    } else {
        goToStep(1);
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});
