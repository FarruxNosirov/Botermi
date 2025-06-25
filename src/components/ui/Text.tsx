import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

interface TextProps extends RNTextProps {
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({ style, children, ...props }) => {
  return (
    <RNText style={[styles.text, style]} {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    color: colors.gray[900],
  },
});
