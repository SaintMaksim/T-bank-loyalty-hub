import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../services/api';

const LOGO_URI = require('../../assets/logo.png');

const formatMoney = (val) => {
  const num = val != null ? Number(val) : 0;
  return num.toLocaleString('ru-RU');
};

export default function DashboardScreen({ route, navigation }) {
  const [summary, setSummary] = useState(null);
  const [offers, setOffers] = useState([]);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Трекаем визит (не ждём ответа — не блокируем UI)
      api.trackVisit();
      
      // Загружаем все данные параллельно
      const [sumData, offData, aiData, streakData] = await Promise.all([
        api.getLoyaltySummary(),
        api.getOffers(),
        api.getAiRecommend(),
        api.getStreak()
      ]);
      
      setSummary(sumData);
      setOffers(offData);
      setAiRecommendation(aiData);
      setStreak(streakData);
    } catch (e) {
      console.error('🔴 Ошибка загрузки дашборда:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = async () => {
    await api.logout();
    navigation.replace('UserSelect');
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FFDD2D" />
      </SafeAreaView>
    );
  }

  const programs = summary?.accounts || [];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* --- ХЕДЕР: Логотип слева, Стрик справа (на одной высоте) --- */}
      <View style={styles.header}>
        <Image source={LOGO_URI} style={styles.logo} resizeMode="contain" />
        
        {/* Стрик: только если есть данные о следующей награде */}
        {streak?.next_milestone && (
          <View style={styles.streakBox}>
            <Text style={styles.streakCount}>{streak.streak_count}</Text>
            <Text style={styles.streakLabel}>дней</Text>
            <Text style={styles.streakHint}>
              До повышения кешбека на {formatMoney(streak.next_milestone.bonus_rub)} ₽{'\n'}
              осталось {streak.next_milestone.days} дней
            </Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Назад к выбору профиля</Text>
        </TouchableOpacity>

        {/* --- ВАША ЛОЯЛЬНОСТЬ --- */}
        <Text style={styles.sectionTitle}>Ваша лояльность</Text>

        {summary && (
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatMoney(summary.total_rub)}</Text>
              <Text style={styles.statLabel}>кешбек</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatMoney(summary.total_bravo)}</Text>
              <Text style={styles.statLabel}>браво</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatMoney(summary.total_miles)}</Text>
              <Text style={styles.statLabel}>мили</Text>
            </View>
          </View>
        )}

        {/* --- ИИ-РЕКОМЕНДАЦИЯ (по центру, под лояльностью) --- */}
        {aiRecommendation?.recommendation && (
          <View style={styles.aiCard}>
            <Text style={styles.aiTitle}>Рекомендация ИИ</Text>
            <Text style={styles.aiText}>{aiRecommendation.recommendation}</Text>
          </View>
        )}

        {/* --- ПРОГРАММЫ ЛОЯЛЬНОСТИ --- */}
        <Text style={[styles.sectionTitle, styles.mt]}>Программы лояльности</Text>
        <View style={styles.programsList}>
          {programs.map((prog, idx) => {
            let desc = '';
            if (prog.cashback_currency === 'rub') desc = 'Кешбек 1-5% рублями';
            else if (prog.cashback_currency === 'bravo-points') desc = 'Бонусы Браво 1.5-10%';
            else if (prog.cashback_currency === 'miles') desc = 'Мили за авиабилеты';

            const threshold = 50000;
            const progress = Math.min((prog.current_balance / threshold) * 100, 100);
            const remaining = Math.max(threshold - prog.current_balance, 0);

            return (
              <View key={prog.account_id || idx} style={styles.programCard}>
                <Text style={styles.programName}>{prog.loyalty_program_name}</Text>
                <Text style={styles.programDesc}>{desc}</Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.progressText}>
                  {remaining > 0 ? `До следующей категории осталось ${formatMoney(remaining)} ₽` : 'Максимальный уровень'}
                </Text>
              </View>
            );
          })}
        </View>

        {/* --- АКЦИИ ПАРТНЁРОВ --- */}
        <Text style={[styles.sectionTitle, styles.mt]}>Акции партнеров</Text>
        <View style={styles.offersList}>
          {offers.map(offer => (
            <View key={offer.id} style={styles.offerCard}>
              <View style={styles.offerInfo}>
                <Text style={styles.offerName}>{offer.partner_name}</Text>
                <Text style={styles.offerDesc}>{offer.short_description}</Text>
              </View>
              <View style={[styles.offerBadge, { backgroundColor: offer.brand_color_hex }]}>
                <Text style={styles.offerPercent}>+{offer.cashback_percent}%</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7F8' },
  center: { justifyContent: 'center', alignItems: 'center' },
  
  // Хедер: логотип и стрик на одной строке
  header: { 
    backgroundColor: '#F6F7F8', 
    padding: 20, 
    paddingTop: 10, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: { width: 120, height: 40 },
  
  // Стрик в хедере
  streakBox: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    minWidth: 130,
  },
  streakCount: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#1A1A1A',
    marginBottom: 2,
  },
  streakLabel: { 
    fontSize: 12, 
    color: '#6B7280', 
    fontWeight: '500',
    marginBottom: 4,
  },
  streakHint: { 
    fontSize: 10, 
    color: '#9CA3AF', 
    textAlign: 'center',
    lineHeight: 13,
  },
  
  scrollContent: { padding: 20, paddingBottom: 40 },
  backButton: { marginBottom: 16, paddingVertical: 8, paddingHorizontal: 4, alignSelf: 'flex-start' },
  backButtonText: { fontSize: 15, color: '#6B7280', fontWeight: '500' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginTop: 8 },
  mt: { marginTop: 24 },
  
  // Карточка статистики (серый фон)
  statsCard: { 
    backgroundColor: '#F3F4F6', 
    borderRadius: 16, 
    padding: 16, 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    marginTop: 12 
  },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 20, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#6B7280', fontWeight: '500', textTransform: 'lowercase' },
  statDivider: { width: 1, height: 40, backgroundColor: '#D1D5DB' },
  
  // ИИ-рекомендация (белая карточка, по центру)
  aiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  aiTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 8 },
  aiText: { fontSize: 14, color: '#374151', lineHeight: 20, textAlign: 'center' },
  
  // Программы лояльности
  programsList: { marginTop: 12 },
  programCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 12,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 8, 
    elevation: 2 
  },
  programName: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
  programDesc: { fontSize: 13, color: '#6B7280', marginBottom: 12 },
  progressBarBg: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, marginBottom: 8 },
  progressBarFill: { height: '100%', backgroundColor: '#FFDD2D', borderRadius: 3 },
  progressText: { fontSize: 12, color: '#6B7280', textAlign: 'right' },
  
  // Офферы
  offersList: { marginTop: 12 },
  offerCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 10, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  offerInfo: { flex: 1, paddingRight: 12 },
  offerName: { fontSize: 15, fontWeight: '600', color: '#1A1A1A', marginBottom: 2 },
  offerDesc: { fontSize: 13, color: '#6B7280' },
  offerBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  offerPercent: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});