import { Text, View, Button } from 'react-native';
import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { useAuthRequest } from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OAUTH_CLIENT_ID, OAUTH_SECRET, API_BASE_URL } from '@env';
import axios from 'axios';

WebBrowser.maybeCompleteAuthSession();

const baseURL = API_BASE_URL;

const Login = ({ navigation, route }) => {
  const [code, setCode] = React.useState();

  const [request, response, promptAsync] = useAuthRequest({
    clientId: OAUTH_CLIENT_ID,
    scopes: ['public', 'projects'],
    redirectUri: 'fortytwo://oauth',
  }, {
    authorizationEndpoint: `${baseURL}/oauth/authorize`
  });

  const isValidToken = async () => {
    try {
      console.log(`${baseURL}/oauth/token/info`);
      const res = await axios.get(`${baseURL}/oauth/token/info`, {
        headers: {
          Authorization: `Bearer ${ await AsyncStorage.getItem('@token') }`
        }
      });
      return res.data.expires_in_seconds > 5;
    } catch (e) {

      console.error(e);
      return false;
    }
  };

  const getToken = async () => {
    try {
      const res = await axios.post(`${baseURL}/oauth/token`, {
        'grant_type': 'client_credentials',
        'client_id': OAUTH_CLIENT_ID,
        'client_secret': OAUTH_SECRET,
        code: await AsyncStorage.getItem('@code')
      });
      console.log(res.data);
      await AsyncStorage.setItem('@token', res.data.access_token ? res.data.access_token : null);
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
      if (await isValidToken()) {
        console.warn('valid token');
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