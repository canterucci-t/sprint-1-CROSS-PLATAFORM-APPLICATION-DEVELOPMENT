import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import Login from './src/telas/Login';
import Dashboard from './src/telas/Dashboard';
import Ranking from './src/telas/Ranking';
import Cronograma from './src/telas/Cronograma';
import Detalhe from './src/telas/Detalhe';
import Confirmacao from './src/telas/Confirmacao';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Abas principais do app (visíveis após login)
function AbasPrincipais() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0B5C46',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarStyle: { paddingBottom: 4, height: 58 },
        tabBarIcon: ({ color, size, focused }) => {
          const icones = {
            Dashboard: focused ? 'grid' : 'grid-outline',
            Ranking: focused ? 'podium' : 'podium-outline',
            Cronograma: focused ? 'calendar' : 'calendar-outline',
          };
          return <Ionicons name={icones[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} options={{ tabBarLabel: 'Dashboard' }} />
      <Tab.Screen name="Ranking" component={Ranking} options={{ tabBarLabel: 'Ranking' }} />
      <Tab.Screen name="Cronograma" component={Cronograma} options={{ tabBarLabel: 'Cronograma' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  // Controla se o usuário está logado
  const [logado, setLogado] = useState(false);
  const [usuario, setUsuario] = useState(null);

  function handleLogin(dadosUsuario) {
    setUsuario(dadosUsuario);
    setLogado(true);
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#0B5C46" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!logado ? (
            // Antes do login: só mostra a tela de Login
            <Stack.Screen name="Login">
              {(props) => <Login {...props} onLogin={handleLogin} />}
            </Stack.Screen>
          ) : (
            // Após login: mostra as abas + telas de detalhe
            <>
              <Stack.Screen name="Principal" component={AbasPrincipais} />
              <Stack.Screen name="Detalhe" component={Detalhe} />
              <Stack.Screen name="Confirmacao" component={Confirmacao} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
