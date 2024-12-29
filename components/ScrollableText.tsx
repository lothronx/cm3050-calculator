// start of my code
import { ScrollView, Text, StyleProp, ViewStyle, TextStyle } from "react-native";

/**
 * Props interface for the ScrollableText component
 * @interface ScrollableTextProps
 * @property {string} content - The text content to be displayed in the scrollable view
 * @property {StyleProp<ViewStyle>} containerStyle - Style object for the ScrollView container
 * @property {StyleProp<TextStyle>} textStyle - Style object for the text content
 */
interface ScrollableTextProps {
  content: string;
  containerStyle: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;
}

/**
 * A horizontally scrollable text component that automatically scrolls to the end
 * when new content is added. Useful for displaying long text content like calculator
 * input/output that needs to be horizontally scrollable.
 * 
 * @component
 * @param {ScrollableTextProps} props - The component props
 * @param {string} props.content - The text content to display
 * @param {StyleProp<ViewStyle>} props.containerStyle - Style for the ScrollView container
 * @param {StyleProp<TextStyle>} props.textStyle - Style for the text content
 * @returns {JSX.Element} A horizontally scrollable text component
 */
export default function ScrollableText({
  content,
  containerStyle,
  textStyle,
}: ScrollableTextProps) {
  return (
    <ScrollView
      horizontal
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "flex-end", // Aligns content to the right side
      }}
      style={containerStyle}
      showsHorizontalScrollIndicator={false}
      // Automatically scrolls to the end when content changes
      ref={(scrollView) => {
        if (scrollView) {
          // Use setTimeout to ensure the scroll happens after the content is rendered
          setTimeout(() => {
            scrollView.scrollToEnd({ animated: false });
          }, 0);
        }
      }}>
      <Text style={textStyle}>{content}</Text>
    </ScrollView>
  );
}
//end of my code
