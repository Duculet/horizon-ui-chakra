import React, {useState, useEffect} from 'react';
import { Box, Card, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import { loadData } from 'variables/charts';
import { MdAdd } from 'react-icons/md';
import AddComponentForm from './AddComponentsForm';

const NewComponent = ({ onAdd }) => {
    const brandColor = useColorModeValue("brand.500", "white");
    const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const [dataLoaded, setDataLoaded] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        loadData(setDataLoaded);
    }, []);

    const handleAdd = (componentType) => {
        onAdd(componentType);
    }

    const handleClose = () => {
      setShowAddForm(false);
    };

    return (
        <Card py='15px' borderRadius={'3xl'} onClick={() => setShowAddForm(true)}>
          <Flex
            my='auto'
            h='100%'
            align={{ base: "center", xl: "start" }}
            justify={{ base: "center", xl: "center" }}
            p={'20px'}
          >
          {showAddForm ? (
            <AddComponentForm onAdd={handleAdd} onClose={handleClose}/>
          ) : (
            <>
              <Icon as={MdAdd} color={brandColor} fontSize='xl' />
              <Text fontSize='xl' color={textColor}>
                Add component!
              </Text>
            </>
          )}
          </Flex>
        </Card>
    )
};

export default NewComponent;