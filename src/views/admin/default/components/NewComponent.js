import React, {useState, useEffect} from 'react';
import { Box, Card, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import { loadData } from 'variables/charts';
import { MdAdd } from 'react-icons/md';

const NewComponent = () => {
    const brandColor = useColorModeValue("brand.500", "white");
    const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        loadData(setDataLoaded);
    }, []);

    return (
        <Card py='15px' borderRadius={'3xl'}>
          <Flex
            my='auto'
            h='100%'
            align={{ base: "center", xl: "start" }}
            justify={{ base: "center", xl: "center" }}
            p={'20px'}
          >
            <Icon as={MdAdd} color={brandColor} fontSize='xl' />
            <Text 
              fontSize='xl'
              color={textColor}
            >
              Add component!
              
            </Text>
          </Flex>
        </Card>
    )
};

export default NewComponent;