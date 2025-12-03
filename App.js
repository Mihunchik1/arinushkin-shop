import { StyleSheet, Text, View, Pressable, Modal, TextInput, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, createContext, useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CartContext = createContext();

function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevItems.filter(item => item.id !== productId);
      }
    });
  };

  const removeItemCompletely = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseInt(item.price.replace('₽', '').replace(/\s/g, ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      removeItemCompletely,
      clearCart,
      getTotalPrice,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  );
}

const useCart = () => useContext(CartContext);

const categories = [
  { id: 1, name: 'Кровати', icon: () => <Ionicons name="bed" size={45} color="#284B63" /> },
  { id: 2, name: 'Столы', icon: () => <MaterialIcons name="table-restaurant" size={45} color="#284B63" /> },
  { id: 3, name: 'Прихожие', icon: () => <MaterialIcons name="door-sliding" size={45} color="#284B63" /> },
  { id: 4, name: 'Кухни', icon: () => <MaterialIcons name="kitchen" size={45} color="#284B63" /> },
];

const products = [
  {id: 1, categoryId: 1, name: 'Кровать-Сити', color: 'Белый', size: '200*90*65', price: '20000₽'},
  {id: 2, categoryId: 1, name: 'Кровать-Рим', color: 'Зеленый', size: '220*220*70', price: '47000₽'},
  {id: 3, categoryId: 1, name: 'Кровать-Уют', color: 'Синий', size: '200*90*65', price: '24000₽'},
  {id: 4, categoryId: 1, name: 'Кровать-Уют', color: 'Белый', size: '200*90*65', price: '25000₽'},
  {id: 5, categoryId: 1, name: 'Кровать-Венсен', color: 'Белый', size: '190*85*60', price: '17000₽'},
  {id: 6, categoryId: 1, name: 'Кровать-Уют', color: 'Коричневый', size: '200*90*65', price: '29000₽'},
  
  {id: 7, categoryId: 2, name: 'Стол-Wood', color: 'Коричневый', material: 'Дуб', price: '7000₽'},
  {id: 8, categoryId: 2, name: 'Стол-ССТ4', color: 'Серый', material: 'Пластик', price: '2500₽'},
  {id: 9, categoryId: 2, name: 'Стол-Престиж', color: 'Белый', material: 'Аллюминий', price: '3200₽'},
  {id: 10, categoryId: 2, name: 'Стол-Престиж', color: 'Желтый', material: 'Аллюминий', price: '3200₽'},

  {id: 11, categoryId: 3, name: 'Прихожая-Грейс', color: 'Черный', size: '200*60*250', price: '80000₽'},
  {id: 12, categoryId: 3, name: 'Прихожая-Престиж', color: 'Белый', size: '100*30*250', price: '35700₽'},
  {id: 13, categoryId: 3, name: 'Прихожая-Грейс', color: 'Бежевый', size: '200*60*250', price: '80000₽'},
  {id: 14, categoryId: 3, name: 'Прихожая-Грейс XL', color: 'Черный', size: '240*800*250', price: '100000₽'},
  {id: 15, categoryId: 3, name: 'Прихожая-Сицилия', color: 'Голубой', size: '150*30*250', price: '35000₽'},
  {id: 16, categoryId: 3, name: 'Прихожая-БН208', color: 'Розовый', size: '200*60*250', price: '80000₽'},
];

function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Магазин Arinushkin</Text>
    </View>
  );
}

function HomeScreen() {
  const [newYearModalVisible, setNewYearModalVisible] = useState(false);

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

function CatalogScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');

  const handleCategoryPress = (categoryName) => {
    navigation.navigate('Category', { 
      categoryName: categoryName 
    });
  };
  
  return(
    <View style={styles.screen}>
       <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск товара"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Pressable 
          style={({ pressed }) => [
            styles.searchButton,
            pressed && styles.searchButtonPressed
          ]}
        >
          <Ionicons name="search" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <Pressable 
            key={category.id}
            style={({ pressed }) => [
              styles.categoryItem,
              pressed && styles.categoryPressed
            ]}
            onPress={() => handleCategoryPress(category.name)}
          >
            <Text style={styles.categoryName}>{category.name}</Text>
            {category.icon()}
          </Pressable>
        ))}
      </View>
    </View>
  )
}

function CategoryScreen({ route, navigation }) {
  const { categoryName } = route.params;
  const { addToCart } = useCart();
  
  const category = categories.find(cat => cat.name === categoryName);
  const categoryId = category ? category.id : null;
  
  const categoryProducts = products.filter(product => product.categoryId === categoryId);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [cartModalVisible, setCartModalVisible] = useState(false);

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setProductModalVisible(true);
  };

  const closeProductModal = () => {
    setProductModalVisible(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      addToCart(selectedProduct);
    }
    closeProductModal();
  };

  const renderProductItem = ({ item }) => (
    <Pressable 
      style={({ pressed }) => [
        styles.productCard,
        pressed && styles.productCardPressed
      ]}
      onPress={() => handleProductPress(item)}
    >
      <View style={styles.productImageContainer}>
        <Ionicons name="image-outline" size={50} color="#D9D9D9" />
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productDetails} numberOfLines={1}>
          {item.color && `Цвет: ${item.color}`}
        </Text>
        <Text style={styles.productPrice}>{item.price}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.categoryScreen}>
      <View style={styles.topBarContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.topBarButton,
            styles.backButton,
            pressed && styles.buttonPressed
          ]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={20} color="#284B63" />
          <Text style={styles.topBarButtonText}>Назад</Text>
        </Pressable>

        <Text style={styles.categoryTitle}>{categoryName}</Text>

        <Pressable
          style={({ pressed }) => [
            styles.topBarButton,
            styles.cartButton,
            pressed && styles.buttonPressed
          ]}
          onPress={() => setCartModalVisible(true)}
        >
          <Text style={styles.topBarButtonText}>Корзина</Text>
          <Ionicons name="cart" size={20} color="#284B63" />
        </Pressable>
      </View>
      
      <FlatList
        data={categoryProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productsList}
        columnWrapperStyle={styles.productsRow}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.noProductsText}>Товары отсутствуют</Text>
        }
      />

      <Modal
        visible={productModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeProductModal}
      >
        <View style={styles.productModalOverlay}>
          <View style={styles.productModalContent}>
            <View style={styles.productModalHeader}>
              <Text style={styles.productModalTitle}>Карточка товара</Text>
              <Pressable onPress={closeProductModal}>
                <Ionicons name="close" size={24} color="#353535" />
              </Pressable>
            </View>

            {selectedProduct && (
              <>
                <View style={styles.modalProductImageContainer}>
                  <Ionicons name="image-outline" size={100} color="#D9D9D9" />
                </View>

                <Text style={styles.modalProductName}>{selectedProduct.name}</Text>
                <Text style={styles.modalProductId}>Артикул: {selectedProduct.id}</Text>
                <Text style={styles.modalProductPrice}>{selectedProduct.price}</Text>

                <View style={styles.productParamsContainer}>
                  {selectedProduct.color && (
                    <Text style={styles.productParam}>Цвет: {selectedProduct.color}</Text>
                  )}
                  {selectedProduct.size && (
                    <Text style={styles.productParam}>Размер(Длина, Ширина, Высота): {selectedProduct.size}</Text>
                  )}
                  {selectedProduct.material && (
                    <Text style={styles.productParam}>Материал: {selectedProduct.material}</Text>
                  )}
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.addToCartButton,
                    pressed && styles.buttonPressed
                  ]}
                  onPress={handleAddToCart}
                >
                  <Ionicons name="cart" size={20} color="#FFFFFF" />
                  <Text style={styles.addToCartButtonText}>Добавить в корзину</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>

      <CartModal 
        visible={cartModalVisible}
        onClose={() => setCartModalVisible(false)}
      />
    </View>
  );
}

function CartModal({ visible, onClose }) {
  const { 
    cartItems, 
    addToCart, 
    removeFromCart, 
    removeItemCompletely, 
    clearCart, 
    getTotalPrice,
    getTotalItems 
  } = useCart();

  const [orderErrorModalVisible, setOrderErrorModalVisible] = useState(false);

  const handleOrder = () => {
    console.log('Попытка оформить заказ');
    onClose(); 
    setOrderErrorModalVisible(true); 
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="fade"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.cartModalOverlay}>
          <View style={styles.cartModalContent}>
            <View style={styles.cartModalHeader}>
              <Text style={styles.cartModalTitle}>
                Корзина ({getTotalItems()} товаров)
              </Text>
              <Pressable onPress={onClose}>
                <Ionicons name="close" size={24} color="#353535" />
              </Pressable>
            </View>

            {cartItems.length > 0 ? (
              <>
                <FlatList
                  data={cartItems}
                  renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                      <View style={styles.cartItemImage}>
                        <Ionicons name="image-outline" size={40} color="#D9D9D9" />
                      </View>
                      
                      <View style={styles.cartItemInfo}>
                        <Text style={styles.cartItemName}>{item.name}</Text>
                        <Text style={styles.cartItemPrice}>{item.price}</Text>
                        {item.color && (
                          <Text style={styles.cartItemDetail}>Цвет: {item.color}</Text>
                        )}
                      </View>

                      <View style={styles.cartItemControls}>
                        <Pressable 
                          style={styles.cartItemButton}
                          onPress={() => removeFromCart(item.id)}
                        >
                          <Ionicons name="remove" size={20} color="#284B63" />
                        </Pressable>
                        
                        <Text style={styles.cartItemQuantity}>{item.quantity}</Text>
                        
                        <Pressable 
                          style={styles.cartItemButton}
                          onPress={() => addToCart(item)}
                        >
                          <Ionicons name="add" size={20} color="#284B63" />
                        </Pressable>

                        <Pressable 
                          style={[styles.cartItemButton, styles.deleteButton]}
                          onPress={() => removeItemCompletely(item.id)}
                        >
                          <Ionicons name="trash" size={20} color="#FF6B6B" />
                        </Pressable>
                      </View>
                    </View>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  style={styles.cartItemsList}
                />

                <View style={styles.cartTotal}>
                  <Text style={styles.cartTotalText}>Итого:</Text>
                  <Text style={styles.cartTotalPrice}>{getTotalPrice()}₽</Text>
                </View>

                <View style={styles.cartButtons}>
                  <Pressable
                    style={[styles.cartActionButton, styles.clearCartButton]}
                    onPress={clearCart}
                  >
                    <Text style={styles.clearCartButtonText}>Очистить корзину</Text>
                  </Pressable>
                  
                  <Pressable
                    style={[styles.cartActionButton, styles.orderButton]}
                    onPress={handleOrder}
                  >
                    <Text style={styles.orderButtonText}>Заказать</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <View style={styles.emptyCart}>
                <Ionicons name="cart-outline" size={80} color="#D9D9D9" />
                <Text style={styles.emptyCartText}>Корзина пуста</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
        <Modal
          visible={orderErrorModalVisible}
          animationType="fade"
          transparent={true}
          statusBarTranslucent={true}
          onRequestClose={() => setOrderErrorModalVisible(false)}
        >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Отсутствует интернет соединение.{'\n'}
              Пожалуйста, повторите попытку позже
            </Text>
            <Pressable
              onPress={() => setOrderErrorModalVisible(false)}
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.buttonPressed
              ]}
            >
              <Text style={styles.buttonText}>Назад</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

function CatalogStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CatalogMain" component={CatalogScreen} />
      <Stack.Screen name="Category" component={CategoryScreen} />
    </Stack.Navigator>
  );
}

function ProfileScreen() {
  
  const [modalWindow, setModalWindow] = useState(false);

  return(
    <View style={styles.profileScreen}>
      <Pressable 
        onPress={() => setModalWindow(true)}
        style={({ pressed }) => [
          styles.registerButton,
          pressed && styles.buttonPressed
        ]}
      >
        <Text style={styles.buttonText}>Регистрация</Text>
      </Pressable>
      <Pressable
        onPress={() => setModalWindow(true)}
        style={({ pressed }) => [
          styles.loginButton,
          pressed && styles.buttonPressed
        ]}
      >
        <Text style={styles.buttonText}>Войти</Text>
      </Pressable>
      <Modal 
        visible={modalWindow}
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Отсутствует интернет соединение.{'\n'}Пожалуйста, повторите попытку позже</Text>
            <Pressable
             onPress={() => setModalWindow(false)}
             style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.buttonPressed
              ]}
            >
              <Text style={styles.buttonText}>Назад</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  )
};

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Header/>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#284B63',
            tabBarInactiveTintColor: '#353535',
          }}
        >
          <Tab.Screen
            name='Главная'
            component={HomeScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home" size={size} color={color} />
              )
            }}
          />
          <Tab.Screen
            name='Каталог'
            component={CatalogStack}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="cart" size={size} color={color} />
              )
            }}
          />
          <Tab.Screen
            name='Профиль'
            component={ProfileScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person" size={size} color={color} />
              )
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    paddingTop: 10,
  },
  screenText: {
    color: '#353535',
    fontSize: 18,
  },
  profileScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#D9D9D9',
  },
  header: {
    paddingTop: 40,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderBottomColor: '#3C6E71',
    backgroundColor: '#284B63',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '300',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  tabBar: {
    backgroundColor: '#284B63',
    borderTopColor: '#3C6E71',
    borderTopWidth: 1,
    paddingBottom: 5,
    paddingTop: 5,
  },
  registerButton: {
    width: '50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3C6E71',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    minWidth: 200,
  },
  loginButton: {
    width: 'auto',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#284B63',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    minWidth: 200,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '300',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
    height: 'auto',
    textAlign: 'center'
  },
  modalText: {
    color: '#353535',
    textAlign: 'center',
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    width: '95%',
  },
  searchInput: {
    flex: 1,
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#353535',
    borderWidth: 1,
    borderColor: '#284B63',
    marginRight: 10,
    height: 40,
  },
  searchButton: {
    backgroundColor: '#284B63',
    borderRadius: 10,
    padding: 13,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    width: 50,
  },
  searchButtonPressed: {
    opacity: 0.8,
  },
  categoryItem: {
    width: '90%',
    height: '20%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryName: {
    fontSize: 22,
    fontWeight: '300',
    color: '#353535',
  },
  categoriesContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryPressed: {
    opacity: 0.8,
  },
  topBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: '2%',
    paddingBottom: '2%',
    backgroundColor: '#FFFFFF',
  },
  topBarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 8,
    borderColor: '#284B63',
    borderWidth: 1,
    justifyContent: 'center',
  },
  topBarButtonText: {
    color: '#284B63',
    fontSize: 16,
    fontWeight: '300',
  },
  backButton: {
    minWidth: 90,
  },
  cartButton: {
    minWidth: 90,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '300',
    color: '#284B63',
    textAlign: 'center',
  },
  categoryScreen: {
    flex: 1,
    backgroundColor: '#D9D9D9',
  },
  productsList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  productsRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    width: '48%',
    minHeight: 180,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginTop: '4%',
  },
  productCardPressed: {
    opacity: 0.8,
  },
  productImageContainer: {
    width: '100%',
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '400',
    color: '#353535',
    marginBottom: 5,
    height: 40,
  },
  productDetails: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '500',
    color: '#284B63',
    marginTop: 'auto',
  },
  noProductsText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  productModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  productModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  productModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  productModalTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#353535',
  },
  modalProductImageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    alignSelf: 'center',
  },
  modalProductName: {
    fontSize: 22,
    fontWeight: '400',
    color: '#353535',
    textAlign: 'center',
    marginBottom: 5,
  },
  modalProductId: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalProductPrice: {
    fontSize: 26,
    fontWeight: '600',
    color: '#284B63',
    textAlign: 'center',
    marginBottom: 20,
  },
  productParamsContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  productParam: {
    fontSize: 16,
    color: '#353535',
    marginBottom: 8,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3C6E71',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  addToCartButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '400',
    marginLeft: 10,
  },
  cartModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cartModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  cartModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  cartModalTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#353535',
  },
  cartItemsList: {
    maxHeight: 300,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cartItemImage: {
    width: 50,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '400',
    color: '#353535',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#284B63',
    marginBottom: 4,
  },
  cartItemDetail: {
    fontSize: 12,
    color: '#666',
  },
  cartItemControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  cartItemButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  deleteButton: {
    backgroundColor: '#FFF5F5',
    marginLeft: 10,
  },
  cartItemQuantity: {
    fontSize: 16,
    fontWeight: '500',
    color: '#353535',
    marginHorizontal: 10,
    minWidth: 20,
    textAlign: 'center',
  },
  cartTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 10,
  },
  cartTotalText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#353535',
  },
  cartTotalPrice: {
    fontSize: 22,
    fontWeight: '600',
    color: '#284B63',
  },
  cartButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cartActionButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearCartButton: {
    backgroundColor: '#F5F5F5',
    marginRight: 10,
  },
  orderButton: {
    backgroundColor: '#3C6E71',
    marginLeft: 10,
  },
  clearCartButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '400',
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyCart: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyCartText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
  },
  screenTitle: {
  fontSize: 28,
  fontWeight: 'bold',
  color: '#284B63',
  textAlign: 'center',
  marginBottom: 25,
  marginTop: 10,
  },
  promoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  promoCardPressed: {
    opacity: 0.9,
  },
  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promoTextContainer: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#284B63',
    marginBottom: 5,
  },
  promoSubtitle: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
    marginBottom: 3,
  },
  promoPeriod: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#353535',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    textAlign: 'center',
  },
  quickLinks: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickLinksTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#353535',
    marginBottom: 15,
    textAlign: 'center',
  },
  quickLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickLinkItem: {
    alignItems: 'center',
    padding: 10,
  },
  quickLinkText: {
    fontSize: 14,
    color: '#284B63',
    marginTop: 8,
    fontWeight: '500',
  },
  promoModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  promoModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxHeight: '80%',
  },
  promoModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  promoModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#284B63',
  },
  promoModalIcon: {
    alignItems: 'center',
    marginBottom: 15,
  },
  promoModalPeriod: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: '#FFF5F5',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignSelf: 'center',
  },
  promoDetails: {
    marginBottom: 20,
  },
  promoDetailItem: {
    fontSize: 16,
    color: '#353535',
    marginBottom: 12,
    paddingLeft: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  promoModalNote: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 25,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  promoModalButton: {
    backgroundColor: '#3C6E71',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  promoModalButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
});