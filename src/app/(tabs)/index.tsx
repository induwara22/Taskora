import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TodoListScreen() {
  const [tasks, setTasks] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadAndCheckTasks();
    }, [])
  );

  const loadAndCheckTasks = async () => {
    try {
      const storedData = await AsyncStorage.getItem('todolist_tasks');
      if (storedData) {
        const loadedTasks = JSON.parse(storedData);
        const currentTime = new Date();

        // Check for Overdue tasks and trigger notification
        for (let task of loadedTasks) {
          if (!task.completed && new Date(task.dueDate) < currentTime && !task.overdueNotified) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: '⚠️ Overdue Task Alert!',
                body: `"${task.title}" was due on ${task.dueDate}`,
              },
              trigger: null,
            });
            task.overdueNotified = true;
          }
        }

        setTasks(loadedTasks);
        await AsyncStorage.setItem('todolist_tasks', JSON.stringify(loadedTasks));
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Failed to load tasks', error);
    }
  };

  const toggleTaskDone = async (id: string) => {
    try {
      const updatedTasks = tasks.map((task: any) => {
        if (task.id === id) {
          return { ...task, completed: !task.completed };
        }
        return task;
      });

      setTasks(updatedTasks);
      await AsyncStorage.setItem('todolist_tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Failed to update task', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>My To-Do Schedule</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item: any) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks scheduled. Add one!</Text>}
        renderItem={({ item }: any) => {
          const isOverdue = !item.completed && new Date(item.dueDate) < new Date();
          return (
            <View style={[styles.taskCard, item.completed && styles.completedCard]}>
              <View style={styles.taskInfo}>
                <Text style={[styles.taskTitle, item.completed && styles.completedText]}>
                  {item.title}
                </Text>
                <Text style={styles.taskDesc}>{item.description}</Text>
                <Text style={styles.dateText}>Created: {item.createdDate}</Text>
                <Text style={[styles.dueDateText, isOverdue && styles.overdueText]}>
                  Due: {item.dueDate} {isOverdue ? '(OVERDUE!)' : ''}
                </Text>
              </View>

              <Pressable onPress={() => toggleTaskDone(item.id)}>
                <MaterialCommunityIcons 
                  name={item.completed ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'} 
                  size={28} 
                  color={item.completed ? '#10B981' : '#64748B'} 
                />
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8FAFC' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B', marginBottom: 15 },
  taskCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  completedCard: { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  completedText: { textDecorationLine: 'line-through', color: '#94A3B8' },
  taskDesc: { fontSize: 14, color: '#475569', marginTop: 2 },
  dateText: { fontSize: 11, color: '#94A3B8', marginTop: 6 },
  dueDateText: { fontSize: 12, color: '#0EA5E9', fontWeight: '600', marginTop: 2 },
  overdueText: { color: '#EF4444', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#64748B', marginTop: 50, fontSize: 16 }
});