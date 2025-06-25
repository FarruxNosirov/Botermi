import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppDrawerScreenProps } from '@/types/navigation';

type ShareScreenProps = AppDrawerScreenProps<'Share'>;

export const ShareScreen: React.FC<ShareScreenProps> = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Do'stlaringiz bilan ulashing</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ShareScreen;
