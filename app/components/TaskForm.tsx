import React, { useState } from 'react';
import { View, TextInput, Button, TouchableOpacity, Text, Alert } from 'react-native';
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
    if (title.trim() === '') {
      Alert.alert('Validation Error', 'Task name is required.');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title,
      completed: false,
      notes,
      dueDate,
    };
    onSubmit(newTask);
  };

  const handleTitleChange = (text: string) => {
    if (text.length <= 30) {
      setTitle(text);
    }
  };

  const handleNotesChange = (text: string) => {
    if (text.length <= 50) {
      setNotes(text);
    }
  };

  return (
    <View style={styles.modalContainer}>
      <Text style={styles.text}>What do we need to do?</Text>
      <TextInput
        placeholder="Task name (max 30 chars)"
        value={title}
        onChangeText={handleTitleChange}
        style={styles.input}
      />
      <Text style={styles.charCount}>{30 - title.length} characters remaining</Text>

      <TextInput
        placeholder="Task notes (max 50 chars)"
        value={notes}
        onChangeText={handleNotesChange}
        multiline={true}
        style={styles.notesInput}
      />
      <Text style={styles.charCount}>{50 - notes.length} characters remaining</Text>

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
        <Text>Date: {dueDate}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={new Date(dueDate)}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}  // Only allow current and future dates
        />
      )}

      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button title="Add Task" onPress={handleSubmit} color="#6750a4" />
        </View>
        <View style={styles.button}>
          <Button title="Close" onPress={onClose} color="#6750a4" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
  },
  input: {
    marginBottom: 5,
    borderBottomWidth: 1,
    padding: 5,
  },
  notesInput: {
    marginBottom: 5,
    borderBottomWidth: 1,
    padding: 5,
    height: 100,
  },
  charCount: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
    textAlign: 'right',
  },
  datePicker: {
    padding: 10,
    backgroundColor: '#eee',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
});
