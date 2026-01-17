import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { supabase } from './utils/supabase';

// ⚡ Bolt: Hoisted renderItem to prevent recreation on every render
// Optimization: Reduces memory allocation and garbage collection overhead
const renderItem = ({ item }) => <Text>{item.title}</Text>;

// ⚡ Bolt: Hoisted keyExtractor for stable reference
const keyExtractor = (item) => item.id.toString();

export default function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const getTodos = async () => {
      try {
        // ⚡ Bolt: Select only needed fields to reduce payload size
        const { data: todos, error } = await supabase
          .from('todos')
          .select('id, title');

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
