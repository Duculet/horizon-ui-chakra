import { supabase } from './supabase';

export const signUp = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data.user;
  } catch (e) {
    console.error('Error signing up: ', e);
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
  } catch (e) {
    console.error('Error signing out: ', e);
  }
};

export const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};