import { Image, Pressable, StyleSheet, Text } from "react-native";

export default function MealCard({
  meal,
  onPress,
  horizontal = false,
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        horizontal ? styles.horizontalCard : styles.gridCard,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Image
        source={{ uri: meal.strMealThumb }}
        style={
          horizontal
            ? styles.horizontalImage
            : styles.gridImage
        }
      />

      <Text
        style={
          horizontal
            ? styles.horizontalText
            : styles.gridText
        }
        numberOfLines={2}
      >
        {meal.strMeal}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  gridCard: {
    flex: 1,
    margin: 6,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
  },

  horizontalCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 8,
    overflow: "hidden",
    elevation: 2,
  },

  pressed: {
    opacity: 0.7,
  },

  gridImage: {
    width: "100%",
    height: 130,
  },

  horizontalImage: {
    width: 80,
    height: 80,
  },

  gridText: {
    padding: 8,
    fontWeight: "600",
    fontSize: 13,
  },

  horizontalText: {
    flex: 1,
    padding: 10,
    fontWeight: "600",
    alignSelf: "center",
  },
});