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
    <LinearGradient colors={['#EFF6FF', '#DBEAFE']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Syringe color="#2563EB" size={32} />
            </View>
            <Text style={styles.title}>Insulin Calculator</Text>
            <Text style={styles.subtitle}>Monthly Penfill Estimation</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Patient's Total Daily Dose (IU)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="e.g. 40"
              value={dailyDose}
              onChangeText={setDailyDose}
              placeholderTextColor="#A1A1AA"
            />

            <View style={styles.primingSection}>
              <View style={styles.primingHeader}>
                <Text style={styles.label}>Include Priming (Dead Space)</Text>
                <Switch
                  value={includePriming}
                  onValueChange={setIncludePriming}
                  trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                  thumbColor={includePriming ? '#2563EB' : '#F3F4F6'}
                />
              </View>
              {includePriming && (
                <View style={styles.primingOptions}>
                  <Text style={styles.subLabel}>Number of injections per day:</Text>
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

          {isValid && (
            <View style={styles.resultCard}>
              <View style={styles.resultRow}>
                <View style={styles.resultIconBox}>
                  <Calendar color="#3B82F6" size={24} />
                </View>
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultLabel}>Total Units (30 Days)</Text>
                  <Text style={styles.resultValue}>{monthlyUnits} <Text style={{fontSize: 16}}>IU</Text></Text>
                  {includePriming && (
                    <Text style={styles.resultSubValue}>Includes {dailyPrimingWaste * 30} IU priming waste</Text>
                  )}
                </View>
              </View>
              
              <View style={styles.divider} />

              <View style={styles.resultRow}>
                <View style={[styles.resultIconBox, { backgroundColor: '#EFF6FF' }]}>
                  <Package color="#2563EB" size={24} />
                </View>
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultLabel}>Actual Penfills Required</Text>
                  <Text style={styles.resultValueHighlight}>{penfillsNeeded} <Text style={{fontSize: 16}}>pen(s)</Text></Text>
                  <Text style={styles.resultSubValue}>Exact Calculation: {exactPenfills} pens</Text>
                </View>
              </View>
              
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  Dispense <Text style={{fontWeight: '700'}}>{penfillsNeeded} pen(s)</Text> for a 1-month supply.
                </Text>
              </View>

              <View style={styles.warningBox}>
                <AlertCircle color="#D97706" size={20} style={{marginTop: 2}} />
                <View style={styles.warningTextContainer}>
                  <Text style={styles.warningTitle}>28-Day Expiration Warning</Text>
                  <Text style={styles.warningText}>Ensure patient discards pen 28 days after first use or removal from fridge, regardless of remaining volume inside.</Text>
                </View>
              </View>

            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 24, marginTop: 20 },
  iconContainer: { width: 64, height: 64, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 12, shadowColor: '#2563EB', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 5 },
  title: { fontSize: 28, fontWeight: '800', color: '#1F2937', letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, marginBottom: 20 },
  label: { fontSize: 15, fontWeight: '600', color: '#374151', marginBottom: 8 },
  subLabel: { fontSize: 13, color: '#6B7280', marginBottom: 8 },
  input: { backgroundColor: '#F3F4F6', borderRadius: 12, padding: 16, fontSize: 18, color: '#1F2937', marginBottom: 24, fontWeight: '500' },
  primingSection: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#E2E8F0' },
  primingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  primingOptions: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderColor: '#E2E8F0' },
  injectionToggleRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  injectionBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0' },
  injectionBtnActive: { backgroundColor: '#DBEAFE', borderColor: '#3B82F6' },
  injectionBtnText: { fontSize: 15, fontWeight: '600', color: '#64748B' },
  injectionBtnTextActive: { color: '#1D4ED8' },
  primingInfoText: { fontSize: 12, color: '#2563EB', fontStyle: 'italic' },
  toggleContainer: { flexDirection: 'column', gap: 8 },
  toggleBtn: { paddingVertical: 16, paddingHorizontal: 16, alignItems: 'center', borderRadius: 12, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: 'transparent' },
  toggleBtnActive: { backgroundColor: '#EFF6FF', borderColor: '#3B82F6', shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 1 },
  toggleText: { fontSize: 16, fontWeight: '700', color: '#6B7280', marginBottom: 4 },
  toggleTextActive: { color: '#1E3A8A' },
  brandText: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
  brandTextActive: { color: '#3B82F6' },
  resultCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, shadowColor: '#2563EB', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 15, elevation: 4, borderWidth: 1, borderColor: '#BFDBFE' },
  resultRow: { flexDirection: 'row', alignItems: 'center' },
  resultIconBox: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#F0F9FF', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  resultTextContainer: { flex: 1 },
  resultLabel: { fontSize: 14, color: '#6B7280', marginBottom: 4, fontWeight: '500' },
  resultValue: { fontSize: 24, fontWeight: '800', color: '#1F2937' },
  resultValueHighlight: { fontSize: 28, fontWeight: '800', color: '#2563EB' },
  resultSubValue: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 16 },
  infoBox: { marginTop: 20, backgroundColor: '#EFF6FF', padding: 16, borderRadius: 12, alignItems: 'center' },
  infoText: { color: '#1E3A8A', fontSize: 15 },
  warningBox: { marginTop: 16, backgroundColor: '#FFFBEB', padding: 16, borderRadius: 12, flexDirection: 'row', borderWidth: 1, borderColor: '#FEF08A' },
  warningTextContainer: { flex: 1, marginLeft: 12 },
  warningTitle: { color: '#B45309', fontWeight: '700', fontSize: 14, marginBottom: 4 },
  warningText: { color: '#92400E', fontSize: 13, lineHeight: 18 }
});
