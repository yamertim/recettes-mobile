const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

const fetchData = async (endpoint) => {
  const response = await fetch(`${BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(
      "Erreur lors de la récupération des données"
    );
  }

  return response.json();
};

export const getCategories = async () => {
  const data = await fetchData("/categories.php");

  return data.categories ?? [];
};

export const getMealsByCategory = async (category) => {
  const value = encodeURIComponent(category);

  const data = await fetchData(
    `/filter.php?c=${value}`
  );

  return data.meals ?? [];
};

export const searchMealByName = async (name) => {
  const value = encodeURIComponent(name);

  const data = await fetchData(
    `/search.php?s=${value}`
  );

  return data.meals ?? [];
};

export const getMealById = async (id) => {
  const value = encodeURIComponent(id);

  const data = await fetchData(
    `/lookup.php?i=${value}`
  );

  return data.meals?.[0] ?? null;
};