import BlogCard from '@/components/BlogCard';
import IsLoading from '@/components/IsLoading';
import { useBlogs } from '@/hooks/querys';
import { HomeStackParamList } from '@/types/navigation';
import { BlogsType } from '@/types/product';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Blogs = () => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const { data, isLoading, isError } = useBlogs();
  const blogsData = data?.data?.data;

  if (isLoading) {
    return <IsLoading />;
  }

  if (isError) {
    return (
      <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
            <Text style={styles.headerTitle}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#666' }}>
            Ma'lumotlarni yuklashda xatolik yuz berdi
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
          <Text style={styles.headerTitle}>Back</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={{ padding: 16, backgroundColor: '#fff' }}
        showsVerticalScrollIndicator={false}
      >
        {blogsData?.map((blog: BlogsType) => {
          return (
            <BlogCard
              key={blog.id}
              imge={blog.image}
              name={blog.name}
              slug={blog.slug}
              onPress={() => {
                Linking.openURL(blog.link);
              }}
            />
          );
        })}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};
export default Blogs;
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
    flexDirection: 'row',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
});
