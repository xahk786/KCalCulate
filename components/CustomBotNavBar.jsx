import { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Keyboard } from 'react-native';
import { Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Home from '../screens/Home';
import LogMeals from '../screens/LogMeals';
import Settings from '../screens/Settings';

const CustomBotNavBar = () => {

	const homeRoute = () => <Home/>
	const logMealRoute = () => <LogMeals/>
	const settingsRoute = () => <Settings/>

	const [index, setIndex] = useState(0);
	const insets = useSafeAreaInsets();
	const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

	useEffect(() => {
		const showSub = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
		const hideSub = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));
		return () => {
			showSub.remove();
			hideSub.remove();
		};
	}, []);

	const tabs = [
		{ key: 'home', title: 'Home', iconFocused: 'home', iconUnfocused: 'home-outline' },
		{ key: 'logMeals', title: 'Log Meal', iconFocused: 'plus-box', iconUnfocused: 'plus-box-outline' },
		{ key: 'settings', title: 'Settings', iconFocused: 'cog', iconUnfocused: 'cog-outline' },
	];

	return (
		<View style={{ flex: 1 }}>
			{/* Scene */}
			<View style={{ flex: 1 }}>
				{tabs[index].key === 'home' && (
					homeRoute()
				)}
				{tabs[index].key === 'logMeals' && (
					logMealRoute()
				)}
				{tabs[index].key === 'settings' && (
					settingsRoute()
				)}
			</View>
			{/* Custom bottom nav (hidden while keyboard is visible) */}
			{!isKeyboardVisible && (
				<View
					style={[styles.bar, {marginBottom: insets.bottom}]}
				>
					{tabs.map((tab, tabIndex) => (
						<TouchableOpacity
							key={tab.key}
							onPress={() => setIndex(tabIndex)}
							activeOpacity={index === tabIndex ? 1 : 0.5}
							style={{ alignItems: 'center' }}
						>
							<View style={[styles.iconContainer, index === tabIndex && styles.activeIconContainer]}>
								<Icon source={index === tabIndex ? tab.iconFocused : tab.iconUnfocused} size={25} color={index === tabIndex ? '#10b77f' : 'grey'} />
							</View>

							<Text style={{ color: index === tabIndex ? '#10b77f' : 'grey' }}>{tab.title}</Text>
						</TouchableOpacity>
					))}
				</View>
			)}
		</View>
	);
};

export default CustomBotNavBar;

const styles = StyleSheet.create({
	bar: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		paddingVertical: 10,
		backgroundColor: '#ffffff',
		borderTopWidth: 1,
		elevation: 6,
		borderTopColor: '#f5f5f5',
	},
	iconContainer: {
		padding: 10,
		borderRadius: 30,
		backgroundColor: '#f8fafc',
	}, 
	activeIconContainer: {
		backgroundColor: '#f0fdf4',
	}
})
