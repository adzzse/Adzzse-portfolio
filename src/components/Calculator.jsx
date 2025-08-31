import React, { useState } from 'react'

function Calculator() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const clearAll = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '×':
        return firstValue * secondValue
      case '÷':
        return firstValue / secondValue
      default:
        return secondValue
    }
  }

  const equals = () => {
    if (!previousValue || !operation) return

    const inputValue = parseFloat(display)
    const newValue = calculate(previousValue, inputValue, operation)

    setDisplay(String(newValue))
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const percentage = () => {
    const currentValue = parseFloat(display)
    const newValue = currentValue / 100
    setDisplay(String(newValue))
  }

  const plusMinus = () => {
    const currentValue = parseFloat(display)
    const newValue = -currentValue
    setDisplay(String(newValue))
  }

  return (
    <div className="calculator-container">
      <div className="calculator">
        <div className="calculator-display">
          <div className="calculator-expression">
            {previousValue !== null && operation && (
              <span>{previousValue} {operation}</span>
            )}
          </div>
          <div className="calculator-result">{display}</div>
        </div>
        
        <div className="calculator-buttons">
          <button onClick={clearAll} className="calc-btn calc-btn-function">
            AC
          </button>
          <button onClick={plusMinus} className="calc-btn calc-btn-function">
            ±
          </button>
          <button onClick={percentage} className="calc-btn calc-btn-function">
            %
          </button>
          <button onClick={() => performOperation('÷')} className="calc-btn calc-btn-operator">
            ÷
          </button>
          
          <button onClick={() => inputDigit(7)} className="calc-btn calc-btn-number">
            7
          </button>
          <button onClick={() => inputDigit(8)} className="calc-btn calc-btn-number">
            8
          </button>
          <button onClick={() => inputDigit(9)} className="calc-btn calc-btn-number">
            9
          </button>
          <button onClick={() => performOperation('×')} className="calc-btn calc-btn-operator">
            ×
          </button>
          
          <button onClick={() => inputDigit(4)} className="calc-btn calc-btn-number">
            4
          </button>
          <button onClick={() => inputDigit(5)} className="calc-btn calc-btn-number">
            5
          </button>
          <button onClick={() => inputDigit(6)} className="calc-btn calc-btn-number">
            6
          </button>
          <button onClick={() => performOperation('-')} className="calc-btn calc-btn-operator">
            −
          </button>
          
          <button onClick={() => inputDigit(1)} className="calc-btn calc-btn-number">
            1
          </button>
          <button onClick={() => inputDigit(2)} className="calc-btn calc-btn-number">
            2
          </button>
          <button onClick={() => inputDigit(3)} className="calc-btn calc-btn-number">
            3
          </button>
          <button onClick={() => performOperation('+')} className="calc-btn calc-btn-operator">
            +
          </button>
          
          <button onClick={() => inputDigit(0)} className="calc-btn calc-btn-number calc-btn-zero">
            0
          </button>
          <button onClick={inputDecimal} className="calc-btn calc-btn-number">
            .
          </button>
          <button onClick={equals} className="calc-btn calc-btn-operator">
            =
          </button>
        </div>
      </div>
    </div>
  )
}

export default Calculator
