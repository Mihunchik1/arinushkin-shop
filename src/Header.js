import { View, Text } from 'react-native';
import { styles } from './Styles';

export function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Магазин Arinushkin</Text>
    </View>
  );
}
