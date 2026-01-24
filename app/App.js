import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { supabase } from './utils/supabase';

// ⚡ Bolt: Extract renderItem to prevent re-creation on every render
const renderItem = ({ item }) => <Text>{item.title}</Text>;
// ⚡ Bolt: Extract keyExtractor to maintain reference stability
const keyExtractor = (item) => item.id.toString();

export default function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const getTodos = async () => {
      try {
        // ⚡ Bolt: Select only needed columns to reduce network payload
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
