import { ScrollView, View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import React, { Dispatch, SetStateAction, useRef } from 'react';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import { API_BASE_URL, DEBUG } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../models/user.model';
import { CursusUser } from '../models/user.model';
import { cs } from '../style/common.style';
import { SvgCssUri } from 'react-native-svg';
import { BarChart } from "react-native-chart-kit";

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
  projectList: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    width: '100%',
  },
  badge: {
    display: 'flex',
    flexDirection: 'row',
    height: 50,
    marginBottom: 5,
  }
});

const ProfileContent = ({ userId }) => {
  const [user, setUser]: [User, Dispatch<SetStateAction<User>>] = React.useState();
  const [cursus, setCursus]: [ CursusUser, Dispatch<SetStateAction<CursusUser>>] = React.useState();
  const [curriculums, setCurriculums]: any[] = React.useState();

  const getUserData = async () => {
    console.log(await AsyncStorage.getItem('@token'));
    try {
      const res = await axios.get(`${API_BASE_URL}/v2/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('@token')}`
        }
      });
      if (res.data) {
        setUser(res.data)
        const r = await axios.get(`${API_BASE_URL}/v2/users/${userId}/cursus_users`, {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('@token')}`
          }
        });
        setCurriculums(r.data)
      }
    } catch(e) {
      if (DEBUG) {
        console.error(e); 
      }
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
        { +cursus.level > 0 ? (
          <View>
            <View>
              <ScrollView horizontal={true}>
                <BarChart
                  data={{
                    labels: cursus.skills.map(skill => skill.name),
                    datasets: [{
                      data: cursus.skills.map(skill => skill.level),
                    }],
                  }}
                  width={600}
                  height={100}
                  yAxisLabel=""
                  yAxisSuffix=''
                  yAxisInterval={1}
                  verticalLabelRotation={30}
                  chartConfig={{
                    backgroundGradientFromOpacity: 0,
                    backgroundGradientToOpacity: 0,
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: { borderRadius: 16 },
                    propsForDots: {
                      r: '1',
                      stroke: '#ffa726'
                    }
                  }}
                  style={{
                    marginVertical: 8,
                  }}
                />
              </ScrollView>
            </View>
            <View style={ cs.container }>
              <Text style={ cs.h2 }>Projects</Text>
              <ScrollView style={{ height: 180 }}>
                {
                  user.projects_users.filter(p => p.cursus_ids[0] == cursus.cursus.id).map(project => {
                    return (
                      <View style={ style.projectList }>
                        <Text>{ project.project.name }</Text>
                        <Text>{ project.status === 'finished' ? project.final_mark : project.status }</Text>
                      </View>
                    );
                  })
                }
              </ScrollView>
            </View>
            <View style={ cs.container }>
              <Text style={ cs.h2 }>Achievements</Text>
              <ScrollView>
                {
                  user.achievements.map(badge => {
                    return (
                      <View style={ style.badge }>
                        <SvgCssUri
                          width="50"
                          height="50"
                          uri={ API_BASE_URL + badge.image }
                        />
                        <View style={{ padding: 5 }}>
                          <Text>{ badge.name }</Text>
                          <Text>{ badge.description }</Text>
                        </View>
                      </View>
                    );
                  })
                }
              </ScrollView>
            </View>
          </View>
       ) : ( <Text>no datas</Text> )}
      </View>
    );
  }
}

export default ProfileContent;
