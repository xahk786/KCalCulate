import { StyleSheet, Text, View } from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'

const CircularProgress = ({ type, totalIntake, goals }) => {

	function selectMultiplier(){
		if (type === "protein" || type === "carbs"){
			return 4;
		} else {
			return 9;
		}
	}
	
	const gramsGoal = Math.round( goals[type] / 100 * goals.calories / selectMultiplier() ) 
	const displayFill = Math.round(totalIntake[type] / gramsGoal * 100)

	function setColor(){ 
		return type === "protein" ? "#3b82f6" : (type === "carbs" ? "#ef4444" : "#f59e0b")
	}


	return (
		<View>
			<AnimatedCircularProgress
				size={140}
				width={9}
				fill={displayFill} // percentage filled
				tintColor= {setColor()}
				backgroundColor="#3d5875"
				rotation={0}
			>{() =>
				<View style={{ alignItems: "center" }}>
					<Text style={{ fontSize: 25, fontWeight: 600 }}>{Math.round(totalIntake[type] * 100) / 100}g</Text>
					<Text style={{ fontSize: 18, color: "grey" }}>of {gramsGoal}g</Text>
				</View>
				}
			</AnimatedCircularProgress>
			<View style={{alignItems:"center", marginTop:10}}>
				<Text style={{fontWeight:600, fontSize:20}}>{type === "carbs" ? "Carbohydrates" : type.charAt(0).toUpperCase()+ type.slice(1)}</Text>
				<Text style={{fontSize: 18}}>{displayFill}%</Text>
			</View>
		</View>
	)
}

export default CircularProgress

const styles = StyleSheet.create({
})