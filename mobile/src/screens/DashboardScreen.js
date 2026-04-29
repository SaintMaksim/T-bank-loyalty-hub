import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LOYALTY_DATA, OFFERS, getSegmentColor, getSegmentName } from '../data/mockData';

export default function DashboardScreen({ route, navigation }) {
  // 🔧 БЕЗОПАСНЫЙ ДОСТУП: если params пустой → берём дефолт
  const user = route.params?.user || { 
    id: '1', 
    name: 'Гость', 
    segment: 'LOW', 
    balance: 0 
  };
  
  const loyalty = LOYALTY_DATA[user.id] || { rub: 0, bravo: 0, miles: 0, total: 0 };
  const offers = OFFERS[user.segment] || [];

  const getNextSegment = () => {
    if (user.segment === 'LOW') return 'Standard';
    if (user.segment === 'MEDIUM') return 'Premium';
    return null;
  };

  const nextSegment = getNextSegment();
  const hasNextSegment = nextSegment !== null;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Назад</Text>
        </TouchableOpacity>

        <Text style={styles.userName}>{user.name}</Text>
        <View style={[styles.segmentBadge, { backgroundColor: getSegmentColor(user.segment) }]}>
          <Text style={styles.segmentText}>{getSegmentName(user.segment)}</Text>
        </View>

        <View style={styles.loyaltyWidget}>
          <Text style={styles.widgetTitle}>Ваша лояльность:</Text>
          <Text style={styles.totalValue}>{loyalty.total.toLocaleString()} ₽</Text>
          <View style={styles.row}>
            <Text style={styles.rowText}>₽ {loyalty.rub}</Text>
            <Text style={styles.rowText}>🎯 {loyalty.bravo}</Text>
            <Text style={styles.rowText}>✈️ {loyalty.miles}</Text>
          </View>
        </View>

        <View style={styles.progressBlock}>
          <Text style={styles.sectionTitle}>🏆 Прогресс</Text>
          <Text style={styles.progressText}>
            {hasNextSegment ? `До следующего уровня: ${nextSegment}` : 'Максимальный уровень!'}
          </Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { 
              width: user.segment === 'LOW' ? '30%' : user.segment === 'MEDIUM' ? '70%' : '100%',
              backgroundColor: getSegmentColor(user.segment) 
            }]} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>🎁 Акции для вас</Text>
        {offers.map(offer => (
          <View key={offer.id} style={styles.offerCard}>
            <Text style={styles.offerName}>{offer.partner}</Text>
            <Text style={styles.offerPercent}>+{offer.percent}% кэшбэк</Text>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scroll: { padding: 20 },
  backBtn: { marginBottom: 15 },
  backText: { fontSize: 16, color: '#007AFF' },
  userName: { fontSize: 24, fontWeight: 'bold' },
  segmentBadge: { padding: 6, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 20, marginTop: 5 },
  segmentText: { color: 'white', fontWeight: '600' },
  loyaltyWidget: { backgroundColor: '#FFDD2D', padding: 20, borderRadius: 16, marginBottom: 20 },
  widgetTitle: { fontSize: 16, color: '#333' },
  totalValue: { fontSize: 32, fontWeight: 'bold', color: '#1A1A1A', marginVertical: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowText: { color: '#333', fontWeight: '500' },
  progressBlock: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginTop: 10 },
  progressText: { marginBottom: 10, color: '#666' },
  progressBarBg: { height: 10, backgroundColor: '#EEE', borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: 10, borderRadius: 5 },
  offerCard: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' },
  offerName: { fontWeight: '600' },
  offerPercent: { color: '#22C55E', fontWeight: 'bold' }
});