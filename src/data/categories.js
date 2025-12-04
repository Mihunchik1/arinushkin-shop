import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const categories = [
  { id: 1, name: 'Кровати', icon: () => <Ionicons name="bed" size={45} color="#284B63" /> },
  { id: 2, name: 'Столы', icon: () => <MaterialIcons name="table-restaurant" size={45} color="#284B63" /> },
  { id: 3, name: 'Прихожие', icon: () => <MaterialIcons name="door-sliding" size={45} color="#284B63" /> },
  { id: 4, name: 'Кухни', icon: () => <MaterialIcons name="kitchen" size={45} color="#284B63" /> },
];

export { categories };