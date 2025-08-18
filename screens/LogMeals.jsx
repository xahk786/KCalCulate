import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import CustomTopTabBar from '../components/CustomTopTabBar'
import Search from '../components/TopTabs/Search'
import Create from '../components/TopTabs/Create'
import Saved from '../components/TopTabs/Saved'

const LogMeals = () => {
  
  const searchRoute = () => <Search/>
  const createRoute = () => <Create/>
  const savedRoute = () => <Saved />
  
  const [renderScene, setRenderScene] = useState("create")

  const render = () => {
    if (renderScene === "search") { 
      return searchRoute();
    } 
    else if (renderScene === "create"){
      return createRoute();
    } 
    else {
      return savedRoute();
    }
  }

  return (
    <SafeAreaView  style ={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <Text style= {styles.heading}>Log Meals</Text>
      <CustomTopTabBar setRenderScene={setRenderScene}/>
      {render()}
    </SafeAreaView>
      
  )
}

export default LogMeals

const styles = StyleSheet.create({
  screen : {
    backgroundColor: "#f9fafb",
    flex : 1
  }, 
  spacer: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  heading : {
    paddingHorizontal: 20,
    paddingBottom: 16,
    fontSize: 30,
    fontWeight: 800,
    color: "#10b77f"
  },
})
