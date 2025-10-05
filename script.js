let displayValue = '0';
let expressionValue = '';
let shouldResetDisplay = false;
let currentTheme = 'default';

const themes = ['default', 'dark', 'light', 'ocean', 'sunset', 'forest', 'rose', 'cyber'];

function updateDisplay() {
    document.getElementById('result').textContent = displayValue;
    document.getElementById('expression').textContent = expressionValue;
}

function appendToDisplay(value) {
    if (shouldResetDisplay) {
        displayValue = '';
        shouldResetDisplay = false;
    }

    if (displayValue === '0' && value !== '.') {
        displayValue = value;
    } else {
        displayValue += value;
    }

    createSparkleEffect();
    createFloatingNumber(value);
    updateDisplay();
}

function appendFunction(func) {
    if (shouldResetDisplay) {
        displayValue = '';
        shouldResetDisplay = false;
    }

    if (displayValue === '0') {
        displayValue = func;
    } else {
        displayValue += func;
    }

    createSparkleEffect();
    updateDisplay();
}

function clearDisplay() {
    displayValue = '0';
    expressionValue = '';
    shouldResetDisplay = false;

    const calculator = document.querySelector('.calculator');
    calculator.classList.add('shake');
    setTimeout(() => calculator.classList.remove('shake'), 500);

    updateDisplay();
}

function deleteLast() {
    if (displayValue.length > 1) {
        displayValue = displayValue.slice(0, -1);
    } else {
        displayValue = '0';
    }

    const display = document.querySelector('.display');
    display.style.animation = 'bounce 0.3s ease';
    setTimeout(() => display.style.animation = '', 300);

    updateDisplay();
}

function createSparkleEffect() {
    const calculator = document.querySelector('.calculator');
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-effect';

    const rect = calculator.getBoundingClientRect();
    sparkle.style.left = Math.random() * (rect.width - 20) + 10 + 'px';
    sparkle.style.top = Math.random() * (rect.height - 20) + 10 + 'px';

    calculator.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 600);
}

function createFloatingNumber(value) {
    const calculator = document.querySelector('.calculator');
    const floatingNum = document.createElement('div');
    floatingNum.className = 'floating-number';
    floatingNum.textContent = value;

    const display = document.querySelector('.display');
    floatingNum.style.left = Math.random() * 100 + 150 + 'px';
    floatingNum.style.top = '120px';

    calculator.appendChild(floatingNum);
    setTimeout(() => floatingNum.remove(), 1500);
}

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function calculate() {
    try {
        expressionValue = displayValue;
        let expression = displayValue
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-')
            .replace(/π/g, Math.PI)
            .replace(/e/g, Math.E)
            .replace(/\^/g, '**')
            .replace(/√\(/g, 'Math.sqrt(')
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/ln\(/g, 'Math.log(');

        expression = expression.replace(/(\d+)!/g, (match, num) => factorial(parseInt(num)));
        let result = Function('"use strict"; return (' + expression + ')')();

        if (isNaN(result) || !isFinite(result)) {
            displayValue = 'Error';
            const calculator = document.querySelector('.calculator');
            calculator.classList.add('shake');
            setTimeout(() => calculator.classList.remove('shake'), 500);
        } else {
            if (Math.abs(result) < 0.000001 && result !== 0) {
                displayValue = result.toExponential(6);
            } else if (Math.abs(result) > 999999999) {
                displayValue = result.toExponential(6);
            } else {
                displayValue = parseFloat(result.toPrecision(12)).toString();
            }

            const resultElement = document.getElementById('result');
            resultElement.classList.add('animate-result');
            setTimeout(() => resultElement.classList.remove('animate-result'), 400);

            for (let i = 0; i < 3; i++) {
                setTimeout(() => createSparkleEffect(), i * 100);
            }
        }

        shouldResetDisplay = true;
    } catch (error) {
        displayValue = 'Error';
        shouldResetDisplay = true;
        const calculator = document.querySelector('.calculator');
        calculator.classList.add('shake');
        setTimeout(() => calculator.classList.remove('shake'), 500);
    }

    updateDisplay();
}

function setMode(mode) {
    const scientificButtons = document.getElementById('scientificButtons');
    const modeButtons = document.querySelectorAll('.mode-btn');

    modeButtons.forEach(btn => btn.classList.remove('active'));

    if (mode === 'scientific') {
        scientificButtons.classList.add('active');
        document.querySelector('[onclick="setMode(\'scientific\')"]').classList.add('active');
    } else {
        scientificButtons.classList.remove('active');
        document.querySelector('[onclick="setMode(\'basic\')"]').classList.add('active');
    }
}

function toggleTheme() {
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    currentTheme = themes[nextIndex];

    // Clear any inline styles that might interfere
    const allButtons = document.querySelectorAll('button, .keyboard-shortcuts__btn, .mode-btn, .theme-toggle');
    allButtons.forEach(btn => {
        btn.style.color = '';
        btn.style.removeProperty('color');
    });

    // ✅ Always keep default class
    document.body.className = 'default';

    if (currentTheme !== 'default') {
        document.body.classList.add(currentTheme);
    }

    // Force a reflow to ensure CSS is applied
    document.body.offsetHeight;

    const themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) {
        themeBtn.classList.add('rainbow');
        setTimeout(() => themeBtn.classList.remove('rainbow'), 2000);
    }

    for (let i = 0; i < 5; i++) {
        setTimeout(() => createSparkleEffect(), i * 50);
    }
}

document.addEventListener('keydown', function(event) {
    const key = event.key;

    if (key >= '0' && key <= '9') appendToDisplay(key);
    else if (key === '.') appendToDisplay('.');
    else if (key === '+') appendToDisplay('+');
    else if (key === '-') appendToDisplay('-');
    else if (key === '*') appendToDisplay('*');
    else if (key === '/') {
        event.preventDefault();
        appendToDisplay('/');
    } else if (key === 'Enter' || key === '=') calculate();
    else if (key === 'Escape' || key === 'Delete') clearDisplay();
    else if (key === 'Backspace') deleteLast();
    else if (key === ' ') {
        event.preventDefault(); // Prevent page scrolling
        // Toggle between basic and scientific modes
        const scientificButtons = document.getElementById('scientificButtons');
        const isScientificActive = scientificButtons.classList.contains('active');
        
        if (isScientificActive) {
            setMode('basic');
        } else {
            setMode('scientific');
        }
    }
});

// Close keyboard shortcuts panel when clicking anywhere on the screen
document.addEventListener('click', function(event) {
    const panel = document.querySelector('.keyboard-shortcuts__panel');
    const button = document.querySelector('.keyboard-shortcuts__btn');
    
    // Check if panel exists and is visible
    if (panel && !panel.classList.contains('hidden')) {
        // If the click is not on the button or inside the panel, hide it
        if (!button.contains(event.target) && !panel.contains(event.target)) {
            panel.classList.add('hidden');
        }
    }
});

updateDisplay();