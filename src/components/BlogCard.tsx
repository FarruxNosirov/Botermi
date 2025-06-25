import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
type BlogCardProps = {
  imge: string;
  name: string;
  slug: string;
  onPress: () => void;
};
const BlogCard = ({ imge, name, slug, onPress }: BlogCardProps) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View>
      <Image source={{ uri: imge }} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>{slug}</Text>
      </View>
    </View>
    <Text style={styles.title}>{name}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    boxShadow: '0px 0px 5px #cacaca',
  },
  image: {
    width: '100%',
    height: 200,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(220, 38, 38, 0.85)',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  overlayText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    margin: 12,
    color: '#222',
  },
});

export default BlogCard;
