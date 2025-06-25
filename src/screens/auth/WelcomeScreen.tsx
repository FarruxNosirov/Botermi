import Box from '@/shared/ui/Box';
import { Image } from '@/shared/ui/Image';
import { Text } from '@/shared/ui/Text';
import { AuthScreenProps } from '@/types/navigation';
import AntDesign from '@expo/vector-icons/AntDesign';
import React, { FC, useState } from 'react';
import { Dimensions, FlatList, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
const { width, height, scale } = Dimensions.get('window');
type LoginScreenProps = AuthScreenProps<'Welcome'>;
const WelcomeScreen: FC<LoginScreenProps> = ({ navigation }) => {
  const languages = [
    { code: 'uz', name: "O'zbekcha", flag: require('../../../assets/uz.webp'), icon: '' },
    { code: 'ru', name: 'Русский', flag: require('../../../assets/rus.png') },
  ];
  const [selectedLang, setSelectedLang] = useState(languages[0]);

  const handleLanguageSelect = (lang: any) => {
    setSelectedLang(lang);
    navigation.navigate('Login');
  };
  const RenderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          backgroundColor: '#F0F0F0',
          marginTop: 8,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        onPress={() => handleLanguageSelect(item)}
      >
        <Box
          flexDirection="row"
          alignItems="center"
          py="m"
          borderBottomWidth={1}
          borderBottomColor="border"
          bg="border"
          borderRadius="m"
          px="s"
          width={width * 0.7}
        >
          <Image
            source={item.flag}
            style={{ width: 32, height: 32, borderRadius: 16, marginRight: 16 }}
          />
          <Text variant="langName" flex={1}>
            {item.name}
          </Text>
        </Box>
        <Box pr="m">
          <AntDesign name="right" size={24} color="black" />
        </Box>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require('../../../assets/Apk1.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <Box flex={1} alignItems="center">
        <Box
          position="absolute"
          bottom={0}
          width={width}
          bg="background"
          borderTopLeftRadius="l"
          borderTopRightRadius="l"
          px="l"
          py="xl"
          shadowColor="background"
          shadowOpacity={0.08}
          shadowRadius={8}
          elevation={8}
          height={height * 0.3}
        >
          <Text variant="languageTitle" mb="m">
            Выберите язык
          </Text>
          <FlatList
            data={languages}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => RenderItem({ item })}
          />
        </Box>
      </Box>
    </ImageBackground>
  );
};

export default WelcomeScreen;
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 24,
  },
});
