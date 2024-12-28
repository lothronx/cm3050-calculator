import { Text, View, StyleSheet, Dimensions, TouchableOpacity, StatusBar } from "react-native";
import { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const contentMargin = 10;
const buttonMargin = 5;
const buttonWidth = (Dimensions.get("window").width - contentMargin * 2) / 4 - buttonMargin * 2;

const bgColor = "rgb(44,50,54)";
const primaryColor = "rgb(233,234,234)";
const lightGrayColor = "rgb(114,120,124)";
const darkGrayColor = "rgb(80,90,94)";
const highlightColor = "rgb(241,154,55)";
const shadowColor = "rgba(0,0,0,0.5)";

type CalculatorButtonProps = {
  value: string;
  onPress: (value: string) => void;
  backgroundColor: string;
  style?: object;
};

const CalculatorButton = ({ value, onPress, backgroundColor, style }: CalculatorButtonProps) => (
  <View style={[styles.buttonContainer, style]}>
    <TouchableOpacity
      key={value}
      onPress={() => onPress(value)}
      style={[styles.button, { backgroundColor }, style]}
      activeOpacity={0.7}
      pressRetentionOffset={{ top: 10, left: 10, right: 10, bottom: 10 }}>
      <Text style={styles.buttonText}>{value}</Text>
    </TouchableOpacity>
  </View>
);

export default function Index() {
  const lightGrayButtons = ["C", "+/-", "%"];
  const darkGrayButtons = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    ["0", "."],
  ];
  const highlightButtons = ["÷", "×", "-", "+", "="];

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
          <Text key="result-field" style={styles.results}>
            {answerValue}
          </Text>
          <View style={styles.calculatorContainer}>
            <View style={styles.leftSection}>
              <View style={styles.row}>
                {lightGrayButtons.map((button) => (
                  <CalculatorButton
                    key={button}
                    value={button}
                    onPress={buttonPressed}
                    backgroundColor={lightGrayColor}
                  />
                ))}
              </View>
              {darkGrayButtons.map((row, i) => (
                <View key={`row-${i}`} style={styles.row}>
                  {row.map((button) => (
                    <CalculatorButton
                      key={button}
                      value={button}
                      onPress={buttonPressed}
                      backgroundColor={darkGrayColor}
                      style={
                        button === "0"
                          ? {
                              width: buttonWidth * 2 + buttonMargin * 2,
                              paddingRight: buttonWidth + buttonMargin,
                            }
                          : undefined
                      }
                    />
                  ))}
                </View>
              ))}
            </View>
            <View style={styles.rightSection}>
              {highlightButtons.map((button) => (
                <CalculatorButton
                  key={button}
                  value={button}
                  onPress={buttonPressed}
                  backgroundColor={highlightColor}
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
    backgroundColor: bgColor,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
    margin: contentMargin,
  },
  results: {
    fontSize: 58,
    fontWeight: "600",
    textAlign: "right",
    color: primaryColor,
    margin: buttonMargin,
    marginBottom: 20,
    paddingHorizontal: 10,
    textShadowColor: shadowColor,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
    margin: buttonMargin,
    width: buttonWidth,
    height: buttonWidth,
    shadowColor: shadowColor,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 2,
    elevation: 8,
  },
  button: {
    flex: 1,
    borderRadius: buttonWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: primaryColor,
    fontSize: 36,
    fontWeight: "500",
    textAlign: "center",
    textShadowColor: shadowColor,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
