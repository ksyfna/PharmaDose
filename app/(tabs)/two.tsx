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
    <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Activity color="#10B981" size={32} />
            </View>
            <Text style={styles.title}>Renal Adjustment</Text>
          </View>

          {/* HERO CARD (RESULTS) */}
          {result && (
            <LinearGradient 
              colors={result.status === 'CONTRAINDICATED' ? ['#FEF2F2', '#FEE2E2'] : ['#ECFDF5', '#D1FAE5']} 
              style={[styles.heroCard, { borderColor: result.status === 'CONTRAINDICATED' ? '#FECACA' : '#A7F3D0', shadowColor: result.status === 'CONTRAINDICATED' ? '#EF4444' : '#10B981' }]}
            >
              <Text style={styles.resultTitle}>Dosing Recommendation</Text>

              <View style={styles.resultHeaderRow}>
                {result.icon === 'ShieldAlert' && <ShieldAlert color={result.color} size={36} />}
                {result.icon === 'AlertTriangle' && <AlertTriangle color={result.color} size={36} />}
                {result.icon === 'CheckCircle' && <CheckCircle color={result.color} size={36} />}
                <Text style={[styles.resultStatus, { color: result.color }]}>{result.status}</Text>
              </View>
              
              <View style={[styles.divider, { backgroundColor: result.color + '40' }]} />
              
              <Text style={[styles.resultMsg, result.status === 'CONTRAINDICATED' && { color: '#B91C1C', fontWeight: '700' }]}>{result.msg}</Text>
            </LinearGradient>
          )}

          {/* INPUT CARD */}
          <View style={styles.neumorphicCard}>

            <View style={styles.typeSelector}>
              <TouchableOpacity style={[styles.typeBtn, patientType === 'adult' && styles.typeBtnActive]} onPress={() => setPatientType('adult')}>
                <User color={patientType === 'adult' ? '#fff' : '#64748B'} size={20} />
                <Text style={[styles.typeBtnText, patientType === 'adult' && styles.typeBtnTextActive]}>Adult (CG)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.typeBtn, patientType === 'pediatric' && styles.typeBtnActive]} onPress={() => setPatientType('pediatric')}>
                <Baby color={patientType === 'pediatric' ? '#fff' : '#64748B'} size={20} />
                <Text style={[styles.typeBtnText, patientType === 'pediatric' && styles.typeBtnTextActive]}>Pediatric (Schwartz)</Text>
              </TouchableOpacity>
            </View>

            {patientType === 'adult' ? (
              <View>
                <View style={styles.row}>
                  <View style={styles.flexHalf}>
                    <Text style={styles.label}>Age (yrs)</Text>
                    <TextInput style={styles.input} keyboardType="numeric" placeholder="e.g. 65" value={age} onChangeText={setAge} placeholderTextColor="#94A3B8" />
                  </View>
                  <View style={styles.flexHalf}>
                    <Text style={styles.label}>Weight (kg)</Text>
                    <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="e.g. 70" value={weight} onChangeText={setWeight} placeholderTextColor="#94A3B8" />
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
                <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="e.g. 110" value={height} onChangeText={setHeight} placeholderTextColor="#94A3B8" />
              </View>
            )}

            <Text style={styles.label}>Serum Creatinine (µmol/L)</Text>
            <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="e.g. 120" value={scr} onChangeText={setScr} placeholderTextColor="#94A3B8" />

            {calculatedCrcl !== null && crclStatus && (
              <View style={[styles.crclBox, { backgroundColor: crclStatus.bg, borderColor: crclStatus.color }]}>
                <View style={styles.crclHeaderRow}>
                  <Calculator color={crclStatus.color} size={24} />
                  <Text style={[styles.crclValue, { color: crclStatus.color }]}>CrCl: {calculatedCrcl.toFixed(1)} <Text style={styles.crclUnit}>mL/min</Text></Text>
                </View>
                <View style={[styles.crclDivider, { backgroundColor: crclStatus.color + '33' }]} />
                <View style={styles.crclStatusRow}>
                  <Text style={[styles.crclStatusLabel, { color: crclStatus.color }]}>{crclStatus.label}</Text>
                  <Text style={[styles.crclStatusMsg, { color: '#475569' }]}>{crclStatus.msg}</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.neumorphicCard}>
            <Text style={styles.label}>Select Medication for Adjustment</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.drugSelector}>
              {RENAL_DRUGS.map((drug) => (
                <TouchableOpacity key={drug.id} style={[styles.pill, selectedDrug.id === drug.id && styles.pillActive]} onPress={() => setSelectedDrug(drug)}>
                  <Text style={[styles.pillText, selectedDrug.id === drug.id && styles.pillTextActive]}>{drug.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {!result && (
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
  iconContainer: { width: 64, height: 64, borderRadius: 24, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 12, shadowColor: '#10B981', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 5 },
  title: { fontSize: 26, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
  
  heroCard: { borderRadius: 28, padding: 24, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.2, shadowRadius: 24, elevation: 8, marginBottom: 24, borderWidth: 1 },
  resultTitle: { fontSize: 16, fontWeight: '700', color: '#475569', marginBottom: 16, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 },
  resultHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  resultStatus: { fontWeight: '900', fontSize: 26, marginLeft: 16, flexShrink: 1, textAlign: 'center' },
  divider: { height: 1, marginVertical: 18 },
  resultMsg: { fontSize: 16, color: '#334155', lineHeight: 24, fontWeight: '600', textAlign: 'center' },
  
  neumorphicCard: { backgroundColor: '#fff', borderRadius: 28, padding: 24, shadowColor: '#64748B', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 4, marginBottom: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  typeSelector: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 16, padding: 6, marginBottom: 24, borderWidth: 1, borderColor: '#E2E8F0' },
  typeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, gap: 8 },
  typeBtnActive: { backgroundColor: '#10B981', shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  typeBtnText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  typeBtnTextActive: { color: '#fff' },
  row: { flexDirection: 'row', gap: 14, marginBottom: 16 },
  flexHalf: { flex: 1 },
  label: { fontSize: 14, fontWeight: '600', color: '#64748B', marginBottom: 10 },
  input: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, fontSize: 16, color: '#0F172A', borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20, fontWeight: '600' },
  genderRow: { flexDirection: 'row', gap: 14, marginBottom: 24 },
  genderBtn: { flex: 1, paddingVertical: 14, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', backgroundColor: '#F8FAFC' },
  genderBtnActive: { backgroundColor: '#ECFDF5', borderColor: '#34D399', shadowColor: '#34D399', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 1 },
  genderBtnText: { fontSize: 15, fontWeight: '600', color: '#64748B' },
  genderBtnTextActive: { color: '#059669' },
  crclBox: { marginTop: 4, padding: 20, borderRadius: 20, borderWidth: 2 },
  crclHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  crclValue: { fontSize: 30, fontWeight: '900' },
  crclUnit: { fontSize: 14, fontWeight: '600' },
  crclDivider: { height: 1, marginVertical: 14 },
  crclStatusRow: { flexDirection: 'column', gap: 6 },
  crclStatusLabel: { fontSize: 18, fontWeight: '800' },
  crclStatusMsg: { fontSize: 14, fontWeight: '500' },
  drugSelector: { flexDirection: 'row', marginBottom: 10 },
  
  pill: { paddingHorizontal: 18, paddingVertical: 12, backgroundColor: '#F8FAFC', borderRadius: 16, marginRight: 10, borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center', gap: 6 },
  pillActive: { backgroundColor: '#10B981', borderColor: '#10B981', shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 2 },
  pillText: { fontSize: 14, fontWeight: '600', color: '#475569' },
  pillTextActive: { color: '#fff' },
  
  placeholderBox: { backgroundColor: '#F8FAFC', padding: 24, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed', marginTop: 12 },
  placeholderText: { color: '#94A3B8', fontSize: 15, fontWeight: '500', textAlign: 'center' }
});
