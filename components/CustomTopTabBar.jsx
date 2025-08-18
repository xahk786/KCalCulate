import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useState } from 'react'
import { Icon } from 'react-native-paper';

const CustomTopTabBar = ({ setRenderScene }) => {

	const [index, setIndex] = useState(1);

	const setTab = (tabIndex) => {
		setIndex(tabIndex);
		setRenderScene(tabs[tabIndex].key)
	}

	const tabs = [
		{ key: "search", title: "Search", icon: "magnify" },
		{ key: "create", title: "Create", icon: "plus" },
		{ key: "saved", title: "Saved", icon: "book-open-page-variant" }
	]

	return (
		<View style={styles.bar}>
			{tabs.map((tab, tabIndex) => (
				<Pressable key={tab.key} onPress={() => setTab(tabIndex)} style={{
					flexDirection: "row", flex: 1, justifyContent:"center",
					backgroundColor: index === tabIndex ? "#f0fdf4" : "#fefefe", borderRadius: 5, paddingHorizontal: 20, paddingVertical: 10
				}}>
					<Icon color={index === tabIndex ? "#10b77f" : "#77777f"} size={20} source={tab.icon} />
					<Text style={{ fontWeight: 600, color: index === tabIndex ? "#10b77f" : "#77777f" }} >{tab.title}</Text>
				</Pressable>
			))}
		</View>
	)
}

export default CustomTopTabBar

const styles = StyleSheet.create({
	bar: {
		elevation: 3,
		margin: 20,
		flexDirection: "row",
		justifyContent: "space-around",
		backgroundColor: "#fefefe",
		borderRadius: 10,
		paddingHorizontal: 10,
		paddingVertical: 10
	}
})