import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Syringe, Calendar, Package } from 'lucide-react-native';

export default function InsulinScreen() {
  const [dailyDose, setDailyDose] = useState('');
  const [penfillSize, setPenfillSize] = useState(300);

  const dose = parseFloat(dailyDose);
  const isValid = !isNaN(dose) && dose > 0;
  
  const monthlyUnits = isValid ? dose * 30 : 0;
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
            <Text style={styles.label}>Total Daily Dose (IU)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="e.g. 40"
              value={dailyDose}
              onChangeText={setDailyDose}
              placeholderTextColor="#A1A1AA"
            />

            <Text style={styles.label}>Penfill Size (IU)</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleBtn, penfillSize === 300 && styles.toggleBtnActive]}
                onPress={() => setPenfillSize(300)}
              >
                <Text style={[styles.toggleText, penfillSize === 300 && styles.toggleTextActive]}>300 IU (3ml)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, penfillSize === 450 && styles.toggleBtnActive]}
                onPress={() => setPenfillSize(450)}
              >
                <Text style={[styles.toggleText, penfillSize === 450 && styles.toggleTextActive]}>450 IU (1.5ml)</Text>
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
                  <Text style={styles.resultLabel}>Total Units for 30 Days</Text>
                  <Text style={styles.resultValue}>{monthlyUnits} <Text style={{fontSize: 16}}>IU</Text></Text>
                </View>
              </View>
              
              <View style={styles.divider} />

              <View style={styles.resultRow}>
                <View style={[styles.resultIconBox, { backgroundColor: '#EFF6FF' }]}>
                  <Package color="#2563EB" size={24} />
                </View>
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultLabel}>Penfills Required</Text>
                  <Text style={styles.resultValueHighlight}>{penfillsNeeded} <Text style={{fontSize: 16}}>pen(s)</Text></Text>
                </View>
              </View>
              
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  Dispense <Text style={{fontWeight: '700'}}>{penfillsNeeded} pen(s)</Text> for a 1-month supply.
                </Text>
              </View>

            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 24,
    fontWeight: '500',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#fff',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  resultTextContainer: {
    flex: 1,
  },
  resultLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
  },
  resultValueHighlight: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2563EB',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 16,
  },
  infoBox: {
    marginTop: 20,
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoText: {
    color: '#1E3A8A',
    fontSize: 15,
  }
});
