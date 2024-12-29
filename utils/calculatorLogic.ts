// start of my code
// Types
type InputType = "number" | "operator" | "";

// Helper functions for the calculator's brain

/**
 * Finds the index of the last mathematical operator in the expression.
 * Operators include: "÷", "×", "-", "+", but exclude negative signs in parentheses.
 * For example, in "(-5)", the "-" is considered a negative sign, not an operator.
 * 
 * @param answerValue - The current calculator expression string
 * @returns The index of the last operator, or -1 if no operator is found
 */
const findLastOperatorIndex = (answerValue: string): number => {
  return Math.max(
    ...["÷", "×", "+"].map((op) => answerValue.lastIndexOf(op)),
    ...answerValue.split("").reduce((indices, char, i) => {
      if (char === "-" && answerValue[i - 1] !== "(") {
        indices.push(i);
      }
      return indices;
    }, [] as number[])
  );
};

/**
 * Extracts the current number being entered after the last operator.
 * 
 * @param answerValue - The current calculator expression string
 * @param lastOperatorIndex - Index of the last operator in the expression
 * @returns The current number as a string, or the entire expression if no operator exists
 */
const getCurrentNumber = (answerValue: string, lastOperatorIndex: number): string => {
  return lastOperatorIndex === -1 ? answerValue : answerValue.slice(lastOperatorIndex + 1);
};

/**
 * Gets the portion of the expression before and including the last operator.
 * 
 * @param answerValue - The current calculator expression string
 * @param lastOperatorIndex - Index of the last operator in the expression
 * @returns The expression up to and including the last operator, or empty string if no operator exists
 */
const getExpressionBeforeNumber = (answerValue: string, lastOperatorIndex: number): string => {
  return lastOperatorIndex === -1 ? "" : answerValue.slice(0, lastOperatorIndex + 1);
};

/**
 * Determines if the current input should be ignored based on calculator rules.
 * Handles special cases for decimal points and percentage signs.
 * 
 * @param value - The input value to check
 * @param currentNumber - The current number being entered
 * @param answerValue - The complete calculator expression
 * @returns True if the input should be ignored, false otherwise
 */
const shouldReturnUnchanged = (
  value: string,
  currentNumber: string,
  answerValue: string
): boolean => {
  if (
    value === "." &&
    (!currentNumber || currentNumber.includes(".") || answerValue.endsWith(")"))
  ) {
    return true;
  }
  if (
    value === "%" &&
    (!currentNumber || currentNumber.includes("%") || answerValue.endsWith(")"))
  ) {
    return true;
  }
  return false;
};

/**
 * Handles the negation (+/-) operation for the current number.
 * Toggles between positive and negative by adding or removing "(-" and ")" around the number.
 * 
 * @param currentNumber - The current number being manipulated
 * @param expressionBeforeCurrentNumber - The expression before the current number
 * @param answerValue - The complete calculator expression
 * @returns The updated expression with the number negated or un-negated
 */
const handleNegation = (
  currentNumber: string,
  expressionBeforeCurrentNumber: string,
  answerValue: string
): string => {
  // If the current number is for example "(-5)", return "5"
  if (currentNumber.startsWith("(-")) {
    return expressionBeforeCurrentNumber + currentNumber.slice(2, -1);
  }
  // If the current number is for example "5", return "(-5)"
  if (currentNumber) {
    return expressionBeforeCurrentNumber + "(-" + currentNumber + ")";
  }
  // If the current number is empty, do nothing
  return answerValue;
};

/**
 * Processes numeric input (including decimal points, percentage, and +/- toggle).
 * Handles special cases like leading zeros and operations after parentheses.
 * 
 * @param value - The numeric input value or special character (".", "%", "+/-")
 * @param answerValue - The current calculator expression
 * @returns The updated calculator expression after processing the input
 */
const handleNumber = (value: string, answerValue: string): string => {
  const lastOperatorIndex = findLastOperatorIndex(answerValue);
  const currentNumber = getCurrentNumber(answerValue, lastOperatorIndex);
  const expressionBeforeCurrentNumber = getExpressionBeforeNumber(answerValue, lastOperatorIndex);

  // Handle special cases
  if (shouldReturnUnchanged(value, currentNumber, answerValue)) {
    return answerValue;
  }

  // Handle +/- toggle
  if (value === "+/-") {
    return handleNegation(currentNumber, expressionBeforeCurrentNumber, answerValue);
  }

  // Handle zero input to avoid leading zeros
  if (value === "0" && currentNumber === "0") {
    return answerValue;
  }

  // Handle number replacing zero to avoid leading zero
  if (parseInt(value) && currentNumber === "0") {
    return expressionBeforeCurrentNumber + value;
  }

  // Handle number input right after a closing parenthesis using the logic of Apple Calculator
  if (answerValue.endsWith(")")) {
    return answerValue + "×" + value;
  }

  return answerValue + value;
};

/**
 * Processes operator input (÷, ×, -, +) according to calculator rules.
 * Handles operator chaining and ensures proper operator placement.
 * 
 * @param operator - The operator to be added
 * @param lastInputType - The type of the last input (number, operator, or empty)
 * @param answerValue - The current calculator expression
 * @returns The updated calculator expression with the operator added
 */
const handleOperator = (
  operator: string,
  lastInputType: InputType,
  answerValue: string
): string => {
  // If the last input was an operator, replace the last operator with the new one
  if (lastInputType === "operator") {
    return answerValue.slice(0, -1) + operator;
  }
  return answerValue + operator;
};

/**
 * Formats the expression for evaluation by replacing display operators with JavaScript operators.
 * Handles percentage calculations and ensures proper mathematical syntax.
 * 
 * @param answerValue - The calculator expression to format
 * @param lastInputType - The type of the last input
 * @returns A JavaScript-compatible mathematical expression string
 */
const formatExpressionForEvaluation = (answerValue: string, lastInputType: InputType): string => {
  // if the last input was an operator, remove the last operator
  const expressionToEvaluate =
    lastInputType === "operator" ? answerValue.slice(0, -1) : answerValue;
  return (
    expressionToEvaluate
      // Replace all occurrences of "×" with "*"
      .replace(/×/g, "*")
      // Replace all occurrences of "÷" with "/"
      .replace(/÷/g, "/")
      // Replace percentages with decimals
      .replace(/(\d+\.?\d*|\))%/g, (match) => {
        const num = match.endsWith("%") ? parseFloat(match.slice(0, -1)) / 100 : parseFloat(match);
        return num.toString();
      })
  );
};

/**
 * Formats the numerical result for display.
 * Handles decimal places and converts to string representation.
 * 
 * @param result - The numerical result to format
 * @returns The formatted result as a string
 */
const formatResult = (result: number): string => {
  // Format the result to maximum of 8 decimal places to avoid rounding errors
  return Number.isInteger(result) ? result.toString() : result.toFixed(8).replace(/\.?0+$/, "");
};

/**
 * Calculates the final result when equals is pressed.
 * Formats the expression, evaluates it, and returns the result.
 * 
 * @param answerValue - The current calculator expression
 * @param lastInputType - The type of the last input
 * @returns The calculated result as a string
 */
const calculateEquals = (answerValue: string, lastInputType: InputType): string => {
  try {
    const evalExpression = formatExpressionForEvaluation(answerValue, lastInputType);
    const result = new Function("return (" + evalExpression + ")")();
    return formatResult(result);
  } catch (error) {
    return "Error";
  }
};

export { InputType, handleNumber, handleOperator, calculateEquals };
//end of my code
