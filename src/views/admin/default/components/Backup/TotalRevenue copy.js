import React from 'react'
import { MdBarChart } from 'react-icons/md'
import { useColorModeValue } from '@chakra-ui/react'
import MiniStatistics from 'components/card/MiniStatistics'
import IconBox from 'components/icons/IconBox'
import { loadData } from 'variables/charts'
import { useState, useEffect } from 'react'
import { lineChartDataTotalSpentCSV } from 'variables/charts'
import { Icon } from '@chakra-ui/react'

const TotalRevenue = () => {
    const brandColor = useColorModeValue("brand.500", "white");
    const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        loadData(setDataLoaded);
    }, []);

    return (
        <MiniStatistics
            startContent={
                <IconBox
                w='56px'
                h='56px'
                bg={boxBg}
                icon={
                    <Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />
                }
                />
            }
            name='Revenue'
            // value should be the last element of the array plus the letter 'k'
            value={
                dataLoaded ? (`$${Math.floor(lineChartDataTotalSpentCSV[0].data[lineChartDataTotalSpentCSV[0].data.length - 1])}`
            ) : (
                'Loading...'
            )}
            />
    )
}

export default TotalRevenue