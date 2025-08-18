import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useContext } from 'react';
import CustomBotNavBar from './components/CustomBotNavBar';
import { AppContext, AppProvider } from './components/AppContext';
import Authscreen from './screens/Authscreen';
import { Text, View, ActivityIndicator } from 'react-native';
import { enableScreens } from 'react-native-screens';
enableScreens(true);

const RenderMain = () => {
  const { user, skippedAuth, isLoading } = useContext(AppContext)

  console.log('RenderMain - user:', user);
  console.log('RenderMain - skippedAuth:', skippedAuth);
  console.log('RenderMain - isLoading:', isLoading);

  // Show loading indicator while determining auth state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
        <ActivityIndicator size="large" color="#10b77f" />
        <Text style={{ marginTop: 10, color: '#10b77f' }}>Loading...</Text>
      </View>
    );
  }

  if (!user && !skippedAuth) {
    console.log('Showing Authscreen');
    return <Authscreen />
  }
  else {
    console.log('Showing CustomBotNavBar');
    return <CustomBotNavBar />
  }
}

export default function App() {

  return (
    <AppProvider>
      <SafeAreaProvider>    
        <RenderMain/>
      </SafeAreaProvider>
    </AppProvider>
  );
}