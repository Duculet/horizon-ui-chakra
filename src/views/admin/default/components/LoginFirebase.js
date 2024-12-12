import React, { useState } from 'react';
import { Button, Input, Flex, Box, Text } from '@chakra-ui/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../api/firebase';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Flex align="center" justify="center" height="100vh">
      <Box p={6} rounded="md" bg="white" boxShadow="lg">
        <Text fontSize="2xl" mb={4}>Login</Text>
        {error && <Text color="red.500" mb={4}>{error}</Text>}
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          mb={4}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          mb={4}
        />
        <Button onClick={handleLogin} colorScheme="blue" width="full">Login</Button>
      </Box>
    </Flex>
  );
};

export default Login;