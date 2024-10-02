import React from 'react';
import { FlatList, SectionList, View, TouchableOpacity, useColorScheme } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Icon from 'react-native-vector-icons/FontAwesome';
import { commonStyles } from './css/styles'; // Import the common styles

interface TaskListProps {
  tasks: Task[];
  groupTasksByDate?: (tasks: Task[]) => any; // Optional for flat list
  toggleTaskCompletion: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  isSectionList?: boolean; // Toggle between FlatList and SectionList
}

export default function TaskList({
  tasks,
  groupTasksByDate,
  toggleTaskCompletion,
  deleteTask,
  isSectionList = false,
}: TaskListProps) {
  const colorScheme = useColorScheme(); // Detect the current color scheme
  const backgroundColor = colorScheme === 'dark' ? '#333' : '#fff';
  const renderTask = ({ item }: { item: Task }) => (
    <ThemedView style={commonStyles.taskContainer}>
      <View style={commonStyles.checkboxContainer}>
        <Checkbox
          status={item.completed ? 'checked' : 'unchecked'}
          onPress={() => toggleTaskCompletion(item.id)}
        />
        <View style={commonStyles.taskDetails}>
          <ThemedText
            style={[
              commonStyles.taskTitle,
              { color: colorScheme === 'dark' ? '#000' : '#000' }, // Dynamic color based on theme
            ]}
          >
            {item.title}
          </ThemedText>
          <ThemedText style={commonStyles.taskNotes}>Notes: {item.notes}</ThemedText>
          <ThemedText style={commonStyles.taskDueDate}>Expire: {item.dueDate}</ThemedText>
        </View>
        <TouchableOpacity onPress={() => deleteTask(item.id)} style={commonStyles.deleteButton}>
          <Icon name="trash" size={24} color={commonStyles.trashColor.color} />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <ThemedText
      style={[
        commonStyles.sectionHeader,
        { color: colorScheme === 'dark' ? '#000' : '#000' }, // Dynamic color based on theme
      ]}
    >
      {title}
    </ThemedText>
  );

  return (
    <View style={[commonStyles.container, { backgroundColor }]}>
      {isSectionList && groupTasksByDate ? (
        <SectionList
          sections={groupTasksByDate(tasks)}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          renderSectionHeader={renderSectionHeader} // Updated to use dynamic theme
          ListEmptyComponent={() => <ThemedText>No tasks available.</ThemedText>}
          contentContainerStyle={commonStyles.listContainer}
        />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          ListEmptyComponent={() => <ThemedText>No tasks available.</ThemedText>}
          contentContainerStyle={commonStyles.listContainer}
        />
      )}
    </View>
  );
}
