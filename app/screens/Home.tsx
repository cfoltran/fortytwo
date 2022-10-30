import { Text, View, Button } from 'react-native';
import React from 'react';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const Home = ({ navigation, route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
      <Text>
          HOME
      </Text>
    </View>
  );
}

export default Home;
