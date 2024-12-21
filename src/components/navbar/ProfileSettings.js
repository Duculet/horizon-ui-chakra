import React, { useState } from 'react';
import { Button, Input, Flex, Box, Text } from '@chakra-ui/react';
import { supabase } from '../../views/admin/default/api/supabase';

const ProfileSettings = () => {
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdateProfile = async () => {
    try {
      const user = supabase.auth.getUser();
      if (!user) {
        setMessage('No user is signed in.');
        return;
      }

      const updates = {
        id: user.id,
        display_name: displayName,
        photo_url: photoURL,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }

      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile.');
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