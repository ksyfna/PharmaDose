import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Baby, Activity, AlertCircle, Info, Droplet } from 'lucide-react-native';

const PEDIATRIC_DRUGS = [
  {
    id: 'amox_pneu', name: 'Amoxycillin (Pneumonia/CAP)',
    concentrations: [{ mg: 125, ml: 5, label: '125mg / 5ml (Standard)' }, { mg: 250, ml: 5, label: '250mg / 5ml (Double)' }],
    rule: '80-90 mg/kg/day', ruleMgPerKg: 85, dosesPerDay: 2, freq: 'BD (Every 12 hrs)', maxAdultMg: 4000, maxAdultStr: '4g/day',
    cpgInfo: 'High dose (80-90mg/kg) in 2 divided doses for Community-Acquired Pneumonia.'
  },
  {
    id: 'amox_tonsil', name: 'Amoxycillin (Tonsillitis)',
    concentrations: [{ mg: 125, ml: 5, label: '125mg / 5ml (Standard)' }, { mg: 250, ml: 5, label: '250mg / 5ml (Double)' }],
    rule: '50 mg/kg/day', ruleMgPerKg: 50, dosesPerDay: 2, freq: 'BD or TDS', maxAdultMg: 4000, maxAdultStr: '4g/day',
    cpgInfo: 'Standard dose (50mg/kg/day). Often TDS, but BD acceptable for better compliance.'
  },
  {
    id: 'aug', name: 'Augmentin (General)',
    concentrations: [{ mg: 156.25, ml: 5, label: '156.25mg (Base)' }, { mg: 228, ml: 5, label: '228mg (BD Formula)' }],
    rule: '25-45 mg/kg/day', ruleMgPerKg: 30, dosesPerDay: 2, freq: 'BD (Every 12 hrs)', maxAdultMg: 2000, maxAdultStr: '2g/day',
    cpgInfo: 'Ensure formulation matches BD dosing regimens (e.g. 228mg/5ml).'
  },
  {
    id: 'ceph', name: 'Cephalexin (Skin)',
    concentrations: [{ mg: 125, ml: 5, label: '125mg / 5ml' }, { mg: 250, ml: 5, label: '250mg / 5ml' }],
    rule: '25-50 mg/kg/day', ruleMgPerKg: 37.5, dosesPerDay: 2, freq: 'BD (Every 12 hrs)', maxAdultMg: 4000, maxAdultStr: '4g/day',
    cpgInfo: 'Commonly used for uncomplicated skin and soft tissue infections.'
  },
  {
    id: 'cefuroxime', name: 'Cefuroxime (Sinusitis)',
    concentrations: [{ mg: 125, ml: 5, label: '125mg / 5ml' }, { mg: 250, ml: 5, label: '250mg / 5ml' }],
    rule: '30 mg/kg/day', ruleMgPerKg: 30, dosesPerDay: 2, freq: 'BD (Every 12 hrs)', maxAdultMg: 1000, maxAdultStr: '1g/day',
    cpgInfo: 'Effective for acute bacterial rhinosinusitis. Mix with food if bitter.'
  },
  {
    id: 'pcm', name: 'Paracetamol (Fever)',
    concentrations: [{ mg: 120, ml: 5, label: '120mg / 5ml' }, { mg: 250, ml: 5, label: '250mg / 5ml (6+ yr)' }],
    rule: '15 mg/kg/dose', ruleMgPerKg: 15, ruleIsPerDose: true, dosesPerDay: 4, freq: 'QDS/PRN (Every 6 hrs)', maxAdultMg: 4000, maxAdultStr: '4g/day',
    cpgInfo: 'Max 60mg/kg/day or 4g/day. Do not exceed 4 doses in 24 hours.'
  }
];

export default function PediatricScreen() {
  const [weight, setWeight] = useState('');
  const [selectedDrug, setSelectedDrug] = useState(PEDIATRIC_DRUGS[0]);
  const [selectedConc, setSelectedConc] = useState(PEDIATRIC_DRUGS[0].concentrations[0]);
  const [result, setResult] = useState<any>(null);

  const handleSelectDrug = (drug: any) => {
    setSelectedDrug(drug);
    setSelectedConc(drug.concentrations[0]);
  };

  const calculateDose = () => {
    const w = parseFloat(weight);
    if (!w || isNaN(w) || w <= 0) { setResult(null); return; }

    let doseMgPerDay = 0;
    let doseMgPerDose = 0;

    if (selectedDrug.ruleIsPerDose) {
      doseMgPerDose = w * selectedDrug.ruleMgPerKg;
      doseMgPerDay = doseMgPerDose * selectedDrug.dosesPerDay;
    } else {
      doseMgPerDay = w * selectedDrug.ruleMgPerKg;
      doseMgPerDose = doseMgPerDay / selectedDrug.dosesPerDay;
    }

    let isCapped = false;
    if (doseMgPerDay > selectedDrug.maxAdultMg) {
      doseMgPerDay = selectedDrug.maxAdultMg;
      doseMgPerDose = doseMgPerDay / selectedDrug.dosesPerDay;
      isCapped = true;
    }

    const doseMlPerDose = (doseMgPerDose / selectedConc.mg) * selectedConc.ml;
    const isHighVolume = doseMlPerDose >= 10;

    let suggestion = null;
    if (isHighVolume && selectedConc === selectedDrug.concentrations[0] && selectedDrug.concentrations.length > 1) {
      suggestion = `High volume detected (>10ml). Tap here to switch to double strength for better compliance.`;
    }

    setResult({ doseMg: doseMgPerDose, doseMl: doseMlPerDose, freq: selectedDrug.freq, isCapped, isHighVolume, suggestion });
  };

  React.useEffect(() => { calculateDose(); }, [weight, selectedDrug, selectedConc]);

  return (
    <LinearGradient colors={['#F5F3FF', '#EDE9FE']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.iconContainer}><Baby color="#7C3AED" size={32} /></View>
            <Text style={styles.title}>Pediatric Dosing</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Patient Weight (kg)</Text>
            <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="e.g. 6.5" value={weight} onChangeText={setWeight} placeholderTextColor="#A1A1AA" />

            <Text style={styles.label}>1. Select Medication</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.drugSelector}>
              {PEDIATRIC_DRUGS.map((drug) => (
                <TouchableOpacity key={drug.id} style={[styles.drugPill, selectedDrug.id === drug.id && styles.drugPillActive]} onPress={() => handleSelectDrug(drug)}>
                  <Text style={[styles.drugPillText, selectedDrug.id === drug.id && styles.drugPillTextActive]}>{drug.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.label}>2. Select Concentration</Text>
            <View style={styles.concContainer}>
              {selectedDrug.concentrations.map((conc, idx) => (
                <TouchableOpacity key={idx} style={[styles.concPill, selectedConc.mg === conc.mg && styles.concPillActive]} onPress={() => setSelectedConc(conc)}>
                  <Droplet color={selectedConc.mg === conc.mg ? '#fff' : '#6B7280'} size={16} />
                  <Text style={[styles.concPillText, selectedConc.mg === conc.mg && styles.drugPillTextActive]}>{conc.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.infoBox}>
              <Activity color="#7C3AED" size={20} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Rule: {selectedDrug.rule}</Text>
                <Text style={styles.infoSubtitle}>Uses {selectedConc.mg}mg per {selectedConc.ml}ml</Text>
              </View>
            </View>

            {selectedDrug.cpgInfo && (
              <View style={[styles.infoBox, { marginTop: 12, backgroundColor: '#F0F9FF', borderColor: '#BAE6FD' }]}>
                <Info color="#0284C7" size={20} />
                <View style={styles.infoTextContainer}>
                  <Text style={[styles.infoTitle, {color: '#0369A1'}]}>CPG Reference</Text>
                  <Text style={[styles.infoSubtitle, {color: '#0284C7'}]}>{selectedDrug.cpgInfo}</Text>
                </View>
              </View>
            )}
          </View>

          {result && (
            <View style={[styles.resultCard, result.isHighVolume && styles.resultCardHighVol]}>
              <Text style={styles.resultTitle}>Calculated Output</Text>

              {result.isCapped && (
                <View style={[styles.warningBox, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', marginBottom: 16 }]}>
                  <Activity color="#16A34A" size={20} />
                  <Text style={[styles.warningText, { color: '#166534', flex: 1 }]}>
                    Dose capped at Adult Max ({selectedDrug.maxAdultStr}).
                  </Text>
                </View>
              )}
              
              <View style={styles.resultRow}>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Dose</Text>
                  <Text style={styles.resultValueHighlight}>{result.doseMg.toFixed(1)} <Text style={{fontSize: 14}}>mg</Text></Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={[styles.resultLabel, result.isHighVolume && {color: '#B45309'}]}>Volume</Text>
                  <Text style={[styles.resultValueHighlight, result.isHighVolume && {color: '#D97706'}]}>{result.doseMl.toFixed(1)} <Text style={{fontSize: 14}}>ml</Text></Text>
                </View>
              </View>

              <View style={styles.divider} />
              <View style={styles.freqRow}>
                <Text style={styles.freqLabel}>Frequency:</Text>
                <Text style={styles.freqValue}>{result.freq}</Text>
              </View>

              {result.suggestion && (
                <TouchableOpacity onPress={() => setSelectedConc(selectedDrug.concentrations[1])} style={[styles.warningBox, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A', marginTop: 8 }]}>
                  <AlertCircle color="#D97706" size={20} />
                  <Text style={[styles.warningText, { color: '#92400E', flex: 1 }]}>{result.suggestion}</Text>
                </TouchableOpacity>
              )}
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
  iconContainer: { width: 64, height: 64, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 12, shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 5 },
  title: { fontSize: 28, fontWeight: '800', color: '#1F2937', letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, marginBottom: 20 },
  label: { fontSize: 15, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#F3F4F6', borderRadius: 12, padding: 16, fontSize: 18, color: '#1F2937', marginBottom: 20, fontWeight: '500' },
  drugSelector: { flexDirection: 'row', marginBottom: 20 },
  drugPill: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#F3F4F6', borderRadius: 20, marginRight: 10 },
  drugPillActive: { backgroundColor: '#7C3AED' },
  drugPillText: { fontSize: 14, fontWeight: '600', color: '#4B5563' },
  drugPillTextActive: { color: '#fff' },
  concContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  concPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#F3F4F6', borderRadius: 16, gap: 6 },
  concPillActive: { backgroundColor: '#6D28D9' },
  concPillText: { fontSize: 13, fontWeight: '600', color: '#4B5563' },
  infoBox: { flexDirection: 'row', backgroundColor: '#FAF5FF', padding: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E9D5FF' },
  infoTextContainer: { marginLeft: 12, flex: 1 },
  infoTitle: { color: '#5B21B6', fontWeight: '700', fontSize: 14 },
  infoSubtitle: { color: '#7C3AED', fontSize: 12, marginTop: 2, lineHeight: 18 },
  resultCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 15, elevation: 4, borderWidth: 1, borderColor: '#E9D5FF' },
  resultCardHighVol: { borderColor: '#FDE68A', shadowColor: '#D97706' },
  resultTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 16, textAlign: 'center' },
  resultRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  resultItem: { alignItems: 'center' },
  resultLabel: { fontSize: 14, color: '#6B7280', marginBottom: 4, fontWeight: '500' },
  resultValueHighlight: { fontSize: 32, fontWeight: '800', color: '#7C3AED' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 16 },
  freqRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  freqLabel: { fontSize: 15, color: '#4B5563', fontWeight: '600' },
  freqValue: { fontSize: 15, color: '#1F2937', fontWeight: '700' },
  warningBox: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1 },
  warningText: { fontWeight: '600', fontSize: 13, marginLeft: 8, lineHeight: 18 },
});
