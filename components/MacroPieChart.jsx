import PieChart from 'react-native-pie-chart'

const MacroPieChart = ({protein, carbs, fats}) => {
	const widthAndHeight = 250

	const series = [
		{ value: protein, color: '#3b82f6', label: { text: `Protein ${protein}%`, fontWeight: 'bold', fontSize:15, outline: "white" } },
		{ value: carbs, color: '#ef4444', label: { text: `Carbs: ${carbs}%`, fontWeight: 'bold', fontSize:15 } },
		{ value: fats, color: '#f59e0b', label: { text: `Fats: ${fats}%`, fontWeight: 'bold', fontSize:15 } }
	]

	return (
		<PieChart widthAndHeight={250} series={series} />
	)
}

export default MacroPieChart
