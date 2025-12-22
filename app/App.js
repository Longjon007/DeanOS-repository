import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
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

  // Bolt: Use useCallback to maintain stable reference for renderItem
  const renderItem = useCallback(({ item }) => (
    <Text>{item.title}</Text>
  ), []);

  // Bolt: Use useCallback for keyExtractor to prevent re-creation
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  return (
    <View style={styles.container}>
      <Text>Todo List</Text>
      <FlatList
        data={todos}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </View>
  );
}

// Bolt: Move inline styles to StyleSheet to improve performance
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
