'use client'
// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import LineChart from "components/charts/LineChart";
import React, { useState, useEffect } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { MdBarChart, MdOutlineCalendarToday } from "react-icons/md";
// Assets
import { RiArrowUpSFill } from "react-icons/ri";
import {
  years,
  lineChartDataTotalSpent,
  lineChartOptionsTotalSpent,
  lineChartDataTotalSpentCSV,
  lineChartOptionsTotalSpentCSV,
} from "variables/charts";

export default function TotalSpent(props) {
  const { ...rest } = props;

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Year');
  const [chartData, setChartData] = useState(lineChartDataTotalSpentCSV);
  const [chartOptions, setChartOptions] = useState(lineChartOptionsTotalSpentCSV);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowDropdown(false);
  };

  useEffect(() => {
    const filterDataByYears = (yearsInterval) => {
      const filteredYears = years.filter(year => year % yearsInterval === 0);
      const filteredData = lineChartDataTotalSpentCSV.map(dataset => ({
        ...dataset,
        data: dataset.data.filter((_, index) => filteredYears.includes(years[index]))
      }));
      return { filteredData, filteredYears };
    };

    if (selectedOption === '5 Years') {
      const { filteredData, filteredYears } = filterDataByYears(5);
      setChartData(filteredData);
      setChartOptions({
        ...lineChartOptionsTotalSpentCSV,
        xaxis: {
          ...lineChartOptionsTotalSpentCSV.xaxis,
          categories: filteredYears,
        },
      });
    } else if (selectedOption === '10 Years') {
      const { filteredData, filteredYears } = filterDataByYears(10);
      setChartData(filteredData);
      setChartOptions({
        ...lineChartOptionsTotalSpentCSV,
        xaxis: {
          ...lineChartOptionsTotalSpentCSV.xaxis,
          categories: filteredYears,
        },
      });
    } else {
      setChartData(lineChartDataTotalSpentCSV);
      setChartOptions({
        ...lineChartOptionsTotalSpentCSV,
        xaxis: {
          ...lineChartOptionsTotalSpentCSV.xaxis,
          categories: years,
        },
      });
    }
  }, [selectedOption]);

  // useEffect(() => {
  //   const filterData = (interval) => {
  //     return lineChartDataTotalSpentCSV.map(dataset => ({
  //       ...dataset,
  //       data: dataset.data.filter((_, index) => index % interval === 0)
  //     }));
  //   };

  //   if (selectedOption === '5 Years') {
  //     setChartData(filterData(5));
  //   } else if (selectedOption === '10 Years') {
  //     setChartData(filterData(10));
  //   } else {
  //     setChartData(lineChartDataTotalSpentCSV);
  //   }
  // }, [selectedOption]);

  // Chakra Color Mode

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const iconColor = useColorModeValue("brand.500", "white");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );
  return (
    <Card
      justifyContent='center'
      align='center'
      direction='column'
      w='100%'
      mb='0px'
      {...rest}>
      <Flex justify='space-between' ps='0px' pe='20px' pt='5px'>
        <Flex align='center' w='100%'>
          <Button
            bg={boxBg}
            fontSize='sm'
            fontWeight='500'
            color={textColorSecondary}
            borderRadius='7px'
            onClick={toggleDropdown}>
            <Icon
              as={MdOutlineCalendarToday}
              color={textColorSecondary}
              me='4px'
            />
            {selectedOption}
          </Button>
          {showDropdown && (
            <Box
              position='absolute'
              mt='40px'
              bg={boxBg}
              borderRadius='7px'
              boxShadow='md'
              zIndex='1'>
              <Button bg={boxBg}
                      fontSize='sm'
                      fontWeight='500'
                      color={textColorSecondary}
                      borderRadius='7px' 
                      onClick={() => handleOptionClick('Year')}>Year</Button>
              <Button bg={boxBg}
                      fontSize='sm'
                      fontWeight='500'
                      color={textColorSecondary}
                      borderRadius='7px' 
                      onClick={() => handleOptionClick('5 Years')}>5 Years</Button>
              <Button bg={boxBg}
                      fontSize='sm'
                      fontWeight='500'
                      color={textColorSecondary}
                      borderRadius='7px' 
                      onClick={() => handleOptionClick('10 Years')}>10 Years</Button>
            </Box>
          )}
          <Button
            ms='auto'
            align='center'
            justifyContent='center'
            bg={bgButton}
            _hover={bgHover}
            _focus={bgFocus}
            _active={bgFocus}
            w='37px'
            h='37px'
            lineHeight='100%'
            borderRadius='10px'
            {...rest}>
            <Icon as={MdBarChart} color={iconColor} w='24px' h='24px' />
          </Button>
        </Flex>
      </Flex>
      <Flex w='100%' flexDirection={{ base: "column", lg: "row" }}>
        <Flex flexDirection='column' me='20px' mt='28px'>
          <Text
            color={textColor}
            fontSize='34px'
            textAlign='start'
            fontWeight='700'
            lineHeight='100%'>
            $16.5K
          </Text>
          <Flex align='center' mb='20px'>
            <Text
              color='secondaryGray.600'
              fontSize='sm'
              fontWeight='500'
              mt='4px'
              me='12px'>
              Total Spent
            </Text>
            <Flex align='center'>
              <Icon as={RiArrowUpSFill} color='green.500' me='2px' mt='2px' />
              <Text color='green.500' fontSize='sm' fontWeight='700'>
                +13%
              </Text>
            </Flex>
          </Flex>

          <Flex align='center'>
            <Icon as={IoCheckmarkCircle} color='green.500' me='4px' />
            <Text color='green.500' fontSize='md' fontWeight='700'>
              On track
            </Text>
          </Flex>
        </Flex>
        <Box minH='260px' minW='75%' mt='auto'>
          <LineChart
            chartData={chartData}
            chartOptions={chartOptions}
          />
        </Box>
      </Flex>
    </Card>
  );
}
