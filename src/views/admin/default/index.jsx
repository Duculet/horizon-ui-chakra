import React, { useState, useEffect, useRef } from "react";
import { Flex, Button, Icon, SimpleGrid, Box, Select, Input, useColorModeValue } from "@chakra-ui/react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { MdCalendarMonth, MdCalendarToday, MdDelete, MdEdit, MdSave } from 'react-icons/md';
import TotalSpent from "views/admin/default/components/TotalSpent";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalRevenue from "./components/TotalRevenue";
import TotalCosts from "./components/TotalCosts";
import { saveOrderToServer, loadOrderFromServer, deleteOrderFromServer, saveComponentMapToServer, loadComponentMapFromServer } from './api/sapi';
import { getUser, signIn } from './api/auth';
import Cookies from "js-cookie";
import NewComponent from "./components/NewComponent";
import NewComponentByUrl from "./components/NewComponentByUrl";
import TotalSomething from "./components/TotalSomething";
import { useNavigate } from "react-router-dom";
import { Resizable } from 'react-resizable';
import '../../../assets/css/ReactResizable.css';

export default function UserReports() {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const bgColor = useColorModeValue("white", "navy.800");
  const [isEditing, setIsEditing] = useState(false);
  const [components, setComponents] = useState([
    {
      id: '1',
      content: <TotalRevenue />,
    },
    {
      id: '2',
      content: <TotalCosts />,
    },
    {
      id: '3',
      content: <TotalSpent />,
    },
    {
      id: '4',
      content: <WeeklyRevenue />,
    }
  ]);
  const [savedOrders, setSavedOrders] = useState([{
    name: 'Default Order',
    order: [1, 2, 3, 4]
  }]);
  const [newOrderName, setNewOrderName] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [componentMap, setComponentMap] = useState({
    1: <TotalRevenue />,
    2: <TotalCosts />,
    3: <TotalSpent />,
    4: <WeeklyRevenue />
  });
  const [columns, setColumns] = useState(2); // Default number of columns
  const navigate = useNavigate();

  const contentRef = useRef(null);
  const [dimensions, setDimensions] = useState({});

  const onResize = (id, event, { size }) => {
    setDimensions(prevDimensions => ({
      ...prevDimensions,
      [id]: { width: size.width, height: size.height }
    }));
  };

  useEffect(() => {
    components.forEach(component => {
      if (!dimensions[component.id]) {
        const contentRef = document.getElementById(`content-${component.id}`);
        if (contentRef) {
          setDimensions(prevDimensions => ({
            ...prevDimensions,
            [component.id]: {
              width: contentRef.offsetWidth,
              height: contentRef.offsetHeight
            }
          }));
        }
      }
    });
  }, [components]);
  
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

  useEffect(() => {
    const loadInitialData = async () => {
      const savedOrdersFromServer = await loadOrderFromServer();
      const componentMapFromServer = await loadComponentMapFromServer();

      // console.log(componentMapFromServer)
      // console.log(savedOrdersFromServer)

      if (savedOrdersFromServer) {
        setSavedOrders(savedOrdersFromServer);
        const defaultOrder = savedOrdersFromServer.find(order => order.name === 'Default Order');
        if (defaultOrder) {
          setComponents(defaultOrder.order.map(id => ({
            id,
            content: componentMap[id]
          })));
        }
      }
      
      if (componentMapFromServer) {
        const map = {};
        componentMapFromServer.forEach(c => {
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
    const order = event.target.value;
    setSelectedOrder(order);

    // Find the selected order by name
    const selectedOrder = savedOrders.find(o => o.name === order);
    console.log(selectedOrder);

    if (selectedOrder) {
      // Map over the 'ids' array and get the components
      const newOrder = selectedOrder.ids.map(id => ({
        id,
        content: componentMap[id]
      }));

      // Set the components in the state
      setComponents(newOrder);
    }
  };

  const handleSaveOrder = async () => {
    if (!newOrderName) return;

    const newOrder = {
      name: newOrderName,
      ids: components.map(component => component.id)
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

    const updatedOrders = savedOrders.filter(order => order.name !== selectedOrder);
    setSavedOrders(updatedOrders);
    setSelectedOrder(null);

    await deleteOrderFromServer(selectedOrder);
  };

  const handleAddComponentByUrl = async (url, type) => {
    const componentMapFromServer = await loadComponentMapFromServer();
    const newId = (componentMapFromServer.length + 1).toString();
    const newComponent = getComponentByTypeAndUrl(url, type);
    const updatedComponents = [...components, { id: newId, content: newComponent }];
    setComponents(updatedComponents);

    console.log(newComponent);
    console.log(newId);

    // Update the component map with the new component
    setComponentMap(prevMap => ({
      ...prevMap,
      [newId]: newComponent
    }));

    // Save the new component to the server
    await saveComponentMapToServer([{ component_type: type }]);
  };

  const handleAddComponent = async (type) => {
    const componentMapFromServer = await loadComponentMapFromServer();
    const newId = (componentMapFromServer.length + 1).toString();
    const newComponent = getComponentByType(type);
    const updatedComponents = [...components, { id: newId, content: newComponent }];
    setComponents(updatedComponents);

    // Update the component map with the new component
    setComponentMap(prevMap => ({
      ...prevMap,
      [newId]: newComponent
    }));

    // Save the new component to the server
    await saveComponentMapToServer([{ component_type: type }]);
  };

  const handleColumnsChange = (event) => {
    setColumns(parseInt(event.target.value));
  };

  return (
    <div>
        <Flex alignItems='center' mt={{base: '120px', md: '80px'}} mb='20px' gap='20px'>
          <Button 
            borderRadius="50%"
            p='0'
            width={"40px"}
            onClick={() => setIsEditing(!isEditing)}
            leftIcon={<Icon as={MdEdit} />}
            iconSpacing={0}
            className={isEditing ? 'jiggle' : ''} 
          >
          </Button>
          <Select
            placeholder="Select preset"
            onChange={handleOrderChange}
            value={selectedOrder ? selectedOrder : ''}
            textAlign={"center"}
            width={"150px"}
          >
            {savedOrders.map(order => (
              <option key={order.name} value={order.name}>{order.name}</option>
            ))}
          </Select>
        </Flex>
        {isEditing && <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap='20px' width="100%" mt={{base: '120px', md: '80px'}} mb={'20px'}>
          <Button
            p={!isEditing ? '5px 30px' : '5px 50px'}
            onClick={() => setIsEditing(!isEditing)}
            leftIcon={<Icon as={MdEdit} />}
          >
            {isEditing ? 'Stop Editing' : 'Edit'}
          </Button>
          <Select
            placeholder="Select preset"
            onChange={handleOrderChange}
            value={selectedOrder ? selectedOrder : ''}
            textAlign={"center"}
          >
            {savedOrders.map(order => (
              <option key={order.name} value={order.name}>{order.name}</option>
            ))}
          </Select>
          <Input
            placeholder="New preset name"
            color={textColor}
            value={newOrderName}
            onChange={(e) => {
              setNewOrderName(e.target.value);
              setSelectedOrder(null);
            }}
            textAlign={"center"}
          />
          <Button
            height={"40px"}
            p='5px 50px'
            isDisabled={!isEditing}
            onClick={selectedOrder ? handleDeleteOrder : handleSaveOrder}
            leftIcon={<Icon as={selectedOrder ? MdDelete : MdSave} />}
          >
            {selectedOrder ? 'Delete Order' : 'Save Order'}
          </Button>
        </SimpleGrid>}
        <Flex mb='20px' alignItems='center' justifyContent='center'>
          <Select
            onChange={handleColumnsChange}
            value={columns}
            width="200px"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </Select>
        </Flex>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='droppable'>
          {(provided) => (
            <Flex
              wrap='wrap'
              gap='20px'
              mb='20px'
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {components.map((component, index) => {
                const { width = 200, height = 200 } = dimensions[component.id] || {};

                return (
                  <Draggable key={component.id} draggableId={component.id} index={index} isDragDisabled={!isEditing}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...(isEditing ? {} : provided.draggableProps)}
                        {...(isEditing ? {} : provided.dragHandleProps)}
                        style={{ display: 'flex', flexDirection: 'column' }} // Flex container
                      >
                        <Resizable
                          width={width}
                          height={height}
                          onResize={(e, data) => onResize(component.id, e, data)}
                          minConstraints={[100, 100]}
                          maxConstraints={[500, 500]}
                          resizeHandles={['se']}
                          draggableOpts={{ disabled: !isEditing }}
                        >
                          <div id={`content-${component.id}`} style={{ width: `${width}px`, height: `${height}px`, display: 'flex', flexDirection: 'column' }}>
                            <Box style={{ flex: 1 }}>
                              {component.content}
                            </Box>
                          </div>
                        </Resizable>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              <NewComponent 
                backgroundColor={bgColor} 
                onAdd={handleAddComponent} 
                text={"Add Component"}
              />
              <NewComponentByUrl 
                backgroundColor={bgColor} 
                onAdd={handleAddComponentByUrl} 
                text={"Add Component by URL"}
              />
            </Flex>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}