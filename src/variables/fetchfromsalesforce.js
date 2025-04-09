import axios from 'axios';

export const fetchLeadsFromSalesforce = async () => {
  try {
    const response = await axios.get('/api/salesforce');
    return response.data.records;
  } catch (error) {
    console.error('Error fetching Salesforce leads:', error);
    return [];
  }
};