import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { USERS, getSegmentColor, getSegmentName } from '../data/mockData';

export default function UserSelectScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>🏦 Т-Банк Лояльность</Text>
        <Text style={styles.subtitle}>Выберите профиль:</Text>

        {USERS.map(user => (
          <TouchableOpacity
            key={user.id}
            style={[styles.card, { borderLeftColor: getSegmentColor(user.segment), borderLeftWidth: 5 }]}
            onPress={() => navigation.navigate('Dashboard', { user })}
            activeOpacity={0.8}
          >
            <Text style={styles.name}>{user.name}</Text>
            <Text style={[styles.segment, { color: getSegmentColor(user.segment) }]}>
              {getSegmentName(user.segment)}
            </Text>
            <Text style={styles.balance}>{user.balance.toLocaleString()} ₽</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scroll: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 12, marginBottom: 15, elevation: 3 },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  segment: { fontSize: 14, fontWeight: '600', marginBottom: 5 },
  balance: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' }
});