import React, { useState } from 'react';
import { Button, Input, Flex, Box, Text, Alert, AlertIcon } from '@chakra-ui/react';
import { signIn, signUp } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async () => {
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        onLogin(email, password);
        navigate('/admin/default');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Flex align="center" justify="center" height="100vh">
      <Box p={6} rounded="md" bg="white" boxShadow="lg">
        <Text fontSize="2xl" mb={4}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
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
        <Button onClick={handleAuth} colorScheme="blue" width="full">
          {isSignUp ? 'Sign Up' : 'Login'}
        </Button>
        <Button
          variant="link"
          mt={4}
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </Button>
      </Box>
    </Flex>
  );
};

export default Login;