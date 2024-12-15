import React, { useState } from 'react';
import { Button, Flex, Input, Select, useColorModeValue } from '@chakra-ui/react';

const AddComponentsFormUrl = ({ onAdd, onCloseForm }) => {
  const [componentType, setComponentType] = useState('TotalRevenue');
  const [url, setUrl] = useState('https://raw.githubusercontent.com/Duculet/testing/refs/heads/main/Tesla.csv');
  const brandColor = useColorModeValue("brand.500", "white");
  const textColor = useColorModeValue("secondaryGray.900", "white");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(url, componentType);
  };

  const handleSubmitClose = (e) => {
    e.preventDefault();
    onCloseForm();
  };

  return (
    <Flex direction='column' w='100%' align='center' justify='center'>
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
          <option value="TotalSomething">TotalSomething</option>
          <option value="TotalRevenue">TotalRevenue</option>
          <option value="TotalCosts">TotalCosts</option>
          <option value="TotalSpent">TotalSpent</option>
          <option value="WeeklyRevenue">WeeklyRevenue</option>
        </Select>
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          mb={4}
          textAlign="center"
          placeholder="Enter URL"
          color={textColor}
        >
        </Input>
        <Button 
          type="submit" 
          color={brandColor} 
          width="200px"
          mb={4}
          align='center'
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

export default AddComponentsFormUrl;