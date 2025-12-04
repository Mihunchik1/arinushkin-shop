import { useState } from 'react';
import { View, Pressable, Text, Modal } from 'react-native';
import { styles } from './Styles';

export function ProfileScreen() {

  const [modalWindow, setModalWindow] = useState(false);

  return (
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
  );
};
