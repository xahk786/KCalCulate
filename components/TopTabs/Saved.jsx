import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
import { useContext } from 'react'
import { Icon } from 'react-native-paper';
import { AppContext } from '../AppContext';
import { saveLoggedMeals, saveSavedMeals, saveTotalIntake } from '../../firebaseStorage';
import { saveToAsyncStorage } from '../../asyncStorage';

const Saved = () => {
  const { savedMeals, setSavedMeals, totalIntake, setTotalIntake, loggedMeals, setLoggedMeals, user } = useContext(AppContext);

  const handleDelete = (mealIndex) => {
    Alert.alert(
      "Delete Meal",
      "Are you sure you want to delete this meal?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            const dupArray = [...savedMeals];
            dupArray.splice(mealIndex, 1);
            setSavedMeals(dupArray);
            if (user){
             await saveSavedMeals(user.uid, dupArray); 
            }
          }
        }
      ]
    );
  };

  const handleLogMeal = async (meal) => {
    console.log(loggedMeals);
    const dupArray = [...loggedMeals];

    const now = new Date();
    const time12hr = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const logMeal = {
      ...meal, ["time"]: today + " " + time12hr
    }

    dupArray.unshift(logMeal);
    setLoggedMeals(dupArray);


    console.log(meal);
    const newTotalIntake = {
      calories: totalIntake.calories + meal.calories,
      protein: totalIntake.protein + meal.protein,
      carbs: totalIntake.carbs + meal.carbs,
      fats: totalIntake.fats + meal.fats
    }
    setTotalIntake(newTotalIntake);
    if (user) {
      await saveLoggedMeals(user.uid, dupArray);
      await saveTotalIntake(user.uid, newTotalIntake);
    } else {
      await saveToAsyncStorage('loggedMeals', dupArray);
      await saveToAsyncStorage('totalIntake', newTotalIntake);
    }
    Alert.alert("Success", "Meal has been logged");
  }

  const mapMeals = () => {
    return savedMeals.map((meal, mealIndex) => (
      <View key={mealIndex} style={{ margin: 20, backgroundColor: "#fefefe", borderRadius: 10, padding: 20, elevation: 3 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 16, fontWeight: 600 }}> {meal.mealName}</Text>
          <TouchableOpacity style={{ borderWidth: 1, padding: 5, borderColor: "#e5e5e5", backgroundColor: "#f9fafb", borderRadius: 5 }}
            onPress={() => handleDelete(mealIndex)}>
            <Icon color='red' size={20} source={"delete-outline"} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", marginTop: 20, gap: 3, flexWrap: "wrap" }}>
          <View style={styles.nutritionBox}>
            <Text style={styles.nutritionText} >{Math.round(meal.calories * 100) / 100} KCal</Text>
          </View>
          <View style={styles.nutritionBox}>
            <Text style={styles.nutritionText} >{meal.protein}g Protein</Text>
          </View>
          <View style={styles.nutritionBox}>
            <Text style={styles.nutritionText} >{meal.carbs}g Carbs</Text>
          </View>
          <View style={styles.nutritionBox}>
            <Text style={styles.nutritionText} >{meal.fats}g Fats</Text>
          </View>
        </View>
        <Text style={{ color: "#475569", marginTop: 10, fontWeight: 600, fontSize: 15 }}>Serving Size: {meal.servingSize}</Text>
        <TouchableOpacity onPress={() => handleLogMeal(meal)} style={styles.logButton} >
          <Text style={{ color: "#fefefe", fontSize: 18, fontWeight: 600 }}>+ Log this meal</Text>
        </TouchableOpacity>
      </View>
    ))
  }

  const noMeals = () => {
    return (
      <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 30 }}>No saved meals yet</Text>
        <Text style={{ fontSize: 18, marginTop: 20, color: "grey" }}>Create your first custom meal to get started</Text>
      </View>
    )
  }

  return (

    <View style={{ flex: 1 }}>
      {savedMeals.length === 0 ? noMeals() :
        <ScrollView showsVerticalScrollIndicator={false}>
          {mapMeals()}
        </ScrollView>
      }
    </View>
  )
}

export default Saved

const styles = StyleSheet.create({
  logButton: {
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 15,
    elevation: 1,
    borderRadius: 10,
    backgroundColor: "#10b77f",
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