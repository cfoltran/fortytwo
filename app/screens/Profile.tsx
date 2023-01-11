import React  from 'react';
import ProfileContent from '../components/ProfileContent';


const Profile = ({ route }) => {
  return (
    <ProfileContent userId={ route.params.userId }/>
  )
}

export default Profile;
