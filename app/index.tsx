// start of my code
import { Text, View, StyleSheet, TouchableOpacity, StatusBar, Dimensions } from "react-native";
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
  const [answerValue, setAnswerValue] = useState("0");
  const [readyToReplace, setReadyToReplace] = useState(true);
  const [memoryValue, setMemoryValue] = useState("0");
  const [operatorValue, setOperatorValue] = useState("");

  // Button component props
  type ButtonProps = {
    value: string;
    onPress: (value: string) => void;
    backgroundColor: string;
    style?: object | false;
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
    // If the value is a number, handle the number logic
    if (!isNaN(Number(value))) {
      setAnswerValue(handleNumber(value));
    }

    // If the value is a decimal point, append it to the answer value if it's not already there
    if (value === ".") {
      if (!answerValue.includes(".")) {
        setAnswerValue(answerValue + ".");
        setReadyToReplace(false);
      }
    }

    // If the value is an operator, handle the operator logic
    if (["÷", "×", "-", "+"].includes(value)) {
      if (operatorValue !== "") {
        setAnswerValue(calculateEquals());
        setMemoryValue(calculateEquals());
      } else {
        setMemoryValue(answerValue);
      }
      setReadyToReplace(true);
      setOperatorValue(value);
    }

    // If the value is an equals sign, calculate the answer and reset the memory and operator values
    if (value === "=") {
      setAnswerValue(calculateEquals());
      setMemoryValue("0");
      setOperatorValue("");
      setReadyToReplace(true);
    }

    // If the value is a +/- sign, set the answerValue to be the positive/negative equivalent
    if (value === "+/-") {
      setAnswerValue((parseFloat(answerValue) * -1).toString());
    }

    // If the value is a percentage sign, multiply the current value by 0.01
    if (value === "%") {
      setAnswerValue((parseFloat(answerValue) * 0.01).toString());
    }

    // If the value is a clear sign, reset everything
    if (value === "C") {
      setAnswerValue("0");
      setMemoryValue("0");
      setOperatorValue("");
      setReadyToReplace(true);
    }
  };

  // Handle number logic
  const handleNumber = (value: string): string => {
    // If the readyToReplace flag is true, set it to false and return the value
    if (readyToReplace) {
      setReadyToReplace(false);
      return value;
    } else {
      // If the readyToReplace flag is false, append the value to the answerValue and return the new value
      let newValue = answerValue + value;
      // If the new value starts with "0" and is not a decimal point, remove the leading "0"
      while (newValue.length > 1 && newValue[0] === "0" && newValue[1] !== ".") {
        newValue = newValue.slice(1);
      }
      return newValue;
    }
  };

  // Calculate the answer
  const calculateEquals = (): string => {
    let previous = parseFloat(memoryValue);
    let current = parseFloat(answerValue);
    switch (operatorValue) {
      case "÷":
        return (previous / current).toString();
      case "×":
        return (previous * current).toString();
      case "-":
        return (previous - current).toString();
      case "+":
        return (previous + current).toString();
      default:
        return current.toString();
    }
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
    results: {
      fontSize: isLandscape ? 38 : 58,
      fontWeight: "600",
      textAlign: "right",
      color: COLORS.PRIMARY,
      margin: LAYOUT.BUTTON_MARGIN,
      marginBottom: isLandscape ? 10 : 15,
      paddingHorizontal: 10,
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
          <Text style={styles.results}>{answerValue}</Text>
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