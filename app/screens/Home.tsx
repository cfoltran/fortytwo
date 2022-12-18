import { View, Button } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({ navigation, route }) => {
  // navigation.replace('Profile', { userId: 40591 });
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'flex-end' }}>
      <Button
        title="Log out"
        onPress={ async () => {
            await AsyncStorage.removeItem('@token')  
            navigation.replace('Login')
         }
        }
      />
    </View>
  );
}

export default Home;
