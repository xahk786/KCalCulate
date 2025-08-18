import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ViewLoggedMeals from '../components/NavigationComponents/ViewLoggedMeals'
import HomeMain from '../components/NavigationComponents/HomeMain'
import { Text } from 'react-native';


const Stack = createNativeStackNavigator();

const Home = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='HomeMain' options={{ headerShown: false }} component={HomeMain} />

        <Stack.Screen name='Logged Meals' options={{
          // Custom styled title
          headerTitleAlign: "left",
          headerTitle: () => (
            <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#10b77f' }}>
              Logged Meals
            </Text>
          ),
          headerTransparent: true,
          headerShadowVisible: false,
        }} component={ViewLoggedMeals} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Home

