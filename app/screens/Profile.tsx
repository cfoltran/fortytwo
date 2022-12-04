import { View, Image, Text, StyleSheet } from 'react-native';
import React, { useRef } from 'react';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
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
  const [cursus, setCursus]: any = React.useState();
  const [curriculums, setCurriculums]: any[] = React.useState();

  const getUserData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/v2/users/${route.params.userId}`, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('@token')}`
        }
      });
      if (res.data) {
        setUser(res.data)
        const r = await axios.get(`${API_BASE_URL}/v2/users/${route.params.userId}/cursus_users`, {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('@token')}`
          }
        });
        setCurriculums(r.data)
      }
    } catch(e) {
      console.error(e); 
    }
  }

  React.useEffect(() => {
    if (curriculums && curriculums.length > 0) {
      setCursus({ label: curriculums[0].cursus.name, value: curriculums[0].cursus.id });
    }
  }, [curriculums])

  React.useEffect(() => {
    if (!user) {
        getUserData();
    }
  })

  if (user && curriculums) {
    console.log(curriculums.map(c => c.cursus.name));
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
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <RNPickerSelect
                onValueChange={(value) => setCursus(value)}
                items={
                  curriculums.map(c => 
                    ({ label: c.cursus.name, value: c.cursus.id })
                  )
                }
              />
            </View>
          </View>
        </View>
        <View style={ style.levelBar }>
          <Text></Text>
        </View>
      </View>
    );
  }
}

export default Profile;
