import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import HomeScreen from "./screens/HomeScreen";
import CategoryScreen from "./screens/CategoryScreen";
import DetailScreen from "./screens/DetailScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar
        style="light"
        backgroundColor="#FF6B35"
      />

      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: "#FF6B35",
            },

            headerTintColor: "#FFFFFF",

            headerTitleStyle: {
              fontWeight: "bold",
            },

            headerTitleAlign: "center",

            contentStyle: {
              backgroundColor: "#FFF8F0",
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: "Recettes",
            }}
          />

          <Stack.Screen
            name="Category"
            component={CategoryScreen}
            options={{
              title: "Catégorie",
            }}
          />

          <Stack.Screen
            name="Detail"
            component={DetailScreen}
            options={{
              title: "Détails",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}