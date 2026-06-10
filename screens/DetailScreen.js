import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { getMealById } from "../services/api";

export default function DetailScreen({
  route,
  navigation,
}) {
  const { mealId } = route.params;

  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMeal = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMealById(mealId);

      if (!data) {
        throw new Error("Recette introuvable.");
      }

      setMeal(data);

      navigation.setOptions({
        title: data.strMeal,
      });
    } catch (err) {
      setError(
        err.message || "Impossible de charger la recette."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeal();
  }, [mealId, navigation]);

  const openYoutubeVideo = async () => {
    if (!meal?.strYoutube) {
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(
        meal.strYoutube
      );

      if (canOpen) {
        await Linking.openURL(meal.strYoutube);
      } else {
        setError(
          "Impossible d’ouvrir la vidéo de cette recette."
        );
      }
    } catch {
      setError(
        "Une erreur est survenue pendant l’ouverture de la vidéo."
      );
    }
  };

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
            Chargement de la recette...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !meal) {
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
            onPress={loadMeal}
          >
            <Text style={styles.retryText}>
              Réessayer
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient =
      meal[`strIngredient${i}`]?.trim();

    const measure =
      meal[`strMeasure${i}`]?.trim();

    if (ingredient) {
      ingredients.push({
        id: i,
        name: ingredient,
        measure: measure || "",
      });
    }
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["left", "right", "bottom"]}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{ uri: meal.strMealThumb }}
          style={styles.image}
        />

        <View style={styles.body}>
          <Text style={styles.mealTitle}>
            {meal.strMeal}
          </Text>

          <View style={styles.infoRow}>
            {meal.strCategory ? (
              <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>
                  {meal.strCategory}
                </Text>
              </View>
            ) : null}

            {meal.strArea ? (
              <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>
                  {meal.strArea}
                </Text>
              </View>
            ) : null}
          </View>

          {meal.strYoutube ? (
            <Pressable
              style={({ pressed }) => [
                styles.youtubeButton,
                pressed && styles.pressed,
              ]}
              onPress={openYoutubeVideo}
            >
              <Text style={styles.youtubeIcon}>
                ▶
              </Text>

              <Text style={styles.youtubeButtonText}>
                Voir la vidéo de préparation
              </Text>
            </Pressable>
          ) : (
            <View style={styles.noVideoContainer}>
              <Text style={styles.noVideoText}>
                Aucune vidéo disponible pour cette recette.
              </Text>
            </View>
          )}

          {error ? (
            <Text style={styles.videoErrorText}>
              {error}
            </Text>
          ) : null}

          <Text style={styles.sectionTitle}>
            Ingrédients
          </Text>

          <View style={styles.ingredientsContainer}>
            {ingredients.map((item) => (
              <View
                key={item.id}
                style={styles.ingredientRow}
              >
                <Text style={styles.bullet}>
                  •
                </Text>

                <Text style={styles.ingredientText}>
                  {item.measure
                    ? `${item.measure} `
                    : ""}
                  {item.name}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>
            Instructions
          </Text>

          <View style={styles.instructionsContainer}>
            <Text style={styles.instructions}>
              {meal.strInstructions ||
                "Aucune instruction disponible."}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF8F0",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFF8F0",
  },

  scrollContent: {
    paddingBottom: 45,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  image: {
    width: "100%",
    height: 280,
    resizeMode: "cover",
  },

  body: {
    padding: 16,
  },

  mealTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2F2F2F",
    marginBottom: 10,
  },

  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 14,
  },

  infoBadge: {
    backgroundColor: "#FFE5D9",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginRight: 8,
    marginBottom: 6,
  },

  infoBadgeText: {
    color: "#D94F1F",
    fontSize: 13,
    fontWeight: "600",
  },

  youtubeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E62117",
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 10,
  },

  youtubeIcon: {
    color: "#FFFFFF",
    fontSize: 18,
    marginRight: 9,
  },

  youtubeButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },

  noVideoContainer: {
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
    marginBottom: 10,
  },

  noVideoText: {
    color: "#666666",
    fontSize: 14,
    textAlign: "center",
  },

  videoErrorText: {
    color: "#C62828",
    textAlign: "center",
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 18,
    marginBottom: 10,
  },

  ingredientsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    elevation: 2,
  },

  ingredientRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 7,
  },

  bullet: {
    color: "#FF6B35",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
    lineHeight: 22,
  },

  ingredientText: {
    flex: 1,
    fontSize: 15,
    color: "#555555",
    lineHeight: 22,
  },

  instructionsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    elevation: 2,
  },

  instructions: {
    fontSize: 15,
    color: "#444444",
    lineHeight: 24,
    textAlign: "justify",
  },

  loadingText: {
    marginTop: 10,
    color: "#555555",
  },

  errorText: {
    color: "#C62828",
    textAlign: "center",
    fontSize: 15,
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

  pressed: {
    opacity: 0.75,
  },
});