import { Text, View, Button } from 'react-native';
import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { useAuthRequest } from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OAUTH_CLIENT_ID, OAUTH_UID, OAUTH_SECRET } from '@env';
import axios from 'axios';

WebBrowser.maybeCompleteAuthSession();

const baseUrl = 'https://api.intra.42.fr';

const Login = ({ navigation, route }) => {
  const [code, setCode] = React.useState();

  const [request, response, promptAsync] = useAuthRequest({
    clientId: OAUTH_CLIENT_ID,
    scopes: ['public', 'projects'],
    redirectUri: 'fortytwo://oauth',
  }, {
    authorizationEndpoint: 'https://api.intra.42.fr/oauth/authorize'
  });

  const getStore = async () => {
    try {
      const value = await AsyncStorage.getItem('@main')
      if (value !== null) {
        return value;
      }
    } catch(e) {
      console.error(e);
    }
  };

  const isValidToken = async () => {
    try {
      const res = await axios.get(`${baseUrl}/oauth/token/info`);
      console.log('👇');
      console.log(res);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const getToken = async () => {
    try {
      const res = await axios.post(`${baseUrl}/oauth/token`, {
        'grant_type': 'client_credentials',
        'client_id': OAUTH_CLIENT_ID,
        'client_secret': OAUTH_SECRET,
        code: await AsyncStorage.getItem('@code')
      });
      console.log(res);
    } catch (e) {
      console.error(e);
    }
  }

  React.useEffect(() => {
    const getCode = async () => {
      if (response?.type === 'success') {
        await AsyncStorage.setItem('@code', response.params.code)
      }
    };
    getCode();
  }, [response]);

  React.useEffect(() => {
    const authGuard = async () => {
      console.warn('Auth guard')
      const store = await getStore();      
      if (await isValidToken()) {
        navigation.replace('Home');
      } else {
        await getToken();
      }
    }
    authGuard();
  })

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
      <Text>
          Click to connect to intra
      </Text>
      <Button
        // disabled={!request}
        title="Connect"
        onPress={() => { promptAsync() }}
      />
    </View>
  );
}

export default Login;

export interface IStore {
  code: string;
}