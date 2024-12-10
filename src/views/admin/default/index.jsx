import React, { useState, useEffect } from "react";
import { Button, Icon, SimpleGrid, Box, Select, Input, Flex } from "@chakra-ui/react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { MdEdit, MdSave } from 'react-icons/md';
import TotalSpent from "views/admin/default/components/TotalSpent";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalRevenue from "./components/TotalRevenue";
import TotalCosts from "./components/TotalCosts";
import { saveOrderToServer, loadOrderFromServer } from './api/api';
import { auth } from './api/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './components/Login';

export default function UserReports() {
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
      order: ['1', '2', '3', '4']
    }]);
  const [newOrderName, setNewOrderName] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      const savedOrdersFromServer = await loadOrderFromServer();
      if (savedOrdersFromServer) {
        setSavedOrders(savedOrdersFromServer);
        const defaultOrder = savedOrdersFromServer.find(order => order.name === 'Default Order');
        if (defaultOrder) {
          setComponents(defaultOrder.order.map(id => ({
            id,
            content: getComponentById(id)
          })));
        }
      }
    };

    loadInitialData();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const getComponentById = (id) => {
    switch (id) {
      case '1':
        return <TotalRevenue />;
      case '2':
        return <TotalCosts />;
      case '3':
        return <TotalSpent />;
      case '4':
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
    const selectedOrder = savedOrders.find(o => o.name === order);
    if (selectedOrder) {
      const newOrder = selectedOrder.order.map(id => ({
        id,
        content: getComponentById(id)
      }));
      setComponents(newOrder);
    }
  };

  const handleSaveOrder = async () => {
    if (!newOrderName) return;

    const newOrder = {
      name: newOrderName,
      order: components.map(component => component.id)
    };

    const updatedOrders = [...savedOrders, newOrder];
    setSavedOrders(updatedOrders);
    localStorage.setItem('savedOrders', JSON.stringify(updatedOrders));
    setNewOrderName('');

    await saveOrderToServer(newOrder);
  };

  if (!user) {
    return <Login onLogin={() => setUser(auth.currentUser)} />;
  }

  return (
    <div>
      <Flex mb='20px' mt={{ base: '120px', md: '80px' }} gap='20px' alignItems='center' justifyContent='center'>
        <Button
          p={!isEditing ? '5px 30px' : '5px 50px'}
          onClick={() => setIsEditing(!isEditing)}
          leftIcon={<Icon as={MdEdit} />}
        >
          {isEditing ? 'Stop Editing' : 'Edit'}
        </Button>
        <Select placeholder="Select preset" onChange={handleOrderChange}>
          {savedOrders.map(order => (
            <option key={order.name} value={order.name}>{order.name}</option>
          ))}
        </Select>
        <Input
          placeholder="New preset name"
          value={newOrderName}
          onChange={(e) => setNewOrderName(e.target.value)}
        />
        <Button
          p='5px 50px'
          onClick={handleSaveOrder}
          leftIcon={<Icon as={MdSave} />}
        >
          Save Order
        </Button>
      </Flex>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='droppable'>
          {(provided) => (
            <SimpleGrid
              columns={{ base: 1, md: 2, xl: 2 }}
              gap='20px'
              mb='20px'
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {components.map((component, index) => (
                <Draggable key={component.id} draggableId={component.id} index={index} isDragDisabled={!isEditing}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      // className={isEditing ? 'jiggle' : ''} // add jiggle class for fun
                    >
                      {component.content}
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </SimpleGrid>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}