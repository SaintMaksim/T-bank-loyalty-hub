// mobile/src/screens/UserSelectScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../services/api';

export default function UserSelectScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (e) {
      console.error(e);
      Alert.alert('Ошибка', 'Не удалось загрузить пользователей. Проверьте интернет-соединение.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = async (user) => {
    setLoading(true);
    try {
      // 🔐 Логинимся под выбранным пользователем
      // Пароль для тестовых юзеров: user_{id}, например user_1 для первого
      const password = `user_${user.id}`;
      await api.login(user.email, password);
      
      // ✅ Переход на дашборд (заменяем экран, чтобы нельзя было вернуться назад без логаута)
      navigation.replace('Dashboard');
    } catch (e) {
      console.error(e);
      Alert.alert('Ошибка входа', e.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#FFDD2D" />
        <Text style={styles.loadingText}>Загрузка пользователей...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>🏦 Т-Банк Лояльность</Text>
        <Text style={styles.subtitle}>Выберите профиль для входа:</Text>

        {users.map(user => (
          <TouchableOpacity
            key={user.id}
            style={[styles.card, { borderLeftColor: getSegmentColor(user.financial_segment), borderLeftWidth: 5 }]}
            onPress={() => handleUserSelect(user)}
            activeOpacity={0.7}
          >
            <Text style={styles.name}>{user.full_name}</Text>
            <Text style={[styles.segment, { color: getSegmentColor(user.financial_segment) }]}>
              {getSegmentName(user.financial_segment)}
            </Text>
            <Text style={styles.email}>{user.email}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const getSegmentColor = (segment) => {
  switch(segment) {
    case 'LOW': return '#22C55E';
    case 'MEDIUM': return '#3B82F6';
    case 'HIGH': return '#F59E0B';
    default: return '#666';
  }
};

const getSegmentName = (segment) => {
  switch(segment) {
    case 'LOW': return 'Starter';
    case 'MEDIUM': return 'Standard';
    case 'HIGH': return 'Premium';
    default: return segment;
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scroll: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#666' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 14, marginBottom: 16, elevation: 3 },
  name: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  segment: { fontSize: 14, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase' },
  email: { fontSize: 13, color: '#999' }
});