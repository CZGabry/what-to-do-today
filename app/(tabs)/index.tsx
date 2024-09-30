import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Modal, TouchableOpacity, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, isToday, isBefore, isAfter, parseISO } from 'date-fns';
import TaskForm from '../components/TaskForm'; // Assuming TaskForm is implemented separately
import TodayTasks from '../components/TodayTasks'; // Import the new TodayTasks component
import TomorrowTasks from '../components/TomorrowTasks';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Icon from 'react-native-vector-icons/FontAwesome'; 

interface IndexScreenProps {
  filter: string;
  headerTitle: string;
}

export default function HomeScreen({headerTitle, filter }: IndexScreenProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const today = new Date();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('@tasks');
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load tasks.');
    }
  };

  const saveTasks = async (tasksToSave: Task[]) => {
    try {
      await AsyncStorage.setItem('@tasks', JSON.stringify(tasksToSave));
    } catch (error) {
      Alert.alert('Error', 'Failed to save tasks.');
    }
  };

  const addTask = (newTask: Task) => {
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setModalVisible(false);
  };

  const toggleTaskCompletion = (taskId: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const filterTasks = () => {
    if (filter === 'today') {
      return tasks.filter(task => {
        const taskDate = parseISO(task.dueDate);
        return isToday(taskDate) || isBefore(taskDate, today) && !task.completed;
      });
    } else if (filter === 'tomorrow') {
      return tasks.filter(task => {
        const taskDate = parseISO(task.dueDate);
        return isAfter(taskDate, today);
      });
    }
    else if (filter === 'past') {
      return tasks.filter(task => {
        const taskDate = parseISO(task.dueDate);
        return isBefore(taskDate, today)&& task.completed;
      });
    }
    return [];
  };

  const groupTasksByDate = (tasksToGroup: Task[]) => {
    const sortedTasks = tasksToGroup.sort((a, b) => {
      const dateA = parseISO(a.dueDate);
      const dateB = parseISO(b.dueDate);
      return dateA.getTime() - dateB.getTime();
    });

    const groupedTasks = sortedTasks.reduce((groups: any, task: Task) => {
      const date = format(parseISO(task.dueDate), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(task);
      return groups;
    }, {});

    return Object.keys(groupedTasks).map(date => ({
      title: date,
      data: groupedTasks[date],
    }));
  };

  const filteredTasks = filterTasks();

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  return (
    <View style={styles.container}>
      <ThemedView style={styles.headerContainer}>
        <ThemedText type="title">{headerTitle} <Icon name="tasks" size={24} color="#000" style={styles.icon} /></ThemedText>
      </ThemedView>
      {filter === 'today' ? (
        <TodayTasks tasks={filteredTasks} toggleTaskCompletion={toggleTaskCompletion} deleteTask={deleteTask}/>
      ) :filter === 'tomorrow'? (
        <TomorrowTasks tasks={filteredTasks} groupTasksByDate={groupTasksByDate} toggleTaskCompletion={toggleTaskCompletion} deleteTask={deleteTask} />
      ) : (
      <TomorrowTasks tasks={filteredTasks} groupTasksByDate={groupTasksByDate} toggleTaskCompletion={toggleTaskCompletion} deleteTask={deleteTask}/>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <TaskForm onSubmit={addTask} onClose={() => setModalVisible(false)} />
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 16,
    alignItems: 'center',
    marginTop:20,
    paddingTop:20
  },
  listContainer: {
    padding: 16,
  },
  taskContainer: {
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
  },
  taskDetails: {
    marginLeft: 10,
  },
  taskTitle: {
    fontWeight: 'bold',
  },
  taskNotes: {
    fontStyle: 'italic',
    color: '#555',
  },
  taskDueDate: {
    color: '#888',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#f4f4f4',
    padding: 8,
    marginBottom: 4,
    borderRadius: 4,
  },
   icon: {
    marginLeft: 8, 
    color: '#6750a4'
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#6750a4', 
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 24,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

