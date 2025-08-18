import { StyleSheet, View } from 'react-native'
import { ProgressBar} from 'react-native-paper';

const HorizontalProgress = ({ intake, kcalGoal }) => {
  const displayProgress = intake / kcalGoal

  return (
    <View>
      <ProgressBar progress={displayProgress} color='black' style={styles.bar} />
    </View>
  )
}

export default HorizontalProgress

const styles = StyleSheet.create({
  bar: {
    height : 15,
    borderRadius: 20
  }
})