import { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserData } from '../firebaseStorage';
import { loadFromAsyncStorage } from '../asyncStorage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

  //user's nutrition goals
  const [goals, setGoals] = useState({
    calories: 2200,
    protein: 30,
    carbs: 40,
    fats: 30
  });

  //totaldata for intake/consumed by user 
  const [totalIntake, setTotalIntake] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  });

  //user's saved and logged meals 
  const [savedMeals, setSavedMeals] = useState([]);
  const [loggedMeals, setLoggedMeals] = useState([]);

  //the user's data
  const [user, setUser] = useState(null);

  //whether the user skipped auth or not 
  const [skippedAuth, setSkippedAuth] = useState(false);

  // Loading state to prevent flashing
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let firstLoad = true;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {

      if (firebaseUser) {
        // User is signed in
        console.log(' User is signed in - setting user state');
        setUser(firebaseUser);

        // Load user data from Firestore
        console.log('Loading Firestore data for user:', firebaseUser.uid);
        const userData = await getUserData(firebaseUser.uid);
        if (userData) {
          console.log(' Firestore data loaded successfully');
          setGoals(userData.goals);
          setTotalIntake(userData.totalIntake);
          setLoggedMeals(userData.loggedMeals);
          setSavedMeals(userData.savedMeals);
        } else {
          console.log(' No Firestore data found for user:', firebaseUser.uid);
        }
      } else {
        // User is signed out
        console.log(' User is signed out - clearing user state');
        setUser(null);
        setSkippedAuth(false);

        const skippedAuthAsyncStorage = await loadFromAsyncStorage('skippedAuth', false);
        console.log('skippedAuth async Storage is:', skippedAuthAsyncStorage);
        if (skippedAuthAsyncStorage) {
          //load from async storage
          setGoals(await loadFromAsyncStorage('goals', {
            calories: 2200,
            protein: 30,
            carbs: 40,
            fats: 30
          }));
          setTotalIntake(await loadFromAsyncStorage('totalIntake', {
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0
          }));
          setLoggedMeals(await loadFromAsyncStorage('loggedMeals', []));
          setSavedMeals(await loadFromAsyncStorage('savedMeals', []));
          if (firstLoad){
            setSkippedAuth(true); 
            firstLoad = false;
          } 
        }
      }

      // Set loading to false after auth state is determined
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const value = {
    goals, setGoals,
    totalIntake, setTotalIntake,
    savedMeals, setSavedMeals,
    loggedMeals, setLoggedMeals,
    user, setUser,
    skippedAuth, setSkippedAuth,
    isLoading,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}