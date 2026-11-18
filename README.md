Taskora - Smart To-Do List Application
Taskora is a modern, feature-rich task management mobile application built with React Native and Expo Router. It helps users organize daily tasks, manage schedules with due dates, and stay productive through persistent local storage and automated notification alerts.

Features
File-Based Routing: Built using Expo Router for seamless navigation between screen layouts and bottom tab groups.

Task Management & Scheduling: Add custom tasks with auto-updating creation timestamps and user-defined due dates.

Persistent Storage: Utilizes React Native AsyncStorage to save tasks locally so data is preserved across app sessions.

Completion Tracking: Easily toggle tasks as completed with a dedicated status checkmark.

Local Notifications: Automated push reminders that trigger immediately when a task is saved or when a task becomes overdue.

Project File Structure
Taskora/
├── app.json
├── package.json
└── src/
└── app/
├── _layout.tsx               # Root Stack Layout
└── (tabs)/
├── _layout.tsx           # Bottom Tab Navigation Configuration
├── index.tsx             # My Tasks Dashboard (FlatList & Overdue checker)
└── add.tsx               # Add Task Screen (Auto-dates & Notifications)

Installation & Setup Instructions
Clone the repository or open the project folder in your terminal.

Install all required dependencies by running the following command:

Bash
npx expo install expo-notifications @react-native-async-storage/async-storage @expo/vector-icons
Start the development server with cache cleared:

Bash
npx expo start --clear
Scan the QR code using the Expo Go app on your physical mobile device to run and test the application.

Demonstration Video
[https://drive.google.com/drive/folders/1Dd5bfodhYi41V6JAEugbxnlZZRS7-DLR]