import { ScrollView, View, Image, Text, StyleSheet } from 'react-native';
import React, { Dispatch, SetStateAction, useRef } from 'react';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../models/user.model';
import { CursusUser } from '../models/user.model';
import { cs } from '../style/common.style';

let levelPercent = 0;

const skillsColor = [ '#FFCC80', '#FFF59D', '#E6EE9C', '#80CBC4', '#81D4FA', '#90CAF9', '#9FA8DA', '#B39DDB', '#CE93D8', '#E1BEE7', '#CE93D8', '#F48FB1', '#EF9A9A', '#F06292', '#F06292' ];

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
    textAlign: 'center',
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
  },
  projects: {
    // display: 'flex',
    flexDirection: 'column',

    projectList: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      width: '100%',
    }
  }
});

const Profile = ({ route }) => {
  const [user, setUser]: [User, Dispatch<SetStateAction<User>>] = React.useState();
  const [cursus, setCursus]: [ CursusUser, Dispatch<SetStateAction<CursusUser>>] = React.useState();
  const [curriculums, setCurriculums]: any[] = React.useState();

  const getUserData = async () => {
    console.log(await AsyncStorage.getItem('@token'));
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
              width: `${+cursus.level.toString().split('.')[1] * 10}%`
            }}></View>
          </View>
        </View>
        <View style={ cs.container }>
          <Text style={ cs.h2 }>Projects</Text>
          <ScrollView>
            {
              user.projects_users.filter(p =>   p.cursus_ids[0] == cursus.cursus.id).map(project => {
                return (
                  <View style={ style.projects.projectList }>
                    <Text>{ project.project.name }</Text>
                    <Text>{ project.final_mark }</Text>
                    <Text>{ project.status }</Text>
                  </View>
                );
              })
            }
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default Profile;
