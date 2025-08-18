import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useContext, useState } from 'react'
import { TextInput } from 'react-native'
import { Icon } from 'react-native-paper'
import Constants from 'expo-constants';
import { AppContext } from '../AppContext';
import { saveLoggedMeals, saveTotalIntake } from '../../firebaseStorage';
import { saveToAsyncStorage } from '../../asyncStorage';

const Search = () => {

	const [searchTerm, setSearchTerm] = useState("");
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const { USDA_API_KEY } = Constants.expoConfig.extra;
	const { setLoggedMeals, totalIntake, setTotalIntake, loggedMeals, user } = useContext(AppContext);
	const [nonefound, setNoneFound] = useState(false)

	const handlePress = async () => {
		const query = searchTerm.trim();
		if (!query) return;
		setLoading(true);
		setResults([]);
		try {
			const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=10`);
			if (!response.ok) throw new Error("API error");
			const data = await response.json();

			// Filter out foods with dataType 'Branded'
			setNoneFound(false);
			const foods = (data.foods || [])
				.filter(food => food.dataType !== 'Branded')
				.map(food => {
					const getNutrient = (nutrientId) => {
						const n = (food.foodNutrients || []).find(n => n.nutrientId === nutrientId);
						return n ? n.value : 0;
					};
					let serving = 'N/A';
					if (food.foodMeasures && food.foodMeasures.length > 0) {
						const m = food.foodMeasures[0];
						let desc = m.disseminationText || '';
						// Remove 'quantity not specified' if present
						desc = desc.replace(/quantity not specified\s*/i, '').trim();
						serving = `${desc}${desc ? ' ' : ''}(${m.gramWeight || '?'}g)`;
					}
					return {
						name: food.description,
						serving,
						calories: getNutrient(1008),
						protein: getNutrient(1003),
						carbs: getNutrient(1005),
						fats: getNutrient(1004),
					};
				});
			if (foods.length === 0) {
				setNoneFound(true);
			}
			setResults(foods);
		} catch (e) {
			Alert.alert("Search Error", "Could not fetch food data. Please try again later.");
		} finally {
			setLoading(false);
		}
	}

	const handleChangeQuery = (text) => {
		setNoneFound(false);
		setSearchTerm(text);
	}

	const handleLogFood = async (food) => {
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
		const dateTime = today + " " + time12hr;
		const logMeal = {
			"mealName": food.name,
			"calories": food.calories,
			"protein": food.protein,
			"carbs": food.carbs,
			"fats": food.fats,
			"time": dateTime
		};
		const newTotalIntake = {
			calories: totalIntake.calories + food.calories,
			protein: totalIntake.protein + food.protein,
			carbs: totalIntake.carbs + food.carbs,
			fats: totalIntake.fats + food.fats
		}
		setTotalIntake(newTotalIntake);
		// setLoggedMeals(prev => [logMeal, ...prev]);
		const newLoggedMeals = [logMeal, ...loggedMeals];
		setLoggedMeals(newLoggedMeals);

		if (user) {
			await saveLoggedMeals(user.uid, newLoggedMeals);
			await saveTotalIntake(user.uid, newTotalIntake);
		} else {
			await saveToAsyncStorage('loggedMeals', newLoggedMeals);
			await saveToAsyncStorage('totalIntake', newTotalIntake);
		}
		Alert.alert("Success", "Food logged successfully");
	}

	const renderResults = () => {
		if (loading) return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" />
			</View>
		);
		if (nonefound) return (
			<View style={styles.loadingContainer}>
				<Text>No results found. Try a different search term</Text>
			</View>
		);
		return (
			<ScrollView showsVerticalScrollIndicator={false}>
				{results.map((food, index) => (
					<View style={styles.resultCard} key={index}>
						<Text style={{ fontSize: 16, fontWeight: 600 }} >{food.name}</Text>

						<View style={{ flexDirection: "row", gap: 3, marginTop: 20, flexWrap: "wrap", }}>
							<View style={styles.nutrionBox}>
								<Text style={styles.nutritionText}>{food.calories} KCal</Text>
							</View>
							<View style={styles.nutrionBox}>
								<Text style={styles.nutritionText}>{food.protein}g Protein</Text>
							</View>

							<View style={styles.nutrionBox}>
								<Text style={styles.nutritionText}>{food.carbs}g Carbs</Text>
							</View>

							<View style={styles.nutrionBox}>
								<Text style={styles.nutritionText}>{food.fats}g Fats</Text>
							</View>
						</View>

						<Text style={{ fontSize: 15, fontWeight: 600, marginTop: 10 }}>Serving size: {food.serving}</Text>
						<TouchableOpacity onPress={() => handleLogFood(food)} style={styles.logButton}>
							<Text style={{ color: "#fefefe", fontSize: 16, fontWeight: 600 }}>+ Log this food</Text>
						</TouchableOpacity>
					</View>
				))}
			</ScrollView>
		)
	}

	return (
		<View style={styles.searchScreen}>
			<View style={styles.searchContainer}>
				<TextInput onChangeText={(text) => handleChangeQuery(text)} style={styles.input} placeholder='Search for food...' placeholderTextColor="#94a3b8" returnKeyType="search" onSubmitEditing={handlePress} />
				<TouchableOpacity style={styles.button} onPress={() => handlePress()}>
					<Icon color='white' size={20} source="magnify" />
				</TouchableOpacity>
			</View>

			{/* render search results here */}
			{renderResults()}

		</View>

	)
}

export default Search

const styles = StyleSheet.create({
	searchScreen: {
		margin: 20,
		flex: 1
	},
	searchContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	input: {
		backgroundColor: "#fefefe",
		borderColor: "#e5e5e5",
		borderWidth: 1,
		paddingHorizontal: 10,
		fontSize: 16,
		color: "black",
		paddingVertical: 20,
		borderRadius: 10,
		width: "80%"
	},
	button: {
		borderRadius: 10,
		backgroundColor: "#10b77f",
		padding: 20
	},
	loadingContainer: {
		flex: 0.3,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 20,
	},
	resultCard: {
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#e5e5e5",
		marginTop: 20,
		padding: 15,
		backgroundColor: "#fefefe",
		elevation: 1
	},
	nutrionBox: {
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
	},
	logButton: {
		marginTop: 20,
		alignItems: "center",
		paddingVertical: 15,
		elevation: 1,
		borderRadius: 10,
		backgroundColor: "#10b77f",
	},
})