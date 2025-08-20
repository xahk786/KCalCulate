import { StyleSheet, Text, View, Platform, StatusBar, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useContext } from 'react'
import { ScrollView } from 'react-native'
import HorizontalProgress from '../HorizontalProgress'
import CircularProgress from '../CircularProgress'
import { AppContext } from '../AppContext'
import { Icon } from 'react-native-paper'
import { saveLoggedMeals, saveTotalIntake } from '../../firebaseStorage'
import { saveToAsyncStorage } from '../../asyncStorage'

const HomeMain = ({ navigation }) => {

	const { totalIntake, goals, setLoggedMeals, setTotalIntake, user } = useContext(AppContext)

	const goalReachedPercent = Math.floor(totalIntake.calories / goals.calories * 100)
	const handleNavigateLogged = () => {
		navigation.navigate("Logged Meals")
	}

	const handleReset = () => {
		Alert.alert(
			"Reset Progress",
			"Are you sure you want to reset progress?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Reset",
					onPress: async () => {
						setLoggedMeals([]);
						setTotalIntake({
							calories: 0,
							protein: 0,
							carbs: 0,
							fats: 0,
						})
						if (user) {
							await saveLoggedMeals(user.uid, []);
							await saveTotalIntake(user.uid, {
								calories: 0,
								protein: 0,
								carbs: 0,
								fats: 0,
							})
						} else {
							await saveToAsyncStorage('loggedMeals', []);
							await saveToAsyncStorage('totalIntake', {
								calories: 0,
								protein: 0,
								carbs: 0,
								fats: 0,
							})
						}
					}
				}
			]
		);
	};

	return (
		<SafeAreaView style={styles.screen}>
			<StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.topBar}>
					<View style={styles.heading}>
						<Text style={styles.headingText}>KCalCulate</Text>
						<Text style={styles.subTitle}>Track your daily nutrition</Text>
					</View>
					<TouchableOpacity onPress={handleReset}><Icon size={40} color='#cf6051ff' source={"restart"} /></TouchableOpacity>
				</View>

				<View style={styles.calories}>
					<View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
						<Text style={{ fontSize: 20, fontWeight: 600 }}>Calories</Text>
						<Text style={{ fontSize: 18, fontWeight: 600, color: "grey" }}> {Math.round(totalIntake.calories * 100) / 100}/{goals.calories} KCal</Text>
					</View>
					<HorizontalProgress intake={totalIntake.calories} kcalGoal={goals.calories} />
					<View style={{ display: "flex", flexDirection: "row-reverse", marginTop: 10 }}>
						<Text style={{ fontSize: 18, fontWeight: 600, color: "grey" }}>{goalReachedPercent}% of Goal</Text>
					</View>
				</View>


				<View style={styles.macros}>
					<Text style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>MacroNutrients</Text>
					<View style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
						<View style={{ alignItems: "center" }}>
							<CircularProgress type={"protein"} totalIntake={totalIntake} goals={goals} />
						</View>
						<View style={{ alignItems: "center" }}>
							<CircularProgress type={"carbs"} totalIntake={totalIntake} goals={goals} />
						</View>
					</View>
					<View style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
						<View style={{ alignItems: "center" }}>
							<CircularProgress type={"fats"} totalIntake={totalIntake} goals={goals} />
						</View>
					</View>
				</View>

				<View style={{ margin: 20 }}>
					<TouchableOpacity onPress={handleNavigateLogged} activeOpacity={0.8} style={styles.button}>
						<Text style={{ color: "#fefefe", fontSize: 18, fontWeight: 600 }}>View Logged Meals</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>

	)
}

export default HomeMain

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: "#f9fafb"
	},
	spacer: {
		marginTop: 0,
	},
	topBar: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 20
	},
	heading: {
		paddingBottom: 16,
		flex: 1
	},
	subTitle: {
		fontSize: 18
	},
	headingText: {
		fontSize: 30,
		fontWeight: 700,
		color: "#10b77f",
		marginBottom: 4
	},
	calories: {
		margin: 20,
		backgroundColor: "#fefefe",
		borderRadius: 10,
		padding: 15,
		elevation: 3,
	},
	macros: {
		margin: 20,
		backgroundColor: "#fefefe",
		elevation: 3,
		borderRadius: 10,
		padding: 15,

	},
	button: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 24,
		borderRadius: 8,
		backgroundColor: "#10b77f",
		elevation: 1
	}
})