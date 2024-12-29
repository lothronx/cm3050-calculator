import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, LAYOUT } from "../constants/constants";

type ButtonProps = {
  value: string;
  onPress: (value: string) => void;
  backgroundColor: string;
  style?: object;
  isLandscape?: boolean;
  buttonWidth: number;
  buttonHeight: number;
};

export default function CalculatorButton({
  value,
  onPress,
  backgroundColor,
  style,
  isLandscape = false,
  buttonWidth,
  buttonHeight,
}: ButtonProps) {
  const styles = createStyles(isLandscape, buttonWidth, buttonHeight);
  return (
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
      fontSize: isLandscape ? 24 : 36,
      fontWeight: "400",
      textAlign: "center",
      textShadowColor: COLORS.SHADOW,
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
  });
