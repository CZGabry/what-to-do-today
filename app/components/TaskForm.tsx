import React, { useState } from 'react';
import { View, TextInput, Button, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StyleSheet } from 'react-native';
interface TaskFormProps {
  onSubmit: (task: { id: string; title: string; completed: boolean; notes: string; dueDate: string }) => void;
  onClose: () => void;
}

export default function TaskForm({ onSubmit, onClose }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  const handleSubmit = () => {
    const newTask = {
      id: Date.now().toString(),
      title,
      completed: false,
      notes,
      dueDate,
    };
    onSubmit(newTask);
  };

  return (
    <View style={{ padding: 20, backgroundColor: '#fff', borderRadius: 10 }}>
      <TextInput
        placeholder="Task name"
        value={title}
        onChangeText={setTitle}
        style={{ marginBottom: 10, borderBottomWidth: 1, padding: 5 }}
      />

      <TextInput
        placeholder="Task notes"
        value={notes}
        onChangeText={setNotes}
        multiline={true}
        style={{ marginBottom: 10, borderBottomWidth: 1, padding: 5 }}
      />

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ padding: 10, backgroundColor: '#eee', marginBottom: 10 }}>
        <Text>Select Due Date: {dueDate}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={new Date(dueDate)}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button title="Add Task" onPress={handleSubmit} />
        </View>
        <View style={styles.button}>
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row' as const, 
      justifyContent: 'space-between',
    },
    button: {
      flex: 1,
      marginHorizontal: 5, 
    },
  });
  
