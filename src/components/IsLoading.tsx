import { StyleSheet, Text, View } from 'react-native';
import React, { useRef } from 'react';
import LottieView from 'lottie-react-native';

const IsLoading = () => {
  const animation = useRef<LottieView>(null);
  return (
    <LottieView
      autoPlay
      ref={animation}
      style={{
        backgroundColor: '#fff',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      source={require('@assets/loader.json')}
    />
  );
};

export default IsLoading;
