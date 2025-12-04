import { Text, View, Pressable, Modal, TextInput, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useState, createContext, useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import { categories } from './src/data/categories.js';
import { products } from './src/data/products.js';
import { Header } from './src/Header.js';
import { HomeScreen } from './src/HomeScreen.js';
import { ProfileScreen } from './src/ProfileScreen.js';
import { styles } from './src/Styles.js';



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
        statusBarTranslucent={true}
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
    onClose(); 
    setOrderErrorModalVisible(true); 
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
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

;

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
};
