/**
 * Glassmorphism Calculator Logic
 * Handles arithmetic calculations, display updates, button clicks, and keyboard events.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const expressionDisplay = document.getElementById('expression');
  const resultDisplay = document.getElementById('result');
  const buttons = document.querySelectorAll('.btn');

  // Calculator State
  let currentOperand = '0';
  let previousOperand = '';
  let activeOperator = null;
  let resetDisplayOnNextInput = false;
  let calculationComplete = false;

  // Formatting configurations
  const MAX_DISPLAY_LENGTH = 12;

  // Initialize display
  updateDisplay();

  // Add click event listeners to all buttons
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      handleButtonPress(button);
      // Remove focus from button to prevent space/enter double trigger
      button.blur();
    });
  });

  // Add keyboard support
  document.addEventListener('keydown', handleKeyboardInput);

  /**
   * Dispatches the action based on button metadata
   */
  function handleButtonPress(button) {
    const number = button.getAttribute('data-number');
    const operator = button.getAttribute('data-operator');
    const action = button.getAttribute('data-action');

    if (number !== null) {
      inputDigit(number);
    } else if (operator !== null) {
      setOperator(operator);
    } else if (action !== null) {
      switch (action) {
        case 'clear':
          clearAll();
          break;
        case 'toggle-sign':
          toggleSign();
          break;
        case 'percent':
          applyPercent();
          break;
        case 'decimal':
          inputDecimal();
          break;
        case 'calculate':
          calculateResult();
          break;
      }
    }
    updateDisplay();
  }

  /**
   * Handle physical keyboard input
   */
  function handleKeyboardInput(e) {
    const key = e.key;

    // Numbers
    if (/^[0-9]$/.test(key)) {
      inputDigit(key);
      animateButtonPress(`btn-${key}`);
    }
    // Operators
    else if (key === '+') {
      setOperator('+');
      animateButtonPress('btn-add');
    } else if (key === '-') {
      setOperator('-');
      animateButtonPress('btn-subtract');
    } else if (key === '*') {
      setOperator('*');
      animateButtonPress('btn-multiply');
    } else if (key === '/') {
      e.preventDefault(); // Prevent search shortcut in some browsers
      setOperator('/');
      animateButtonPress('btn-divide');
    }
    // Actions
    else if (key === 'Enter' || key === '=') {
      e.preventDefault();
      calculateResult();
      animateButtonPress('btn-equals');
    } else if (key === 'Backspace') {
      deleteLastDigit();
      // Visual response on display if needed
    } else if (key === '.' || key === ',') {
      inputDecimal();
      animateButtonPress('btn-decimal');
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
      clearAll();
      animateButtonPress('btn-clear');
    } else if (key === '%') {
      applyPercent();
      animateButtonPress('btn-percent');
    }

    updateDisplay();
  }

  /**
   * Helper function to briefly add an active CSS class to simulate a click visually for key presses
   */
  function animateButtonPress(buttonId) {
    const btn = document.getElementById(buttonId);
    if (btn) {
      btn.classList.add('active-key');
      btn.click();
      setTimeout(() => {
        btn.classList.remove('active-key');
      }, 100);
    }
  }

  /**
   * Adds a digit to the current operand
   */
  function inputDigit(digit) {
    if (calculationComplete) {
      currentOperand = digit;
      previousOperand = '';
      activeOperator = null;
      calculationComplete = false;
    } else if (currentOperand === '0' || resetDisplayOnNextInput) {
      currentOperand = digit;
    } else {
      // Prevent overflow of display
      if (currentOperand.replace(/[^0-9]/g, '').length >= MAX_DISPLAY_LENGTH) {
        return;
      }
      currentOperand += digit;
    }
    resetDisplayOnNextInput = false;
    clearOperatorHighlights();
  }

  /**
   * Appends decimal separator
   */
  function inputDecimal() {
    if (calculationComplete) {
      currentOperand = '0.';
      previousOperand = '';
      activeOperator = null;
      calculationComplete = false;
      resetDisplayOnNextInput = false;
      return;
    }
    if (resetDisplayOnNextInput) {
      currentOperand = '0.';
      resetDisplayOnNextInput = false;
      return;
    }
    if (!currentOperand.includes('.')) {
      currentOperand += '.';
    }
  }

  /**
   * Sets the math operator and evaluates intermediate operations if already chained
   */
  function setOperator(operator) {
    const current = parseFloat(currentOperand);

    if (activeOperator && !resetDisplayOnNextInput) {
      // Evaluate the intermediate calculation
      const result = executeCalculation(parseFloat(previousOperand), current, activeOperator);
      
      if (result === 'Error') {
        currentOperand = 'Error';
        previousOperand = '';
        activeOperator = null;
        resetDisplayOnNextInput = true;
        return;
      }
      
      currentOperand = formatNumber(result);
      previousOperand = currentOperand;
    } else {
      previousOperand = currentOperand;
    }

    activeOperator = operator;
    resetDisplayOnNextInput = true;
    calculationComplete = false;

    // Visual feedback: highlight active operator
    highlightOperator(operator);
  }

  /**
   * Evaluates the final formula and updates state
   */
  function calculateResult() {
    if (!activeOperator || resetDisplayOnNextInput) return;

    const first = parseFloat(previousOperand);
    const second = parseFloat(currentOperand);
    const result = executeCalculation(first, second, activeOperator);

    if (result === 'Error') {
      currentOperand = 'Error';
      expressionDisplay.textContent = `${previousOperand} ${getOperatorSymbol(activeOperator)} ${currentOperand} =`;
    } else {
      expressionDisplay.textContent = `${previousOperand} ${getOperatorSymbol(activeOperator)} ${currentOperand} =`;
      currentOperand = formatNumber(result);
    }

    previousOperand = '';
    activeOperator = null;
    calculationComplete = true;
    resetDisplayOnNextInput = false;
    clearOperatorHighlights();
  }

  /**
   * Core math calculation engine with float correction
   */
  function executeCalculation(first, second, operator) {
    let result;
    switch (operator) {
      case '+':
        result = first + second;
        break;
      case '-':
        result = first - second;
        break;
      case '*':
        result = first * second;
        break;
      case '/':
        if (second === 0) return 'Error';
        result = first / second;
        break;
      default:
        return second;
    }
    // Correct JS floating point inaccuracies (e.g. 0.1 + 0.2 = 0.30000000000000004)
    return parseFloat(result.toPrecision(12));
  }

  /**
   * Negates the current input (+/-)
   */
  function toggleSign() {
    if (currentOperand === 'Error' || currentOperand === '0') return;
    
    if (currentOperand.startsWith('-')) {
      currentOperand = currentOperand.substring(1);
    } else {
      currentOperand = '-' + currentOperand;
    }
  }

  /**
   * Divides current operand by 100 (%)
   */
  function applyPercent() {
    if (currentOperand === 'Error' || currentOperand === '0') return;
    
    const value = parseFloat(currentOperand);
    const result = value / 100;
    
    // Float correction
    currentOperand = formatNumber(parseFloat(result.toPrecision(12)));
  }

  /**
   * Backspace feature: deletes the last typed character
   */
  function deleteLastDigit() {
    if (calculationComplete || currentOperand === 'Error' || resetDisplayOnNextInput) {
      return;
    }
    
    if (currentOperand.length > 1) {
      currentOperand = currentOperand.slice(0, -1);
      // If it ends with just negative sign, make it 0
      if (currentOperand === '-') {
        currentOperand = '0';
      }
    } else {
      currentOperand = '0';
    }
  }

  /**
   * Resets all states (AC)
   */
  function clearAll() {
    currentOperand = '0';
    previousOperand = '';
    activeOperator = null;
    resetDisplayOnNextInput = false;
    calculationComplete = false;
    expressionDisplay.textContent = '';
    clearOperatorHighlights();
  }

  /**
   * Returns display friendly operator unicode symbols
   */
  function getOperatorSymbol(op) {
    switch (op) {
      case '/': return '÷';
      case '*': return '×';
      case '-': return '−';
      case '+': return '+';
      default: return '';
    }
  }

  /**
   * Format numbers to not overflow displays and avoid scientific notations where possible
   */
  function formatNumber(num) {
    if (isNaN(num)) return 'Error';
    
    const strVal = num.toString();
    if (strVal.length > MAX_DISPLAY_LENGTH) {
      if (Math.abs(num) > 1e9 || Math.abs(num) < 1e-4) {
        return num.toExponential(5);
      }
      return parseFloat(num.toFixed(MAX_DISPLAY_LENGTH - strVal.split('.')[0].length - 1)).toString();
    }
    return strVal;
  }

  /**
   * Updates display divs on the screen
   */
  function updateDisplay() {
    // Current input display formatting with local separators
    if (currentOperand === 'Error') {
      resultDisplay.textContent = 'Error';
    } else {
      // Split decimal to format integer portion locally
      const parts = currentOperand.split('.');
      let integerPart = parts[0];
      const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
      
      // Formatting with commas for readability (e.g. 1,000,000)
      const formattedInt = Number(integerPart).toLocaleString('en-US', {
        maximumFractionDigits: 0
      });
      
      // Handle edge cases like lone minus sign during typing or leading zero sequences
      if (integerPart === '-0') {
        resultDisplay.textContent = '-0' + decimalPart;
      } else if (integerPart === '-') {
        resultDisplay.textContent = '-' + decimalPart;
      } else {
        resultDisplay.textContent = formattedInt + decimalPart;
      }
    }

    // Expression display formatting
    if (!calculationComplete) {
      if (activeOperator) {
        expressionDisplay.textContent = `${previousOperand} ${getOperatorSymbol(activeOperator)}`;
      } else {
        expressionDisplay.textContent = '';
      }
    }
  }

  /**
   * Highlights the operator button visually when active
   */
  function highlightOperator(op) {
    clearOperatorHighlights();
    let btnId = '';
    switch (op) {
      case '/': btnId = 'btn-divide'; break;
      case '*': btnId = 'btn-multiply'; break;
      case '-': btnId = 'btn-subtract'; break;
      case '+': btnId = 'btn-add'; break;
    }
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.classList.add('active-op');
    }
  }

  /**
   * Clears highlights from all operators
   */
  function clearOperatorHighlights() {
    const operators = document.querySelectorAll('.btn-operator');
    operators.forEach(op => op.classList.remove('active-op'));
  }
});
