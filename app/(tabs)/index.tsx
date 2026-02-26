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
    <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.iconContainer}><Baby color="#8B5CF6" size={32} /></View>
            <Text style={styles.title}>Pediatric Dosing</Text>
          </View>

          {/* HERO CARD (RESULTS) */}
          {result && (
            <LinearGradient 
              colors={result.isHighVolume ? ['#FFFbeb', '#FEF3C7'] : ['#F5F3FF', '#EDE9FE']} 
              style={[styles.heroCard, result.isHighVolume && styles.heroCardHighVol]}
            >
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
                  <Text style={[styles.resultValueHighlight, result.isHighVolume && {color: '#B45309'}]}>
                    {result.doseMg.toFixed(1)} <Text style={{fontSize: 16, fontWeight: '600'}}>mg</Text>
                  </Text>
                </View>
                <View style={styles.dividerVertical} />
                <View style={styles.resultItem}>
                  <Text style={[styles.resultLabel, result.isHighVolume && {color: '#B45309'}]}>Volume</Text>
                  <Text style={[styles.resultValueHighlight, result.isHighVolume && {color: '#D97706'}]}>
                    {result.doseMl.toFixed(1)} <Text style={{fontSize: 16, fontWeight: '600'}}>ml</Text>
                  </Text>
                </View>
              </View>

              <View style={[styles.divider, result.isHighVolume && {backgroundColor: '#FDE68A'}]} />
              <View style={styles.freqRow}>
                <Text style={styles.freqLabel}>Frequency:</Text>
                <Text style={[styles.freqValue, result.isHighVolume && {color: '#D97706'}]}>{result.freq}</Text>
              </View>

              {result.suggestion && (
                <TouchableOpacity onPress={() => setSelectedConc(selectedDrug.concentrations[1])} style={styles.suggestionBtn}>
                  <AlertCircle color="#D97706" size={20} />
                  <Text style={styles.suggestionBtnText}>{result.suggestion}</Text>
                </TouchableOpacity>
              )}
            </LinearGradient>
          )}

          {/* INPUT CARD */}
          <View style={styles.neumorphicCard}>
            <Text style={styles.label}>Patient Weight (kg)</Text>
            <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="e.g. 6.5" value={weight} onChangeText={setWeight} placeholderTextColor="#94A3B8" />

            <Text style={styles.label}>1. Select Medication</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.drugSelector}>
              {PEDIATRIC_DRUGS.map((drug) => (
                <TouchableOpacity key={drug.id} style={[styles.pill, selectedDrug.id === drug.id && styles.pillActive]} onPress={() => handleSelectDrug(drug)}>
                  <Text style={[styles.pillText, selectedDrug.id === drug.id && styles.pillTextActive]}>{drug.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.label}>2. Select Concentration</Text>
            <View style={styles.concContainer}>
              {selectedDrug.concentrations.map((conc, idx) => (
                <TouchableOpacity key={idx} style={[styles.pill, selectedConc.mg === conc.mg && styles.pillActive]} onPress={() => setSelectedConc(conc)}>
                  <Droplet color={selectedConc.mg === conc.mg ? '#fff' : '#64748B'} size={16} />
                  <Text style={[styles.pillText, selectedConc.mg === conc.mg && styles.pillTextActive]}>{conc.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.infoBox}>
              <Activity color="#8B5CF6" size={20} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Rule: {selectedDrug.rule}</Text>
                <Text style={styles.infoSubtitle}>Uses {selectedConc.mg}mg per {selectedConc.ml}ml</Text>
              </View>
            </View>

            {selectedDrug.cpgInfo && (
              <View style={[styles.infoBox, { marginTop: 12, backgroundColor: '#F0F9FF', borderColor: '#E0F2FE' }]}>
                <Info color="#0EA5E9" size={20} />
                <View style={styles.infoTextContainer}>
                  <Text style={[styles.infoTitle, {color: '#0369A1'}]}>CPG Reference</Text>
                  <Text style={[styles.infoSubtitle, {color: '#0284C7'}]}>{selectedDrug.cpgInfo}</Text>
                </View>
              </View>
            )}
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
  iconContainer: { width: 64, height: 64, borderRadius: 24, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 12, shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 5 },
  title: { fontSize: 26, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
  
  heroCard: { borderRadius: 28, padding: 24, shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.2, shadowRadius: 24, elevation: 8, marginBottom: 24, borderWidth: 1, borderColor: '#DDD6FE' },
  heroCardHighVol: { shadowColor: '#D97706', borderColor: '#FDE68A' },
  resultTitle: { fontSize: 16, fontWeight: '700', color: '#475569', marginBottom: 20, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 },
  resultRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  resultItem: { alignItems: 'center', flex: 1 },
  dividerVertical: { width: 1, height: '80%', backgroundColor: '#DDD6FE', marginHorizontal: 10 },
  resultLabel: { fontSize: 13, color: '#64748B', marginBottom: 4, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  resultValueHighlight: { fontSize: 38, fontWeight: '900', color: '#8B5CF6' },
  divider: { height: 1, backgroundColor: '#DDD6FE', marginVertical: 20 },
  freqRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  freqLabel: { fontSize: 15, color: '#64748B', fontWeight: '500' },
  freqValue: { fontSize: 16, color: '#8B5CF6', fontWeight: '800' },
  
  neumorphicCard: { backgroundColor: '#fff', borderRadius: 28, padding: 24, shadowColor: '#64748B', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 4, marginBottom: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  label: { fontSize: 14, fontWeight: '500', color: '#64748B', marginBottom: 10 },
  input: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 18, fontSize: 18, color: '#0F172A', marginBottom: 24, fontWeight: '600', borderWidth: 1, borderColor: '#E2E8F0' },
  drugSelector: { flexDirection: 'row', marginBottom: 24 },
  
  pill: { paddingHorizontal: 18, paddingVertical: 12, backgroundColor: '#F8FAFC', borderRadius: 16, marginRight: 10, borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center', gap: 6 },
  pillActive: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6', shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 2 },
  pillText: { fontSize: 14, fontWeight: '600', color: '#475569' },
  pillTextActive: { color: '#fff' },
  concContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  
  infoBox: { flexDirection: 'row', backgroundColor: '#F8FAFC', padding: 18, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  infoTextContainer: { marginLeft: 14, flex: 1 },
  infoTitle: { color: '#334155', fontWeight: '700', fontSize: 14 },
  infoSubtitle: { color: '#64748B', fontSize: 13, marginTop: 4, lineHeight: 18 },
  
  warningBox: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, borderWidth: 1 },
  warningText: { fontWeight: '600', fontSize: 13, marginLeft: 10, lineHeight: 18 },
  suggestionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#FDE68A', marginTop: 16 },
  suggestionBtnText: { color: '#92400E', fontWeight: '600', fontSize: 13, marginLeft: 10, flex: 1, lineHeight: 18 }
});
