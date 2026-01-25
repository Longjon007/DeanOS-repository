import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { supabase } from './utils/supabase';

// Optimization: Define renderItem outside component to prevent re-creation on every render
// This allows FlatList to optimize list updates efficiently
const renderItem = ({ item }) => <Text>{item.title}</Text>;

// Optimization: Define keyExtractor outside to maintain reference stability
const keyExtractor = (item) => item.id.toString();

export default function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const getTodos = async () => {
      try {
        // Optimization: Select only necessary fields ('id, title') to reduce payload size
        // and improve data transfer speed.
        const { data: todos, error } = await supabase.from('todos').select('id, title');

        if (error) {
          console.error('Error fetching todos:', error.message);
          return;
        }

        if (todos && todos.length > 0) {
          setTodos(todos);
        }
      } catch (error) {
        console.error('Error fetching todos:', error.message);
      }
    };

    getTodos();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Todo List</Text>
      <FlatList
        data={todos}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </View>
  );
}
