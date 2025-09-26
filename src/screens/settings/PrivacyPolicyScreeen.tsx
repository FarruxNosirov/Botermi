import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import GoBackHeader from '@/components/GoBackHeader';
import { useGetReviews } from '@/hooks/querys';
import RenderHtml from 'react-native-render-html';

const htmlStyles = {
  p: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4B5563',
    marginBottom: 12,
  },
  strong: {
    fontWeight: 'bold' as const,
    color: '#1F2937',
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#1F2937',
    marginBottom: 16,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#1F2937',
    marginBottom: 12,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1F2937',
    marginBottom: 10,
  },
  ul: {
    marginBottom: 12,
  },
  li: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 8,
  },
  a: {
    color: '#E32F45',
    textDecorationLine: 'underline' as const,
  },
};

const PrivacyPolicyScreeen = () => {
  const { t, i18n } = useTranslation();
  const { data, isLoading, error } = useGetReviews(i18n.language);
  const filterData = data?.find((item: any) => item.id === 31);
  const screenWidth = Dimensions.get('window').width;
  const contentWidth = screenWidth - 32;

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader title={t('back')} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>{t('loading')}</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{t('anErrorOccurred')}</Text>
          </View>
        ) : filterData ? (
          <View style={{ paddingBottom: 100 }}>
            <Text style={styles.title}>{filterData.title}</Text>
            <RenderHtml
              contentWidth={contentWidth}
              source={{ html: filterData.text }}
              tagsStyles={htmlStyles}
            />
          </View>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{t('noData')}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreeen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
});
