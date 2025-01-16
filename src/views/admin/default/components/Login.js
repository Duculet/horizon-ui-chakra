import React, { useState } from 'react';
import { Flex, Box, Text, Input, Button, Alert, AlertIcon } from '@chakra-ui/react';
import { signIn, signInWithOAuth, signUp } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  const handleAuth = async () => {
    try {
      if (isSignUp) {
        setAlertMessage('Sign up process has been started.');
        await signUp(email, password);
      } else {
        await onLogin(email, password);
        navigate('/admin/default');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await signInWithOAuth('google');
      if (error) {
        throw error;
      }
      navigate('/admin/default');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Flex align="center" justify="center" height="100vh" bg="white">
      <Box
        p={6}
        rounded="md"
        bg="white"
        boxShadow="lg"
        width={'100%'}
        height={'100%'}
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Box
          width="100%"
          maxWidth="400px"
          margin="0 auto"
          padding="20px"
          borderRadius="10px"
          boxShadow="lg"
          bg="white"
        >
          <Text fontSize="2xl" mb={4}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
        {alertMessage && (
          <Alert status="info" mb={4}>
            <AlertIcon />
            {alertMessage}
          </Alert>
        )}
        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}
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
        <Button onClick={handleAuth} colorScheme="blue" width="full" mb={4}>
          {isSignUp ? 'Sign Up' : 'Login'}
        </Button>
        <Button variant="link" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </Button>
        <Button onClick={handleGoogleAuth} colorScheme="red" width="full">
          Sign in with Google
        </Button>
        </Box>
      </Box>
    </Flex>
  );
};

export default Login;