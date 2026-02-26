import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Syringe, Calendar, Package, AlertCircle, Info } from 'lucide-react-native';

export default function InsulinScreen() {
  const [dailyDose, setDailyDose] = useState('');
  const [penfillSize, setPenfillSize] = useState(300);
  const [includePriming, setIncludePriming] = useState(true);
  const [injectionsPerDay, setInjectionsPerDay] = useState('1');

  const dose = parseFloat(dailyDose);
  const injections = parseInt(injectionsPerDay) || 1;
  const isValid = !isNaN(dose) && dose > 0;
  
  // Calculate daily units taking priming into account
  const dailyPrimingWaste = includePriming ? (injections * 2) : 0;
  const totalDailyUnits = dose + dailyPrimingWaste;
  
  const monthlyUnits = isValid ? totalDailyUnits * 30 : 0;
  // Calculate exact unrounded pens
  const exactPenfills = isValid ? (monthlyUnits / penfillSize).toFixed(2) : '0';
  // Use Math.ceil to ensure pharmacy always dispenses enough full pens
  const penfillsNeeded = isValid ? Math.ceil(monthlyUnits / penfillSize) : 0;

  return (
    <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Syringe color="#2563EB" size={32} />
            </View>
            <Text style={styles.title}>Insulin Calculator</Text>
          </View>

          {/* HERO CARD (RESULTS) */}
          {isValid && (
            <LinearGradient colors={['#EFF6FF', '#DBEAFE']} style={styles.heroCard}>
              <Text style={styles.resultTitle}>Monthly Penfill Estimation</Text>

              <View style={styles.resultRow}>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Total Units (30 Days)</Text>
                  <Text style={styles.resultValueHighlight}>{monthlyUnits} <Text style={{fontSize: 16, fontWeight: '600'}}>IU</Text></Text>
                  {includePriming && (
                    <Text style={styles.resultSubValue}>Inc. {dailyPrimingWaste * 30} IU priming</Text>
                  )}
                </View>
                <View style={styles.dividerVertical} />
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Penfills Required</Text>
                  <Text style={[styles.resultValueHighlight, {fontSize: 42}]}>{penfillsNeeded}</Text>
                  <Text style={styles.resultSubValue}>Exact: {exactPenfills} pens</Text>
                </View>
              </View>

              <View style={styles.divider} />
              
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  Dispense <Text style={{fontWeight: '800'}}>{penfillsNeeded} pen(s)</Text> for a 1-month supply.
                </Text>
              </View>

              <View style={styles.warningBox}>
                <AlertCircle color="#D97706" size={24} />
                <View style={styles.warningTextContainer}>
                  <Text style={styles.warningTitle}>28-Day Expiration</Text>
                  <Text style={styles.warningText}>Discard pen 28 days after first use, regardless of remaining volume.</Text>
                </View>
              </View>
            </LinearGradient>
          )}

          {/* INPUT CARD */}
          <View style={styles.neumorphicCard}>
            <Text style={styles.label}>Patient's Total Daily Dose (IU)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="e.g. 40"
              value={dailyDose}
              onChangeText={setDailyDose}
              placeholderTextColor="#94A3B8"
            />

            <View style={styles.primingSection}>
              <View style={styles.primingHeader}>
                <Text style={styles.label}>Include Priming (Dead Space)</Text>
                <Switch
                  value={includePriming}
                  onValueChange={setIncludePriming}
                  trackColor={{ false: '#E2E8F0', true: '#93C5FD' }}
                  thumbColor={includePriming ? '#2563EB' : '#F8FAFC'}
                />
              </View>
              {includePriming && (
                <View style={styles.primingOptions}>
                  <Text style={styles.subLabel}>Injections per day:</Text>
                  <View style={styles.injectionToggleRow}>
                    {[1, 2, 3, 4].map((num) => (
                      <TouchableOpacity
                        key={num}
                        style={[styles.injectionBtn, injections === num && styles.injectionBtnActive]}
                        onPress={() => setInjectionsPerDay(num.toString())}
                      >
                        <Text style={[styles.injectionBtnText, injections === num && styles.injectionBtnTextActive]}>{num}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={styles.primingInfoText}>
                    Adds {injections * 2} IU/day waste (2 IU per injection)
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.label}>Penfill Type / Size</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleBtn, penfillSize === 300 && styles.toggleBtnActive]}
                onPress={() => setPenfillSize(300)}
              >
                <Text style={[styles.toggleText, penfillSize === 300 && styles.toggleTextActive]}>300 IU (3ml)</Text>
                <Text style={[styles.brandText, penfillSize === 300 && styles.brandTextActive]}>Lantus / Novorapid / Humalog</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, penfillSize === 450 && styles.toggleBtnActive]}
                onPress={() => setPenfillSize(450)}
              >
                <Text style={[styles.toggleText, penfillSize === 450 && styles.toggleTextActive]}>450 IU (1.5ml)</Text>
                <Text style={[styles.brandText, penfillSize === 450 && styles.brandTextActive]}>Toujeo Solostar</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 20, marginTop: 20 },
  iconContainer: { width: 64, height: 64, borderRadius: 24, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 12, shadowColor: '#2563EB', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 5 },
  title: { fontSize: 26, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
  
  heroCard: { borderRadius: 28, padding: 24, shadowColor: '#2563EB', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.2, shadowRadius: 24, elevation: 8, marginBottom: 24, borderWidth: 1, borderColor: '#BFDBFE' },
  resultTitle: { fontSize: 13, fontWeight: '700', color: '#3B82F6', marginBottom: 16, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 },
  resultRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  resultItem: { alignItems: 'center', flex: 1 },
  dividerVertical: { width: 1, height: '80%', backgroundColor: '#BFDBFE', marginHorizontal: 10 },
  resultLabel: { fontSize: 13, color: '#64748B', marginBottom: 4, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center' },
  resultValueHighlight: { fontSize: 34, fontWeight: '900', color: '#1D4ED8' },
  resultSubValue: { fontSize: 12, color: '#64748B', marginTop: 4, fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#BFDBFE', marginVertical: 20 },
  
  infoBox: { backgroundColor: '#DBEAFE', padding: 14, borderRadius: 16, alignItems: 'center', marginBottom: 12 },
  infoText: { color: '#1E3A8A', fontSize: 15 },
  warningBox: { backgroundColor: '#FFFBEB', padding: 14, borderRadius: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#FDE68A' },
  warningTextContainer: { flex: 1, marginLeft: 12 },
  warningTitle: { color: '#B45309', fontWeight: '800', fontSize: 13, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  warningText: { color: '#92400E', fontSize: 13, lineHeight: 18, fontWeight: '500' },
  
  neumorphicCard: { backgroundColor: '#fff', borderRadius: 28, padding: 24, shadowColor: '#64748B', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 4, marginBottom: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  label: { fontSize: 14, fontWeight: '600', color: '#64748B', marginBottom: 10 },
  subLabel: { fontSize: 13, color: '#94A3B8', marginBottom: 8, fontWeight: '500' },
  input: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 18, fontSize: 18, color: '#0F172A', marginBottom: 24, fontWeight: '600', borderWidth: 1, borderColor: '#E2E8F0' },
  
  primingSection: { backgroundColor: '#F8FAFC', borderRadius: 20, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#E2E8F0' },
  primingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  primingOptions: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderColor: '#E2E8F0' },
  injectionToggleRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  injectionBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0' },
  injectionBtnActive: { backgroundColor: '#DBEAFE', borderColor: '#3B82F6', shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 1 },
  injectionBtnText: { fontSize: 15, fontWeight: '700', color: '#64748B' },
  injectionBtnTextActive: { color: '#1D4ED8' },
  primingInfoText: { fontSize: 13, color: '#3B82F6', fontStyle: 'italic', fontWeight: '500' },
  
  toggleContainer: { flexDirection: 'column', gap: 10 },
  toggleBtn: { paddingVertical: 18, paddingHorizontal: 16, alignItems: 'center', borderRadius: 16, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' },
  toggleBtnActive: { backgroundColor: '#EFF6FF', borderColor: '#3B82F6', shadowColor: '#2563EB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 2 },
  toggleText: { fontSize: 16, fontWeight: '800', color: '#64748B', marginBottom: 4 },
  toggleTextActive: { color: '#1E3A8A' },
  brandText: { fontSize: 13, color: '#94A3B8', fontWeight: '600' },
  brandTextActive: { color: '#3B82F6' }
});
