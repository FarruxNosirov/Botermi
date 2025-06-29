import { colors } from '@/constants/colors';
import { ActionsScreen } from '@/screens/actions/ActionsScreen';
import { OperationsScreen } from '@/screens/operations/OperationsScreen';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { MainTabParamList } from '../types/navigation';
import { CatalogStack } from './CatalogStack';
import HomeStack from './HomeStack';
import { SettingsNavigator } from './SettingsNavigator';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator<MainTabParamList>();

type CustomTabBarButtonProps = {
  children: React.ReactNode;
  onPress?: (e: any) => void;
};

const CustomTabBarButton: React.FC<CustomTabBarButtonProps> = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      top: -30,
      width: 70,
      height: 70,
    }}
    onPress={onPress}
  >
    <View
      style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);

export const MainTabNavigator = () => {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Catalog') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Actions') {
            iconName = 'qr-code-outline';
            color = focused ? '#fff' : colors.gray[400];
          } else if (route.name === 'Operations') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <Ionicons
              name={iconName}
              size={route.name === 'Actions' ? 30 : size}
              color={color}
              style={{
                marginTop: route.name === 'Actions' ? 10 : 0,
                width: route.name === 'Actions' ? 34 : null,
                height: route.name === 'Actions' ? 34 : null,
                marginLeft: route.name === 'Actions' ? 5 : null,
              }}
            />
          );
        },
        tabBarActiveTintColor: '#E32F45',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 70,
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          borderTopWidth: 0,
          backgroundColor: '#fff',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: t('navigation.homeLable'),
        }}
      />
      <Tab.Screen
        name="Catalog"
        component={CatalogStack}
        options={{
          tabBarLabel: t('navigation.catalogLable'),
        }}
      />
      <Tab.Screen
        name="Actions"
        component={ActionsScreen}
        options={{
          tabBarLabel: '',
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Operations"
        component={OperationsScreen}
        options={{
          tabBarLabel: t('navigation.operationsLable'),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={SettingsNavigator}
        options={{
          tabBarLabel: t('navigation.profileLable'),
        }}
      />
    </Tab.Navigator>
  );
};

// export const MainTabNavigator = () => {
//   return (
//     <Drawer.Navigator
//       screenOptions={{
//         headerShown: false,
//         drawerStyle: {
//           backgroundColor: '#fff',
//           width: 280,
//         },
//         // drawerLabelStyle: {
//         //   marginLeft: -20,
//         // },
//       }}
//     >
//       <Drawer.Screen
//         name="MainTabs"
//         component={TabNavigator}
//         options={{
//           title: 'Asosiy',
//           drawerIcon: ({ color, size }) => (
//             <Ionicons name="home-outline" size={size} color={color} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="Settings"
//         component={SettingsNavigator}
//         options={{
//           title: 'Sozlamalar',
//           drawerIcon: ({ color, size }) => (
//             <Ionicons name="settings-outline" size={size} color={color} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="Favorites"
//         component={FavoritesScreen}
//         options={{
//           title: 'Sevimlilar',
//           drawerIcon: ({ color, size }) => (
//             <Ionicons name="heart-outline" size={size} color={color} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="Share"
//         component={ShareScreen}
//         options={{
//           title: "Do'stlaringiz bilan ulashing",
//           drawerIcon: ({ color, size }) => (
//             <Ionicons name="share-social-outline" size={size} color={color} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="Support"
//         component={SupportScreen}
//         options={{
//           title: "Qo'llab-quvvatlash markazi",
//           drawerIcon: ({ color, size }) => (
//             <Ionicons name="help-circle-outline" size={size} color={color} />
//           ),
//         }}
//       />
//     </Drawer.Navigator>
//   );
// };
