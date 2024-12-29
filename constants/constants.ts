// start of my code
// Layout constants
export const LAYOUT = {
  CONTENT_MARGIN: 10,
  BUTTON_MARGIN: 6,
} as const;

// Color scheme
export const COLORS = {
  BACKGROUND: "rgb(44,50,54)",
  PRIMARY: "rgb(233,234,234)",
  LIGHT_GRAY: "rgb(114,120,124)",
  DARK_GRAY: "rgb(80,90,94)",
  HIGHLIGHT: "rgb(241,154,55)",
  SHADOW: "rgba(0,0,0,0.5)",
} as const;

// Calculator buttons
export const BUTTONS = {
  FUNCTION: ["C", "+/-", "%"],
  NUMBER: [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    ["0", "."],
  ],
  OPERATOR: ["÷", "×", "-", "+", "="],
} as const;
//end of my code