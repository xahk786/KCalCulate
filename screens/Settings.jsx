import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Goals from '../components/NavigationComponents/Goals';
import { Text } from 'react-native';
import SettingsMain from '../components/NavigationComponents/SettingsMain';

const Stack = createNativeStackNavigator(); 

const Settings = () => {

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen
          name="SettingsMain" component={SettingsMain} options={{ headerShown: false }}
        />
        <Stack.Screen name="Goals" options={{
          // Custom styled title
          headerTitleAlign: "left",
          headerTitle: () => (
            <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#10b77f' }}>
              Macro & Calorie Goals
            </Text>
          ),
          headerTransparent: true,
          headerShadowVisible: false,
        }} component={Goals} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Settings;
