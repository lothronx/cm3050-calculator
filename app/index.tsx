import { Text, View, StyleSheet, TouchableOpacity, StatusBar, Dimensions } from "react-native";
import { useState } from "react";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const LAYOUT = {
    CONTENT_MARGIN: 10,
    BUTTON_MARGIN: 6,
  } as const;

  const COLORS = {
    BACKGROUND: "rgb(44,50,54)",
    PRIMARY: "rgb(233,234,234)",
    LIGHT_GRAY: "rgb(114,120,124)",
    DARK_GRAY: "rgb(80,90,94)",
    HIGHLIGHT: "rgb(241,154,55)",
    SHADOW: "rgba(0,0,0,0.5)",
  } as const;

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

  const window = Dimensions.get("window");
  const insets = useSafeAreaInsets();

  // Calculate safe area dimensions
  const safeAreaWidth = window.width - insets.left - insets.right;
  const safeAreaHeight = window.height - insets.top - insets.bottom;

  const isLandscape = window.width > window.height;

  const buttonWidth =
    (safeAreaWidth - LAYOUT.CONTENT_MARGIN * 2) / (isLandscape ? 5 : 4) - LAYOUT.BUTTON_MARGIN * 2;
  const buttonHeight = isLandscape
    ? (safeAreaHeight - LAYOUT.CONTENT_MARGIN * 2) / 6 - LAYOUT.BUTTON_MARGIN * 2
    : buttonWidth;

  const [answerValue, setAnswerValue] = useState("0");
  const [readyToReplace, setReadyToReplace] = useState(true);
  const [memoryValue, setMemoryValue] = useState("0");
  const [operatorValue, setOperatorValue] = useState("");

  type ButtonProps = {
    value: string;
    onPress: (value: string) => void;
    backgroundColor: string;
    style?: object | false;
  };

  const CalculatorButton = ({ value, onPress, backgroundColor, style }: ButtonProps) => (
    <View style={[styles.buttonContainer, style]}>
      <TouchableOpacity
        onPress={() => onPress(value)}
        style={[styles.button, { backgroundColor }, style]}
        activeOpacity={0.7}
        pressRetentionOffset={{ top: 10, left: 10, right: 10, bottom: 10 }}>
        <Text style={styles.buttonText}>{value}</Text>
      </TouchableOpacity>
    </View>
  );

  const buttonPressed = (value: string): void => {
    if (!isNaN(Number(value))) {
      setAnswerValue(handleNumber(value));
    }

    if (value === ".") {
      if (!answerValue.includes(".")) {
        setAnswerValue(answerValue + ".");
        setReadyToReplace(false);
      }
    }

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

    if (value === "=") {
      setAnswerValue(calculateEquals());
      setMemoryValue("0");
      setOperatorValue("");
      setReadyToReplace(true);
    }

    if (value === "+/-") {
      setAnswerValue((parseFloat(answerValue) * -1).toString());
    }

    if (value === "%") {
      setAnswerValue((parseFloat(answerValue) * 0.01).toString());
    }

    if (value === "C") {
      setAnswerValue("0");
      setMemoryValue("0");
      setOperatorValue("");
      setReadyToReplace(true);
    }
  };

  const handleNumber = (value: string): string => {
    if (readyToReplace) {
      setReadyToReplace(false);
      return value;
    } else {
      let newValue = answerValue + value;
      while (newValue.length > 1 && newValue[0] === "0" && newValue[1] !== ".") {
        newValue = newValue.slice(1);
      }
      return newValue;
    }
  };

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
      flexDirection: isLandscape ? "row" : "column-reverse",
    },
    numberSection: {
      flexDirection: "column",
    },
    functionSection: {
      flexDirection: isLandscape ? "column" : "row",
    },
    operatorSection: {
      flexDirection: "column",
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
          <Text style={styles.results}>{answerValue}</Text>
          <View style={styles.calculatorContainer}>
            <View style={styles.numberAndFunctionSection}>
              <View style={styles.numberSection}>
                {BUTTONS.NUMBER.map((row, i) => (
                  <View key={`row-${i}`} style={{ flexDirection: "row" }}>
                    {row.map((button) => (
                      <CalculatorButton
                        key={button}
                        value={button}
                        onPress={buttonPressed}
                        backgroundColor={COLORS.DARK_GRAY}
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
