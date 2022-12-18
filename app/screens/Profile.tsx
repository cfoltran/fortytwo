import { View, Image, Text, StyleSheet } from 'react-native';
import React, { useRef } from 'react';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

let levelPercent = 0;

const style = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,

    image: {
      height: 100,
      width: 100,
      borderRadius: 100
    }
  },
  levelContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    levelBar: {
      width: '100%',
      backgroundColor: 'rgba(50, 52, 57, 0.5)',
      borderRadius: 5,
  
      currentLevel: {
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        width: `${levelPercent}%`,
        height: 10,
        backgroundColor: '#2596be',
      }
    }
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
      setCursus(curriculums[0]);
    }
  }, [curriculums])

  React.useEffect(() => {
    if (!user) {
        getUserData();
    }
  })

  if (user && curriculums && cursus) {
    console.log(JSON.stringify(cursus, null, 2));
    console.log(cursus.level.toString().split('.')[1] * 10);

    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: 180 }}>
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
                value={cursus}
                onValueChange={(value) => setCursus(value)}
                items={
                  curriculums.map(c => ({
                    label: c.cursus.name,
                    value: c
                  }))
                }
              />
            </View>
          </View>
        </View>
        <View>
        <Text style={ style.levelContainer }>
          Level { cursus.level }%
        </Text>
        </View>
        <View style={{ padding: 10, display: 'flex', flexDirection: 'row' }}>
          <View style={ style.levelContainer.levelBar }>
            <View style={{
              ...style.levelContainer.levelBar.currentLevel,
              width: `${cursus.level.toString().split('.')[1] * 10}%`
            }}></View>
          </View>
        </View>
      </View>
    );
  }
}

export default Profile;
