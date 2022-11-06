import { Text, View, Image } from 'react-native';
import React from 'react';

const SearchItems = ({ users }) => {
  return (
    users?.map(user => {
      return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Image
            source={{ uri: user.image.versions.small }}
            style={{ width: 40, height: 40 }}
          />
          <Text style={{ padding: 15 }}>
            {user.login}
          </Text>
        </View>
      );
    })
  )
}

export default SearchItems;
