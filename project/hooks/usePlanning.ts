import { useState } from 'react';

export interface DayPlanning {
  matin: string;
  aprem: string;
  soir: string;
  objectifs: {
    vus: number;
    closes: number;
    telephones: number;
    ventes: number;
  };
}

export interface WeekPlanning {
  [key: string]: DayPlanning;
}

export interface DayPresence {
  bureau_formation: boolean;
  bureau_presentation: boolean;
  terrain: boolean;
}

export interface WeekPresence {
  [key: string]: DayPresence;
}

export interface MonthlyObjectives {
  vus: number; // Moyenne par jour
  closes: number; // Moyenne par jour
  telephones: number; // Moyenne par jour
  ventes: number;
}

export interface QuarterlyObjectives {
  vus: number; // Moyenne par jour
  closes: number; // Moyenne par jour
  telephones: number; // Moyenne par jour
  ventes: number;
}

export interface ConfigurableWeeklyObjectives {
  vus: number; // Moyenne par jour
  closes: number; // Moyenne par jour
  telephones: number; // Moyenne par jour
  ventes: number; // Total pour la semaine
}

export interface ProgressData {
  current: number;
  target: number;
  remaining: number;
  percentage: number;
  dailyNeeded: number;
  weeklyNeeded: number;
  currentDaily?: number;
  targetDaily?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  level: string;
  terrain: string;
  presence: DayPresence;
}

export function usePlanning() {
  const [currentWeek, setCurrentWeek] = useState<WeekPlanning>({
    lundi: {
      matin: '',
      aprem: '',
      soir: '',
      objectifs: { vus: 25, closes: 15, telephones: 8, ventes: 2 }
    },
    mardi: {
      matin: '',
      aprem: '',
      soir: '',
      objectifs: { vus: 25, closes: 15, telephones: 8, ventes: 2 }
    },
    mercredi: {
      matin: '',
      aprem: '',
      soir: '',
      objectifs: { vus: 25, closes: 15, telephones: 8, ventes: 2 }
    },
    jeudi: {
      matin: '',
      aprem: '',
      soir: '',
      objectifs: { vus: 25, closes: 15, telephones: 8, ventes: 2 }
    },
    vendredi: {
      matin: '',
      aprem: '',
      soir: '',
      objectifs: { vus: 25, closes: 15, telephones: 8, ventes: 2 }
    },
    samedi: {
      matin: '',
      aprem: '',
      soir: '',
      objectifs: { vus: 15, closes: 10, telephones: 5, ventes: 1 }
    },
    dimanche: {
      matin: '',
      aprem: '',
      soir: '',
      objectifs: { vus: 0, closes: 0, telephones: 0, ventes: 0 }
    }
  });

  const [presence, setPresence] = useState<WeekPresence>({
    lundi: { bureau_formation: false, bureau_presentation: false, terrain: false },
    mardi: { bureau_formation: false, bureau_presentation: false, terrain: false },
    mercredi: { bureau_formation: false, bureau_presentation: false, terrain: false },
    jeudi: { bureau_formation: false, bureau_presentation: false, terrain: false },
    vendredi: { bureau_formation: false, bureau_presentation: false, terrain: false },
    samedi: { bureau_formation: false, bureau_presentation: false, terrain: false },
    dimanche: { bureau_formation: false, bureau_presentation: false, terrain: false }
  });

  const [configurableWeeklyObjectives, setConfigurableWeeklyObjectives] = useState<ConfigurableWeeklyObjectives>({
    vus: 25, // Moyenne par jour
    closes: 15, // Moyenne par jour
    telephones: 8, // Moyenne par jour
    ventes: 10 // Total pour la semaine
  });

  const [monthlyObjectives, setMonthlyObjectives] = useState<MonthlyObjectives>({
    vus: 25, // Moyenne par jour
    closes: 15, // Moyenne par jour
    telephones: 8, // Moyenne par jour
    ventes: 30
  });

  const [quarterlyObjectives, setQuarterlyObjectives] = useState<QuarterlyObjectives>({
    vus: 25, // Moyenne par jour
    closes: 15, // Moyenne par jour
    telephones: 8, // Moyenne par jour
    ventes: 90
  });

  // Simulation des données actuelles (à remplacer par des vraies données plus tard)
  const [currentWeekProgressData] = useState({
    vus: 95, // Total réalisé cette semaine
    closes: 58, // Total réalisé cette semaine
    telephones: 28, // Total réalisé cette semaine
    ventes: 4 // Total réalisé cette semaine
  });

  const [currentMonthProgress] = useState({
    vus: 180,
    closes: 95,
    telephones: 42,
    ventes: 8
  });

  const [currentQuarterProgress] = useState({
    vus: 520,
    closes: 310,
    telephones: 145,
    ventes: 28
  });

  // Données simulées pour l'équipe (COD4+)
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Marie Dupont',
      level: 'COD3',
      terrain: 'Secteur Nord',
      presence: { bureau_formation: true, bureau_presentation: false, terrain: true }
    },
    {
      id: '2',
      name: 'Pierre Martin',
      level: 'COD2',
      terrain: 'Secteur Sud',
      presence: { bureau_formation: false, bureau_presentation: true, terrain: true }
    },
    {
      id: '3',
      name: 'Sophie Bernard',
      level: 'COD4',
      terrain: 'Secteur Est',
      presence: { bureau_formation: false, bureau_presentation: false, terrain: true }
    },
    {
      id: '4',
      name: 'Thomas Leroy',
      level: 'COD1',
      terrain: 'Secteur Ouest',
      presence: { bureau_formation: true, bureau_presentation: false, terrain: false }
    },
    {
      id: '5',
      name: 'Julie Moreau',
      level: 'COD3',
      terrain: 'Secteur Centre',
      presence: { bureau_formation: false, bureau_presentation: true, terrain: true }
    }
  ]);

  const updatePlanning = (day: string, creneau: string, value: string) => {
    setCurrentWeek(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [creneau]: value
      }
    }));
  };

  const updateObjectif = (day: string, type: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setCurrentWeek(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        objectifs: {
          ...prev[day].objectifs,
          [type]: numValue
        }
      }
    }));
  };

  const updatePresence = (day: string, type: string, value: boolean) => {
    setPresence(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value
      }
    }));
  };

  const updateConfigurableWeeklyObjective = (type: keyof ConfigurableWeeklyObjectives, value: number) => {
    setConfigurableWeeklyObjectives(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const updateMonthlyObjective = (type: keyof MonthlyObjectives, value: number) => {
    setMonthlyObjectives(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const updateQuarterlyObjective = (type: keyof QuarterlyObjectives, value: number) => {
    setQuarterlyObjectives(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // Fonction pour définir un type de présence spécifique
  const setPresenceType = (day: string, presenceType: 'formation_bureau' | 'bureau_presentation' | 'direct_terrain' | 'formation_bureau_terrain' | 'bureau_presentation_terrain' | 'none') => {
    let newPresence: DayPresence;
    
    switch (presenceType) {
      case 'formation_bureau':
        newPresence = { bureau_formation: true, bureau_presentation: false, terrain: false };
        break;
      case 'bureau_presentation':
        newPresence = { bureau_formation: false, bureau_presentation: true, terrain: false };
        break;
      case 'direct_terrain':
        newPresence = { bureau_formation: false, bureau_presentation: false, terrain: true };
        break;
      case 'formation_bureau_terrain':
        newPresence = { bureau_formation: true, bureau_presentation: false, terrain: true };
        break;
      case 'bureau_presentation_terrain':
        newPresence = { bureau_formation: false, bureau_presentation: true, terrain: true };
        break;
      case 'none':
      default:
        newPresence = { bureau_formation: false, bureau_presentation: false, terrain: false };
    }
    
    setPresence(prev => ({
      ...prev,
      [day]: newPresence
    }));
  };

  // Fonction pour obtenir le type de présence actuel
  const getPresenceType = (day: string): string => {
    const dayPresence = presence[day];
    
    if (!dayPresence) return 'none';
    
    // Direct terrain est exclusif
    if (dayPresence.terrain && !dayPresence.bureau_formation && !dayPresence.bureau_presentation) {
      return 'direct_terrain';
    }
    
    // Combinaisons avec formation bureau
    if (dayPresence.bureau_formation && dayPresence.terrain && !dayPresence.bureau_presentation) {
      return 'formation_bureau_terrain';
    }
    
    // Combinaison présentation + terrain
    if (!dayPresence.bureau_formation && dayPresence.bureau_presentation && dayPresence.terrain) {
      return 'bureau_presentation_terrain';
    }
    
    if (dayPresence.bureau_formation && !dayPresence.terrain && !dayPresence.bureau_presentation) {
      return 'formation_bureau';
    }
    
    // Bureau présentation seul
    if (!dayPresence.bureau_formation && !dayPresence.terrain && dayPresence.bureau_presentation) {
      return 'bureau_presentation';
    }
    
    return 'none';
  };

  // Fonction pour obtenir le libellé de présence
  const getPresenceLabel = (day: string): string => {
    const type = getPresenceType(day);
    
    switch (type) {
      case 'formation_bureau':
        return 'Bureau Formation';
      case 'bureau_presentation':
        return 'Bureau Présentation';
      case 'direct_terrain':
        return 'Direct Terrain';
      case 'formation_bureau_terrain':
        return 'Bureau Formation + Terrain';
      case 'bureau_presentation_terrain':
        return 'Bureau Présentation + Terrain';
      case 'none':
      default:
        return 'Absent';
    }
  };

  // Fonction pour obtenir le jour actuel en français
  const getCurrentDay = (): string => {
    const today = new Date();
    const dayIndex = today.getDay();
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    return days[dayIndex];
  };

  // Fonction pour calculer les objectifs journaliers (jour actuel)
  const getDailyObjectives = () => {
    const currentDay = getCurrentDay();
    return currentWeek[currentDay]?.objectifs || { vus: 0, closes: 0, telephones: 0, ventes: 0 };
  };

  // Fonction pour calculer les objectifs hebdomadaires (somme des jours travaillés)
  const getWeeklyObjectives = () => {
    const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
    const workingDaysOnly = days.filter(day => day !== 'dimanche');
    
    const totals = workingDaysOnly.reduce((total, day) => {
      const dayPresence = presence[day];
      const isWorkingDay = dayPresence.bureau_formation || dayPresence.bureau_presentation || dayPresence.terrain;
      
      if (isWorkingDay) {
        const dayObjectives = currentWeek[day].objectifs;
        return {
          vus: total.vus + dayObjectives.vus,
          closes: total.closes + dayObjectives.closes,
          telephones: total.telephones + dayObjectives.telephones,
          ventes: total.ventes + dayObjectives.ventes
        };
      }
      
      return total;
    }, { vus: 0, closes: 0, telephones: 0, ventes: 0 });
    
    // Compter le nombre de jours travaillés (excluant le dimanche)
    const workingDaysCount = workingDaysOnly.filter(day => {
      const dayPresence = presence[day];
      return dayPresence.bureau_formation || dayPresence.bureau_presentation || dayPresence.terrain;
    }).length;
    
    // Retourner les moyennes journalières pour vus, closes, telephones et le total pour ventes
    return {
      vus: workingDaysCount > 0 ? Math.round(totals.vus / workingDaysCount) : 0,
      closes: workingDaysCount > 0 ? Math.round(totals.closes / workingDaysCount) : 0,
      telephones: workingDaysCount > 0 ? Math.round(totals.telephones / workingDaysCount) : 0,
      ventes: totals.ventes // Total des ventes
    };
  };

  // Fonction pour vérifier si un jour est un jour de travail
  const isWorkingDay = (day: string): boolean => {
    const dayPresence = presence[day];
    return dayPresence.bureau_formation || dayPresence.bureau_presentation || dayPresence.terrain;
  };

  // Fonction pour obtenir la liste des jours travaillés
  const getWorkingDays = (): string[] => {
    const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
    return days.filter(day => isWorkingDay(day));
  };

  // Nouvelles fonctions pour calculer les jours travaillés
  const getWorkingDaysInfoForWeek = () => {
    const workingDays = getWorkingDays();
    const totalWorkingDays = workingDays.length;
    
    // Simulation des jours restants dans la semaine (à adapter selon la logique métier)
    const workingDaysRemaining = Math.max(1, Math.ceil(totalWorkingDays * 0.6)); // 60% des jours restants
    
    return {
      totalWorkingDays,
      workingDaysRemaining
    };
  };

  const getWorkingDaysInfoForMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    // Premier et dernier jour du mois
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Calcul du nombre total de jours travaillés dans le mois (estimation 70% des jours)
    const totalDaysInMonth = lastDay.getDate();
    const totalWorkingDays = Math.ceil(totalDaysInMonth * 0.7);
    
    // Jours restants dans le mois
    const daysRemainingInMonth = Math.max(1, lastDay.getDate() - today.getDate() + 1);
    const workingDaysRemaining = Math.ceil(daysRemainingInMonth * 0.7);
    
    return {
      totalWorkingDays,
      workingDaysRemaining
    };
  };

  const getWorkingDaysInfoForQuarter = () => {
    const today = new Date();
    const currentQuarter = Math.floor(today.getMonth() / 3);
    const quarterStartMonth = currentQuarter * 3;
    const quarterEndMonth = quarterStartMonth + 2;
    
    // Premier jour du trimestre et dernier jour du trimestre
    const quarterStart = new Date(today.getFullYear(), quarterStartMonth, 1);
    const quarterEnd = new Date(today.getFullYear(), quarterEndMonth + 1, 0);
    
    // Calcul du nombre total de jours dans le trimestre
    const totalDaysInQuarter = Math.ceil((quarterEnd.getTime() - quarterStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const totalWorkingDays = Math.ceil(totalDaysInQuarter * 0.7);
    
    // Jours restants dans le trimestre
    const daysRemainingInQuarter = Math.max(1, Math.ceil((quarterEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    const workingDaysRemaining = Math.ceil(daysRemainingInQuarter * 0.7);
    
    return {
      totalWorkingDays,
      workingDaysRemaining
    };
  };

  // Fonctions pour calculer les progressions et recommandations
  const getWeeklyProgress = (type: keyof ConfigurableWeeklyObjectives): ProgressData => {
    const current = currentWeekProgressData[type];
    const workingDaysInfo = getWorkingDaysInfoForWeek();
    
    // Pour vus, closes, telephones: target = moyenne par jour * jours travaillés
    // Pour ventes: target = total direct
    const target = (type === 'ventes') 
      ? configurableWeeklyObjectives[type] 
      : configurableWeeklyObjectives[type] * workingDaysInfo.totalWorkingDays;
    
    const remaining = Math.max(0, target - current);
    const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
    
    const dailyNeeded = remaining > 0 ? Math.ceil(remaining / workingDaysInfo.workingDaysRemaining) : 0;
    const weeklyNeeded = remaining; // Pour la semaine, c'est le restant total
    
    return {
      current,
      target,
      remaining,
      percentage,
      dailyNeeded,
      weeklyNeeded
    };
  };

  const getMonthlyProgress = (type: keyof MonthlyObjectives): ProgressData => {
    const current = currentMonthProgress[type];
    const workingDaysInfo = getWorkingDaysInfoForMonth();
    const daysPassedInMonth = getDaysPassedInMonth();
    
    // Pour vus, closes, telephones: target = moyenne par jour * jours travaillés
    // Pour ventes: target = total direct
    const target = (type === 'ventes') 
      ? monthlyObjectives[type] 
      : monthlyObjectives[type] * workingDaysInfo.totalWorkingDays;
    
    const remaining = Math.max(0, target - current);
    const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
    
    const dailyNeeded = remaining > 0 ? Math.ceil(remaining / workingDaysInfo.workingDaysRemaining) : 0;
    const weeklyNeeded = dailyNeeded * 5; // 5 jours de travail par semaine
    
    // Calcul des moyennes quotidiennes pour l'affichage
    const currentDaily = daysPassedInMonth > 0 ? current / daysPassedInMonth : 0;
    const targetDaily = monthlyObjectives[type];
    
    return {
      current,
      target,
      remaining,
      percentage,
      dailyNeeded,
      weeklyNeeded,
      currentDaily,
      targetDaily
    };
  };

  const getQuarterlyProgress = (type: keyof QuarterlyObjectives): ProgressData => {
    const current = currentQuarterProgress[type];
    const workingDaysInfo = getWorkingDaysInfoForQuarter();
    const daysPassedInQuarter = getDaysPassedInQuarter();
    
    // Pour vus, closes, telephones: target = moyenne par jour * jours travaillés
    // Pour ventes: target = total direct
    const target = (type === 'ventes') 
      ? quarterlyObjectives[type] 
      : quarterlyObjectives[type] * workingDaysInfo.totalWorkingDays;
    
    const remaining = Math.max(0, target - current);
    const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
    
    const dailyNeeded = remaining > 0 ? Math.ceil(remaining / workingDaysInfo.workingDaysRemaining) : 0;
    const weeklyNeeded = dailyNeeded * 5;
    
    // Calcul des moyennes quotidiennes pour l'affichage
    const currentDaily = daysPassedInQuarter > 0 ? current / daysPassedInQuarter : 0;
    const targetDaily = quarterlyObjectives[type];
    
    return {
      current,
      target,
      remaining,
      percentage,
      dailyNeeded,
      weeklyNeeded,
      currentDaily,
      targetDaily
    };
  };

  // Fonctions utilitaires pour calculer les jours écoulés
  const getDaysPassedInMonth = (): number => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const daysPassed = Math.ceil((today.getTime() - firstDayOfMonth.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.ceil(daysPassed * 0.7); // Estimation des jours travaillés (70%)
  };

  const getDaysPassedInQuarter = (): number => {
    const today = new Date();
    const currentQuarter = Math.floor(today.getMonth() / 3);
    const quarterStartMonth = currentQuarter * 3;
    const quarterStart = new Date(today.getFullYear(), quarterStartMonth, 1);
    const daysPassed = Math.ceil((today.getTime() - quarterStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.ceil(daysPassed * 0.7); // Estimation des jours travaillés (70%)
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 100) return '#10B981'; // Vert - Objectif atteint
    if (percentage >= 80) return '#3B82F6';  // Bleu - Bon rythme
    if (percentage >= 60) return '#F59E0B';  // Orange - Attention
    if (percentage >= 40) return '#EF4444';  // Rouge - Critique
    return '#6B7280'; // Gris - Très critique
  };

  const getMotivationalMessage = (progress: ProgressData, period: 'weekly' | 'monthly' | 'quarterly'): string => {
    const { percentage, remaining, dailyNeeded } = progress;
    const periodLabel = period === 'weekly' ? 'semaine' : period === 'monthly' ? 'mois' : 'trimestre';
    
    if (percentage >= 100) {
      return `🎉 Objectif ${periodLabel} atteint ! Félicitations !`;
    } else if (percentage >= 80) {
      return `🚀 Excellent rythme ! Plus que ${remaining} pour finir le ${periodLabel} !`;
    } else if (percentage >= 60) {
      return `💪 Bon rythme ! Il faut ${dailyNeeded} par jour pour rattraper !`;
    } else if (percentage >= 40) {
      return `⚠️ Attention ! Intensifiez l'effort : ${dailyNeeded} par jour requis !`;
    } else {
      return `🚨 Effort critique nécessaire ! ${dailyNeeded} par jour minimum !`;
    }
  };

  // Fonction pour obtenir les membres de l'équipe présents sur le terrain
  const getTeamMembersOnField = (): TeamMember[] => {
    return teamMembers.filter(member => member.presence.terrain);
  };

  // Fonction pour obtenir les membres de l'équipe présents au bureau
  const getTeamMembersInOffice = (): TeamMember[] => {
    return teamMembers.filter(member => 
      member.presence.bureau_formation || member.presence.bureau_presentation
    );
  };

  return {
    currentWeek,
    presence,
    configurableWeeklyObjectives,
    monthlyObjectives,
    quarterlyObjectives,
    teamMembers,
    updatePlanning,
    updateObjectif,
    updatePresence,
    updateConfigurableWeeklyObjective,
    updateMonthlyObjective,
    updateQuarterlyObjective,
    setPresenceType,
    getPresenceType,
    getPresenceLabel,
    getDailyObjectives,
    getWeeklyObjectives,
    isWorkingDay,
    getWorkingDays,
    getCurrentDay,
    getWeeklyProgress,
    getMonthlyProgress,
    getQuarterlyProgress,
    getProgressColor,
    getMotivationalMessage,
    getTeamMembersOnField,
    getTeamMembersInOffice
  };
}