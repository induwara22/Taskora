import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function AddTaskScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('2026-11-25 18:00');

  // Auto-updating creation date
  const createdDate = new Date().toLocaleString();

  const handleSaveTask = async () => {
    if (!title) {
      Alert.alert('Error', 'Please enter a task title.');
      return;
    }

    try {
      const existingData = await AsyncStorage.getItem('todolist_tasks');
      const tasksArray = existingData ? JSON.parse(existingData) : [];

      const newTask = {
        id: Date.now().toString(),
        title,
        description,
        createdDate,
        dueDate,
        completed: false,
        overdueNotified: false,
      };

      tasksArray.push(newTask);
      await AsyncStorage.setItem('todolist_tasks', JSON.stringify(tasksArray));

      // Trigger immediate notification upon saving
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Task Scheduled Successfully! 📅',
          body: `"${title}" is set for ${dueDate}`,
        },
        trigger: null,
      });

      Alert.alert('Success', 'Task added successfully!');
      setTitle('');
      setDescription('');
      router.push('/(tabs)');
    } catch (error) {
      console.error('Failed to save task', error);
      Alert.alert('Error', 'Could not save task to storage.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task Title</Text>
      <TextInput 
        style={styles.input} 
        placeholder="e.g. Submit Lab Report" 
        value={title} 
        onChangeText={setTitle} 
      />

      <Text style={styles.label}>Description</Text>
      <TextInput 
        style={styles.input} 
        placeholder="e.g. Chemistry assignment notes" 
        value={description} 
        onChangeText={setDescription} 
      />

      <Text style={styles.label}>Schedule Due Date & Time</Text>
      <TextInput 
        style={styles.input} 
        placeholder="YYYY-MM-DD HH:MM" 
        value={dueDate} 
        onChangeText={setDueDate} 
      />

      <Text style={styles.autoText}>Creation Date (Auto): {createdDate}</Text>

      <Pressable style={styles.saveBtn} onPress={handleSaveTask}>
        <Text style={styles.saveText}>Save & Schedule Task</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8FAFC' },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 6, marginTop: 15 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', padding: 12, borderRadius: 8, fontSize: 16 },
  autoText: { fontSize: 12, color: '#64748B', marginTop: 12, fontStyle: 'italic' },
  saveBtn: { backgroundColor: '#0EA5E9', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  saveText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});