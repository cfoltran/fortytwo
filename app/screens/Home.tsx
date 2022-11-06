import { Text, View, Button } from 'react-native';
import React from 'react';

const Home = ({ navigation, route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'flex-end' }}>
      <Button
        title="Search"
        onPress={() => { navigation.replace('Search') }}
      />
    </View>
  );
}

export default Home;
