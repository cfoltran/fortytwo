import { Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';

const SearchItems = ({ users, navigation }) => {
  return (
    users?.map(user => {
      return (
        <View>
          <TouchableOpacity
            style={{ flex: 1, flexDirection: 'row' }}
            onPress={() => { navigation.replace('Profile') }}
          >
            <Image
              source={{ uri: user.image.versions.small }}
              style={{ width: 40, height: 40 }}
            />
            <Text style={{ padding: 15 }}>
              {user.login}
            </Text>
          </TouchableOpacity>
        </View>
      );
    })
  )
}

export default SearchItems;
