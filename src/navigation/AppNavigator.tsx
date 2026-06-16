import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList, MainTabParamList } from '../types';
import { useApp } from '../context/AppContext';
import { COLORS } from '../theme/colors';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MapaScreen from '../screens/MapaScreen';
import RankingScreen from '../screens/RankingScreen';
import CronogramaScreen from '../screens/CronogramaScreen';
import ColetaScreen from '../screens/ColetaScreen';
import AnaliseScreen from '../screens/AnaliseScreen';
import PrevisaoScreen from '../screens/PrevisaoScreen';
import DetalheScreen from '../screens/DetalheScreen';
import AgendamentoScreen from '../screens/AgendamentoScreen';
import ConfirmacaoScreen from '../screens/ConfirmacaoScreen';
import RelatoriosScreen from '../screens/RelatoriosScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  const { alertasNaoLidos } = useApp();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          paddingBottom: 4,
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size, focused }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            DashboardTab: focused ? 'grid' : 'grid-outline',
            MapaTab: focused ? 'map' : 'map-outline',
            RankingTab: focused ? 'podium' : 'podium-outline',
            CronogramaTab: focused ? 'calendar' : 'calendar-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{ tabBarLabel: 'Dashboard', tabBarBadge: alertasNaoLidos > 0 ? alertasNaoLidos : undefined }}
      />
      <Tab.Screen
        name="MapaTab"
        component={MapaScreen}
        options={{ tabBarLabel: 'Mapa' }}
      />
      <Tab.Screen
        name="RankingTab"
        component={RankingScreen}
        options={{ tabBarLabel: 'Ranking' }}
      />
      <Tab.Screen
        name="CronogramaTab"
        component={CronogramaScreen}
        options={{ tabBarLabel: 'Cronograma' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { usuario } = useApp();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
          animation: 'slide_from_right',
        }}
      >
        {!usuario ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Coleta" component={ColetaScreen} />
            <Stack.Screen name="Analise" component={AnaliseScreen} />
            <Stack.Screen name="Previsao" component={PrevisaoScreen} />
            <Stack.Screen name="Detalhe" component={DetalheScreen} />
            <Stack.Screen name="Agendamento" component={AgendamentoScreen} />
            <Stack.Screen name="Confirmacao" component={ConfirmacaoScreen} />
            <Stack.Screen name="Relatorios" component={RelatoriosScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
