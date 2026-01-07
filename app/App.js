import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { supabase } from './utils/supabase';

// Optimization: Hoisted keyExtractor to prevent function re-creation
const keyExtractor = (item) => item.id.toString();

// Optimization: Memoized component for list items to prevent unnecessary re-renders
const TodoItem = React.memo(({ item }) => (
  <Text>{item.title}</Text>
));

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

  // Optimization: Stable renderItem reference
  const renderItem = useCallback(({ item }) => <TodoItem item={item} />, []);

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
