import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import { Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../AppContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { saveToAsyncStorage } from '../../asyncStorage';

const SettingsMain = ({ navigation }) => {
	const { user, setSkippedAuth } = useContext(AppContext);
	const handleNavigateGoals = () => {
		navigation.navigate("Goals");
	};

	const handleSignOut = async () => {
		try {
			// await saveToAsyncStorage('skippedAuth', false);
			await signOut(auth);
			//auth state listener will handle setting user to null and skippedAuth to false
		} catch (e) {
			console.log("Error signing out: ", e);
		}
	}

	const handleSignIn = () => {
		setSkippedAuth(false);
	}

	const settingsOptions = [
		{
			title: "Edit Goals",
			subtitle: "Set your daily nutritional targets",
			icon: "target",
			onPress: handleNavigateGoals,
			iconColor: "#10b77f",
			backgroundColor: "#ccf2d9"
		},
		{
			title: user ? "Sign Out" : "Sign In",
			subtitle: user ? "Sign out of your account" : "Sign into your account",
			icon: user ? "logout" : "login",
			iconColor: user ? "#c42020ff" : "#034880ff",
			backgroundColor: user ? "#e09595ff" : "#b4d5f0ff",
			onPress: user ? handleSignOut : handleSignIn

		}
	]

	return (
		<SafeAreaView style={styles.screen}>
			<StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
			<Text style={styles.heading}>Settings</Text>
			<ScrollView>
				{settingsOptions.map((option, index) => (
					<TouchableOpacity onPress={option.onPress} key={index} style={styles.settingsButton}>
						<View style={[styles.iconContainer, { backgroundColor: option.backgroundColor }]} >
							<Icon size={25} color={option.iconColor} source={option.icon} />
						</View>
						<View style={styles.buttonContent}>
							<Text style={styles.buttonTitle} >{option.title}</Text>
							<Text style={styles.buttonSubtitle}>{option.subtitle}</Text>
						</View>
						<Icon size={20} color='#94a3b8' source={"chevron-right"} />
					</TouchableOpacity>
				))}
			</ScrollView>
		</SafeAreaView>
	);
};

export default SettingsMain

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: '#f9fafb'
	},

	heading: {
		paddingHorizontal: 20,
		fontSize: 30,
		fontWeight: '700',
		color: '#10b77f'
	},

	settingsButton: {
		flexDirection: "row",
		alignItems: "center",
		margin: 20,
		padding: 20,
		backgroundColor: "#fefefe",
		borderColor: "#e5e5e5",
		borderRadius: 10,
		borderWidth: 1,
		elevation: 3
	},

	iconContainer: {
		height: 48,
		width: 48,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 10
	},
	buttonContent: {
		marginLeft: 25,
		flex: 1,
		// borderWidth: 1
	},
	buttonTitle: {
		fontSize: 20,
		fontWeight: 800
	},
	buttonSubtitle: {
		fontSize: 16,
		fontWeight: 500,
		color: "#475569"
	}
})
