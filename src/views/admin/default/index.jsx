import React, { useState, useEffect } from "react";
import { Button, Icon, SimpleGrid, Box, Select, Input } from "@chakra-ui/react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { MdAdd, MdDelete, MdEdit, MdSave } from 'react-icons/md';
import TotalSpent from "views/admin/default/components/TotalSpent";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalRevenue from "./components/TotalRevenue";
import TotalCosts from "./components/TotalCosts";
import { saveOrderToServer, loadOrderFromServer, deleteOrderFromServer } from './api/sapi';
import { getUser } from './api/auth';
import Login from './components/Login';
import NewComponent from "./components/NewComponent";

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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      const savedOrdersFromServer = await loadOrderFromServer();
      console.log(savedOrdersFromServer)
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

    const checkUser = async () => {
      const user = await getUser();
      setUser(user);
    };

    checkUser();
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
  setSelectedOrder(order);

  // Find the selected order by name
  const selectedOrder = savedOrders.find(o => o.name === order);
  console.log(selectedOrder);

  if (selectedOrder) {
    // Parse 'ids' as it's a stringified array
    const idsArray = JSON.parse(selectedOrder.ids);

    // Map over the parsed 'ids' array and get the components
    const newOrder = idsArray.map(id => ({
      id,
      content: getComponentById(id)  // Assuming getComponentById is a function that returns a component by ID
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

  const handleAddComponent = async () => {
    const newId = (components.length + 1).toString();
    const newComponent = {
      id: newId,
      content: <TotalRevenue />
    };
    const updatedComponents = [...components, newComponent];
    setComponents(updatedComponents);

    // Update the default order with the new component
    const defaultOrder = savedOrders.find(order => order.name === 'Default Order');
    if (defaultOrder) {
      defaultOrder.order.push(newId);
      await saveOrderToServer(defaultOrder);
    }
  };

  if (!user) {
    return <Login onLogin={() => setUser(getUser())} />;
  }

  return (
    <div>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap='20px' width="100%" mt={{base: '120px', md: '80px'}} mb={'20px'}>
          <Button
            p={!isEditing ? '5px 30px' : '5px 50px'}
            onClick={() => setIsEditing(!isEditing)}
            leftIcon={<Icon as={MdEdit} />}
          >
            {isEditing ? 'Stop Editing' : 'Edit'}
          </Button>
          <Button
            p='5px 30px'
            onClick={handleAddComponent}
            leftIcon={<Icon as={MdAdd} />}
          >
            Add
          </Button>
          <Select
            placeholder="Select preset"
            onChange={handleOrderChange}
            value={selectedOrder ? selectedOrder : ''}
          >
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
            height={"40px"}
            p='5px 50px'
            isDisabled={!isEditing}
            onClick={selectedOrder ? handleDeleteOrder : handleSaveOrder}
            leftIcon={<Icon as={selectedOrder ? MdDelete : MdSave} />}
          >
            {selectedOrder ? 'Delete Order' : 'Save Order'}
          </Button>
        </SimpleGrid>
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
              <Box>
                <NewComponent />
              </Box>
              {provided.placeholder}
            </SimpleGrid>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}