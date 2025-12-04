import { View, Text } from 'react-native';
import { styles } from './Styles';
import { categories } from './data/categories';

export function HomeScreen() {
  return(
    <View style={styles.screen}>      
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Добро пожаловать в магазин Arinushkin!</Text>
        <Text style={styles.infoText}>
          У нас вы найдете качественную мебель по лучшим ценам. 
          Выбирайте из сотен товаров с доставкой по всему городу.
        </Text>
      </View>

      <View style={styles.quickLinks}>
        <Text style={styles.quickLinksTitle}>Популярные категории:</Text>
        <View style={styles.quickLinksContainer}>
          {categories.slice(0, 2).map((category) => (
            <View key={category.id} style={styles.quickLinkItem}>
              {category.icon()}
              <Text style={styles.quickLinkText}>{category.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}