import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Activity, ShieldAlert, CheckCircle, AlertTriangle, Calculator, User, Baby } from 'lucide-react-native';

const RENAL_DRUGS = [
  { id: 'metformin', name: 'Metformin',
    calculate: (crcl: number) => {
      if (crcl < 30) return { status: 'CONTRAINDICATED', color: '#EF4444', icon: 'ShieldAlert', msg: 'Do not use. Contraindicated if CrCl < 30 mL/min.' };
      if (crcl >= 30 && crcl <= 44) return { status: 'Reduce Dose', color: '#F97316', icon: 'AlertTriangle', msg: 'Reduce dose by 50%.' };
      return { status: 'Safe to Use', color: '#10B981', icon: 'CheckCircle', msg: 'No dosage adjustment required.' };
    }
  },
  { id: 'gabapentin', name: 'Gabapentin',
    calculate: (crcl: number) => {
      if (crcl < 15) return { status: 'Reduce Dose 90%', color: '#F97316', icon: 'AlertTriangle', msg: 'Reduce dose by 90% (Max 300mg/day).' };
      if (crcl >= 15 && crcl <= 29) return { status: 'Reduce Dose 75%', color: '#F97316', icon: 'AlertTriangle', msg: 'Reduce dose by 75% (Max 600mg/day).' };
      if (crcl >= 30 && crcl <= 49) return { status: 'Reduce Dose 50%', color: '#EAB308', icon: 'AlertTriangle', msg: 'Reduce dose by 50% (Max 900mg/day).' };
      return { status: 'Safe to Use', color: '#10B981', icon: 'CheckCircle', msg: 'No specific dosage adjustment required.' };
    }
  },
  { id: 'oseltamivir', name: 'Oseltamivir',
    calculate: (crcl: number) => {
      if (crcl < 10) return { status: 'Adjust Dose', color: '#EF4444', icon: 'ShieldAlert', msg: '30mg EOD (Every other day).' };
      if (crcl >= 11 && crcl <= 30) return { status: 'Adjust Dose', color: '#F97316', icon: 'AlertTriangle', msg: '30mg OD.' };
      if (crcl >= 31 && crcl <= 60) return { status: 'Adjust Dose', color: '#EAB308', icon: 'AlertTriangle', msg: '30mg BD.' };
      return { status: 'Standard Dose', color: '#10B981', icon: 'CheckCircle', msg: '75mg BD.' };
    }
  },
  { id: 'nsaids', name: 'NSAIDs',
    calculate: (crcl: number) => {
      if (crcl <= 30) return { status: 'CONTRAINDICATED', color: '#EF4444', icon: 'ShieldAlert', msg: 'Contraindicated if CrCl <= 30 mL/min.' };
      if (crcl <= 89) return { status: 'Caution: AKI Risk', color: '#F97316', icon: 'AlertTriangle', msg: 'Caution: Risk of Acute Kidney Injury (AKI). Use shortest duration possible.' };
      return { status: 'Safe to Use', color: '#10B981', icon: 'CheckCircle', msg: 'Ensure adequate hydration.' };
    }
  }
];

export default function RenalScreen() {
  const [patientType, setPatientType] = useState<'adult' | 'pediatric'>('adult');
  
  // Adult inputs
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  
  // Pediatric inputs
  const [height, setHeight] = useState('');

  // Shared
  const [scr, setScr] = useState(''); // in µmol/L
  const [selectedDrug, setSelectedDrug] = useState(RENAL_DRUGS[0]);

  let calculatedCrcl: number | null = null;
  const scrVal = parseFloat(scr);

  if (scrVal > 0) {
    const scrMgDl = scrVal / 88.4; // Convert µmol/L to mg/dL
    
    if (patientType === 'adult') {
      const a = parseFloat(age);
      const w = parseFloat(weight);
      if (a > 0 && w > 0) {
        // Cockcroft-Gault
        calculatedCrcl = ((140 - a) * w * (gender === 'female' ? 0.85 : 1)) / (72 * scrMgDl);
      }
    } else {
      const h = parseFloat(height);
      if (h > 0) {
        // Bedside Schwartz
        calculatedCrcl = (0.413 * h) / scrMgDl;
      }
    }
  }

  const result = calculatedCrcl !== null ? selectedDrug.calculate(calculatedCrcl) : null;

  const getCrclStatus = (crcl: number) => {
    if (crcl >= 90) return { label: 'Normal', color: '#10B981', bg: '#D1FAE5', msg: 'No adjustment needed.' }; // Green
    if (crcl >= 60) return { label: 'Mild Decrease', color: '#EAB308', bg: '#FEF9C3', msg: 'Safe, but monitor function.' }; // Yellow
    if (crcl >= 30) return { label: 'Moderate (CKD 3)', color: '#F97316', bg: '#FFEDD5', msg: 'Reduce Dose / Increase Interval.' }; // Orange
    if (crcl >= 15) return { label: 'Severe (CKD 4)', color: '#EF4444', bg: '#FEE2E2', msg: 'Avoid Nephrotoxic Drugs / Specialist Consult.' }; // Red
    return { label: 'Kidney Failure', color: '#B91C1C', bg: '#FEF2F2', msg: 'Avoid Nephrotoxic Drugs / Specialist Consult.' }; // Dark Red
  };

  const crclStatus = calculatedCrcl !== null ? getCrclStatus(calculatedCrcl) : null;

  return (
    <LinearGradient colors={['#F0FDF4', '#DCFCE7']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Activity color="#16A34A" size={32} />
            </View>
            <Text style={styles.title}>Renal Adjustment</Text>
            <Text style={styles.subtitle}>CrCl Dashboard</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[styles.typeBtn, patientType === 'adult' && styles.typeBtnActive]}
                onPress={() => setPatientType('adult')}
              >
                <User color={patientType === 'adult' ? '#fff' : '#4B5563'} size={20} />
                <Text style={[styles.typeBtnText, patientType === 'adult' && styles.typeBtnTextActive]}>Adult (CG)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeBtn, patientType === 'pediatric' && styles.typeBtnActive]}
                onPress={() => setPatientType('pediatric')}
              >
                <Baby color={patientType === 'pediatric' ? '#fff' : '#4B5563'} size={20} />
                <Text style={[styles.typeBtnText, patientType === 'pediatric' && styles.typeBtnTextActive]}>Pediatric (Schwartz)</Text>
              </TouchableOpacity>
            </View>

            {patientType === 'adult' ? (
              <View>
                <View style={styles.row}>
                  <View style={styles.flexHalf}>
                    <Text style={styles.label}>Age (yrs)</Text>
                    <TextInput style={styles.input} keyboardType="numeric" placeholder="e.g. 65" value={age} onChangeText={setAge} />
                  </View>
                  <View style={styles.flexHalf}>
                    <Text style={styles.label}>Weight (kg)</Text>
                    <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="e.g. 70" value={weight} onChangeText={setWeight} />
                  </View>
                </View>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderRow}>
                  <TouchableOpacity style={[styles.genderBtn, gender === 'male' && styles.genderBtnActive]} onPress={() => setGender('male')}>
                    <Text style={[styles.genderBtnText, gender === 'male' && styles.genderBtnTextActive]}>Male</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.genderBtn, gender === 'female' && styles.genderBtnActive]} onPress={() => setGender('female')}>
                    <Text style={[styles.genderBtnText, gender === 'female' && styles.genderBtnTextActive]}>Female</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View>
                <Text style={styles.label}>Height (cm)</Text>
                <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="e.g. 110" value={height} onChangeText={setHeight} />
              </View>
            )}

            <Text style={styles.label}>Serum Creatinine (µmol/L)</Text>
            <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="e.g. 120" value={scr} onChangeText={setScr} />

            {calculatedCrcl !== null && crclStatus && (
              <View style={[styles.crclBox, { backgroundColor: crclStatus.bg, borderColor: crclStatus.color }]}>
                <View style={styles.crclHeaderRow}>
                  <Calculator color={crclStatus.color} size={24} />
                  <Text style={[styles.crclValue, { color: crclStatus.color }]}>CrCl: {calculatedCrcl.toFixed(1)} <Text style={styles.crclUnit}>mL/min</Text></Text>
                </View>
                <View style={[styles.crclDivider, { backgroundColor: crclStatus.color + '33' }]} />
                <View style={styles.crclStatusRow}>
                  <Text style={[styles.crclStatusLabel, { color: crclStatus.color }]}>{crclStatus.label}</Text>
                  <Text style={[styles.crclStatusMsg, { color: '#4B5563' }]}>{crclStatus.msg}</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Select Medication for Adjustment</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.drugSelector}>
              {RENAL_DRUGS.map((drug) => (
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

            {result ? (
              <View style={[styles.resultCard, { borderColor: result.color, backgroundColor: result.status === 'CONTRAINDICATED' ? '#FEF2F2' : '#fff' }]}>
                <View style={styles.resultHeaderRow}>
                  {result.icon === 'ShieldAlert' && <ShieldAlert color={result.color} size={32} />}
                  {result.icon === 'AlertTriangle' && <AlertTriangle color={result.color} size={32} />}
                  {result.icon === 'CheckCircle' && <CheckCircle color={result.color} size={32} />}
                  <Text style={[styles.resultStatus, { color: result.color, fontSize: result.status === 'CONTRAINDICATED' ? 22 : 20 }]}>{result.status}</Text>
                </View>
                <View style={[styles.divider, { backgroundColor: result.color + '33' }]} />
                <Text style={[styles.resultMsg, result.status === 'CONTRAINDICATED' && { color: '#B91C1C', fontWeight: '700' }]}>{result.msg}</Text>
              </View>
            ) : (
               <View style={styles.placeholderBox}>
                  <Text style={styles.placeholderText}>Enter patient parameters to see dose adjustments.</Text>
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
  iconContainer: { width: 64, height: 64, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 12, shadowColor: '#16A34A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 5 },
  title: { fontSize: 28, fontWeight: '800', color: '#1F2937', letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, marginBottom: 20 },
  typeSelector: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 12, padding: 4, marginBottom: 20 },
  typeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 8, gap: 6 },
  typeBtnActive: { backgroundColor: '#16A34A', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  typeBtnText: { fontSize: 14, fontWeight: '600', color: '#4B5563' },
  typeBtnTextActive: { color: '#fff' },
  row: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  flexHalf: { flex: 1 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 14, fontSize: 16, color: '#1F2937', borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 16 },
  genderRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  genderBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', backgroundColor: '#F9FAFB' },
  genderBtnActive: { backgroundColor: '#DCFCE7', borderColor: '#22C55E' },
  genderBtnText: { fontSize: 15, fontWeight: '600', color: '#4B5563' },
  genderBtnTextActive: { color: '#15803D' },
  crclBox: { marginTop: 8, padding: 16, borderRadius: 16, borderWidth: 2 },
  crclHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  crclValue: { fontSize: 26, fontWeight: '800' },
  crclUnit: { fontSize: 14, fontWeight: '600' },
  crclDivider: { height: 1, marginVertical: 12 },
  crclStatusRow: { flexDirection: 'column', gap: 4 },
  crclStatusLabel: { fontSize: 16, fontWeight: '700' },
  crclStatusMsg: { fontSize: 14, fontWeight: '500' },
  drugSelector: { flexDirection: 'row', marginBottom: 16 },
  drugPill: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#F3F4F6', borderRadius: 20, marginRight: 10 },
  drugPillActive: { backgroundColor: '#16A34A' },
  drugPillText: { fontSize: 14, fontWeight: '600', color: '#4B5563' },
  drugPillTextActive: { color: '#fff' },
  resultCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 2, marginTop: 8 },
  resultHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  resultStatus: { fontWeight: '800', marginLeft: 12, flexShrink: 1 },
  divider: { height: 1, marginVertical: 16 },
  resultMsg: { fontSize: 15, color: '#374151', lineHeight: 22, fontWeight: '500' },
  placeholderBox: { backgroundColor: '#F9FAFB', padding: 20, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderStyle: 'dashed', marginTop: 8 },
  placeholderText: { color: '#9CA3AF', fontSize: 14, fontWeight: '500', textAlign: 'center' }
});
