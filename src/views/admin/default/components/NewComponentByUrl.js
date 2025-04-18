import React, {useState, useEffect, useRef} from 'react';
import { Card, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import { loadData } from 'variables/charts';
import { MdAdd } from 'react-icons/md';
import AddComponentForm from './AddComponentsForm';
import AddComponentsFormUrl from './AddComponentsFormUrl';

const NewComponentByUrl = (props) => {
  const { onAdd, text, ...rest } = props;
  const brandColor = useColorModeValue("brand.500", "white");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const componentRef = useRef(null);

  useEffect(() => {
    loadData(setDataLoaded);
  }, []);

  const handleAdd = (url, componentType) => {
    onAdd(url, componentType);
    setShowAddForm(false);
  }

  const handleClose = () => {
    setShowAddForm(false);
  };

  const handleClickOutside = (event) => {
    if (componentRef.current && !componentRef.current.contains(event.target)) {
      setShowAddForm(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Card 
      py='15px' 
      borderRadius={'3xl'} 
      ref={componentRef}
      onClick={() => setShowAddForm(true)}
      cursor="pointer"
      {...rest}
      >
      <Flex
        my='auto'
        h='100%'
        align={{ base: "center", xl: "start" }}
        justify={{ base: "center", xl: "center" }}
        p={'20px'}
      >
      {showAddForm ? (
        <>
          <AddComponentsFormUrl onAdd={handleAdd} onCloseForm={handleClose}/>
        </>
      ) : (
        <>
          <Icon as={MdAdd} color={brandColor} fontSize='xl' />
          <Text fontSize='xl' color={textColor}>
            {text}
          </Text>
        </>
      )}
      </Flex>
    </Card>
  )
};

export default NewComponentByUrl;