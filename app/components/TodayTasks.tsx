import React from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the FontAwesome icon set

interface TodayTasksProps {
  tasks: Task[];
  toggleTaskCompletion: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
}

export default function TodayTasks({ tasks, toggleTaskCompletion, deleteTask }: TodayTasksProps) {
  const renderTask = ({ item }: { item: Task }) => (
    <ThemedView style={styles.taskContainer}>
      <View style={styles.checkboxContainer}>
        <Checkbox
          status={item.completed ? 'checked' : 'unchecked'}
          onPress={() => toggleTaskCompletion(item.id)}
        />
        <View style={styles.taskDetails}>
          <ThemedText style={styles.taskTitle}>{item.title}</ThemedText>
          <ThemedText style={styles.taskNotes}>Notes: {item.notes}</ThemedText>
          <ThemedText style={styles.taskDueDate}>Expire: {item.dueDate}</ThemedText>
        </View>
        <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteButton}>
          <Icon name="trash" size={24} color={styles.trashColor.color} />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        ListEmptyComponent={() => <ThemedText>No tasks for today.</ThemedText>}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  taskContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskDetails: {
    marginLeft: 10,
    flex: 1,
  },
  taskTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  taskNotes: {
    fontStyle: 'italic',
    color: '#555',
    marginTop: 4,
  },
  taskDueDate: {
    color: '#888',
    marginTop: 4,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  trashColor:{
    color: '#e05151'
  }
});
