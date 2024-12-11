import React, { useState } from 'react';
import { Button, Input, Flex, Box, Text } from '@chakra-ui/react';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../views/admin/default/api/firebase';

const ProfileSettings = () => {
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL,
      });
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage(`Error updating profile: ${error.message}`);
    }
  };

  return (
    <Flex direction="column" align="center" justify="center" height="100vh">
      <Box p={6} rounded="md" bg="white" boxShadow="lg">
        <Text fontSize="2xl" mb={4}>Profile Settings</Text>
        {message && <Text color="green.500" mb={4}>{message}</Text>}
        <Input
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          mb={4}
        />
        <Input
          placeholder="Photo URL"
          value={photoURL}
          onChange={(e) => setPhotoURL(e.target.value)}
          mb={4}
        />
        <Button onClick={handleUpdateProfile} colorScheme="blue" width="full">Update Profile</Button>
      </Box>
    </Flex>
  );
};

export default ProfileSettings;