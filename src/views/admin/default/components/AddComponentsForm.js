import React, { useState } from 'react';
import { Button, Select, useColorModeValue } from '@chakra-ui/react';

const AddComponentForm = ({ onAdd, onCloseForm }) => {
  const [componentType, setComponentType] = useState('TotalRevenue');
  const brandColor = useColorModeValue("brand.500", "white");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(componentType);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Select
        value={componentType}
        onChange={(e) => setComponentType(e.target.value)}
        mb={4}
        textAlign="center"
        sx={{
          '& option': {
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
          }
        }}
      >
        <option value="TotalRevenue">TotalRevenue</option>
        <option value="TotalCosts">TotalCosts</option>
        <option value="TotalSpent">TotalSpent</option>
        <option value="WeeklyRevenue">WeeklyRevenue</option>
      </Select>
      <Button 
        type="submit" 
        color={brandColor} 
        width="full"
      >
        Add Component
      </Button>
      <Button onClick={onCloseForm} colorScheme="red" width="full">
        Cancel
      </Button>
    </form>
  );
};

export default AddComponentForm;