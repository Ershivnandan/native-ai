import { KeyboardAvoidingView, Platform, Keyboard, Pressable } from "react-native";
import { memo } from "react";
import type { ReactNode } from "react";

interface KeyboardAwareViewProps {
  children: ReactNode;
  dismissOnTap?: boolean;
}

export const KeyboardAwareView = memo(
  ({ children, dismissOnTap = true }: KeyboardAwareViewProps) => {
    return (
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {dismissOnTap ? (
          <Pressable
            className="flex-1"
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            {children}
          </Pressable>
        ) : (
          children
        )}
      </KeyboardAvoidingView>
    );
  },
);
