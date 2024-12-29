import { ScrollView, Text, StyleProp, ViewStyle, TextStyle } from "react-native";

interface ScrollableTextProps {
  content: string;
  containerStyle: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;
}

export default function ScrollableText({ content, containerStyle, textStyle }: ScrollableTextProps) {
  return (
    <ScrollView
      horizontal
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "flex-end",
      }}
      style={containerStyle}
      showsHorizontalScrollIndicator={false}
      maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
      ref={(scrollView) => {
        if (scrollView) {
          setTimeout(() => {
            scrollView.scrollToEnd({ animated: false });
          }, 0);
        }
      }}
    >
      <Text style={textStyle}>{content}</Text>
    </ScrollView>
  );
}
