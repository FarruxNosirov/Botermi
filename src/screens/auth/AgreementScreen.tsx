import { AuthStackParamList } from '@/types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

type Props = NativeStackScreenProps<AuthStackParamList, 'Agreement'>;

export const AgreementScreen = ({ navigation, route }: Props) => {
  const { isRegistration } = route.params || { isRegistration: false };

  const handleAccept = () => {
    // dispatch(acceptAgreement());
    // if (isRegistration) {
    // navigation.navigate('Registration');
    // }
    // If not registration, acceptAgreement will trigger MainApp navigation through RootNavigator
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Ikki tomonlama kelishuv</Text>

        <Text style={styles.subtitle}>Атамалар:</Text>

        <View style={styles.termContainer}>
          <Text style={styles.term}>EPA</Text>
          <Text style={styles.dash}> – </Text>
          <Text style={styles.definition}>EPA компанияси.</Text>
        </View>

        <View style={styles.termContainer}>
          <Text style={styles.term}>Махсулот</Text>
          <Text style={styles.dash}> – </Text>
          <Text style={styles.definition}>EPA компанияси махсулотлари.</Text>
        </View>

        <View style={styles.termContainer}>
          <Text style={styles.term}>Дилер</Text>
          <Text style={styles.dash}> – </Text>
          <Text style={styles.definition}>
            EPAнинг вакили сифатида ушбу келишувда белгиланган ваколатлар доирасида фаолият юритувчи
            шахс. Дилер EPA томонидан белгилаб берилган худудда ўз дўконлари ҳамда комиссионерлар
            орқали махсулотларнинг сотувини ташкил қилишга масъулдир.
          </Text>
        </View>

        <View style={styles.termContainer}>
          <Text style={styles.term}>Комиссионер</Text>
          <Text style={styles.dash}> – </Text>
          <Text style={styles.definition}>
            Дилер билан тузилган келишув асосида Дилернинг вакили сифатида махсулотларни сотиш билан
            шуғулланувчи шахс. Дилер Комиссионерга етказиб берилган махсулотлар EPA томонидан
            белгиланган улгуржи нархдан паст бўлмаган нархда сотиш топшириғини беради. Агар
            комиссионер Дилер томонидан белгиланган нархдан баландроқ нархда махсулотни сота олса,
            қўшимча фойда комиссионернинг хизмат ҳақи ҳисобланади.
          </Text>
        </View>

        <View style={styles.termContainer}>
          <Text style={styles.term}>Мижоз</Text>
          <Text style={styles.dash}> – </Text>
          <Text style={styles.definition}>
            Дилер ёки комиссионерлар дўконларидан махсулотларни сотиб олувчи харидор.
          </Text>
        </View>

        <View style={styles.termContainer}>
          <Text style={styles.term}>Уста</Text>
          <Text style={styles.dash}> – </Text>
          <Text style={styles.definition}>
            EPA компанияси томонидан бонус ҳисоб рақами очилган, устачилик билан шуғулланувчи мижоз.
          </Text>
        </View>

        <View style={styles.termContainer}>
          <Text style={styles.term}>Бонус</Text>
          <Text style={styles.dash}> – </Text>
          <Text style={styles.definition}>
            ҳар бир харид қилинган махсулотга товар қийматидан маълум бир % да бериладиган кешбек.
            Бу ерда кешбек махсулот турига қараб тўпланиши ва тўлашни ваъда қилади. Ушбу бонус EPA
            компанияси томонидан тўланади.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.button} onPress={handleAccept}>
          <Text style={styles.buttonText}>Roziman</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  termContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  term: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  dash: {
    fontSize: 16,
    color: '#1F2937',
  },
  definition: {
    flex: 1,
    fontSize: 16,
    color: '#4B5563',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  button: {
    backgroundColor: '#E32F45',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
