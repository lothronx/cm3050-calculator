// Types
type InputType = "number" | "operator" | "";

// Helper functions for the calculator's brain

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

const getCurrentNumber = (answerValue: string, lastOperatorIndex: number): string => {
  return lastOperatorIndex === -1 ? answerValue : answerValue.slice(lastOperatorIndex + 1);
};

const getExpressionBeforeNumber = (answerValue: string, lastOperatorIndex: number): string => {
  return lastOperatorIndex === -1 ? "" : answerValue.slice(0, lastOperatorIndex + 1);
};

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

const handleNegation = (
  currentNumber: string,
  expressionBeforeCurrentNumber: string,
  answerValue: string
): string => {
  if (currentNumber.startsWith("(-")) {
    return expressionBeforeCurrentNumber + currentNumber.slice(2, -1);
  }
  if (currentNumber) {
    return expressionBeforeCurrentNumber + "(-" + currentNumber + ")";
  }
  return answerValue;
};

// Core calculator functions
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

  // Handle zero input
  if (value === "0" && currentNumber === "0") {
    return answerValue;
  }

  // Handle number replacing zero
  if (parseInt(value) && currentNumber === "0") {
    return expressionBeforeCurrentNumber + value;
  }

  // Handle number input right after a closing parenthesis using the logic of Apple Calculator
  if (answerValue.endsWith(")")) {
    return answerValue + "×" + value;
  }

  return answerValue + value;
};

const handleOperator = (
  operator: string,
  lastInputType: InputType,
  answerValue: string
): string => {
  if (lastInputType === "operator") {
    return answerValue.slice(0, -1) + operator;
  }
  return answerValue + operator;
};

const prepareExpressionForEvaluation = (answerValue: string, lastInputType: InputType): string => {
  const expressionToEvaluate =
    lastInputType === "operator" ? answerValue.slice(0, -1) : answerValue;
  return expressionToEvaluate
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/(\d+\.?\d*|\))%/g, (match) => {
      const num = match.endsWith("%") ? parseFloat(match.slice(0, -1)) / 100 : parseFloat(match);
      return num.toString();
    });
};

const formatResult = (result: number): string => {
  return Number.isInteger(result) ? result.toString() : result.toFixed(8).replace(/\.?0+$/, "");
};

const calculateEquals = (answerValue: string, lastInputType: InputType): string => {
  try {
    const evalExpression = prepareExpressionForEvaluation(answerValue, lastInputType);
    const result = new Function("return (" + evalExpression + ")")();
    return formatResult(result);
  } catch (error) {
    return "Error";
  }
};

export { InputType, handleNumber, handleOperator, calculateEquals };
