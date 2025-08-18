import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

export const createUserDb = async (userId) => {
	try {
		const userRef = doc(db, "users", userId);
		await setDoc(userRef, {
			goals: {
				calories: 2200,
				protein: 30,
				carbs: 40,
				fats: 30
			},
			totalIntake: {
				calories: 0,
				protein: 0,
				carbs: 0,
				fats: 0
			},
			savedMeals: [],
			loggedMeals: []
		});
		console.log("User successfully created in database");
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
}

export const getUserData = async (userId) => {
	try {
		const userRef = doc(db, "users", userId);
		const snap = await getDoc(userRef);
		return snap.data();
	} catch(e){
		console.log(e);
		return false;
	}
}


export const saveGoals = async (userId, goals) => {
	try {
		const userRef = doc(db, "users", userId);
		await updateDoc(userRef, { goals: goals });
		console.log("Goals saved successfully");
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
}

export const saveLoggedMeals = async (userId, loggedMeals) => {
	try {
		const userRef = doc(db, "users", userId);
		await updateDoc(userRef, { loggedMeals: loggedMeals })
		console.log("LoggedMeals saved successfully")
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
}

export const saveSavedMeals = async (userId, savedMeals) => {
	try {
		const userRef = doc(db, "users", userId);
		await updateDoc(userRef, { savedMeals: savedMeals })
		console.log("SavedMeals saved successfully")
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
}

export const saveTotalIntake = async (userId, totalIntake) => {
	try {
		const userRef = doc(db, "users", userId);
		await updateDoc(userRef, { totalIntake: totalIntake })
		console.log("TotalIntake saved successfully")
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
}


