import React from 'react';
import { SectionList, StyleSheet, Text, View , TouchableOpacity} from 'react-native';
import { Checkbox } from 'react-native-paper';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { format, parseISO } from 'date-fns';
import Icon from 'react-native-vector-icons/FontAwesome'; 

interface PastCompletedTasksProps {
  tasks: Task[];
  groupTasksByDate: (tasks: Task[]) => any;
  toggleTaskCompletion: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
}

export default function TomorrowTasks({ tasks, groupTasksByDate, toggleTaskCompletion, deleteTask }: PastCompletedTasksProps) {
  const renderTask = ({ item }: { item: Task }) => (
    <ThemedView style={styles.taskContainer}>
      <View style={styles.checkboxContainer}>
        <Checkbox
          status={item.completed ? 'checked' : 'unchecked'}
          onPress={() => toggleTaskCompletion(item.id)}
        />
        <View style={styles.taskDetails}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <Text style={styles.taskNotes}>Notes: {item.notes}</Text>
          <Text style={styles.taskDueDate}>Expire: {item.dueDate}</Text>
        </View>
        <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteButton}>
          <Icon name="trash" size={24} color={styles.trashColor.color} />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );

  return (
    <View style={styles.container}>
      <SectionList
        sections={groupTasksByDate(tasks)}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{format(parseISO(title), 'eeee, MMMM d')}</Text>
        )}
        ListEmptyComponent={<ThemedText>No tasks for tomorrow.</ThemedText>}
        contentContainerStyle={styles.listContainer}
        stickySectionHeadersEnabled={true}
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
  deleteButtonText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 18,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#f4f4f4',
    padding: 8,
    marginBottom: 4,
    borderRadius: 4,
  },
  trashColor:{
    color: '#e05151'
  }
});
