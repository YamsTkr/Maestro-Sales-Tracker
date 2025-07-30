import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { Calculator, TrendingUp, CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react-native';

interface DailyData {
  portes: number;
  vus: number;
  closes: number;
  telephones: number;
  ventes: number;
}

interface FeedbackResult {
  message: string;
  type: 'success' | 'warning' | 'error';
  suggestions?: string[];
}

export default function MesChiffres() {
  const [data, setData] = useState<DailyData>({
    portes: 0,
    vus: 0,
    closes: 0,
    telephones: 0,
    ventes: 0,
  });

  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);

  const updateField = (field: keyof DailyData, value: string) => {
    setData(newData);
    
    // Génération automatique du feedback
    if (Object.values(newData).some(val => val > 0)) {
      setFeedback(getFeedback(newData));
    }
  };

  const getFeedback = (data: DailyData): FeedbackResult => {
    const { portes, vus, closes, telephones, ventes } = data;
    
    if (portes === 0) {
      return {
        message: "Commencez par saisir le nombre de portes visitées",
        type: 'warning'
      };
    }

    const tauxVus = vus / portes;
    const tauxCloses = closes / vus;
    const tauxTelephones = telephones / closes;
    const tauxVentes = ventes / telephones;

    let suggestions: string[] = [];
    let message = "";
    let type: 'success' | 'warning' | 'error' = 'success';

    // Analyse du taux de vus
    if (tauxVus < 0.3) {
      suggestions.push("Travaillez les créneaux horaires - trop de portes fermées");
      type = 'error';
    } else if (tauxVus < 0.5) {
      suggestions.push("Bon rythme, ajustez les horaires pour plus de présence");
      type = 'warning';
    }

    // Analyse du taux de closes
    if (tauxCloses < 0.4 && vus > 0) {
      suggestions.push("Travaillez votre accroche - trop de refus directs");
      type = 'error';
    } else if (tauxCloses < 0.6 && vus > 0) {
      suggestions.push("Bonne accroche, peaufinez l'argumentation");
      type = 'warning';
    }

    // Analyse du taux de téléphones
    if (tauxTelephones < 0.3 && closes > 0) {
      suggestions.push("Renforcez la collecte de téléphones - c'est la clé !");
      type = 'error';
    } else if (tauxTelephones < 0.5 && closes > 0) {
      suggestions.push("Bonne collecte, insistez sur l'importance du suivi");
      type = 'warning';
    }

    // Analyse du taux de ventes
    if (tauxVentes < 0.15 && telephones > 0) {
      suggestions.push("Travaillez vos relances et votre closing");
      type = 'error';
    } else if (tauxVentes < 0.25 && telephones > 0) {
      suggestions.push("Bon taux de conversion, continuez ainsi !");
      type = 'warning';
    }

    // Message principal
    if (suggestions.length === 0) {
      message = "Excellente performance ! Vous êtes sur la bonne voie 🎯";
      type = 'success';
    } else if (type === 'error') {
      message = "Des axes d'amélioration importants détectés";
    } else {
      message = "Bonne performance avec quelques ajustements possibles";
    }

    return { message, type, suggestions };
  };

  const calculateRates = () => {
    const { portes, vus, closes, telephones, ventes } = data;
    return {
      tauxVus: portes > 0 ? ((vus / portes) * 100).toFixed(1) : '0',
      tauxCloses: vus > 0 ? ((closes / vus) * 100).toFixed(1) : '0',
      tauxTelephones: closes > 0 ? ((telephones / closes) * 100).toFixed(1) : '0',
      tauxVentes: telephones > 0 ? ((ventes / telephones) * 100).toFixed(1) : '0',
    };
  };

  const rates = calculateRates();

  const saveData = () => {
    // Simulation de sauvegarde
    Alert.alert('Données sauvegardées', 'Vos chiffres ont été enregistrés avec succès !');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Calculator size={24} color="#3B82F6" />
        <Text style={styles.title}>Mes Chiffres</Text>
      </View>

      {/* Saisie des données */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Saisie du jour</Text>
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Nb de portes</Text>
            <TextInput
              style={styles.input}
              value={data.portes.toString()}
              onChangeText={(value) => updateField('portes', value)}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Nb de vus</Text>
            <TextInput
              style={styles.input}
              value={data.vus.toString()}
              onChangeText={(value) => updateField('vus', value)}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Nb de closes</Text>
            <TextInput
              style={styles.input}
              value={data.closes.toString()}
              onChangeText={(value) => updateField('closes', value)}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Nb de téléphones</Text>
            <TextInput
              style={styles.input}
              value={data.telephones.toString()}
              onChangeText={(value) => updateField('telephones', value)}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Nb de ventes</Text>
            <TextInput
              style={styles.input}
              value={data.ventes.toString()}
              onChangeText={(value) => updateField('ventes', value)}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>
        </View>
      </View>

      {/* Taux de transformation */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <TrendingUp size={20} color="#10B981" />
          <Text style={styles.cardTitle}>Taux de transformation</Text>
        </View>
        <View style={styles.ratesContainer}>
          <View style={styles.rateItem}>
            <Text style={styles.rateLabel}>Taux de vus</Text>
            <Text style={styles.rateValue}>{rates.tauxVus}%</Text>
          </View>
          <View style={styles.rateItem}>
            <Text style={styles.rateLabel}>Taux de closes</Text>
            <Text style={styles.rateValue}>{rates.tauxCloses}%</Text>
          </View>
          <View style={styles.rateItem}>
            <Text style={styles.rateLabel}>Taux de téléphones</Text>
            <Text style={styles.rateValue}>{rates.tauxTelephones}%</Text>
          </View>
          <View style={styles.rateItem}>
            <Text style={styles.rateLabel}>Taux de ventes</Text>
            <Text style={styles.rateValue}>{rates.tauxVentes}%</Text>
          </View>
        </View>
      </View>

      {/* Feedback intelligent */}
      {feedback && (
        <View style={[styles.card, styles.feedbackCard]}>
          <View style={styles.feedbackHeader}>
            {feedback.type === 'success' && <CheckCircle size={20} color="#10B981" />}
            {feedback.type === 'warning' && <AlertCircle size={20} color="#F59E0B" />}
            {feedback.type === 'error' && <AlertCircle size={20} color="#EF4444" />}
            <Text style={[styles.feedbackTitle, { color: getFeedbackColor(feedback.type) }]}>
              Analyse intelligente
            </Text>
          </View>
          <Text style={styles.feedbackMessage}>{feedback.message}</Text>
          {feedback.suggestions && feedback.suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>Recommandations :</Text>
              {feedback.suggestions.map((suggestion, index) => (
                <Text key={index} style={styles.suggestion}>• {suggestion}</Text>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Bouton de sauvegarde */}
      <TouchableOpacity style={styles.saveButton} onPress={saveData}>
        <Text style={styles.saveButtonText}>Sauvegarder les données</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const getFeedbackColor = (type: string) => {
  switch (type) {
    case 'success': return '#10B981';
    case 'warning': return '#F59E0B';
    case 'error': return '#EF4444';
    default: return '#6B7280';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  inputContainer: {
    gap: 16,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    minWidth: 80,
    textAlign: 'center',
  },
  ratesContainer: {
    gap: 12,
  },
  rateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rateLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  rateValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  feedbackCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  feedbackMessage: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
  },
  suggestionsContainer: {
    marginTop: 8,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  suggestion: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});