import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadFromAsyncStorage = async (key, defaultValue) => {
    try {
        const value = await AsyncStorage.getItem(key);
        console.log('value of async storage load is:', value);
        return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
        console.log(e);
        return defaultValue;
    }
}

export const saveToAsyncStorage = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}