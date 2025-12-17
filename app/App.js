import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { supabase } from './utils/supabase';

export default function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const getTodos = async () => {
      try {
        const { data: todos, error } = await supabase.from('todos').select();

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

  // Optimization: Memoize renderItem to prevent creating a new function on every render,
  // which improves FlatList performance by avoiding unnecessary re-renders.
  const renderItem = useCallback(({ item }) => <Text>{item.title}</Text>, []);

  // Optimization: Memoize keyExtractor for stable reference.
  const keyExtractor = useCallback((item) => item.id.toString(), []);

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
