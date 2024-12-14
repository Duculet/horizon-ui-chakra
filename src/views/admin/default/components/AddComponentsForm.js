import React, { useState } from 'react';
import { Box, Button, Select, Flex } from '@chakra-ui/react';

const AddComponentForm = ({ onAdd }) => {
  const [componentType, setComponentType] = useState('TotalRevenue');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(componentType);
  };

  return (
    <Box p={4} bg="gray.100" borderRadius="md">
      <form onSubmit={handleSubmit}>
        <Select
          value={componentType}
          onChange={(e) => setComponentType(e.target.value)}
          mb={4}
        >
          <option value="TotalRevenue">TotalRevenue</option>
          <option value="TotalCosts">TotalCosts</option>
          <option value="TotalSpent">TotalSpent</option>
          <option value="WeeklyRevenue">WeeklyRevenue</option>
        </Select>
        <Button type="submit" colorScheme="blue" width="full">
          Add Component
        </Button>
      </form>
    </Box>
  );
};

export default AddComponentForm;