import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UserProfile {
  firstName: string;
  level: string;
  levelName: string;
}

interface UserContextType {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  levels: Array<{
    code: string;
    name: string;
    description: string;
  }>;
  getLevelColor: (level: string) => string;
  getLevelIndex: (level: string) => number;
  isAtLeastLevel: (userLevel: string, requiredLevel: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: 'Jean',
    level: 'COD6+',
    levelName: 'Franchisé'
  });

  const levels = [
    { code: 'COD1', name: 'Débutant', description: 'Accès aux fonctionnalités de base' },
    { code: 'COD2', name: 'Junior', description: 'Accès aux statistiques avancées' },
    { code: 'COD3', name: 'Commercial', description: 'Accès complet aux outils commerciaux' },
    { code: 'COD4', name: 'Senior', description: 'Accès aux outils de formation + consultation réseau' },
    { code: 'COD5', name: 'Manager', description: 'Accès aux outils de gestion d\'équipe + consultation réseau' },
    { code: 'COD6+', name: 'Franchisé', description: 'Accès complet + gestion de réseau' }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'COD1': return '#6B7280';
      case 'COD2': return '#3B82F6';
      case 'COD3': return '#10B981';
      case 'COD4': return '#F59E0B';
      case 'COD5': return '#8B5CF6';
      case 'COD6+': return '#EF4444';
      default: return '#3B82F6';
    }
  };

  const getLevelIndex = (level: string): number => {
    const levelOrder = ['COD1', 'COD2', 'COD3', 'COD4', 'COD5', 'COD6+'];
    return levelOrder.indexOf(level);
  };

  const isAtLeastLevel = (userLevel: string, requiredLevel: string): boolean => {
    return getLevelIndex(userLevel) >= getLevelIndex(requiredLevel);
  };
  return (
    <UserContext.Provider value={{
      userProfile,
      setUserProfile,
      levels,
      getLevelColor,
      getLevelIndex,
      isAtLeastLevel
    }}>
      {children}
    </UserContext.Provider>
  );
};