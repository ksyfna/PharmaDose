import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Baby, Activity, AlertCircle } from 'lucide-react-native';

const PEDIATRIC_DRUGS = [
  { id: 'amox_pneu', name: 'Amoxycillin (Pneumonia/CAP)', concMg: 125, concMl: 5, rule: '80-90 mg/kg/day', freq: 'BD', maxAdultMg: 4000, maxAdultStr: '4g/day',
    calculate: (w: number) => {
      // using average 85 mg/kg/day
      const doseMgPerDay = w * 85; 
      const doseMgPerDose = doseMgPerDay / 2; // BD
      const doseMlPerDose = (doseMgPerDose / 125) * 5;
      return { doseMg: doseMgPerDose, doseMl: doseMlPerDose, freq: 'BD (Every 12 hours)', maxExceeded: doseMgPerDay > 4000 };
    }
  },
  { id: 'amox_tonsil', name: 'Amoxycillin (Tonsillitis)', concMg: 125, concMl: 5, rule: '50 mg/kg/day', freq: 'OD or BD', maxAdultMg: 4000, maxAdultStr: '4g/day',
    calculate: (w: number) => {
      const doseMgPerDay = w * 50; 
      const doseMgPerDose = doseMgPerDay / 2; // Assuming BD for volume calculation
      const doseMlPerDose = (doseMgPerDose / 125) * 5;
      return { doseMg: doseMgPerDose, doseMl: doseMlPerDose, freq: 'BD (Every 12 hours)', maxExceeded: doseMgPerDay > 4000 };
    }
  },
  { id: 'aug', name: 'Augmentin (General)', concMg: 156.25, concMl: 5, rule: '25 mg/kg/day', freq: 'BD', maxAdultMg: 2000, maxAdultStr: '2g/day',
    calculate: (w: number) => {
      const doseMgPerDay = w * 25; 
      const doseMgPerDose = doseMgPerDay / 2; // BD
      const doseMlPerDose = (doseMgPerDose / 156.25) * 5;
      return { doseMg: doseMgPerDose, doseMl: doseMlPerDose, freq: 'BD (Every 12 hours)', maxExceeded: doseMgPerDay > 2000 };
    }
  },
  { id: 'ceph', name: 'Cephalexin (Skin Infection)', concMg: 250, concMl: 5, rule: '25-50 mg/kg/day', freq: 'BD', maxAdultMg: 4000, maxAdultStr: '4g/day',
    calculate: (w: number) => {
      // Using average 37.5 mg/kg/day
      const doseMgPerDay = w * 37.5; 
      const doseMgPerDose = doseMgPerDay / 2; // BD
      const doseMlPerDose = (doseMgPerDose / 250) * 5;
      return { doseMg: doseMgPerDose, doseMl: doseMlPerDose, freq: 'BD (Every 12 hours)', maxExceeded: doseMgPerDay > 4000 };
    }
  },
  { id: 'cefuroxime', name: 'Cefuroxime (Sinusitis)', concMg: 125, concMl: 5, rule: '30 mg/kg/day', freq: 'BD', maxAdultMg: 1000, maxAdultStr: '1g/day',
    calculate: (w: number) => {
      const doseMgPerDay = w * 30; 
      const doseMgPerDose = doseMgPerDay / 2; // BD
      const doseMlPerDose = (doseMgPerDose / 125) * 5;
      return { doseMg: doseMgPerDose, doseMl: doseMlPerDose, freq: 'BD (Every 12 hours)', maxExceeded: doseMgPerDay > 1000 };
    }
  },
  { id: 'pcm', name: 'Paracetamol (Fever/Pain)', concMg: 120, concMl: 5, rule: '15 mg/kg/dose', freq: 'TDS/PRN', maxAdultMg: 4000, maxAdultStr: '4g/day',
    calculate: (w: number) => {
      const doseMgPerDose = w * 15; 
      const doseMlPerDose = (doseMgPerDose / 120) * 5;
      const doseMgPerDay = doseMgPerDose * 4; // Assuming 4 times a day max
      return { doseMg: doseMgPerDose, doseMl: doseMlPerDose, freq: 'TDS / PRN (Every 6-8 hrs)', maxExceeded: doseMgPerDay > 4000 };
    }
  }
];

export default function PediatricScreen() {
  const [weight, setWeight] = useState('');
  const [selectedDrug, setSelectedDrug] = useState(PEDIATRIC_DRUGS[0]);
  const [result, setResult] = useState<any>(null);

  const calculateDose = () => {
    // Allow decimal inputs
    const w = parseFloat(weight);
    if (!w || isNaN(w) || w <= 0) {
      setResult(null);
      return;
    }
    setResult(selectedDrug.calculate(w));
  };

  React.useEffect(() => {
    calculateDose();
  }, [weight, selectedDrug]);

  return (
    <LinearGradient colors={['#F5F3FF', '#EDE9FE']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Baby color="#7C3AED" size={32} />
            </View>
            <Text style={styles.title}>Pediatric Dosing</Text>
            <Text style={styles.subtitle}>Verified KK Merlimau Math</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Patient Weight (kg)</Text>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              placeholder="e.g. 6.5"
              value={weight}
              onChangeText={setWeight}
              placeholderTextColor="#A1A1AA"
            />

            <Text style={styles.label}>Select Medication</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.drugSelector}>
              {PEDIATRIC_DRUGS.map((drug) => (
                <TouchableOpacity
                  key={drug.id}
                  style={[styles.drugPill, selectedDrug.id === drug.id && styles.drugPillActive]}
                  onPress={() => setSelectedDrug(drug)}
                >
                  <Text style={[styles.drugPillText, selectedDrug.id === drug.id && styles.drugPillTextActive]}>
                    {drug.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.infoBox}>
              <Activity color="#7C3AED" size={20} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Rule: {selectedDrug.rule}</Text>
                <Text style={styles.infoSubtitle}>Concentration: {selectedDrug.concMg}mg/{selectedDrug.concMl}ml</Text>
              </View>
            </View>
          </View>

          {result && (
            <View style={[styles.resultCard, result.maxExceeded && styles.resultCardWarning]}>
              <Text style={styles.resultTitle}>Calculated Output</Text>
              
              <View style={styles.resultRow}>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Dose</Text>
                  <Text style={[styles.resultValueHighlight, result.maxExceeded && {color: '#EF4444'}]}>
                    {result.doseMg.toFixed(2)} <Text style={{fontSize: 14}}>mg</Text>
                  </Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Volume</Text>
                  <Text style={[styles.resultValueHighlight, result.maxExceeded && {color: '#EF4444'}]}>
                    {result.doseMl.toFixed(2)} <Text style={{fontSize: 14}}>ml</Text>
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.freqRow}>
                <Text style={styles.freqLabel}>Frequency:</Text>
                <Text style={styles.freqValue}>{result.freq}</Text>
              </View>

              {result.maxExceeded ? (
                <View style={[styles.warningBox, { backgroundColor: '#FEF2F2', borderColor: '#F87171' }]}>
                  <AlertCircle color="#EF4444" size={20} />
                  <Text style={[styles.warningText, { color: '#B91C1C', fontSize: 15 }]}>Use Adult Max: {selectedDrug.maxAdultStr}</Text>
                </View>
              ) : (
                <View style={styles.warningBox}>
                  <AlertCircle color="#EAB308" size={16} />
                  <Text style={styles.warningText}>Max Adult Dose: {selectedDrug.maxAdultStr}</Text>
                </View>
              )}
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
    shadowColor: '#7C3AED',
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
    marginBottom: 20,
    fontWeight: '500',
  },
  drugSelector: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  drugPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginRight: 10,
  },
  drugPillActive: {
    backgroundColor: '#7C3AED',
  },
  drugPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  drugPillTextActive: {
    color: '#fff',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#FAF5FF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoTitle: {
    color: '#5B21B6',
    fontWeight: '700',
    fontSize: 14,
  },
  infoSubtitle: {
    color: '#7C3AED',
    fontSize: 12,
    marginTop: 2,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  resultCardWarning: {
    borderColor: '#FECACA',
    shadowColor: '#EF4444',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  resultItem: {
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  resultValueHighlight: {
    fontSize: 32,
    fontWeight: '800',
    color: '#7C3AED',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 16,
  },
  freqRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  freqLabel: {
    fontSize: 15,
    color: '#4B5563',
    fontWeight: '600',
  },
  freqValue: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '700',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEFCE8',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEF08A',
  },
  warningText: {
    color: '#A16207',
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 8,
  },
});
