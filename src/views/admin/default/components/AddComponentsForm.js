import React, { useState } from 'react';
import { Button, Flex, Select, useColorModeValue } from '@chakra-ui/react';

const AddComponentForm = ({ onAdd, onCloseForm }) => {
  const [componentType, setComponentType] = useState('TotalRevenue');
  const brandColor = useColorModeValue("brand.500", "white");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(componentType);
  };

  const handleSubmitClose = (e) => {
    e.preventDefault();
    onCloseForm();
  };

  return (
    <Flex direction='column' w='100%' align='center'>
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
          width="200px"
          mb={4}
        >
          Add Component
        </Button>
      </form>
      <form onSubmit={handleSubmitClose}>
      <Button type="submit" colorScheme="red" width="200px">
          Cancel
      </Button>
      </form>
    </Flex>
  );
};

export default AddComponentForm;