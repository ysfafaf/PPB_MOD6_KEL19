import { useEffect, useState } from "react";
import { View } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MonitoringScreen } from "./src/screens/MonitoringScreen.js";
import { ControlScreen } from "./src/screens/ControlScreen.js";
import { ProfileScreen } from "./src/screens/ProfileScreen.js";
import { SplashScreen } from "./src/screens/SplashScreen.js";
import { assertConfig } from "./src/services/config.js";
import { tokens } from "./src/theme/tokens.js";

const Tab = createBottomTabNavigator();
const { color } = tokens;

enableScreens(true);

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: color.bg,
    card: color.surface,
    text: color.text,
    border: color.border,
    primary: color.primary,
  },
};

const TAB_ICONS = {
  Monitoring: "pulse",
  Control: "options",
  Profil: "people-outline",
};

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    assertConfig();
  }, []);

  if (!splashDone) {
    return (
      <SafeAreaProvider>
        <SplashScreen onFinish={() => setSplashDone(true)} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={theme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: true,
            headerTitle: "LiveTemp",
            headerTitleAlign: "left",
            headerTintColor: color.text,
            headerStyle: {
              backgroundColor: color.surface,
              borderBottomWidth: 1,
              borderBottomColor: color.border,
            },
            headerTitleStyle: {
              fontWeight: "700",
              fontSize: 17,
              letterSpacing: -0.4,
            },
            tabBarActiveTintColor: color.primary,
            tabBarInactiveTintColor: color.text2,
            tabBarLabelStyle: { fontSize: 12, fontWeight: "500" },
            tabBarStyle: {
              backgroundColor: color.surface,
              borderTopWidth: 1,
              borderTopColor: color.border,
            },
            tabBarHideOnKeyboard: true,
            tabBarIcon: ({ color: iconColor }) => (
              <Ionicons
                name={TAB_ICONS[route.name] ?? "ellipse-outline"}
                size={24}
                color={iconColor}
              />
            ),
          })}
        >
          <Tab.Screen name="Monitoring" component={MonitoringScreen} />
          <Tab.Screen name="Control" component={ControlScreen} />
          <Tab.Screen name="Profil" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
