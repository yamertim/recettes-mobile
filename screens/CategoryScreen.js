import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { getMealsByCategory } from "../services/api";
import MealCard from "../components/MealCard";

export default function CategoryScreen({
  route,
  navigation,
}) {
  const { category } = route.params;

  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMeals = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMealsByCategory(category);

      setMeals(data);
    } catch (err) {
      setError(
        err.message || "Impossible de charger les plats."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: category,
    });

    loadMeals();
  }, [category, navigation]);

  if (loading) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={["left", "right", "bottom"]}
      >
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#FF6B35"
          />

          <Text style={styles.loadingText}>
            Chargement des plats...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={["left", "right", "bottom"]}
      >
        <View style={styles.center}>
          <Text style={styles.errorText}>
            {error}
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.retryButton,
              pressed && styles.pressed,
            ]}
            onPress={loadMeals}
          >
            <Text style={styles.retryText}>
              Réessayer
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["left", "right", "bottom"]}
    >
      <FlatList
        key="meals-grid"
        style={styles.list}
        contentContainerStyle={styles.content}
        data={meals}
        numColumns={2}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <MealCard
            meal={item}
            onPress={() =>
              navigation.navigate("Detail", {
                mealId: item.idMeal,
              })
            }
          />
        )}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Aucun plat disponible dans cette catégorie.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF8F0",
  },

  list: {
    flex: 1,
    backgroundColor: "#FFF8F0",
  },

  content: {
    flexGrow: 1,
    padding: 10,
    paddingBottom: 30,
  },

  columnWrapper: {
    justifyContent: "space-between",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  loadingText: {
    marginTop: 10,
    color: "#555555",
  },

  errorText: {
    color: "#C62828",
    textAlign: "center",
  },

  retryButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 12,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: "#666666",
  },

  pressed: {
    opacity: 0.75,
  },
});