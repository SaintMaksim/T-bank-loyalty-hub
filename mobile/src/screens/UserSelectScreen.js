import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../services/api';

const LOGO_URI = require('../../assets/logo.png');
const USER_URI = require('../../assets/user.png');

export default function UserSelectScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const data = await api.getUsers();
      if (data && data.length > 0) { setUsers(data); setError(null); }
      else setError('Нет данных от сервера. Проверьте подключение.');
    } catch (e) {
      console.error(e);
      setError('Ошибка загрузки. Проверьте интернет или URL в api.js');
    } finally { setLoading(false); }
  };

  const handleLogin = async () => {
    if (!selectedUserId) return;
    const selectedUser = users.find(u => u.id === selectedUserId);
    if (!selectedUser) return;

    try {
      setLoading(true);
      await api.login(selectedUser.email, `user_${selectedUser.id}`);
      navigation.navigate('Dashboard', { user: selectedUser });
    } catch (e) {
      alert('Ошибка входа: ' + e.message);
      setLoading(false);
    }
  };

  if (loading && users.length === 0) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FFDD2D" />
        <Text style={{ marginTop: 16, color: '#666' }}>Загрузка...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Image source={LOGO_URI} style={styles.logo} resizeMode="contain" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Выберите профиль</Text>

        <View style={styles.usersWrapper}>
          {error && <Text style={styles.errorText}>⚠️ {error}</Text>}
          
          {users.map((user) => {
            const isSelected = selectedUserId === user.id;
            const colors = { LOW: '#22C55E', MEDIUM: '#3B82F6', HIGH: '#F59E0B' };
            const color = colors[user.financial_segment] || '#666';
            const progress = user.financial_segment === 'LOW' ? 30 : user.financial_segment === 'MEDIUM' ? 60 : 100;
            const nextLevel = user.financial_segment === 'LOW' ? 'Standard' : user.financial_segment === 'MEDIUM' ? 'Premium' : null;

            return (
              <TouchableOpacity key={user.id} style={[styles.userCard, isSelected && styles.userCardSelected]} onPress={() => setSelectedUserId(user.id)}>
                <View style={styles.cardHeader}>
                  <Image source={USER_URI} style={styles.avatarImage} resizeMode="contain" />
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.full_name}</Text>
                    <Text style={[styles.segmentText, { color: color }]}>
                      {user.financial_segment === 'LOW' ? 'Starter' : user.financial_segment === 'MEDIUM' ? 'Standard' : 'Premium'}
                    </Text>
                  </View>
                </View>

                {nextLevel && (
                  <View style={styles.progressRow}>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: '#FFDD2D' }]} />
                    </View>
                    <Text style={styles.progressText}>{progress}% до {nextLevel}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedUserId && (
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.8}>
            <Text style={styles.loginButtonText}>{loading ? 'Вход...' : 'Войти'}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7F8' },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, paddingTop: 10, alignItems: 'flex-start' },
  logo: { width: 120, height: 40 },
  scrollContent: { padding: 20, paddingTop: 0, paddingBottom: 40 },
  title: { fontSize: 18, fontWeight: '600', color: '#1A1A1A', textAlign: 'center', marginBottom: 20 },
  usersWrapper: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  errorText: { color: '#E53E3E', textAlign: 'center', marginBottom: 16, backgroundColor: '#FFF5F5', padding: 10, borderRadius: 8 },
  userCard: { backgroundColor: '#F6F7F8', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 2, borderColor: 'transparent' },
  userCardSelected: { borderColor: '#FFDD2D', backgroundColor: '#FFFCDE' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatarImage: { width: 40, height: 40, marginRight: 12 },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
  segmentText: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  progressRow: { marginTop: 4 },
  progressBarBg: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, marginBottom: 6 },
  progressBarFill: { height: '100%', borderRadius: 3 },
  progressText: { fontSize: 12, color: '#888', textAlign: 'right' },
  loginButton: { backgroundColor: '#FFDD2D', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12, alignSelf: 'flex-start', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  loginButtonText: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
});