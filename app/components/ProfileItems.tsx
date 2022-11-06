import { Text, View, Button, ScrollView } from 'react-native';
import React from 'react';

const SearchItems = ({ users }) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'flex-end' }}>
      {
          users?.map(user => {
            return (
              <Text>{user.login}</Text>
            );
          })
      }
    </View>
  )
}

export default SearchItems;
