import { Alert, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useContext } from 'react'
import { AppContext } from '../AppContext';
import { Icon } from 'react-native-paper';
import { saveLoggedMeals, saveTotalIntake } from '../../firebaseStorage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveToAsyncStorage } from '../../asyncStorage';

const ViewLoggedMeals = () => {

  const { loggedMeals, setLoggedMeals, totalIntake, setTotalIntake, user } = useContext(AppContext)

  const handleUnlog = (mealIndex) => {
    Alert.alert(
      "Unlog Meal",
      "Are you sure you want to unlog this meal?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unlog",
          onPress: async () => {
            const dupArray = [...loggedMeals];
            // console.log(totalIntake);
            // console.log(dupArray[mealIndex].calories)
            const newTotalIntake = {
              calories: totalIntake.calories - dupArray[mealIndex].calories,
              protein: totalIntake.protein - dupArray[mealIndex].protein,
              fats: totalIntake.fats - dupArray[mealIndex].fats,
              carbs: totalIntake.carbs - dupArray[mealIndex].carbs,
            }
            setTotalIntake(newTotalIntake)

            dupArray.splice(mealIndex, 1);
            setLoggedMeals(dupArray);
            if (user) {
              await saveLoggedMeals(user.uid, dupArray);
              await saveTotalIntake(user.uid, newTotalIntake);
            } else {
              await saveToAsyncStorage('loggedMeals', dupArray);
              await saveToAsyncStorage('totalIntake', newTotalIntake);
            }
          }
        }
      ]
    );
  };

  const mapMeals = () => {
    return loggedMeals.map((meal, mealIndex) => (
      <View key={mealIndex} style={{ margin: 20, backgroundColor: "#fefefe", borderRadius: 10, padding: 20, elevation: 3 }}>
        <View style={{ flexDirection: "row", flexWrap:"wrap", justifyContent: "space-between", alignItems: "center", borderWidth: 0 }}>
          <Text style={{ fontSize: 16, fontWeight: 800 }}>{meal.mealName}</Text>
          <Text style={{ color: "#475569", fontSize: 15, fontWeight: 500 }}><Icon size={16} source={"calendar-blank"} /> {meal.time}</Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 20, gap: 3, flexWrap: "wrap" }}>
          <View style={styles.nutritionBox}>
            <Text style={styles.nutritionText} >{Math.round(meal.calories * 100) / 100} kCal</Text>
          </View>
          <View style={styles.nutritionBox}>
            <Text style={styles.nutritionText} >{meal.protein}g protein</Text>
          </View>
          <View style={styles.nutritionBox}>
            <Text style={styles.nutritionText} >{meal.carbs}g carbs</Text>
          </View>
          <View style={styles.nutritionBox}>
            <Text style={styles.nutritionText} >{meal.fats}g fats</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => handleUnlog(mealIndex)} activeOpacity={0.4} style={styles.unlogButton} >
          <Text style={{ color: "#fefefe", fontSize: 18, fontWeight: 600 }}>- Unlog this meal</Text>
        </TouchableOpacity>
      </View>
    ))
  }

  const noMeals = () => {
    return (
      <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 30 }}>No logged meals yet</Text>
        <Text style={{ fontSize: 18, marginTop: 20, color: "grey" }}>Log your first meal to get started</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.spacer}></View>
      {loggedMeals.length === 0 ? noMeals() :
        <ScrollView showsVerticalScrollIndicator={false}>
          {mapMeals()}
        </ScrollView>}
    </SafeAreaView>
  )
}

export default ViewLoggedMeals

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f9fafb"
  },
  spacer: {
    marginTop: 60,
  },
  unlogButton: {
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 15,
    elevation: 1,
    borderRadius: 10,
    backgroundColor: "#f84e4eff",
  },
  nutritionBox: {
    backgroundColor: "#f9fafb",
    borderColor: "#e5e5e5",
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  nutritionText: {
    fontSize: 13,
    fontWeight: 600
  }
})