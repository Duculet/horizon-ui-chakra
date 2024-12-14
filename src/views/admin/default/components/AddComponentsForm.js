import React, { useState } from 'react';
import { Box, Button, Select, Flex, useColorModeValue } from '@chakra-ui/react';

const AddComponentForm = ({ onAdd, onClose }) => {
  const [componentType, setComponentType] = useState('TotalRevenue');

  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const textColor = useColorModeValue("secondaryGray.900", "white");

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
          },
          '& option': {
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
      <Button onClick={onClose} colorScheme="red" width="full">
        Cancel
      </Button>
    </form>
  );
};

export default AddComponentForm;