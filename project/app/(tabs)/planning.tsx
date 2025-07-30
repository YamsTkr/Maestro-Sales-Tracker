import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Calendar, Target, Users, ChevronRight, MapPin, Clock, User } from 'lucide-react-native';
import { usePlanning } from '../../hooks/usePlanning';
import { useUser } from '../../contexts/UserContext';

export default function Planning() {
  const [activeTab, setActiveTab] = useState<'objectifs' | 'planning' | 'presence'>('objectifs');
  const {
    monthlyObjectives,
    quarterlyObjectives,
    configurableWeeklyObjectives,
    currentWeek,
    presence,
    teamMembers,
    updateConfigurableWeeklyObjective,
    updateMonthlyObjective,
    updateQuarterlyObjective,
    updatePlanning,
    updateObjectif,
    setPresenceType,
    getPresenceType,
    getPresenceLabel,
    getWeeklyProgress,
    getMonthlyProgress,
    getQuarterlyProgress,
    getProgressColor,
    getMotivationalMessage,
    getTeamMembersOnField,
    getTeamMembersInOffice
  } = usePlanning();

  const { userProfile, isAtLeastLevel } = useUser();

  const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

  const renderTabButton = (tab: 'objectifs' | 'planning' | 'presence', label: string, icon: React.ReactNode) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      {icon}
      <Text style={[styles.tabButtonText, activeTab === tab && styles.activeTabButtonText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderObjectifsSection = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Objectifs Journaliers */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Calendar size={20} color="#3B82F6" />
          <Text style={styles.sectionTitle}>Objectifs Journaliers</Text>
        </View>
        
        {days.map((day) => (
          <View key={day} style={styles.dayObjectivesCard}>
            <Text style={styles.dayTitle}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
            
            <View style={styles.objectivesGrid}>
              <View style={styles.objectiveItem}>
                <Text style={styles.objectiveEmoji}>👥</Text>
                <Text style={styles.objectiveLabel}>Vus</Text>
                <TextInput
                  style={styles.objectiveInput}
                  value={currentWeek[day]?.objectifs?.vus?.toString() || '0'}
                  onChangeText={(text) => updateObjectif(day, 'vus', text)}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>

              <View style={styles.objectiveItem}>
                <Text style={styles.objectiveEmoji}>🤝</Text>
                <Text style={styles.objectiveLabel}>Closes</Text>
                <TextInput
                  style={styles.objectiveInput}
                  value={currentWeek[day]?.objectifs?.closes?.toString() || '0'}
                  onChangeText={(text) => updateObjectif(day, 'closes', text)}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>

              <View style={styles.objectiveItem}>
                <Text style={styles.objectiveEmoji}>📞</Text>
                <Text style={styles.objectiveLabel}>Téléphones</Text>
                <TextInput
                  style={styles.objectiveInput}
                  value={currentWeek[day]?.objectifs?.telephones?.toString() || '0'}
                  onChangeText={(text) => updateObjectif(day, 'telephones', text)}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>

              <View style={styles.objectiveItem}>
                <Text style={styles.objectiveEmoji}>💰</Text>
                <Text style={styles.objectiveLabel}>Ventes</Text>
                <TextInput
                  style={styles.objectiveInput}
                  value={currentWeek[day]?.objectifs?.ventes?.toString() || '0'}
                  onChangeText={(text) => updateObjectif(day, 'ventes', text)}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Objectifs Hebdomadaires */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Calendar size={20} color="#8B5CF6" />
          <Text style={styles.sectionTitle}>Objectifs Hebdomadaires</Text>
        </View>
        
        <View style={styles.monthlyObjectivesGrid}>
          <View style={styles.monthlyObjectiveItem}>
            <Text style={styles.objectiveEmoji}>👥</Text>
            <Text style={styles.monthlyObjectiveLabel}>Vus (Moy/jour)</Text>
            <TextInput
              style={styles.monthlyObjectiveInput}
              value={configurableWeeklyObjectives.vus.toString()}
              onChangeText={(text) => updateConfigurableWeeklyObjective('vus', parseInt(text) || 0)}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>

          <View style={styles.monthlyObjectiveItem}>
            <Text style={styles.objectiveEmoji}>🤝</Text>
            <Text style={styles.monthlyObjectiveLabel}>Closes (Moy/jour)</Text>
            <TextInput
              style={styles.monthlyObjectiveInput}
              value={configurableWeeklyObjectives.closes.toString()}
              onChangeText={(text) => updateConfigurableWeeklyObjective('closes', parseInt(text) || 0)}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>

          <View style={styles.monthlyObjectiveItem}>
            <Text style={styles.objectiveEmoji}>📞</Text>
            <Text style={styles.monthlyObjectiveLabel}>Téléphones (Moy/jour)</Text>
            <TextInput
              style={styles.monthlyObjectiveInput}
              value={configurableWeeklyObjectives.telephones.toString()}
              onChangeText={(text) => updateConfigurableWeeklyObjective('telephones', parseInt(text) || 0)}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>

          <View style={styles.monthlyObjectiveItem}>
            <Text style={styles.objectiveEmoji}>💰</Text>
            <Text style={styles.monthlyObjectiveLabel}>Ventes (Total)</Text>
            <TextInput
              style={styles.monthlyObjectiveInput}
              value={configurableWeeklyObjectives.ventes.toString()}
              onChangeText={(text) => updateConfigurableWeeklyObjective('ventes', parseInt(text) || 0)}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>
        </View>

        {/* Progression hebdomadaire */}
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>📊 Progression Hebdomadaire</Text>
          {(['vus', 'closes', 'telephones', 'ventes'] as const).map((type) => {
            const progress = getWeeklyProgress(type);
            return (
              <View key={type} style={styles.progressItem}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>
                    {type === 'vus' ? '👥' : type === 'closes' ? '🤝' : type === 'telephones' ? '📞' : '💰'} {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                  <Text style={styles.progressPercentage}>{Math.round(progress.percentage)}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${progress.percentage}%`,
                        backgroundColor: getProgressColor(progress.percentage)
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressDetails}>
                  {progress.current}/{progress.target} • Reste: {progress.remaining} • Besoin/jour: {progress.dailyNeeded}
                </Text>
              </View>
            );
          })}
          <View style={styles.motivationCard}>
            <Text style={styles.motivationText}>
              {getMotivationalMessage(getWeeklyProgress('ventes'), 'weekly')}
            </Text>
          </View>
        </View>
      </View>

      {/* Objectifs Mensuels */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Target size={20} color="#10B981" />
          <Text style={styles.sectionTitle}>Objectifs Mensuels</Text>
        </View>
        
        <View style={styles.monthlyObjectivesGrid}>
          <View style={styles.monthlyObjectiveItem}>
            <Text style={styles.objectiveEmoji}>👥</Text>
            <Text style={styles.monthlyObjectiveLabel}>Vus (Moy/jour)</Text>
            <TextInput
              style={styles.monthlyObjectiveInput}
              value={monthlyObjectives.vus.toString()}
              onChangeText={(text) => updateMonthlyObjective('vus', parseInt(text) || 0)}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>

          <View style={styles.monthlyObjectiveItem}>
            <Text style={styles.objectiveEmoji}>🤝</Text>
            <Text style={styles.monthlyObjectiveLabel}>Closes (Moy/jour)</Text>
            <TextInput
              style={styles.monthlyObjectiveInput}
              value={monthlyObjectives.closes.toString()}
              onChangeText={(text) => updateMonthlyObjective('closes', parseInt(text) || 0)}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>

          <View style={styles.monthlyObjectiveItem}>
            <Text style={styles.objectiveEmoji}>📞</Text>
            <Text style={styles.monthlyObjectiveLabel}>Téléphones (Moy/jour)</Text>
            <TextInput
              style={styles.monthlyObjectiveInput}
              value={monthlyObjectives.telephones.toString()}
              onChangeText={(text) => updateMonthlyObjective('telephones', parseInt(text) || 0)}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>

          <View style={styles.monthlyObjectiveItem}>
            <Text style={styles.objectiveEmoji}>💰</Text>
            <Text style={styles.monthlyObjectiveLabel}>Ventes (Total)</Text>
            <TextInput
              style={styles.monthlyObjectiveInput}
              value={monthlyObjectives.ventes.toString()}
              onChangeText={(text) => updateMonthlyObjective('ventes', parseInt(text) || 0)}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>
        </View>

        {/* Progression mensuelle */}
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>📊 Progression Mensuelle</Text>
          {(['vus', 'closes', 'telephones', 'ventes'] as const).map((type) => {
            const progress = getMonthlyProgress(type);
            return (
              <View key={type} style={styles.progressItem}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>
                    {type === 'vus' ? '👥' : type === 'closes' ? '🤝' : type === 'telephones' ? '📞' : '💰'} {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                  <Text style={styles.progressPercentage}>{Math.round(progress.percentage)}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${progress.percentage}%`,
                        backgroundColor: getProgressColor(progress.percentage)
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressDetails}>
                  {progress.current}/{progress.target} • Reste: {progress.remaining} • Besoin/jour: {progress.dailyNeeded}
                </Text>
              </View>
            );
          })}
          <View style={styles.motivationCard}>
            <Text style={styles.motivationText}>
              {getMotivationalMessage(getMonthlyProgress('ventes'), 'monthly')}
            </Text>
          </View>
        </View>
      </View>

      {/* Objectifs Trimestriels */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Target size={20} color="#8B5CF6" />
          <Text style={styles.sectionTitle}>Objectifs Trimestriels</Text>
        </View>
        
        <View style={styles.monthlyObjectivesGrid}>
          <View style={styles.monthlyObjectiveItem}>
            <Text style={styles.objectiveEmoji}>👥</Text>
            <Text style={styles.monthlyObjectiveLabel}>Vus (Moy/jour)</Text>
            <TextInput
              style={styles.monthlyObjectiveInput}
              value={quarterlyObjectives.vus.toString()}
              onChangeText={(text) => updateQuarterlyObjective('vus', parseInt(text) || 0)}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>

          <View style={styles.monthlyObjectiveItem}>
            <Text style={styles.objectiveEmoji}>🤝</Text>
            <Text style={styles.monthlyObjectiveLabel}>Closes (Moy/jour)</Text>
            <TextInput
              style={styles.monthlyObjectiveInput}
              value={quarterlyObjectives.closes.toString()}
              onChangeText={(text) => updateQuarterlyObjective('closes', parseInt(text) || 0)}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>

          <View style={styles.monthlyObjectiveItem}>
            <Text style={styles.objectiveEmoji}>📞</Text>
            <Text style={styles.monthlyObjectiveLabel}>Téléphones (Moy/jour)</Text>
            <TextInput
              style={styles.monthlyObjectiveInput}
              value={quarterlyObjectives.telephones.toString()}
              onChangeText={(text) => updateQuarterlyObjective('telephones', parseInt(text) || 0)}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>

          <View style={styles.monthlyObjectiveItem}>
            <Text style={styles.objectiveEmoji}>💰</Text>
            <Text style={styles.monthlyObjectiveLabel}>Ventes (Total)</Text>
            <TextInput
              style={styles.monthlyObjectiveInput}
              value={quarterlyObjectives.ventes.toString()}
              onChangeText={(text) => updateQuarterlyObjective('ventes', parseInt(text) || 0)}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>
        </View>

        {/* Progression trimestrielle */}
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>📈 Progression Trimestrielle</Text>
          {(['vus', 'closes', 'telephones', 'ventes'] as const).map((type) => {
            const progress = getQuarterlyProgress(type);
            return (
              <View key={type} style={styles.progressItem}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>
                    {type === 'vus' ? '👥' : type === 'closes' ? '🤝' : type === 'telephones' ? '📞' : '💰'} {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                  <Text style={styles.progressPercentage}>{Math.round(progress.percentage)}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${progress.percentage}%`,
                        backgroundColor: getProgressColor(progress.percentage)
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressDetails}>
                  {progress.current}/{progress.target} • Reste: {progress.remaining} • Besoin/jour: {progress.dailyNeeded}
                </Text>
              </View>
            );
          })}
          <View style={styles.motivationCard}>
            <Text style={styles.motivationText}>
              {getMotivationalMessage(getQuarterlyProgress('ventes'), 'quarterly')}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderPlanningSection = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Calendar size={20} color="#3B82F6" />
          <Text style={styles.sectionTitle}>Planning Hebdomadaire</Text>
        </View>
        
        {days.map((day) => (
          <View key={day} style={styles.dayPlanningCard}>
            <Text style={styles.dayPlanningTitle}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
            
            {/* Créneaux horaires */}
            <View style={styles.creneauxContainer}>
              <View style={styles.creneauItem}>
                <View style={styles.creneauHeader}>
                  <Text style={styles.creneauEmoji}>🌅</Text>
                  <Text style={styles.creneauLabel}>Matin</Text>
                </View>
                <TextInput
                  style={styles.creneauInput}
                  value={currentWeek[day]?.matin || ''}
                  onChangeText={(text) => updatePlanning(day, 'matin', text)}
                  placeholder="Programme du matin..."
                  multiline
                />
              </View>

              <View style={styles.creneauItem}>
                <View style={styles.creneauHeader}>
                  <Text style={styles.creneauEmoji}>☀️</Text>
                  <Text style={styles.creneauLabel}>Après-midi</Text>
                </View>
                <TextInput
                  style={styles.creneauInput}
                  value={currentWeek[day]?.aprem || ''}
                  onChangeText={(text) => updatePlanning(day, 'aprem', text)}
                  placeholder="Programme de l'après-midi..."
                  multiline
                />
              </View>

              <View style={styles.creneauItem}>
                <View style={styles.creneauHeader}>
                  <Text style={styles.creneauEmoji}>🌙</Text>
                  <Text style={styles.creneauLabel}>Soir</Text>
                </View>
                <TextInput
                  style={styles.creneauInput}
                  value={currentWeek[day]?.soir || ''}
                  onChangeText={(text) => updatePlanning(day, 'soir', text)}
                  placeholder="Programme du soir..."
                  multiline
                />
              </View>
            </View>

            {/* Objectifs journaliers intégrés */}
            <View style={styles.integratedObjectives}>
              <Text style={styles.integratedObjectivesTitle}>🎯 Objectifs du jour</Text>
              <View style={styles.integratedObjectivesRow}>
                <View style={styles.integratedObjectiveItem}>
                  <Text style={styles.integratedObjectiveEmoji}>👥</Text>
                  <Text style={styles.integratedObjectiveValue}>{currentWeek[day]?.objectifs?.vus || 0}</Text>
                  <Text style={styles.integratedObjectiveLabel}>Vus</Text>
                </View>
                <View style={styles.integratedObjectiveItem}>
                  <Text style={styles.integratedObjectiveEmoji}>🤝</Text>
                  <Text style={styles.integratedObjectiveValue}>{currentWeek[day]?.objectifs?.closes || 0}</Text>
                  <Text style={styles.integratedObjectiveLabel}>Closes</Text>
                </View>
                <View style={styles.integratedObjectiveItem}>
                  <Text style={styles.integratedObjectiveEmoji}>📞</Text>
                  <Text style={styles.integratedObjectiveValue}>{currentWeek[day]?.objectifs?.telephones || 0}</Text>
                  <Text style={styles.integratedObjectiveLabel}>Tél.</Text>
                </View>
                <View style={styles.integratedObjectiveItem}>
                  <Text style={styles.integratedObjectiveEmoji}>💰</Text>
                  <Text style={styles.integratedObjectiveValue}>{currentWeek[day]?.objectifs?.ventes || 0}</Text>
                  <Text style={styles.integratedObjectiveLabel}>Ventes</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderPresenceSection = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Ma présence hebdomadaire */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <User size={20} color="#3B82F6" />
          <Text style={styles.sectionTitle}>Ma Présence Hebdomadaire</Text>
        </View>
        
        {days.map((day) => (
          <View key={day} style={styles.presenceCard}>
            <Text style={styles.presenceDayTitle}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
            
            <View style={styles.presenceOptions}>
              {[
                { type: 'formation_bureau', label: 'Bureau Formation', emoji: '📚' },
                { type: 'bureau_presentation', label: 'Bureau Présentation', emoji: '💼' },
                { type: 'direct_terrain', label: 'Direct Terrain', emoji: '🚗' },
                { type: 'formation_bureau_terrain', label: 'Bureau Formation + Terrain', emoji: '📚🚗' },
                { type: 'bureau_presentation_terrain', label: 'Bureau Présentation + Terrain', emoji: '💼🚗' },
                { type: 'none', label: 'Absent', emoji: '❌' }
              ].map((option) => (
                <TouchableOpacity
                  key={option.type}
                  style={[
                    styles.presenceOption,
                    getPresenceType(day) === option.type && styles.presenceOptionActive
                  ]}
                  onPress={() => setPresenceType(day, option.type as any)}
                >
                  <Text style={styles.presenceOptionEmoji}>{option.emoji}</Text>
                  <Text style={[
                    styles.presenceOptionText,
                    getPresenceType(day) === option.type && styles.presenceOptionTextActive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.presenceStatus}>
              <Text style={styles.presenceStatusLabel}>Statut actuel:</Text>
              <Text style={styles.presenceStatusValue}>{getPresenceLabel(day)}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Consultation équipe (COD4+) */}
      {isAtLeastLevel(userProfile.level, 'COD4') && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={20} color="#10B981" />
            <Text style={styles.sectionTitle}>Présences de l'Équipe</Text>
          </View>
          
          {/* Membres sur le terrain */}
          <View style={styles.teamSection}>
            <View style={styles.teamSectionHeader}>
              <MapPin size={16} color="#EF4444" />
              <Text style={styles.teamSectionTitle}>Sur le terrain ({getTeamMembersOnField().length})</Text>
            </View>
            {getTeamMembersOnField().map((member) => (
              <View key={member.id} style={styles.teamMemberCard}>
                <View style={styles.teamMemberInfo}>
                  <Text style={styles.teamMemberName}>{member.name}</Text>
                  <Text style={styles.teamMemberLevel}>{member.level}</Text>
                </View>
                <View style={styles.teamMemberTerrain}>
                  <MapPin size={14} color="#6B7280" />
                  <Text style={styles.teamMemberTerrainText}>{member.terrain}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Membres au bureau */}
          <View style={styles.teamSection}>
            <View style={styles.teamSectionHeader}>
              <Clock size={16} color="#3B82F6" />
              <Text style={styles.teamSectionTitle}>Au bureau ({getTeamMembersInOffice().length})</Text>
            </View>
            {getTeamMembersInOffice().map((member) => (
              <View key={member.id} style={styles.teamMemberCard}>
                <View style={styles.teamMemberInfo}>
                  <Text style={styles.teamMemberName}>{member.name}</Text>
                  <Text style={styles.teamMemberLevel}>{member.level}</Text>
                </View>
                <Text style={styles.teamMemberActivity}>
                  {member.presence.bureau_formation ? '📚 Formation' : '💼 Présentation'}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Message pour les niveaux inférieurs à COD4 */}
      {!isAtLeastLevel(userProfile.level, 'COD4') && (
        <View style={styles.section}>
          <View style={styles.restrictedSection}>
            <Users size={48} color="#9CA3AF" />
            <Text style={styles.restrictedTitle}>Consultation d'équipe</Text>
            <Text style={styles.restrictedMessage}>
              Cette fonctionnalité est réservée aux utilisateurs COD4 et plus.
            </Text>
            <Text style={styles.restrictedNote}>
              Niveau requis: COD4+ • Votre niveau: {userProfile.level}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Calendar size={24} color="#3B82F6" />
        <Text style={styles.title}>Planning</Text>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabsContainer}>
        {renderTabButton('objectifs', 'Objectifs', <Target size={16} color={activeTab === 'objectifs' ? '#FFFFFF' : '#6B7280'} />)}
        {renderTabButton('planning', 'Planning', <Calendar size={16} color={activeTab === 'planning' ? '#FFFFFF' : '#6B7280'} />)}
        {renderTabButton('presence', 'Présence', <Users size={16} color={activeTab === 'presence' ? '#FFFFFF' : '#6B7280'} />)}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'objectifs' && renderObjectifsSection()}
        {activeTab === 'planning' && renderPlanningSection()}
        {activeTab === 'presence' && renderPresenceSection()}
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
    color: '#1F2937',
    marginLeft: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    gap: 6,
  },
  activeTabButton: {
    backgroundColor: '#3B82F6',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabButtonText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  section: {
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  
  // Objectifs journaliers
  dayObjectivesCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  objectivesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  objectiveItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
  },
  objectiveEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  objectiveLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  objectiveInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 14,
    textAlign: 'center',
    minWidth: 60,
  },

  // Objectifs mensuels/trimestriels
  monthlyObjectivesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  monthlyObjectiveItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
  },
  monthlyObjectiveLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  monthlyObjectiveInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    textAlign: 'center',
    minWidth: 80,
    fontWeight: '600',
  },

  // Progression
  progressSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressDetails: {
    fontSize: 12,
    color: '#6B7280',
  },
  motivationCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  motivationText: {
    fontSize: 14,
    color: '#15803D',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Planning
  dayPlanningCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  dayPlanningTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  creneauxContainer: {
    gap: 12,
    marginBottom: 16,
  },
  creneauItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
  },
  creneauHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  creneauEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  creneauLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  creneauInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  integratedObjectives: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
  },
  integratedObjectivesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  integratedObjectivesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  integratedObjectiveItem: {
    alignItems: 'center',
  },
  integratedObjectiveEmoji: {
    fontSize: 16,
    marginBottom: 4,
  },
  integratedObjectiveValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  integratedObjectiveLabel: {
    fontSize: 10,
    color: '#6B7280',
  },

  // Présence
  presenceCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  presenceDayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  presenceOptions: {
    gap: 8,
    marginBottom: 12,
  },
  presenceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  presenceOptionActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  presenceOptionEmoji: {
    fontSize: 16,
    marginRight: 12,
  },
  presenceOptionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  presenceOptionTextActive: {
    color: '#FFFFFF',
  },
  presenceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 8,
  },
  presenceStatusLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 8,
  },
  presenceStatusValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },

  // Équipe
  teamSection: {
    marginBottom: 16,
  },
  teamSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  teamMemberCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  teamMemberInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  teamMemberName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  teamMemberLevel: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  teamMemberTerrain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamMemberTerrainText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  teamMemberActivity: {
    fontSize: 12,
    color: '#6B7280',
  },

  // Section restreinte
  restrictedSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  restrictedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 16,
    marginBottom: 8,
  },
  restrictedMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  restrictedNote: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
});