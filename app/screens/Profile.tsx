import { View, Image, Text } from 'react-native';
import React from 'react';
import axios from 'axios';
import { OAUTH_CLIENT_ID, OAUTH_SECRET, API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Profile = ({ route }) => {
  const [user, setUser]: any[] = React.useState();
  const [userCursus, setUserCursus] = React.useState();
  const [projects, setProjects] = React.useState();

  const getUserData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/v2/users/${route.params.userId}`, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('@token')}`
        }
      });
      if (res.data) {
        setUser(res.data)
      }
      console.log(JSON.stringify(res.data, null, 2));
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
      <View
        style={{ flex: 1, flexDirection: 'row' }}
      >
        <Image
          source={{ uri: user.image.versions.small }}
          style={{ width: 40, height: 40 }}
        />
        <Text style={{ padding: 15 }}>
          {user.login}
        </Text>
      </View>
    );
  }
}

export default Profile;
