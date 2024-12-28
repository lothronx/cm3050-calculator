import { Text, View, StyleSheet, Dimensions, TouchableOpacity, StatusBar } from "react-native";
import { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const LAYOUT = {
  CONTENT_MARGIN: 15,
  BUTTON_MARGIN: 6,
  BUTTON_WIDTH: (Dimensions.get("window").width - 30) / 4 - 12,
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
  LIGHT_GRAY: ["C", "+/-", "%"],
  DARK_GRAY: [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    ["0", "."],
  ],
  HIGHLIGHT: ["÷", "×", "-", "+", "="],
} as const;

type ButtonProps = {
  value: string;
  onPress: (value: string) => void;
  backgroundColor: string;
  style?: object;
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

export default function Index() {
  const [answerValue, setAnswerValue] = useState("0");
  const [readyToReplace, setReadyToReplace] = useState(true);
  const [memoryValue, setMemoryValue] = useState("0");
  const [operatorValue, setOperatorValue] = useState("");

  function buttonPressed(value: string): void {
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
  }

  function handleNumber(value: string): string {
    if (readyToReplace) {
      setReadyToReplace(false);
      return value;
    } else {
      return answerValue + value;
    }
  }

  function calculateEquals(): string {
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
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.contentContainer}>
          <Text style={styles.results}>{answerValue}</Text>
          <View style={styles.calculatorContainer}>
            <View style={styles.leftSection}>
              <View style={styles.row}>
                {BUTTONS.LIGHT_GRAY.map((button) => (
                  <CalculatorButton
                    key={button}
                    value={button}
                    onPress={buttonPressed}
                    backgroundColor={COLORS.LIGHT_GRAY}
                  />
                ))}
              </View>
              {BUTTONS.DARK_GRAY.map((row, i) => (
                <View key={`row-${i}`} style={styles.row}>
                  {row.map((button) => (
                    <CalculatorButton
                      key={button}
                      value={button}
                      onPress={buttonPressed}
                      backgroundColor={COLORS.DARK_GRAY}
                      style={
                        button === "0"
                          ? {
                              width:
                                LAYOUT.BUTTON_WIDTH * 2 +
                                LAYOUT.BUTTON_MARGIN * 2,
                              paddingRight:
                                LAYOUT.BUTTON_WIDTH + LAYOUT.BUTTON_MARGIN,
                            }
                          : undefined
                      }
                    />
                  ))}
                </View>
              ))}
            </View>
            <View style={styles.rightSection}>
              {BUTTONS.HIGHLIGHT.map((button) => (
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
    fontSize: 58,
    fontWeight: "600",
    textAlign: "right",
    color: COLORS.PRIMARY,
    margin: LAYOUT.BUTTON_MARGIN,
    marginBottom: 20,
    paddingHorizontal: 10,
    textShadowColor: COLORS.SHADOW,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  calculatorContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  leftSection: {
    flex: 3,
  },
  rightSection: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
  },
  buttonContainer: {
    margin: LAYOUT.BUTTON_MARGIN,
    width: LAYOUT.BUTTON_WIDTH,
    height: LAYOUT.BUTTON_WIDTH,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    elevation: 4,
  },
  button: {
    flex: 1,
    borderRadius: LAYOUT.BUTTON_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: COLORS.PRIMARY,
    fontSize: 36,
    fontWeight: "400",
    textAlign: "center",
    textShadowColor: COLORS.SHADOW,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
