import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Network, Lock } from 'lucide-react-native';

export default function MonReseau() {
  const showComingSoon = () => {
    Alert.alert(
      'Fonctionnalité à venir',
      'Le module "Mon Réseau" sera disponible dans la version 2.0 de l\'application.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Network size={24} color="#9CA3AF" />
        <Text style={styles.title}>Mon Réseau</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.comingSoonContainer}>
          <Lock size={64} color="#9CA3AF" />
          <Text style={styles.comingSoonTitle}>Module en développement</Text>
          <Text style={styles.comingSoonDescription}>
            La gestion de réseau sera disponible dans la prochaine version pour les franchisés (COD6+).
          </Text>
          <Text style={styles.comingSoonFeatures}>
            Fonctionnalités à venir :
          </Text>
          <View style={styles.featuresList}>
            <Text style={styles.featureItem}>• Gestion des utilisateurs</Text>
            <Text style={styles.featureItem}>• Suivi des performances d'équipe</Text>
            <Text style={styles.featureItem}>• Administration des niveaux</Text>
            <Text style={styles.featureItem}>• Désignation d'administrateurs</Text>
            <Text style={styles.featureItem}>• Tableaux de bord d'équipe</Text>
          </View>
          
          <TouchableOpacity style={styles.notifyButton} onPress={showComingSoon}>
            <Text style={styles.notifyButtonText}>Me notifier</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

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
    color: '#9CA3AF',
    marginLeft: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  comingSoonContainer: {
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B7280',
    textAlign: 'center',
  },
  comingSoonDescription: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
  },
  comingSoonFeatures: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  featuresList: {
    gap: 8,
    alignItems: 'flex-start',
  },
  featureItem: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  notifyButton: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  notifyButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
});