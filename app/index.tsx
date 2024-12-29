// start of my code
/**
 * Calculator App - Main Component
 *
 * This is the main component of a responsive calculator application that adapts its layout
 * based on device orientation (portrait/landscape). The calculator supports basic arithmetic
 * operations and includes features like percentage calculation and sign toggling.
 *
 * Features:
 * - Responsive layout that adjusts to portrait and landscape orientations
 * - Safe area aware design for modern devices with notches
 * - Basic arithmetic operations (addition, subtraction, multiplication, division)
 * - Additional operations: percentage, sign toggle, decimal point
 * - Expression history display
 * - Scrollable input/output fields for long numbers
 */

import { View, StyleSheet, StatusBar, Dimensions } from "react-native";
import { useState } from "react";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LAYOUT, COLORS, BUTTONS } from "../constants/constants";
import { InputType, handleNumber, handleOperator, calculateEquals } from "../utils/calculatorLogic";
import CalculatorButton from "../components/CalculatorButton";
import ScrollableText from "../components/ScrollableText";

/**
 * Main Calculator component that handles the UI layout and calculator logic
 * @returns React component with calculator interface
 */
export default function Index() {
  // Calculate safe area dimensions
  const window = Dimensions.get("window");
  const insets = useSafeAreaInsets();
  const safeAreaWidth = window.width - insets.left - insets.right;
  const safeAreaHeight = window.height - insets.top - insets.bottom;

  // Determine if the device is in landscape mode
  const isLandscape = window.width > window.height;

  // Calculate button dimensions based on the device orientation and safe area dimensions
  // The button section has 5 columns in landscape mode and 4 columns in portrait mode
  // Thus, in landscape mode, the button width is 1/5 of the safe area width (minus margins); in portrait mode, the button width is 1/4 of that
  const buttonWidth =
    (safeAreaWidth - LAYOUT.CONTENT_MARGIN * 2) / (isLandscape ? 5 : 4) - LAYOUT.BUTTON_MARGIN * 2;
  // The button is flattened in landscape mode and round in portrait mode
  // Thus, in landscape mode, the button height is 1/6 of the safe area height (very flat); in portrait mode, the button height is equal to the button width
  const buttonHeight = isLandscape
    ? (safeAreaHeight - LAYOUT.CONTENT_MARGIN * 2) / 6 - LAYOUT.BUTTON_MARGIN * 2
    : buttonWidth;

  // Create styles based on the current parameters
  const styles = createStyles(isLandscape, buttonWidth, buttonHeight);

  // State Management
  /**
   * Tracks the type of the last input (number, operator, or other)
   * Used to prevent invalid sequences of operations
   */
  const [lastInputType, setLastInputType] = useState<InputType>("");

  /**
   * Stores the current calculation value or result
   * Initialized to "0" and updated as user inputs numbers or performs calculations
   */
  const [answerValue, setAnswerValue] = useState("0");

  /**
   * Stores the previous expression after calculation
   * Displayed above the current input for reference
   */
  const [expression, setExpression] = useState("");

  /**
   * Handles all button press events in the calculator
   * @param value - The value/operation of the pressed button
   */
  const buttonPressed = (value: string): void => {
    // If the user presses "C", reset everything
    if (value === "C") {
      setLastInputType("");
      setAnswerValue("0");
      setExpression("");
    }

    // If the user presses "=", store all their previous inputs in expression and store the calculated result in answerValue
    if (value === "=") {
      setLastInputType("");
      setExpression(answerValue);
      setAnswerValue(calculateEquals(answerValue, lastInputType));
    }

    // Handle numbers and number-like values
    if (!isNaN(Number(value)) || [".", "+/-", "%"].includes(value)) {
      setLastInputType("number");
      setAnswerValue(handleNumber(value, answerValue));
      setExpression("");
    }

    // Handle operators
    if (["÷", "×", "-", "+"].includes(value)) {
      setAnswerValue(handleOperator(value, lastInputType, answerValue));
      setLastInputType("operator");
      setExpression("");
    }
  };

  /**
   * Renders a calculator button with specified properties
   * @param button - The button text/value to display
   * @param backgroundColor - The background color of the button
   * @param style - Optional additional styles to apply
   * @returns A CalculatorButton component
   */
  const renderCalculatorButton = (button: string, backgroundColor: string, style?: object) => (
    <CalculatorButton
      key={button}
      value={button}
      onPress={buttonPressed}
      backgroundColor={backgroundColor}
      style={style}
      isLandscape={isLandscape}
      buttonWidth={buttonWidth}
      buttonHeight={buttonHeight}
    />
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.contentContainer}>
          {/* The expression field */}
          <ScrollableText
            content={expression}
            containerStyle={styles.expressionField}
            textStyle={styles.expression}
          />
          {/* The results field */}
          <ScrollableText
            content={answerValue}
            containerStyle={styles.resultsField}
            textStyle={styles.results}
          />
          {/* The calculator buttons container */}
          <View style={styles.calculatorContainer}>
            {/* The number buttons and function buttons section */}
            <View style={styles.numberAndFunctionSection}>
              {/* The number buttons section is a 3x4 grid of buttons */}
              <View style={styles.numberSection}>
                {BUTTONS.NUMBER.map((row, i) => (
                  <View key={`row-${i}`} style={{ flexDirection: "row" }}>
                    {row.map((button) =>
                      renderCalculatorButton(
                        button,
                        COLORS.DARK_GRAY,
                        /* If the button is "0", use a special style */
                        button === "0" ? styles.buttonZero : undefined
                      )
                    )}
                  </View>
                ))}
              </View>
              {/* The function buttons section */}
              <View style={styles.functionSection}>
                {BUTTONS.FUNCTION.map((button) =>
                  renderCalculatorButton(button, COLORS.LIGHT_GRAY)
                )}
              </View>
            </View>
            {/* The operator buttons section */}
            <View style={styles.operatorSection}>
              {BUTTONS.OPERATOR.map((button) => renderCalculatorButton(button, COLORS.HIGHLIGHT))}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// Create styles with dynamic parameters
const createStyles = (isLandscape: boolean, buttonWidth: number, buttonHeight: number) =>
  StyleSheet.create({
    // Fill the entire screen
    container: {
      flex: 1,
      backgroundColor: COLORS.BACKGROUND,
    },
    // Leave some space on the edges
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
      flexDirection: isLandscape ? "row" : "column-reverse", // In portrait mode, display the function section above the number section; in landscape mode, display the function section to the right of the number section
    },
    numberSection: {
      flexDirection: "column",
    },
    functionSection: {
      flexDirection: isLandscape ? "column" : "row", // In landscape mode, display the function buttons vertically; in portrait mode, display the function buttons horizontally
    },
    operatorSection: {
      flexDirection: "column",
      // The rest of the code is for the landscape mode.
      // In landscape mode, the operator section is 4 buttons high
      // with the last button, the "=" button, wrapped to below the function section buttons
      maxHeight: isLandscape ? (buttonHeight + LAYOUT.BUTTON_MARGIN * 2) * 4 : undefined,
      width: isLandscape ? buttonWidth + LAYOUT.BUTTON_MARGIN * 2 : undefined,
      flexWrap: "wrap",
      direction: "rtl",
      justifyContent: "flex-end",
    },
    buttonZero: {
      // For button "0":
      // Set the button width to twice the normal width (plus the internal margins)
      // Add extra padding to the right so the text "0" is vertically aligned with the other buttons
      width: buttonWidth * 2 + LAYOUT.BUTTON_MARGIN * 2,
      paddingRight: buttonWidth + LAYOUT.BUTTON_MARGIN,
    },
  });
//end of my code
