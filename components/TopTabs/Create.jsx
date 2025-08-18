import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { AppContext } from '../AppContext';
import { saveSavedMeals } from '../../firebaseStorage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveToAsyncStorage } from '../../asyncStorage';

const Create = () => {

  const {savedMeals, setSavedMeals, user} = useContext(AppContext)
  const [meal, setMeal] = useState({
    mealName: "",
    servingSize: "",
    calories: 0,
    protein: "",
    carbs: "",
    fats: ""
  })

  const handleChangeText = (key, value) => {
    setMeal({ ...meal, [key]: value });
  }

  const handleChangeNumber = (key, value) => {

    // const numericText = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    // setMeal({ ...meal, [key]: (numericText) });
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setMeal({ ...meal, [key]: value });
    }
  }

  function emptyForm() {
    setMeal({
      mealName: "",
      calories: 0,
      servingSize: "",
      protein: 0,
      carbs: 0,
      fats: 0
    })
  }

  const handlePress = async () => {
    // console.log(meal)
    // if ((meal.carbs === 0 && meal.fats === 0 && meal.protein === 0) || meal.mealName === "" || meal.servingSize === "") {
    //   alert("Missing value(s). Please input.");
    //   return;
    // }
    // const dupArray = [...savedMeals];
    // meal.calories = 4 * meal.carbs + 4 * meal.protein + 9 * meal.fats
    // dupArray.push(meal);
    // console.log(dupArray);
    // setSavedMeals(dupArray);
    // // emptyForm();
    // alert("Meal has been saved");
    // emptyForm();

    const protein = parseFloat(meal.protein) || 0;
    const carbs = parseFloat(meal.carbs) || 0;
    const fats = parseFloat(meal.fats) || 0;

    if ((carbs === 0 && fats === 0 && protein === 0) || meal.mealName === "" || meal.servingSize === "") {
      alert("Missing value(s). Please input.");
      return;
    }

    const dupArray = [...savedMeals];
    const calories = 4 * carbs + 4 * protein + 9 * fats;

    dupArray.push({
      ...meal,
      protein,
      carbs,
      fats,
      calories
    });

    setSavedMeals(dupArray);
    Alert.alert("Success", "Meal has been saved");
    emptyForm();
    if (user){
      await saveSavedMeals(user.uid, dupArray);
    } else {
      await saveToAsyncStorage('savedMeals', dupArray);
    }

  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ margin: 20, backgroundColor: "#10b77f", padding: 20, borderRadius: 10, elevation: 3 }}>
          <Text style={{ fontSize: 25, fontWeight: "600", color: "white" }}>Create Custom Meal</Text>
          <Text style={{ fontSize: 16, marginTop: 10, color: "white", fontWeight: "500" }}>Enter macronutrients manually</Text>
        </View>

        <View style={styles.createCard}>
          <View style={{ marginTop: 0, gap: 30 }}>
            <View>
              <Text style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>Meal Name</Text>
              <TextInput value={meal.mealName} onChangeText={(text) => handleChangeText("mealName", text)} placeholder='Enter meal name...' placeholderTextColor="#94a3b8" style={styles.input}></TextInput>
            </View>

            <View>
              <Text style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>Serving Size</Text>
              <TextInput value={meal.servingSize} onChangeText={(text) => handleChangeText("servingSize", text)} placeholder='e.g per 200g...' placeholderTextColor="#94a3b8" style={styles.input}></TextInput>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 20 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>Protein (g)</Text>
                <TextInput onChangeText={(text) => handleChangeNumber("protein", text)} value={meal.protein} keyboardType="numeric" placeholder='0' placeholderTextColor="#94a3b8" style={styles.input}></TextInput>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>Carbs (g)</Text>
                <TextInput onChangeText={(text) => handleChangeNumber("carbs", text)} value={meal.carbs} keyboardType="numeric" placeholder='0' placeholderTextColor="#94a3b8" style={[styles.input]}></TextInput>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>Fats (g)</Text>
                <TextInput onChangeText={(text) => handleChangeNumber("fats", text)} value={meal.fats} keyboardType="numeric" placeholder='0' placeholderTextColor="#94a3b8" style={styles.input}></TextInput>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={() => handlePress()} style={styles.button}>
            <Text style={{ color: "#fefefe", fontSize: 18, fontWeight: 600 }}>Save Meal</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create

const styles = StyleSheet.create({
  createCard: {
    margin: 20,
    backgroundColor: "#fefefe",
    elevation: 3,
    borderRadius: 10,
    padding: 20
  },
  input: {
    borderColor: "#e5e5e5",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#f9fafb",
    padding: 16,
    fontSize: 16
  },
  button: {
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    borderRadius: 8,
    backgroundColor: "#10b77f",
    elevation: 1
  }

})