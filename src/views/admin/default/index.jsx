import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid,
  Flex,
  Button,
  Icon,
  SimpleGrid,
  Box,
  Select,
  Input,
  useColorModeValue,
} from '@chakra-ui/react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  MdCalendarMonth,
  MdCalendarToday,
  MdDelete,
  MdEdit,
  MdSave,
} from 'react-icons/md';
import TotalSpent from 'views/admin/default/components/TotalSpent';
import WeeklyRevenue from 'views/admin/default/components/WeeklyRevenue';
import TotalRevenue from './components/TotalRevenue';
import TotalCosts from './components/TotalCosts';
import PieCardNou from './components/PieCardNou';
import {
  saveOrderToServer,
  loadOrderFromServer,
  deleteOrderFromServer,
  saveComponentMapToServer,
  loadComponentMapFromServer,
} from './api/sapi';
import { getUser, signIn } from './api/auth';
import Cookies from 'js-cookie';
import NewComponent from './components/NewComponent';
import NewComponentByUrl from './components/NewComponentByUrl';
import TotalSomething from './components/TotalSomething';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchLeadsFromSalesforce } from 'variables/fetchfromsalesforce';

export default function UserReports() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const bgColor = useColorModeValue('white', 'navy.800');
  const [isEditing, setIsEditing] = useState(false);
  const [savedOrders, setSavedOrders] = useState([
    {
      name: 'Default Order',
      order: [1, 2, 3, 4],
    },
  ]);
  const [newOrderName, setNewOrderName] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [componentMap, setComponentMap] = useState({
    1: <TotalRevenue />,
    2: <TotalCosts />,
    3: <TotalSpent />,
    4: <WeeklyRevenue />,
  });
  const [columns, setColumns] = useState(2); // Default number of columns
  const navigate = useNavigate();
  const sizeMap = {
    small: { width: 1, height: 150 },
    medium: { width: 2, height: 250 },
    large: { width: 2, height: 350 },
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userCookie = Cookies.get('user');
      if (userCookie) {
        setUser(JSON.parse(userCookie));
      } else {
        const currentUser = await getUser();
        if (!currentUser) {
          navigate('/auth/sign-in');
        } else {
          setUser(currentUser);
          Cookies.set('user', JSON.stringify(currentUser), { expires: 7 }); // Save user in cookie for 7 days
        }
      }
    };

    fetchUser();
  }, [navigate]);

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authData, setAuthData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);

  const fetchAuthToken = async () => {
    try {
      const response = await axios.get(
        'https://salesforce-leads-viewer.onrender.com/api/auth',
      );
      setAuthData(response.data);
      return response.data;
    } catch (err) {
      setError('Failed to authenticate with Salesforce');
      setLoading(false);
      return null;
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get auth token if we don't have one
      const auth = authData || (await fetchAuthToken());
      if (!auth) return;

      const response = await axios.get(
        'https://salesforce-leads-viewer.onrender.com/api/leads',
        {
          params: {
            access_token: auth.access_token,
            instance_url: auth.instance_url,
          },
        },
      );

      setLeads(response.data.records);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch leads');
      setLoading(false);
    }
  };

  // Process leads to calculate pie chart data
  const processPieChartData = (leads) => {
    const groupedData = leads.reduce((acc, lead) => {
      const status = lead.Status || 'Unknown'; // Group by 'Status' field
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    console.log(groupedData);
    const chartData = ['working', 'New', 'Open - Not Contacted'].map(
      (status) => {
        return groupedData[status] || 0;
      },
    );
    console.log(chartData);

    // Convert grouped data to pie chart format, namely
    // [25, 69, 12] for [New, Contacted, Unqualified]
    setPieChartData(chartData);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    if (leads.length > 0) {
      processPieChartData(leads);
    }
  }, [leads]);

  const [components, setComponents] = useState([
    {
      id: '1',
      content: <TotalRevenue />,
      size: 'small',
    },
    {
      id: '2',
      content: <TotalCosts />,
      size: 'small',
    },
    {
      id: '3',
      content: <TotalSpent />,
      size: 'large',
    },
    {
      id: '4',
      content: <WeeklyRevenue />,
      size: 'large',
    },
  ]);

  useEffect(() => {
    setComponents((prevComponents) => {
      // Remove existing PieCardNou component if it exists
      const filteredComponents = prevComponents.filter(
        (comp) => comp.id !== '5',
      );

      // Add PieCardNou only if pieChartData is not empty
      if (pieChartData.length > 0) {
        return [
          ...filteredComponents,
          {
            id: '5',
            content: <PieCardNou pieChartData={pieChartData} />,
            size: 'large',
          },
        ];
      }

      return filteredComponents;
    });
  }, [pieChartData]);

  useEffect(() => {
    const loadInitialData = async () => {
      const savedOrdersFromServer = await loadOrderFromServer();
      const componentMapFromServer = await loadComponentMapFromServer();

      if (savedOrdersFromServer) {
        setSavedOrders(savedOrdersFromServer);
        const defaultOrder = savedOrdersFromServer.find(
          (order) => order.name === 'Default Order',
        );
        if (defaultOrder) {
          setComponents(
            defaultOrder.components.map((c) => ({
              id: c.id,
              content: componentMap[c.id],
              size: c.size, // Apply the saved size
            })),
          );
        }
      }

      if (componentMapFromServer) {
        const map = {};
        componentMapFromServer.forEach((c) => {
          map[c.id] = getComponentByType(c.component_type);
        });
        setComponentMap(map);
      }
    };

    loadInitialData();

    const checkUser = async () => {
      const user = await getUser();
      setUser(user);
    };

    checkUser();
  }, []);

  const getComponentByTypeAndUrl = (url, type) => {
    switch (type) {
      case 'TotalSomething':
        return <TotalSomething datasetUrl={url} />;
      default:
        return null;
    }
  };

  const getComponentByType = (type) => {
    switch (type) {
      case 'TotalRevenue':
        return <TotalRevenue />;
      case 'TotalCosts':
        return <TotalCosts />;
      case 'TotalSpent':
        return <TotalSpent />;
      case 'WeeklyRevenue':
        return <WeeklyRevenue />;
      default:
        return null;
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setComponents(items);
  };

  const handleOrderChange = (event) => {
    const orderName = event.target.value;
    setSelectedOrder(orderName);

    const selectedOrder = savedOrders.find((o) => o.name === orderName);

    console.log(selectedOrder);

    if (selectedOrder) {
      // Map over the 'ids' array and get the components
      const newOrder = selectedOrder.ids.map((id) => ({
        id,
        content: componentMap[id],
        size: selectedOrder.sizes[selectedOrder.ids.indexOf(id)], // Apply the saved size
      }));

      // Set the components in the state
      setComponents(newOrder);
    }
  };

  const handleSaveOrder = async () => {
    if (!newOrderName) return;

    const newOrder = {
      name: newOrderName,
      ids: components.map((c) => c.id),
      sizes: components.map((c) => c.size),
    };

    console.log(newOrder);

    const updatedOrders = [...savedOrders, newOrder];
    setSavedOrders(updatedOrders);
    setNewOrderName('');
    setIsEditing(false);
    setSelectedOrder(newOrder.name);

    await saveOrderToServer(newOrder);
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;

    const updatedOrders = savedOrders.filter(
      (order) => order.name !== selectedOrder,
    );
    setSavedOrders(updatedOrders);
    setSelectedOrder(null);

    await deleteOrderFromServer(selectedOrder);
  };

  const handleAddComponentByUrl = async (url, type) => {
    const componentMapFromServer = await loadComponentMapFromServer();
    const newId = (componentMapFromServer.length + 1).toString();
    const newComponent = getComponentByTypeAndUrl(url, type);
    const updatedComponents = [
      ...components,
      { id: newId, content: newComponent },
    ];
    setComponents(updatedComponents);

    console.log(newComponent);
    console.log(newId);

    setComponentMap((prevMap) => ({
      ...prevMap,
      [newId]: newComponent,
    }));

    await saveComponentMapToServer([{ component_type: type }]);
  };

  const handleResize = (componentId, size) => {
    setComponents((prevComponents) =>
      prevComponents.map((comp) =>
        comp.id === componentId
          ? { ...comp, width: size.width, height: size.height }
          : comp,
      ),
    );
  };

  const handleAddComponent = async (type) => {
    const componentMapFromServer = await loadComponentMapFromServer();
    const newId = (componentMapFromServer.length + 1).toString();
    const newComponent = getComponentByType(type);
    const updatedComponents = [
      ...components,
      {
        id: newId,
        content: newComponent,
        size: 'small',
      },
    ];
    setComponents(updatedComponents);

    setComponentMap((prevMap) => ({
      ...prevMap,
      [newId]: newComponent,
    }));

    await saveComponentMapToServer([{ component_type: type }]);
  };

  const handleColumnsChange = (event) => {
    setColumns(parseInt(event.target.value));
  };

  const handleSizeChange = (componentId, newSize) => {
    setComponents((prevComponents) =>
      prevComponents.map((comp) =>
        comp.id === componentId ? { ...comp, size: newSize } : comp,
      ),
    );
  };

  const handleDeleteComponent = (componentId) => {
    setComponents((prevComponents) =>
      prevComponents.filter((comp) => comp.id !== componentId),
    );
  };

  const isAdmin = user && user.email.includes('admin');

  return (
    <div>
      <Flex
        alignItems="center"
        mt={{ base: '120px', md: '80px' }}
        mb="20px"
        gap="20px"
      >
        {isAdmin && (
          <Button
            borderRadius="50%"
            p="0"
            width={'40px'}
            onClick={() => setIsEditing(!isEditing)}
            leftIcon={<Icon as={MdEdit} />}
            iconSpacing={0}
            className={isEditing ? 'jiggle' : ''}
          ></Button>
        )}
        <Select
          placeholder="Select preset"
          onChange={handleOrderChange}
          value={selectedOrder ? selectedOrder : ''}
          textAlign={'center'}
          width={'150px'}
        >
          {savedOrders.map((order) => (
            <option key={order.name} value={order.name}>
              {order.name}
            </option>
          ))}
        </Select>
        {isAdmin && isEditing && (
          <>
            <Input
              placeholder="New preset name"
              color={textColor}
              value={newOrderName}
              width={'200px'}
              onChange={(e) => {
                setNewOrderName(e.target.value);
                setSelectedOrder(null);
              }}
              textAlign={'center'}
            />
            <Button
              height={'40px'}
              p="5px 15px"
              isDisabled={!isEditing}
              onClick={selectedOrder ? handleDeleteOrder : handleSaveOrder}
              leftIcon={<Icon as={selectedOrder ? MdDelete : MdSave} />}
            >
              {selectedOrder ? 'Delete Order' : 'Save Order'}
            </Button>
          </>
        )}
      </Flex>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <Grid
              templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
              autoFlow="dense"
              gap="20px"
              mb="20px"
              {...provided.droppableProps}
              ref={provided.innerRef}
              as={motion.div}
              layout="position"
              transition={{
                type: 'spring',
                stiffness: 350,
                damping: 25,
                mass: 0.5,
              }}
            >
              {components.map((component, index) => (
                <Draggable
                  key={component.id}
                  draggableId={component.id}
                  index={index}
                  isDragDisabled={!isEditing}
                >
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      position="relative"
                      gridColumn={`span ${
                        component.size === 'small'
                          ? 1
                          : component.size === 'medium'
                          ? 2
                          : 2
                      }`}
                      gridRow={`span ${
                        component.size === 'small'
                          ? 1
                          : component.size === 'large'
                          ? 2
                          : 1
                      }`}
                      as={motion.div}
                      initial={false}
                      animate={{
                        height: sizeMap[component.size].height,
                        gridColumn: `span ${
                          component.size === 'small'
                            ? 1
                            : component.size === 'medium'
                            ? 2
                            : 2
                        }`,
                        gridRow: `span ${
                          component.size === 'small'
                            ? 1
                            : component.size === 'large'
                            ? 2
                            : 1
                        }`,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 25,
                        mass: 0.5,
                      }}
                      sx={{
                        '&': {
                          transition: 'height 0.3s ease, transform 0.3s ease',
                          willChange: 'height, transform',
                        },
                      }}
                    >
                      {component.content}

                      {isAdmin && isEditing && (
                        <Flex
                          position="absolute"
                          bottom="10px"
                          right="10px"
                          gap="5px"
                          zIndex="1"
                        >
                          {['small', 'medium', 'large'].map((size) => (
                            <Button
                              key={size}
                              size="xs"
                              colorScheme={
                                component.size === size ? 'blue' : 'gray'
                              }
                              onClick={() =>
                                handleSizeChange(component.id, size)
                              }
                              _hover={{ transform: 'scale(1.05)' }}
                              _active={{ transform: 'scale(0.95)' }}
                              transition="transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                            >
                              {size.charAt(0).toUpperCase()}
                            </Button>
                          ))}
                          <Button
                            size="xs"
                            colorScheme="red"
                            onClick={() => handleDeleteComponent(component.id)}
                            _hover={{ transform: 'scale(1.05)' }}
                            _active={{ transform: 'scale(0.95)' }}
                            transition="transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                          >
                            Delete
                          </Button>
                        </Flex>
                      )}
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Grid>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
