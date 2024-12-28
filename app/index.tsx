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

export default function Index() {
  const lightGrayButtons = ["C", "+/-", "%"];
  const darkGrayButtons = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    ["0", "."],
  ];
  const highlightButtons = ["÷", "×", "-", "+", "="];

  const [answerValue, setAnswerValue] = useState(0);

  function buttonPressed(value: string) {
    if (value === "C") {
      setAnswerValue(0);
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
                  <TouchableOpacity
                    key={button}
                    style={[styles.button, { backgroundColor: lightGrayColor }]}>
                    <Text style={styles.buttonText}>{button}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {darkGrayButtons.map((row) => (
                <View style={styles.row}>
                  {row.map((button) => (
                    <TouchableOpacity
                      key={button}
                      style={[
                        styles.button,
                        { backgroundColor: darkGrayColor },
                        button === "0" ? { width: buttonWidth * 2 + buttonMargin * 2 } : null,
                      ]}>
                      <Text style={styles.buttonText}>{button}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
            <View style={styles.rightSection}>
              {highlightButtons.map((button) => (
                <TouchableOpacity
                  key={button}
                  style={[styles.button, { backgroundColor: highlightColor }]}>
                  <Text style={styles.buttonText}>{button}</Text>
                </TouchableOpacity>
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
    fontWeight: 600,
    textAlign: "right",
    color: primaryColor,
    margin: buttonMargin,
    marginBottom: 10,
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
  button: {
    margin: buttonMargin,
    width: buttonWidth,
    height: buttonWidth,
    borderRadius: buttonWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: primaryColor,
    fontSize: 36,
    fontWeight: 500,
  },
});
