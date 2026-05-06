import { memo, useMemo } from "react";
import { Platform } from "react-native";
import Markdown from "react-native-markdown-display";
import { useTheme } from "@/hooks/useTheme";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = memo(({ content }: MarkdownRendererProps) => {
  const { isDark } = useTheme();

  const styles = useMemo(
    () => ({
      body: {
        color: isDark ? "#f1f5f9" : "#1e293b",
        fontSize: 16,
        lineHeight: 24,
      },
      heading1: {
        color: isDark ? "#ffffff" : "#0f172a",
        fontSize: 22,
        fontWeight: "700" as const,
        marginTop: 12,
        marginBottom: 8,
      },
      heading2: {
        color: isDark ? "#ffffff" : "#0f172a",
        fontSize: 19,
        fontWeight: "600" as const,
        marginTop: 10,
        marginBottom: 6,
      },
      heading3: {
        color: isDark ? "#f8fafc" : "#1e293b",
        fontSize: 17,
        fontWeight: "600" as const,
        marginTop: 8,
        marginBottom: 4,
      },
      paragraph: {
        marginTop: 0,
        marginBottom: 8,
      },
      code_inline: {
        backgroundColor: isDark ? "#334155" : "#f1f5f9",
        color: isDark ? "#e2e8f0" : "#be185d",
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
        fontSize: 14,
      },
      fence: {
        backgroundColor: isDark ? "#1e293b" : "#f8fafc",
        borderColor: isDark ? "#475569" : "#e2e8f0",
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginVertical: 8,
      },
      code_block: {
        color: isDark ? "#e2e8f0" : "#1e293b",
        fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
        fontSize: 13,
        lineHeight: 20,
      },
      blockquote: {
        backgroundColor: isDark ? "#1e293b" : "#f8fafc",
        borderLeftColor: isDark ? "#3b82f6" : "#3b82f6",
        borderLeftWidth: 4,
        paddingLeft: 12,
        paddingVertical: 4,
        marginVertical: 8,
      },
      list_item: {
        marginBottom: 4,
      },
      bullet_list: {
        marginBottom: 8,
      },
      ordered_list: {
        marginBottom: 8,
      },
      link: {
        color: "#3b82f6",
        textDecorationLine: "underline" as const,
      },
      strong: {
        fontWeight: "700" as const,
      },
      em: {
        fontStyle: "italic" as const,
      },
      hr: {
        backgroundColor: isDark ? "#475569" : "#e2e8f0",
        height: 1,
        marginVertical: 12,
      },
    }),
    [isDark],
  );

  return <Markdown style={styles}>{content}</Markdown>;
});
