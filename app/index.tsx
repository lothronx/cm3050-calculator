// start of my code
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  // Layout constants
  const LAYOUT = {
    CONTENT_MARGIN: 10,
    BUTTON_MARGIN: 6,
  } as const;

  // Color scheme constants
  const COLORS = {
    BACKGROUND: "rgb(44,50,54)",
    PRIMARY: "rgb(233,234,234)",
    LIGHT_GRAY: "rgb(114,120,124)",
    DARK_GRAY: "rgb(80,90,94)",
    HIGHLIGHT: "rgb(241,154,55)",
    SHADOW: "rgba(0,0,0,0.5)",
  } as const;

  // Button text constants
  const BUTTONS = {
    FUNCTION: ["C", "+/-", "%"],
    NUMBER: [
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["0", "."],
    ],
    OPERATOR: ["÷", "×", "-", "+", "="],
  } as const;

  // Calculate safe area dimensions
  const window = Dimensions.get("window");
  const insets = useSafeAreaInsets();
  const safeAreaWidth = window.width - insets.left - insets.right;
  const safeAreaHeight = window.height - insets.top - insets.bottom;

  // Determine if the device is in landscape mode
  const isLandscape = window.width > window.height;

  // Calculate button dimensions based on the device orientation
  const buttonWidth =
    (safeAreaWidth - LAYOUT.CONTENT_MARGIN * 2) / (isLandscape ? 5 : 4) - LAYOUT.BUTTON_MARGIN * 2;
  const buttonHeight = isLandscape
    ? (safeAreaHeight - LAYOUT.CONTENT_MARGIN * 2) / 6 - LAYOUT.BUTTON_MARGIN * 2
    : buttonWidth;

  // State variables
  const [lastInputType, setLastInputType] = useState<"number" | "operator" | "">("");
  const [answerValue, setAnswerValue] = useState("0");
  const [expression, setExpression] = useState("");

  // Button component props
  type ButtonProps = {
    value: string;
    onPress: (value: string) => void;
    backgroundColor: string;
    style?: object;
  };

  // Button component
  const CalculatorButton = ({ value, onPress, backgroundColor, style }: ButtonProps) => (
    <View style={[styles.buttonContainer, style]}>
      <TouchableOpacity
        onPress={() => onPress(value)}
        style={[styles.button, { backgroundColor }, style]}
        activeOpacity={0.7}>
        <Text style={styles.buttonText}>{value}</Text>
      </TouchableOpacity>
    </View>
  );

  // Handle button press
  const buttonPressed = (value: string): void => {
    if (value === "C") {
      setLastInputType("");
      setAnswerValue("0");
      setExpression("");
    }

    if (value === "=") {
      setLastInputType("");
      setExpression(answerValue);
      setAnswerValue(calculateEquals());
    }

    // Handle numbers and number-like values
    if (!isNaN(Number(value)) || [".", "+/-", "%"].includes(value)) {
      setLastInputType("number");
      setAnswerValue(handleNumber(value));
      setExpression("");
    }

    // Handle operators
    if (["÷", "×", "-", "+"].includes(value)) {
      handleOperator(value);
      setExpression("");
    }
  };

  // Handle operator input
  const handleOperator = (operator: string): void => {
    if (lastInputType === "operator") {
      setAnswerValue(answerValue.slice(0, -1) + operator);
    } else {
      setLastInputType("operator");
      setAnswerValue(answerValue + operator);
    }
  };

  // Handle number input
  const handleNumber = (value: string): string => {
    const lastOperatorIndex = findLastOperatorIndex();
    const currentNumber = getCurrentNumber(lastOperatorIndex);
    const expressionBeforeCurrentNumber = getExpressionBeforeNumber(lastOperatorIndex);

    // Handle special cases
    if (shouldReturnUnchanged(value, currentNumber)) {
      return answerValue;
    }

    // Handle +/- toggle
    if (value === "+/-") {
      return handleNegation(currentNumber, expressionBeforeCurrentNumber);
    }

    // Handle zero input
    if (value === "0" && currentNumber === "0") {
      return answerValue;
    }

    // Handle number replacing zero
    if (parseInt(value) && currentNumber === "0") {
      return expressionBeforeCurrentNumber + value;
    }

    // Handle  number input right after a closing parenthesis using the logic of Apple Calculator
    if (answerValue.endsWith(")")) {
      return answerValue + "×" + value;
    }

    return answerValue + value;
  };

  // Helper functions for number handling
  const findLastOperatorIndex = (): number => {
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

  const getCurrentNumber = (lastOperatorIndex: number): string => {
    return lastOperatorIndex === -1 ? answerValue : answerValue.slice(lastOperatorIndex + 1);
  };

  const getExpressionBeforeNumber = (lastOperatorIndex: number): string => {
    return lastOperatorIndex === -1 ? "" : answerValue.slice(0, lastOperatorIndex + 1);
  };

  const shouldReturnUnchanged = (value: string, currentNumber: string): boolean => {
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

  const handleNegation = (currentNumber: string, expressionBeforeCurrentNumber: string): string => {
    if (currentNumber.startsWith("(-")) {
      return expressionBeforeCurrentNumber + currentNumber.slice(2, -1);
    }
    if (currentNumber) {
      return expressionBeforeCurrentNumber + "(-" + currentNumber + ")";
    }
    return answerValue;
  };

  // Calculate the final result
  const calculateEquals = (): string => {
    try {
      const evalExpression = prepareExpressionForEvaluation();
      const result = new Function("return (" + evalExpression + ")")();
      return formatResult(result);
    } catch (error) {
      return "Error";
    }
  };

  const prepareExpressionForEvaluation = (): string => {
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.BACKGROUND,
    },
    contentContainer: {
      flex: 1,
      justifyContent: "flex-end",
      margin: LAYOUT.CONTENT_MARGIN,
    },
    expressionField: {
      margin: LAYOUT.BUTTON_MARGIN,
      marginBottom: isLandscape ? 4 : 6,
      flexGrow: 0,
    },
    expression: {
      fontSize: isLandscape ? 18 : 28,
      fontWeight: "500",
      textAlign: "right",
      paddingHorizontal: 10,
      color: COLORS.LIGHT_GRAY,
      textShadowColor: COLORS.SHADOW,
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
    },
    resultsField: {
      margin: LAYOUT.BUTTON_MARGIN,
      marginBottom: isLandscape ? 10 : 15,
      flexGrow: 0,
    },
    results: {
      fontSize: isLandscape ? 38 : 56,
      fontWeight: "500",
      textAlign: "right",
      paddingHorizontal: 10,
      color: COLORS.PRIMARY,
      textShadowColor: COLORS.SHADOW,
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
    },
    calculatorContainer: {
      flexDirection: "row",
      alignItems: "flex-end",
    },
    numberAndFunctionSection: {
      flexDirection: isLandscape ? "row" : "column-reverse", // If in portrait mode, display the function section above the number section; if in landscape mode, display the function section to the right of the number section
    },
    numberSection: {
      flexDirection: "column",
    },
    functionSection: {
      flexDirection: isLandscape ? "column" : "row", // If in landscape mode, display the function buttons vertically; if in portrait mode, display the function buttons horizontally
    },
    operatorSection: {
      flexDirection: "column",
      // The rest of the styles are for the landscape mode.
      // In landscape mode, the operator section is 4 buttons high
      // with the last button, the "=" button, wrapped to below the "%" button in the function section
      maxHeight: isLandscape ? (buttonHeight + LAYOUT.BUTTON_MARGIN * 2) * 4 : undefined,
      width: isLandscape ? buttonWidth + LAYOUT.BUTTON_MARGIN * 2 : undefined,
      flexWrap: "wrap",
      direction: "rtl",
      justifyContent: "flex-end",
    },
    buttonContainer: {
      margin: LAYOUT.BUTTON_MARGIN,
      width: buttonWidth,
      height: buttonHeight,
      shadowColor: COLORS.SHADOW,
      shadowOffset: { width: 1, height: 2 },
      shadowRadius: 4,
      shadowOpacity: 0.2,
      elevation: 4,
    },
    button: {
      flex: 1,
      borderRadius: buttonWidth,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: COLORS.PRIMARY,
      fontSize: isLandscape ? 24 : 36,
      fontWeight: "400",
      textAlign: "center",
      textShadowColor: COLORS.SHADOW,
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.contentContainer}>
          {/* The result field */}
          <ScrollView
            horizontal
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "flex-end",
            }}
            style={styles.expressionField}
            showsHorizontalScrollIndicator={false}
            maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
            ref={(scrollView) => {
              // Scroll to end whenever answerValue changes
              if (scrollView) {
                setTimeout(() => {
                  scrollView.scrollToEnd({ animated: false });
                }, 0);
              }
            }}>
            <Text style={styles.expression}>{expression}</Text>
          </ScrollView>
          {/* The result field */}
          <ScrollView
            horizontal
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "flex-end",
            }}
            style={styles.resultsField}
            showsHorizontalScrollIndicator={false}
            maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
            ref={(scrollView) => {
              // Scroll to end whenever answerValue changes
              if (scrollView) {
                setTimeout(() => {
                  scrollView.scrollToEnd({ animated: false });
                }, 0);
              }
            }}>
            <Text style={styles.results}>{answerValue}</Text>
          </ScrollView>
          {/* The calculator container */}
          <View style={styles.calculatorContainer}>
            {/* The number buttons and function buttons section */}
            <View style={styles.numberAndFunctionSection}>
              {/* The number buttons section is a 3x4 grid of buttons */}
              <View style={styles.numberSection}>
                {BUTTONS.NUMBER.map((row, i) => (
                  <View key={`row-${i}`} style={{ flexDirection: "row" }}>
                    {row.map((button) => (
                      <CalculatorButton
                        key={button}
                        value={button}
                        onPress={buttonPressed}
                        backgroundColor={COLORS.DARK_GRAY}
                        /* If the button is a "0" button, set the width to be 2 buttons wide. Also add padding to the right to make the button text align with the other buttons */
                        style={
                          button === "0"
                            ? {
                                width: buttonWidth * 2 + LAYOUT.BUTTON_MARGIN * 2,
                                paddingRight: buttonWidth + LAYOUT.BUTTON_MARGIN,
                              }
                            : undefined
                        }
                      />
                    ))}
                  </View>
                ))}
              </View>
              {/* The function buttons section */}
              <View style={styles.functionSection}>
                {BUTTONS.FUNCTION.map((button) => (
                  <CalculatorButton
                    key={button}
                    value={button}
                    onPress={buttonPressed}
                    backgroundColor={COLORS.LIGHT_GRAY}
                  />
                ))}
              </View>
            </View>
            {/* The operator buttons section */}
            <View style={styles.operatorSection}>
              {BUTTONS.OPERATOR.map((button) => (
                <CalculatorButton
                  key={button}
                  value={button}
                  onPress={buttonPressed}
                  backgroundColor={COLORS.HIGHLIGHT}
                />
              ))}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
//end of my code
