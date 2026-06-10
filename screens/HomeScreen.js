import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  getCategories,
  searchMealByName,
} from "../services/api";

import CategoryCard from "../components/CategoryCard";
import MealCard from "../components/MealCard";

export default function HomeScreen({ navigation }) {
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  const [error, setError] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCategories();

      setCategories(data);
    } catch (err) {
      setError(
        err.message || "Impossible de charger les catégories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSearch = async () => {
    const mealName = search.trim();

    if (!mealName) {
      setError("Veuillez saisir le nom d’une recette.");
      return;
    }

    try {
      setSearchLoading(true);
      setError("");

      const results = await searchMealByName(mealName);

      setSearchResults(results);
    } catch (err) {
      setError(
        err.message || "Impossible d’effectuer la recherche."
      );
    } finally {
      setSearchLoading(false);
    }
  };

  const clearSearch = () => {
    setSearch("");
    setSearchResults(null);
    setError("");
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
            Chargement des catégories...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (
    error &&
    searchResults === null &&
    categories.length === 0
  ) {
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
            onPress={loadCategories}
          >
            <Text style={styles.buttonText}>
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
      <View style={styles.container}>
        <Text style={styles.pageTitle}>
          Trouvez votre recette
        </Text>

        <Text style={styles.subtitle}>
          Recherchez un plat ou choisissez une catégorie.
        </Text>

        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder="Exemple : Chicken"
            placeholderTextColor="#999999"
            value={search}
            onChangeText={(value) => {
              setSearch(value);

              if (error) {
                setError("");
              }
            }}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />

          <Pressable
            style={({ pressed }) => [
              styles.searchButton,
              pressed && styles.pressed,
            ]}
            onPress={handleSearch}
          >
            <Text style={styles.buttonText}>
              Chercher
            </Text>
          </Pressable>
        </View>

        {searchResults !== null && (
          <Pressable
            style={({ pressed }) => [
              styles.clearButton,
              pressed && styles.pressed,
            ]}
            onPress={clearSearch}
          >
            <Text style={styles.clearButtonText}>
              Retour aux catégories
            </Text>
          </Pressable>
        )}

        {error ? (
          <Text style={styles.errorText}>
            {error}
          </Text>
        ) : null}

        {searchLoading ? (
          <View style={styles.searchLoader}>
            <ActivityIndicator
              size="large"
              color="#FF6B35"
            />

            <Text style={styles.loadingText}>
              Recherche en cours...
            </Text>
          </View>
        ) : searchResults !== null ? (
          <>
            <Text style={styles.sectionTitle}>
              Résultats ({searchResults.length})
            </Text>

            <FlatList
              key="search-results-list"
              data={searchResults}
              numColumns={1}
              keyExtractor={(item) => item.idMeal}
              renderItem={({ item }) => (
                <MealCard
                  meal={item}
                  horizontal
                  onPress={() =>
                    navigation.navigate("Detail", {
                      mealId: item.idMeal,
                    })
                  }
                />
              )}
              contentContainerStyle={
                searchResults.length === 0
                  ? styles.emptyListContainer
                  : styles.listContent
              }
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  Aucune recette trouvée.
                </Text>
              }
            />
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>
              Catégories
            </Text>

            <FlatList
              key="categories-grid-list"
              data={categories}
              numColumns={2}
              keyExtractor={(item) => item.idCategory}
              renderItem={({ item }) => (
                <CategoryCard
                  category={item}
                  onPress={() =>
                    navigation.navigate("Category", {
                      category: item.strCategory,
                    })
                  }
                />
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={styles.columnWrapper}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  Aucune catégorie disponible.
                </Text>
              }
            />
          </>
        )}
      </View>
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
    paddingHorizontal: 12,
    paddingTop: 12,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  pageTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#2F2F2F",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 14,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  input: {
    flex: 1,
    height: 46,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: "#333333",
    marginRight: 8,
  },

  searchButton: {
    height: 46,
    backgroundColor: "#FF6B35",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  retryButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 10,
    paddingHorizontal: 22,
    paddingVertical: 11,
    marginTop: 12,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },

  clearButton: {
    alignSelf: "flex-start",
    backgroundColor: "#FFE5D9",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },

  clearButtonText: {
    color: "#D94F1F",
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },

  loadingText: {
    marginTop: 10,
    color: "#666666",
    textAlign: "center",
  },

  errorText: {
    color: "#C62828",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
  },

  searchLoader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  listContent: {
    paddingBottom: 30,
  },

  emptyListContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 30,
  },

  emptyText: {
    color: "#777777",
    fontSize: 15,
    textAlign: "center",
    marginTop: 30,
  },

  columnWrapper: {
    justifyContent: "space-between",
  },

  pressed: {
    opacity: 0.75,
  },
});