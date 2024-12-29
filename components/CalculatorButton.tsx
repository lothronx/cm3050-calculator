// start of my code
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, LAYOUT } from "../constants/constants";

/**
 * Props interface for the CalculatorButton component
 * @interface ButtonProps
 * @property {string} value - The text value to display on the button
 * @property {function} onPress - Callback function triggered when button is pressed
 * @property {string} backgroundColor - Background color of the button
 * @property {object} [style] - Optional additional styles to apply to the button
 * @property {boolean} [isLandscape=false] - Whether the device is in landscape mode
 * @property {number} buttonWidth - Width of the button in pixels
 * @property {number} buttonHeight - Height of the button in pixels
 */
type ButtonProps = {
  value: string;
  onPress: (value: string) => void;
  backgroundColor: string;
  style?: object;
  isLandscape?: boolean;
  buttonWidth: number;
  buttonHeight: number;
};

/**
 * A customizable calculator button component with shadow and press effects
 * 
 * @component
 * @param {ButtonProps} props - The props for the calculator button
 * @returns {React.ReactElement} A styled calculator button
 * 
 * @example
 * <CalculatorButton
 *   value="7"
 *   onPress={(val) => handlePress(val)}
 *   backgroundColor="#FFFFFF"
 *   buttonWidth={80}
 *   buttonHeight={80}
 * />
 */
export default function CalculatorButton({
  value,
  onPress,
  backgroundColor,
  style,
  isLandscape = false,
  buttonWidth,
  buttonHeight,
}: ButtonProps) {
  // Create styles based on the current parameters
  const styles = createStyles(isLandscape, buttonWidth, buttonHeight);

  return (
    // Wrap the TouchableOpacity in a View so that the shadow can be applied
    <View style={[styles.buttonContainer, style]}>
      <TouchableOpacity
        onPress={() => onPress(value)}
        style={[styles.button, { backgroundColor }, style]}
        activeOpacity={0.7}>
        <Text style={styles.buttonText}>{value}</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Creates StyleSheet for the calculator button based on device orientation and dimensions
 * 
 * @param {boolean} isLandscape - Whether the device is in landscape mode
 * @param {number} buttonWidth - Width of the button
 * @param {number} buttonHeight - Height of the button
 * @returns {StyleSheet.NamedStyles} StyleSheet object containing button styles
 */
const createStyles = (isLandscape: boolean, buttonWidth: number, buttonHeight: number) =>
  StyleSheet.create({
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
      fontSize: isLandscape ? 24 : 36, // Responsive font size based on orientation
      fontWeight: "400",
      textAlign: "center",
      textShadowColor: COLORS.SHADOW,
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
  });
//end of my code
