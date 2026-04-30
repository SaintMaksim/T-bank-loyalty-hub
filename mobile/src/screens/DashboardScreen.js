// mobile/src/screens/DashboardScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../services/api';

export default function DashboardScreen({ navigation }) {
  const [summary, setSummary] = useState(null);
  const [offers, setOffers] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Загружаем все данные параллельно
      const [sum, off, fore] = await Promise.all([
        api.getLoyaltySummary(),
        api.getOffers(),
        api.getForecast()
      ]);
      setSummary(sum);
      setOffers(off);
      setForecast(fore);
    } catch (e) {
      console.error(e);
      Alert.alert('Ошибка', 'Не удалось загрузить данные. Проверьте соединение.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    navigation.replace('UserSelect');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#FFDD2D" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Хедер с кнопкой выхода */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Выйти</Text>
          </TouchableOpacity>
        </View>

        {/* Виджет совокупной лояльности */}
        {summary && (
          <View style={styles.loyaltyWidget}>
            <Text style={styles.widgetTitle}>💰 Ваша совокупная лояльность</Text>
            <Text style={styles.totalValue}>{summary.total_equivalent_rub.toLocaleString('ru-RU')} ₽</Text>
            <View style={styles.row}>
              <Text style={styles.rowItem}>₽ {summary.total_rub.toFixed(0)}</Text>
              <Text style={styles.rowItem}>🎯 {summary.total_bravo.toFixed(0)}</Text>
              <Text style={styles.rowItem}>✈️ {summary.total_miles.toFixed(0)}</Text>
            </View>
          </View>
        )}

        {/* Прогноз выгоды */}
        {forecast && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📈 Прогноз на следующий месяц</Text>
            <Text style={styles.forecastValue}>
              ≈ {forecast.total_predicted_equivalent_rub.toLocaleString('ru-RU')} ₽
            </Text>
            <Text style={styles.forecastSub}>При сохранении активности (×1.2)</Text>
          </View>
        )}

        {/* Персональные офферы */}
        <Text style={styles.sectionTitle}>🎁 Персональные акции</Text>
        {offers.length > 0 ? (
          offers.map(offer => (
            <View key={offer.id} style={styles.offerCard}>
              <View style={styles.offerInfo}>
                <Text style={styles.offerName}>{offer.partner_name}</Text>
                <Text style={styles.offerDesc}>{offer.short_description}</Text>
              </View>
              <View style={[styles.offerBadge, { backgroundColor: offer.brand_color_hex }]}>
                <Text style={styles.offerPercent}>+{offer.cashback_percent}%</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Нет доступных акций для вашего сегмента</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scroll: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'flex-end', marginBottom: 10 },
  logoutBtn: { padding: 8 },
  logoutText: { color: '#007AFF', fontWeight: '600' },
  loyaltyWidget: { backgroundColor: '#FFDD2D', padding: 22, borderRadius: 18, marginBottom: 20 },
  widgetTitle: { fontSize: 16, color: '#333', marginBottom: 8 },
  totalValue: { fontSize: 36, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-around' },
  rowItem: { fontSize: 16, fontWeight: '500', color: '#333' },
  card: { backgroundColor: 'white', padding: 18, borderRadius: 14, marginBottom: 20 },
  cardTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 6 },
  forecastValue: { fontSize: 24, fontWeight: 'bold', color: '#00BCD4' },
  forecastSub: { fontSize: 13, color: '#888', marginTop: 4 },
  sectionTitle: { fontSize: 19, fontWeight: 'bold', marginBottom: 12, marginTop: 4 },
  offerCard: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  offerInfo: { flex: 1, paddingRight: 10 },
  offerName: { fontWeight: '700', fontSize: 15, marginBottom: 2 },
  offerDesc: { fontSize: 13, color: '#666' },
  offerBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  offerPercent: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  emptyText: { color: '#999', textAlign: 'center', padding: 20 }
});