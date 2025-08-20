import { useContext, useState } from 'react'
import { Alert, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth'
import { AppContext } from '../components/AppContext';
import { createUserDb } from '../firebaseStorage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveToAsyncStorage } from '../asyncStorage';
import { Icon } from 'react-native-paper';

const Authscreen = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const {setSkippedAuth} = useContext(AppContext)

	const handleSubmit = async () => {
		try {
			if (isLogin) {
				//sign in
				const userCredential = await signInWithEmailAndPassword(auth, email, password);
				if (!userCredential.user.emailVerified) {
					Alert.alert(
						'Email Not Verified',
						'Please verify your email before logging in. Check your inbox for email'
					)
				} else {
					//auth listener will handle setting user and loading user data
					console.log('User signed in successfully');
				}
			}
			else {
				//sign up
				if (password !== confirmPassword) {
					Alert.alert('Error', 'Passwords do not match.');
					return;
				}
				const userCredential = await createUserWithEmailAndPassword(auth, email, password);
				console.log(userCredential);
				await sendEmailVerification(userCredential.user);
				await createUserDb(userCredential.user.uid);
				Alert.alert('Verification Email Sent', 'Please check your email to verify your account.');

			}
		} catch (e) {
			Alert.alert('Authentication Error', e.message);
		}
	}

	const handleSkip = async () => {
		//change skip usestate variable to true
		await saveToAsyncStorage('skippedAuth', true);
		setSkippedAuth(true);
	}

	return (
		// <KeyboardAvoidingView style={styles.screen}
		// 	behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		// 	keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
		<SafeAreaView style={styles.screen}>
			<StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled">
				<View style={styles.content}>
					<Image source={require('../assets/icon.png')} style={{width: 70, height: 70, borderRadius: 50}}/>
					<View style={styles.appBranding}>
						<Text style={styles.brandText}>KCalCulate</Text>
						<Text style={styles.sloganText}>Track your nutrional goals with ease</Text>
					</View>
					<View style={styles.formBox}>
						<View style={styles.row}>
							<TouchableOpacity onPress={() => setIsLogin(true)} style={[styles.loginButton, isLogin && { backgroundColor: "#10b77f" }]}><Text style={[styles.buttonText, isLogin && { color: "white" }]}>Login</Text></TouchableOpacity>
							<TouchableOpacity onPress={() => setIsLogin(false)} style={[styles.signUpbutton, !isLogin && { backgroundColor: "#10b77f" }]}><Text style={[styles.buttonText, !isLogin && { color: "white" }]}>Sign up</Text></TouchableOpacity>
						</View>
						<View style={styles.inputContainer}>
							<Text style={styles.inputLabel}>Email</Text>
							<TextInput onChangeText={(text) => setEmail(text)} style={styles.input} placeholder='Enter your email' placeholderTextColor="#94a3b8"></TextInput>
						</View>
						<View style={styles.inputContainer}>
							<Text style={styles.inputLabel}>Password</Text>
							<TextInput onChangeText={(text) => setPassword(text)} style={styles.input} secureTextEntry={true} placeholder='Enter your password' placeholderTextColor="#94a3b8"></TextInput>
						</View>

						{!isLogin &&
							<View style={styles.inputContainer}>
								<TextInput onChangeText={(text) => setConfirmPassword(text)} secureTextEntry={true} style={styles.input} placeholder='Re-enter your password' placeholderTextColor="#94a3b8"></TextInput>
							</View>}

						<TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
							<Text style={styles.submitButtonText}>{isLogin ? "Sign In" : "Sign Up"}</Text>
						</TouchableOpacity>

						<View style={styles.skipContainer}>
							<TouchableOpacity onPress={handleSkip} ><Text style={styles.skipText}>Skip without sign on</Text></TouchableOpacity>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default Authscreen

const styles = StyleSheet.create({
	screen: {
		backgroundColor: "#f9fafb",
		flex: 1,
	},
	spacer: {
		marginTop: 0,
	},
	scrollContent: {
		flexGrow: 1,
		justifyContent: "center",
	},
	content: {
		justifyContent: "center",
		alignItems: "center",
		// paddingHorizontal: "5%",
		// paddingVertical: "2%",
	},
	appBranding: {
		alignItems: "center",
		gap: 10,
		marginBottom: 30
	},
	brandText: {
		fontSize: 32,
		color: "#10b77f",
		fontWeight: "600"
	},
	sloganText: {
		fontSize: 16,
		textAlign: "center"
	},
	formBox: {
		padding: 20,
		margin: 10,
		backgroundColor: "white",
		elevation: 6,
		borderRadius: 20,
		width: "90%",
		// maxWidth: 400,
	},
	loginButton: {
		borderRadius: 20,
		paddingHorizontal: 20,
		paddingVertical: 12,
		backgroundColor: "#f0fdf4",
		flex: 1,
	},
	signUpbutton: {
		borderRadius: 20,
		paddingHorizontal: 20,
		paddingVertical: 12,
		backgroundColor: "#f0fdf4",
		flex: 1,
	},
	row: {
		flexDirection: "row",
		borderRadius: 20,
		backgroundColor: "#f0fdf4",
		gap: 2,
	},
	buttonText: {
		fontSize: 16,
		textAlign: "center",
		color: "#10b77f",
		fontWeight: "600"
	},
	inputContainer: {
		marginTop: 20,
		gap: 8,
	},
	inputLabel: {
		fontSize: 14,
		fontWeight: "600"
	},
	input: {
		borderColor: "#e5e5e5",
		borderWidth: 1,
		borderRadius: 10,
		backgroundColor: "#f9fafb",
		padding: 16,
		fontSize: 16,
		color: "black"
	},
	submitButton: {
		marginTop: 20,
		paddingVertical: 16,
		borderRadius: 8,
		backgroundColor: "#10b77f",
		elevation: 1,
		alignItems: "center"
	},
	submitButtonText: {
		color: "white",
		fontWeight: "700",
		fontSize: 16
	},
	skipContainer: {
		alignItems: "center",
		marginTop: 20,
	},
	skipText: {
		color: "#10b77f",
		fontWeight: "600",
		fontSize: 16,
		textDecorationLine: "underline"
	}
})