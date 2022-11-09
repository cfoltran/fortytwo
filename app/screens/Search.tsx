import { View, TextInput, StyleSheet, ScrollView } from 'react-native';
import { API_BASE_URL } from '@env';
import ProfileItems from '../components/ProfileItems'
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import axios from 'axios';

const baseURL = API_BASE_URL;

const Search = ({ navigation, route }) => {
  const [text, onChangeText] = React.useState("");
  const [users, onChangeUsers] = React.useState(); 
  const [timePassed, setTimeout] = React.useState();

  const search = async () => {
    try {
      console.log('in search');
      const res = await axios.get(`${baseURL}/v2/users/`, {
        params: {
          'search[login]': text,
        },
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('@token')}`
        }
      });
      onChangeUsers(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  React.useEffect(() => {
    if (timePassed) {
      clearTimeout(timePassed);
    }
    setTimeout(() => search(), 1000);
  }, [text]);

  return (
    <View style={{ padding: 10 }}>
      <View style={{ marginBottom: 10 }}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
        />
      </View>

      <ScrollView>
        <ProfileItems users={users} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 40,
    padding: 10,
    borderWidth: 1,
    textAlign: 'center',
    borderRadius: 5,
  },
});

export default Search;
