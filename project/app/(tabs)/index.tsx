import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { TrendingUp, Target, Calendar, Award, ChevronRight, Calculator, User, Settings } from 'lucide-react-native';
import { router } from 'expo-router';
import { usePlanning } from '@/hooks/usePlanning';
import { useUser } from '@/contexts/UserContext';

export default function Dashboard() {
  const { 
    getDailyObjectives, 
    getWeeklyObjectives, 
    getCurrentDay, 
    getWorkingDays,
    getMonthlyProgress,
    getQuarterlyProgress,
    getProgressColor,
    getMotivationalMessage
  } = usePlanning();
  const { userProfile, setUserProfile, levels, getLevelColor } = useUser();
  
  const dailyProgress = {
    vus: 18,
    closes: 12,
    telephones: 6,
    ventes: 1
  };
  
  const weeklyProgress = {
    vus: 19, // Moyenne journalière
    closes: 12, // Moyenne journalière
    telephones: 6, // Moyenne journalière
    ventes: 7
  };
  
  const yesterdayScore = 8.5;

  // Récupération des objectifs depuis le planning
  const dailyGoals = getDailyObjectives();
  const weeklyGoals = getWeeklyObjectives();
  const currentDay = getCurrentDay();
  const workingDays = getWorkingDays();

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const navigateToModule = (module: string) => {
    // Vérification des permissions selon le niveau
    if (module === 'cartes') {
      Alert.alert('Module indisponible', 'Cette fonctionnalité sera disponible dans la version 2.0 de l\'application.');
      return;
    }
    
    if (module === 'reseau' && userProfile.level !== 'COD6+') {
      Alert.alert(
        'Accès restreint', 
        'Le module "Mon Réseau" est réservé aux franchisés (COD6+). Changez votre niveau pour y accéder.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    if (module === 'reseau' && userProfile.level === 'COD6+') {
      Alert.alert('Module indisponible', 'Cette fonctionnalité sera disponible dans la version 2.0 de l\'application.');
      return;
    }
    
    router.push(`/(tabs)/${module}`);
  };

  const changeUserLevel = () => {
    if (userProfile.level !== 'COD6+') {
      Alert.alert(
        'Accès restreint',
        'Seuls les franchisés (COD6+) peuvent changer de niveau pour simuler les vues des autres utilisateurs.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Simuler un niveau d\'accès',
      'En tant que franchisé, vous pouvez simuler la vue des autres niveaux :',
      levels.map(level => ({
        text: `${level.code} - ${level.name}`,
        onPress: () => {
          setUserProfile(prev => ({
            ...prev,
            level: level.code,
            levelName: level.name
          }));
          Alert.alert(
            level.code === 'COD6+' ? 'Retour au niveau franchisé' : 'Simulation activée',
            level.code === 'COD6+' 
              ? `Vous êtes de retour à votre niveau franchisé (${level.code})\n\n${level.description}`
              : `Vous simulez maintenant la vue ${level.name} (${level.code})\n\n${level.description}\n\n💡 Vous pouvez revenir à votre niveau franchisé à tout moment.`,
            [{ text: 'OK' }]
          );
        }
      })).concat([{ text: 'Annuler', style: 'cancel' }])
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Bonjour</Text>
          <Text style={styles.nameText}>{userProfile.firstName}</Text>
          <Text style={styles.levelNameText}>{userProfile.levelName}</Text>
        </View>
        <View style={styles.profileActions}>
          <TouchableOpacity 
            style={[
              styles.levelBadge, 
              { backgroundColor: getLevelColor(userProfile.level) },
              userProfile.level !== 'COD6+' && styles.levelBadgeDisabled
            ]}
            onPress={userProfile.level === 'COD6+' ? changeUserLevel : () => {
              Alert.alert(
                'Fonction non disponible',
                'Seuls les franchisés peuvent changer de niveau d\'accès.',
                [{ text: 'OK' }]
              );
            }}
          >
            <Text style={styles.levelText}>{userProfile.level}</Text>
            {userProfile.level === 'COD6+' && (
              <Text style={styles.levelSubtext}>Tap pour simuler</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Informations de niveau */}
      <View style={styles.levelInfoCard}>
        <View style={styles.levelInfoHeader}>
          <User size={20} color="#3B82F6" />
          <Text style={styles.levelInfoTitle}>
            {userProfile.level === 'COD6+' ? 'Niveau d\'accès (Simulation)' : 'Niveau d\'accès'}
          </Text>
          <TouchableOpacity 
            onPress={userProfile.level === 'COD6+' ? changeUserLevel : () => {
              Alert.alert(
                'Fonction non disponible',
                'Seuls les franchisés peuvent changer de niveau d\'accès.',
                [{ text: 'OK' }]
              );
            }} 
            style={[
              styles.changeLevelButton,
              userProfile.level !== 'COD6+' && styles.changeLevelButtonDisabled
            ]}
          >
            <Settings size={16} color={userProfile.level === 'COD6+' ? "#6B7280" : "#D1D5DB"} />
            <Text style={[
              styles.changeLevelText,
              userProfile.level !== 'COD6+' && styles.changeLevelTextDisabled
            ]}>
              {userProfile.level === 'COD6+' ? 'Simuler' : 'Changer'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.levelDescription}>
          {levels.find(l => l.code === userProfile.level)?.description || 'Description non disponible'}
        </Text>
        {userProfile.level === 'COD6+' ? (
          <Text style={styles.franchiseNote}>
            🎯 En tant que franchisé, vous avez accès au module "Mon Réseau" pour gérer votre équipe.
            Vous pouvez également simuler les vues des autres niveaux.
          </Text>
        ) : (
          <Text style={styles.simulationNote}>
            🔄 Mode simulation activé - Vous visualisez l'interface d'un utilisateur {userProfile.levelName}.
            Cliquez sur "Simuler" pour revenir à votre niveau franchisé.
          </Text>
        )}
      </View>

      {/* Daily Objectives */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Target size={20} color="#3B82F6" />
          <Text style={styles.cardTitle}>Objectifs du jour ({currentDay})</Text>
        </View>
        <View style={styles.objectivesContainer}>
          <View style={styles.objectiveItem}>
            <Text style={styles.objectiveLabel}>Vus</Text>
            <Text style={styles.objectiveValue}>{dailyGoals.vus}</Text>
          </View>
          <View style={styles.objectiveItem}>
            <Text style={styles.objectiveLabel}>Closes</Text>
            <Text style={styles.objectiveValue}>{dailyGoals.closes}</Text>
          </View>
          <View style={styles.objectiveItem}>
            <Text style={styles.objectiveLabel}>Téléphones</Text>
            <Text style={styles.objectiveValue}>{dailyGoals.telephones}</Text>
          </View>
          <View style={styles.objectiveItem}>
            <Text style={styles.objectiveLabel}>Ventes</Text>
            <Text style={styles.objectiveValue}>{dailyGoals.ventes}</Text>
          </View>
        </View>
      </View>

      {/* Weekly Objectives */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Calendar size={20} color="#3B82F6" />
          <Text style={styles.cardTitle}>Objectifs hebdomadaires ({workingDays.length} jours travaillés)</Text>
        </View>
        <View style={styles.weeklyStats}>
          <View style={styles.weeklyItem}>
            <Text style={styles.weeklyLabel}>Vus/jour</Text>
            <Text style={styles.weeklyValue}>{weeklyProgress.vus}/{weeklyGoals.vus}</Text>
            <Text style={styles.weeklyPercentage}>
              {Math.round(getProgressPercentage(weeklyProgress.vus, weeklyGoals.vus))}%
            </Text>
          </View>
          <View style={styles.weeklyItem}>
            <Text style={styles.weeklyLabel}>Closes/jour</Text>
            <Text style={styles.weeklyValue}>{weeklyProgress.closes}/{weeklyGoals.closes}</Text>
            <Text style={styles.weeklyPercentage}>
              {Math.round(getProgressPercentage(weeklyProgress.closes, weeklyGoals.closes))}%
            </Text>
          </View>
          <View style={styles.weeklyItem}>
            <Text style={styles.weeklyLabel}>Tél./jour</Text>
            <Text style={styles.weeklyValue}>{weeklyProgress.telephones}/{weeklyGoals.telephones}</Text>
            <Text style={styles.weeklyPercentage}>
              {Math.round(getProgressPercentage(weeklyProgress.telephones, weeklyGoals.telephones))}%
            </Text>
          </View>
          <View style={styles.weeklyItem}>
            <Text style={styles.weeklyLabel}>Ventes (total)</Text>
            <Text style={styles.weeklyValue}>{weeklyProgress.ventes}/{weeklyGoals.ventes}</Text>
            <Text style={styles.weeklyPercentage}>
              {Math.round(getProgressPercentage(weeklyProgress.ventes, weeklyGoals.ventes))}%
            </Text>
          </View>
        </View>
      </View>

      {/* Performance */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Award size={20} color="#3B82F6" />
          <Text style={styles.cardTitle}>Performance</Text>
        </View>
        <View style={styles.performanceContainer}>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Score d'hier</Text>
            <Text style={styles.performanceValue}>{yesterdayScore}/10</Text>
          </View>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Progression hebdomadaire</Text>
            <Text style={styles.performanceValue}>
              {Math.round(getProgressPercentage(weeklyProgress.ventes, weeklyGoals.ventes))}%
            </Text>
          </View>
        </View>
      </View>

      {/* Objectifs Mensuels - Aperçu */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Target size={20} color="#10B981" />
          <Text style={styles.cardTitle}>Objectifs Mensuels</Text>
        </View>
        <View style={styles.monthlyOverview}>
          {[
            { key: 'vus', label: 'Vus', emoji: '👥' },
            { key: 'closes', label: 'Closes', emoji: '🤝' },
            { key: 'telephones', label: 'Téléphones', emoji: '📞' },
            { key: 'ventes', label: 'Ventes', emoji: '💰' }
          ].map((item) => {
            const progress = getMonthlyProgress(item.key as any);
            return (
              <View key={item.key} style={styles.monthlyItem}>
                <Text style={styles.monthlyEmoji}>{item.emoji}</Text>
                <Text style={styles.monthlyLabel}>{item.label}</Text>
                <View style={styles.monthlyProgressBar}>
                  <View 
                    style={[
                      styles.monthlyProgressFill, 
                      { 
                        width: `${progress.percentage}%`,
                        backgroundColor: getProgressColor(progress.percentage)
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.monthlyProgressText}>
                  {item.key === 'ventes' 
                    ? `${progress.current}/${progress.target}`
                    : `${Math.round(progress.currentDaily || 0)}/${progress.targetDaily || 0}`
                  }
                </Text>
                <Text style={styles.monthlyRemainingText}>
                  -{progress.remaining}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.monthlyMotivation}>
          <Text style={styles.monthlyMotivationText}>
            {getMotivationalMessage(getMonthlyProgress('ventes'), 'monthly')}
          </Text>
        </View>
      </View>

      {/* Objectifs Trimestriels - Aperçu */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <TrendingUp size={20} color="#8B5CF6" />
          <Text style={styles.cardTitle}>Objectifs Trimestriels</Text>
        </View>
        <View style={styles.quarterlyOverview}>
          {[
            { key: 'vus', label: 'Vus', emoji: '👥' },
            { key: 'closes', label: 'Closes', emoji: '🤝' },
            { key: 'telephones', label: 'Téléphones', emoji: '📞' },
            { key: 'ventes', label: 'Ventes', emoji: '💰' }
          ].map((item) => {
            const progress = getQuarterlyProgress(item.key as any);
            return (
              <View key={item.key} style={styles.quarterlyItem}>
                <Text style={styles.quarterlyEmoji}>{item.emoji}</Text>
                <Text style={styles.quarterlyLabel}>{item.label}</Text>
                <View style={styles.quarterlyProgressBar}>
                  <View 
                    style={[
                      styles.quarterlyProgressFill, 
                      { 
                        width: `${progress.percentage}%`,
                        backgroundColor: getProgressColor(progress.percentage)
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.quarterlyProgressText}>
                  {item.key === 'ventes' 
                    ? `${progress.current}/${progress.target}`
                    : `${Math.round(progress.currentDaily || 0)}/${progress.targetDaily || 0}`
                  }
                </Text>
                <Text style={styles.quarterlyRemainingText}>
                  -{progress.remaining}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.quarterlyMotivation}>
          <Text style={styles.quarterlyMotivationText}>
            {getMotivationalMessage(getQuarterlyProgress('ventes'), 'quarterly')}
          </Text>
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigateToModule('chiffres')}
        >
          <Calculator size={24} color="#3B82F6" />
          <Text style={styles.navButtonText}>Mes Chiffres</Text>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigateToModule('planning')}
        >
          <Calendar size={24} color="#3B82F6" />
          <Text style={styles.navButtonText}>Planning</Text>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigateToModule('historique')}
        >
          <TrendingUp size={24} color="#3B82F6" />
          <Text style={styles.navButtonText}>Historique</Text>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.navButton, 
            userProfile.level !== 'COD6+' && styles.restrictedButton
          ]}
          onPress={() => navigateToModule('reseau')}
        >
          <Target size={24} color={userProfile.level === 'COD6+' ? "#3B82F6" : "#9CA3AF"} />
          <View style={styles.navButtonContent}>
            <Text style={[
              styles.navButtonText, 
              userProfile.level !== 'COD6+' && styles.restrictedText
            ]}>
              Mon Réseau
            </Text>
            {userProfile.level !== 'COD6+' && (
              <Text style={styles.restrictionLabel}>COD6+ requis</Text>
            )}
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, styles.disabledButton]}
          onPress={() => navigateToModule('cartes')}
        >
          <Target size={24} color="#9CA3AF" />
          <Text style={[styles.navButtonText, styles.disabledText]}>Mes Cartes</Text>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
  },
  welcomeText: {
    fontSize: 16,
    color: '#6B7280',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  levelNameText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  profileActions: {
    alignItems: 'flex-end',
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  levelText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  levelSubtext: {
    color: '#FFFFFF',
    fontSize: 10,
    opacity: 0.8,
    marginTop: 2,
  },
  levelBadgeDisabled: {
    opacity: 0.7,
  },
  levelInfoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  levelInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  changeLevelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  changeLevelText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  changeLevelButtonDisabled: {
    opacity: 0.5,
  },
  changeLevelTextDisabled: {
    color: '#D1D5DB',
  },
  levelDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  franchiseNote: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 8,
    fontStyle: 'italic',
  },
  simulationNote: {
    fontSize: 12,
    color: '#F59E0B',
    marginTop: 8,
    fontStyle: 'italic',
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 6,
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
  objectivesContainer: {
    gap: 16,
  },
  objectiveItem: {
    gap: 8,
  },
  objectiveLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  objectiveValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  weeklyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weeklyItem: {
    alignItems: 'center',
    gap: 4,
  },
  weeklyLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  weeklyValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  weeklyPercentage: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  performanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  performanceItem: {
    alignItems: 'center',
    gap: 4,
  },
  performanceLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  performanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
  monthlyOverview: {
    gap: 12,
  },
  monthlyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  monthlyEmoji: {
    fontSize: 16,
    width: 20,
  },
  monthlyLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    width: 80,
  },
  monthlyProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  monthlyProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  monthlyProgressText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
    width: 50,
    textAlign: 'right',
  },
  monthlyRemainingText: {
    fontSize: 10,
    color: '#EF4444',
    fontWeight: '500',
    width: 30,
    textAlign: 'right',
  },
  monthlyMotivation: {
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  monthlyMotivationText: {
    fontSize: 12,
    color: '#15803D',
    textAlign: 'center',
    fontWeight: '500',
  },
  quarterlyOverview: {
    gap: 12,
  },
  quarterlyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  quarterlyEmoji: {
    fontSize: 16,
    width: 20,
  },
  quarterlyLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    width: 80,
  },
  quarterlyProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  quarterlyProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  quarterlyProgressText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
    width: 50,
    textAlign: 'right',
  },
  quarterlyRemainingText: {
    fontSize: 10,
    color: '#EF4444',
    fontWeight: '500',
    width: 30,
    textAlign: 'right',
  },
  quarterlyMotivation: {
    backgroundColor: '#F3F0FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  quarterlyMotivationText: {
    fontSize: 12,
    color: '#7C3AED',
    textAlign: 'center',
    fontWeight: '500',
  },
  navigationContainer: {
    margin: 16,
    gap: 8,
  },
  navButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  navButtonContent: {
    flex: 1,
    marginLeft: 12,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#9CA3AF',
  },
  restrictedButton: {
    borderWidth: 1,
    borderColor: '#FEF3C7',
    backgroundColor: '#FFFBEB',
  },
  restrictedText: {
    color: '#92400E',
  },
  restrictionLabel: {
    fontSize: 12,
    color: '#D97706',
    fontStyle: 'italic',
    marginTop: 2,
  },
});