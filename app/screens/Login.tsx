import { Text, View, Button } from 'react-native';
import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { useAuthRequest } from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OAUTH_CLIENT_ID } from '@env';
import axios from 'axios';

WebBrowser.maybeCompleteAuthSession();

const Login = ({ navigation, route }) => {
  const [code, setCode] = React.useState();

  const [request, response, promptAsync] = useAuthRequest({
    clientId: OAUTH_CLIENT_ID,
    scopes: ['public', 'projects'],
    redirectUri: 'fortytwo://oauth',
    // ResponseType: 'code'
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
      const res = await axios.get('/oauth/token/info');
      console.log(res);
    } catch (e) {
      return false;
      console.error(e);
    }
  };

  const getToken = async () => {
    console.log('getToken');
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
      if (isValidToken()) {
        console.log('top');
      } else {
        getToken();
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