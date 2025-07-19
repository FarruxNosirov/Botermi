import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/types/navigation';
import HomeScreen from '@/screens/home/HomeScreen';
import Blogs from '@/screens/home/Blogs';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => {
  return (
    <ErrorBoundary>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeMain" component={HomeScreen} />
        <Stack.Screen name="Blogs" component={Blogs} />
      </Stack.Navigator>
    </ErrorBoundary>
  );
};

export default HomeStack;
