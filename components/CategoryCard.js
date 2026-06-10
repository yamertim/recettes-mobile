import { Image, Pressable, StyleSheet, Text } from "react-native";

export default function CategoryCard({ category, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Image
        source={{ uri: category.strCategoryThumb }}
        style={styles.image}
      />

      <Text style={styles.name}>
        {category.strCategory}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    alignItems: "center",
    padding: 10,
    elevation: 2,
  },

  pressed: {
    opacity: 0.7,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  name: {
    marginTop: 6,
    fontWeight: "600",
    textAlign: "center",
  },
});