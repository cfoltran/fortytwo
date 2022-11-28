import { View, Image, Text, StyleSheet } from 'react-native';
import React, { useRef } from 'react';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const style = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,

    image: {
      height: 100,
      width: 100,
      borderRadius: 100
    }
  },
  levelBar: {

  }
});

const Profile = ({ route }) => {
  const [user, setUser]: any[] = React.useState();
  const [cursus, setCursus] = React.useState();
  const [projects, setProjects] = React.useState();

  // const pickerRef = useRef();

  // function open() {
  //   pickerRef.current.focus();
  // }

  // function close() {
  //   pickerRef.current.blur();
  // }


  const getUserData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/v2/users/${route.params.userId}`, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('@token')}`
        }
      });
      if (res.data) {
        setUser(res.data)
        console.log(JSON.stringify(user.cursus_users, null, 2));
      }
    } catch(e) {
      console.error(e);
    }
  }

  React.useEffect(() => {
    if (!user) {
        getUserData();
    }
  })

  if (user) {
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={ style.header }>
          <Image
            source={{ uri: user.image.versions.small }}
            style={ style.header.image }
          />
          <View style={{ width: '70%' }}>
            <Text>{user.displayname} {user.login}</Text>
            <Text>Grade: { user.grade === 0 ? 'Novice' : 'Member' }</Text>
            <Text>Evaluation point: { user.correction_point }</Text>
            <Text>Campus: { user.campus.map(v => v.name) }</Text>
            <Picker
              selectedValue={cursus}
              onValueChange={(itemValue) =>
                setCursus(itemValue)
              }>
              {
                user?.cursus_users.map(cursus =>
                  <Picker.Item key={ cursus.id } label="ok" value="java" />
                )
              }
            </Picker>
          </View>
        </View>
        <View style={ style.levelBar }>
          <Text>{ user}</Text>
        </View>
      </View>
    );
  }
}

export default Profile;
