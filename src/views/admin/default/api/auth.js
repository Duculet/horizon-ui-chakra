import { supabase } from './supabase';

export const signUp = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data.user;
  } catch (e) {
    console.error('Error signing up: ', e);
    throw e;
  }
};

export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  } catch (e) {
    console.error('Error signing in: ', e);
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    console.log('Signed out successfully');
  } catch (e) {
    console.error('Error signing out: ', e);
  }
};

export const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  try {
    if (error) throw error;
    console.log("SUCCESFULLY GOT USER");
    console.log(data.user);
    console.log(data.user.email);
    return data.user;
  } catch (error) {
    if (error.message === 'Auth session missing!') {
      console.error('Authentication session is missing. Please sign in again.');
      console.error('Error:', error);
      console.log('Data:', data);
    } else {
      console.error('An error occurred:', error);
    }
    return null;
  }
};