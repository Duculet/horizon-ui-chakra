import { supabase } from './supabase';

export const saveOrderToServer = async (order) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .upsert({
        name: order.name,  // Ensure 'name' exists
        ids: order.ids     // Ensure 'ids' exists
      }, { onConflict: ['name'] });

    if (error) throw error;
    return data;
  } catch (e) {
    console.error('Error saving order: ', e);
  }
};

export const loadOrderFromServer = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*');

    if (error) throw error;
    return data;
  } catch (e) {
    console.error('Error loading orders: ', e);
  }
};

export const deleteOrderFromServer = async (orderName) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .delete()
      .eq('name', orderName);

    if (error) throw error;
    return data;
  } catch (e) {
    console.error('Error deleting order: ', e);
  }
};