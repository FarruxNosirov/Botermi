import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AntDesign from '@expo/vector-icons/AntDesign';
import {
  Animated,
  Clipboard,
  Easing,
  Platform,
  ScrollView,
  ToastAndroid,
  UIManager,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const MAX_HEIGHT = 200;

export const Fallback = ({ error }: { error?: Error }) => {
  const [expanded, setExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const { t } = useTranslation();

  const toggleExpand = () => {
    setExpanded((prev) => !prev);

    Animated.timing(animatedHeight, {
      toValue: expanded ? 0 : MAX_HEIGHT,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const handleCopyToClipboard = () => {
    if (error?.message) {
      Clipboard.setString(error.message);
      if (Platform.OS === 'android') {
        ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
      }
    }
  };

  return (
    <View
      style={{
        paddingBottom: 16,
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: expanded ? 40 : 0,
      }}
    >
      <AntDesign name="warning" size={102} color="red" />
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{t('common.errorTitle')} :(</Text>
      <Text style={{ fontSize: 16 }}>{t('common.errorDescription')}</Text>

      <TouchableOpacity
        onPress={toggleExpand}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Text style={{ color: 'blue', fontWeight: 'bold' }}>{t('common.bugReport')}</Text>
        <View style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}>
          <AntDesign name="caretdown" size={24} color="blue" />
        </View>
      </TouchableOpacity>

      <Animated.View
        style={{
          height: animatedHeight,
          overflow: 'hidden',
          width: '100%',
          backgroundColor: '#000',
          borderRadius: 8,
          marginTop: 12,
          position: 'relative',
        }}
      >
        <ScrollView>
          <Text style={{ color: 'white', fontFamily: 'monospace', fontSize: 13, padding: 16 }}>
            {error?.message}
          </Text>
        </ScrollView>
        <View
          style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            padding: 6,
          }}
        >
          <TouchableOpacity onPress={handleCopyToClipboard}>
            <AntDesign name="copy1" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};
