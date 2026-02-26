import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Activity, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react-native';

const RENAL_DRUGS = [
  { id: 'metformin', name: 'Metformin',
    calculate: (crcl: number) => {
      if (crcl < 30) return { status: 'CONTRAINDICATED', color: '#EF4444', icon: 'ShieldAlert', msg: 'Do not use. Contraindicated if CrCl < 30 mL/min.' };
      if (crcl >= 30 && crcl <= 44) return { status: 'Reduce Dose', color: '#F59E0B', icon: 'AlertTriangle', msg: 'Reduce dose by 50%.' };
      return { status: 'Safe to Use', color: '#10B981', icon: 'CheckCircle', msg: 'No dosage adjustment required.' };
    }
  },
  { id: 'gabapentin', name: 'Gabapentin',
    calculate: (crcl: number) => {
      if (crcl < 15) return { status: 'Reduce Dose 90%', color: '#F59E0B', icon: 'AlertTriangle', msg: 'Reduce dose by 90% (Max 300mg/day).' };
      if (crcl >= 15 && crcl <= 29) return { status: 'Reduce Dose 75%', color: '#F59E0B', icon: 'AlertTriangle', msg: 'Reduce dose by 75% (Max 600mg/day).' };
      if (crcl >= 30 && crcl <= 49) return { status: 'Reduce Dose 50%', color: '#F59E0B', icon: 'AlertTriangle', msg: 'Reduce dose by 50% (Max 900mg/day).' };
      return { status: 'Safe to Use', color: '#10B981', icon: 'CheckCircle', msg: 'No specific dosage adjustment required.' };
    }
  },
  { id: 'oseltamivir', name: 'Oseltamivir (Renal)',
    calculate: (crcl: number) => {
      if (crcl < 10) return { status: 'Adjust Dose', color: '#F59E0B', icon: 'AlertTriangle', msg: '30mg EOD (Every other day).' };
      if (crcl >= 11 && crcl <= 30) return { status: 'Adjust Dose', color: '#F59E0B', icon: 'AlertTriangle', msg: '30mg OD.' };
      if (crcl >= 31 && crcl <= 60) return { status: 'Adjust Dose', color: '#F59E0B', icon: 'AlertTriangle', msg: '30mg BD.' };
      return { status: 'Standard Dose', color: '#10B981', icon: 'CheckCircle', msg: '75mg BD.' };
    }
  },
  { id: 'nsaids', name: 'NSAIDs & Fenofibrate',
    calculate: (crcl: number) => {
      if (crcl <= 30) return { status: 'CONTRAINDICATED', color: '#EF4444', icon: 'ShieldAlert', msg: 'Contraindicated if CrCl <= 30 mL/min.' };
      return { status: 'Safe to Use', color: '#10B981', icon: 'CheckCircle', msg: 'Monitor renal function.' };
    }
  }
];

export default function RenalScreen() {
  const [crcl, setCrcl] = useState('');
  const [selectedDrug, setSelectedDrug] = useState(RENAL_DRUGS[0]);
  const [result, setResult] = useState<any>(null);

  const calculateAdjustment = () => {
    const value = parseFloat(crcl);
    if (!value || isNaN(value) || value <= 0) {
      setResult(null);
      return;
    }
    setResult(selectedDrug.calculate(value));
  };

  React.useEffect(() => {
    calculateAdjustment();
  }, [crcl, selectedDrug]);

  return (
    <LinearGradient colors={['#F0FDF4', '#DCFCE7']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Activity color="#16A34A" size={32} />
            </View>
            <Text style={styles.title}>Renal Adjustment</Text>
            <Text style={styles.subtitle}>Verified Adult CKD Rules</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Creatinine Clearance (CrCl) mL/min</Text>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              placeholder="e.g. 25"
              value={crcl}
              onChangeText={setCrcl}
              placeholderTextColor="#A1A1AA"
            />

            <Text style={styles.label}>Select Medication</Text>
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
          </View>

          {result && (
            <View style={[styles.resultCard, { borderColor: result.color, backgroundColor: result.status === 'CONTRAINDICATED' ? '#FEF2F2' : '#fff' }]}>
              <View style={styles.resultHeaderRow}>
                {result.icon === 'ShieldAlert' && <ShieldAlert color={result.color} size={32} />}
                {result.icon === 'AlertTriangle' && <AlertTriangle color={result.color} size={32} />}
                {result.icon === 'CheckCircle' && <CheckCircle color={result.color} size={32} />}
                <Text style={[styles.resultStatus, { color: result.color, fontSize: result.status === 'CONTRAINDICATED' ? 24 : 22 }]}>{result.status}</Text>
              </View>
              
              <View style={[styles.divider, { backgroundColor: result.color + '33' }]} />
              
              <Text style={[styles.resultMsg, result.status === 'CONTRAINDICATED' && { color: '#B91C1C', fontWeight: '700' }]}>{result.msg}</Text>
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
    shadowColor: '#16A34A',
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
    marginBottom: 10,
  },
  drugPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginRight: 10,
  },
  drugPillActive: {
    backgroundColor: '#16A34A',
  },
  drugPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  drugPillTextActive: {
    color: '#fff',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
    borderWidth: 2,
  },
  resultHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultStatus: {
    fontWeight: '800',
    marginLeft: 12,
    flexShrink: 1,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  resultMsg: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    fontWeight: '500',
  }
});
