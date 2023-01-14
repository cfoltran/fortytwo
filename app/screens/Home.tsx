import { View, Button } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileContent from '../components/ProfileContent';
import { isValidToken } from './Login';

const Home = ({ navigation, route }) => {
  React.useEffect(() => {
    const authGuard = async () => {
      if (!await isValidToken()) {
        navigation.replace('Login');
      }
    }
    authGuard();
  });

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
      <ProfileContent userId={40591} />
    </View>
  );
}

export default Home;
