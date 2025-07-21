import React, { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  message?: string;
  animationSource?: any;
  style?: any;
  showAnimation?: boolean;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  animationSource = require('../../assets/Animation - 1748335411299.json'),
  style,
  showAnimation = true,
  icon,
}) => {
  const { t } = useTranslation();
  const animation = useRef<LottieView>(null);

  return (
    <View style={[styles.emptyContainer, style]}>
      {icon ? (
        icon
      ) : showAnimation ? (
        <LottieView autoPlay ref={animation} style={styles.animation} source={animationSource} />
      ) : null}
      <Text style={styles.emptyText}>{message || t('youHaveNoQueriesFound')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  animation: {
    width: 200,
    height: 200,
    backgroundColor: '#eee',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default EmptyState;
