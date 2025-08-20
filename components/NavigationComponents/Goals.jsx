import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useContext, useState } from 'react'
import MacroPieChart from '../MacroPieChart';
import { AppContext } from '../AppContext';
import { saveGoals } from '../../firebaseStorage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveToAsyncStorage } from '../../asyncStorage';

const Goals = () => {
	const { goals, setGoals, user } = useContext(AppContext)

	const [goalTemp, setGoalTemp] = useState(goals)

	const handleChangeNumber = (key, value) => {
		const numericText = value.replace(/[^0-9]/g, '');
		setGoalTemp({ ...goalTemp, [key]: Number(numericText) });
	}

	const handleSave = async () => {
		// console.log(goalTemp)
		
		// setGoals({
		// 	calories: goalTemp.calories,
		// 	protein: goalTemp.protein,
		// 	carbs: goalTemp.carbs,
		// 	fats: goalTemp.fats
		// });
		setGoals(goalTemp);

		if (user){
			await saveGoals(user.uid, goalTemp);
		} else {
			await saveToAsyncStorage('goals', goalTemp);
		}

		alert("Goals have been saved")
	}

	const goalSum = (goalTemp.protein + goalTemp.carbs + goalTemp.fats);
	const proteinGoalGrams = Math.round(goalTemp.calories * goalTemp.protein / 100 / 4);
	const carbsGoalGrams = Math.round(goalTemp.calories * goalTemp.carbs / 100 / 4);
	const fatGoalGrams = Math.round(goalTemp.calories * goalTemp.fats / 100 / 9);

	return (
		<SafeAreaView style={styles.screen}>
			<View style={styles.spacerHeader} />
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={{ margin: 20, backgroundColor: "#10b77f", padding: 20, borderRadius: 10, elevation: 3 }}>
					<Text style={{ fontSize: 20, fontWeight: "600", color: "white" }}>Set Daily Targets</Text>
					<Text style={{ fontSize: 16, marginTop: 10, color: "white", fontWeight: 500 }}>Edit calorie goals and macro distribution manually</Text>
				</View>
				<View style={styles.editGoalsContainer}>
					<View>
						<Text style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>Daily Calories (KCal)</Text>
						<TextInput onChangeText={(text) => handleChangeNumber("calories", text)} value={goalTemp.calories.toString()} style={styles.input} placeholderTextColor="#94a3b8" placeholder="0"></TextInput>
					</View>
				</View>

				<View style={[styles.editGoalsContainer]}>
					<Text style={{ fontSize: 16, fontWeight: 800 }}>Macronutrient Distribution (%)</Text>
					<View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
						<View style={{ flex: 1 }}>
							<Text style={{ fontSize: 16, fontWeight: 800, marginBottom: 20, textAlign: "center" }}>Protein</Text>
							<TextInput onChangeText={(text) => handleChangeNumber("protein", text)} value={goalTemp.protein.toString()} style={styles.input} placeholderTextColor="#94a3b8" placeholder="0"></TextInput>
						</View>
						<View style={{ flex: 1 }}>
							<Text style={{ fontSize: 16, fontWeight: 800, marginBottom: 20, textAlign: "center" }}>Carbs</Text>
							<TextInput onChangeText={(text) => handleChangeNumber("carbs", text)} value={goalTemp.carbs.toString()} style={styles.input} placeholderTextColor="#94a3b8" placeholder="0"></TextInput>
						</View>
						<View style={{ flex: 1 }}>
							<Text style={{ fontSize: 16, fontWeight: 800, marginBottom: 20, textAlign: "center" }}>Fats</Text>
							<TextInput onChangeText={(text) => handleChangeNumber("fats", text)} value={goalTemp.fats.toString()} style={styles.input} placeholderTextColor="#94a3b8" placeholder="0"></TextInput>
						</View>
					</View>
					{goalSum === 100 ?
						(<View>
							<View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
								<Text style={styles.macroGrams}>{proteinGoalGrams}g Protein</Text>
								<Text style={styles.macroGrams}>{carbsGoalGrams}g Carbs</Text>
								<Text style={styles.macroGrams}>{fatGoalGrams}g Fats</Text>
							</View>
							<View style={{ alignItems: "center", marginTop: 10 }}>
								<MacroPieChart protein={goalTemp.protein} carbs={goalTemp.carbs} fats={goalTemp.fats} />
							</View>

						</View>
						) :
						<Text style={{ textAlign: "center", color:"red", fontWeight:"600", fontSize: 16 }}>Macronutrient percentages need to add to 100! Current sum = {goalSum}</Text>}
				</View>
				{goalSum === 100 && goalTemp.calories != 0 ?
					(<TouchableOpacity onPress={handleSave} style={styles.button}><Text style={{ color: "#fefefe", fontSize: 18, fontWeight: 600 }}>Save Settings</Text></TouchableOpacity>)
					: <Text></Text>}

			</ScrollView>
		</SafeAreaView>
	)
}

export default Goals

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: '#f9fafb'
	},
	button: {
		margin: 20,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 20,
		borderRadius: 8,
		backgroundColor: "#10b77f",
		elevation: 1
	},
	input: {
		borderColor: "#e5e5e5",
		borderWidth: 1,
		borderRadius: 10,
		backgroundColor: "#f9fafb",
		fontSize: 14,
		padding: 10
	},
	editGoalsContainer: {
		margin: 20,
		gap: 30,
		marginTop: 10,
		padding: 20,
		backgroundColor: "#fefefe",
		elevation: 3,
		borderRadius: 10
	},
	spacerHeader: {
		marginTop: 60
	},
	macroGrams: {
		borderWidth: 1,
		flex: 1,
		borderRadius: 10,
		padding: 5,
		borderColor: "#e5e5e5",
		fontSize: 16,
		textAlign: "center"
	}
});