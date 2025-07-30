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
  score?: number;
}

export class FeedbackEngine {
  static analyze(data: DailyData): FeedbackResult {
    const { portes, vus, closes, telephones, ventes } = data;
    
    // Vérification des données de base
    if (portes === 0) {
      return {
        message: "Commencez par saisir le nombre de portes visitées",
        type: 'warning',
        score: 0
      };
    }

    // Calcul des taux de conversion
    const rates = {
      vus: vus / portes,
      closes: closes / vus,
      telephones: telephones / closes,
      ventes: ventes / telephones
    };

    // Analyse des performances
    const analysis = this.analyzePerformance(rates, data);
    
    return {
      message: analysis.message,
      type: analysis.type,
      suggestions: analysis.suggestions,
      score: analysis.score
    };
  }

  private static analyzePerformance(rates: any, data: DailyData) {
    const suggestions: string[] = [];
    let score = 10;
    let type: 'success' | 'warning' | 'error' = 'success';

    // Analyse du taux de vus (objectif: 40-60%)
    if (rates.vus < 0.3) {
      suggestions.push("🏠 Travaillez les créneaux horaires - trop de portes fermées");
      suggestions.push("⏰ Privilégiez les heures de présence (17h-20h)");
      score -= 2;
      type = 'error';
    } else if (rates.vus < 0.4) {
      suggestions.push("🔄 Ajustez légèrement vos horaires pour plus de présence");
      score -= 1;
      if (type === 'success') type = 'warning';
    } else if (rates.vus > 0.7) {
      suggestions.push("⚡ Excellent taux de présence ! Continuez !");
      score += 1;
    }

    // Analyse du taux de closes (objectif: 50-70%)
    if (rates.closes < 0.4 && data.vus > 0) {
      suggestions.push("🎯 Travaillez votre accroche - trop de refus directs");
      suggestions.push("💬 Préparez 2-3 phrases d'accroche différentes");
      score -= 3;
      type = 'error';
    } else if (rates.closes < 0.5 && data.vus > 0) {
      suggestions.push("📈 Bonne accroche, peaufinez l'argumentation");
      score -= 1;
      if (type === 'success') type = 'warning';
    } else if (rates.closes > 0.7) {
      suggestions.push("🏆 Excellente accroche ! Vous savez capter l'attention");
      score += 1;
    }

    // Analyse du taux de téléphones (objectif: 40-60%)
    if (rates.telephones < 0.3 && data.closes > 0) {
      suggestions.push("📞 Renforcez la collecte de téléphones - c'est la clé !");
      suggestions.push("🔑 Insistez sur l'intérêt du produit avant de demander");
      score -= 3;
      type = 'error';
    } else if (rates.telephones < 0.4 && data.closes > 0) {
      suggestions.push("📲 Bonne collecte, insistez sur l'importance du suivi");
      score -= 1;
      if (type === 'success') type = 'warning';
    } else if (rates.telephones > 0.6) {
      suggestions.push("🎖️ Excellent taux de téléphones collectés !");
      score += 1;
    }

    // Analyse du taux de ventes (objectif: 15-25%)
    if (rates.ventes < 0.1 && data.telephones > 0) {
      suggestions.push("💰 Travaillez vos relances et votre closing");
      suggestions.push("📋 Préparez un script de relance structuré");
      score -= 2;
      type = 'error';
    } else if (rates.ventes < 0.15 && data.telephones > 0) {
      suggestions.push("🔄 Améliorez vos techniques de relance");
      score -= 1;
      if (type === 'success') type = 'warning';
    } else if (rates.ventes > 0.25) {
      suggestions.push("💎 Taux de conversion exceptionnel ! Bravo !");
      score += 2;
    }

    // Messages motivationnels selon le score
    let message = "";
    if (score >= 9) {
      message = "🎯 Performance exceptionnelle ! Vous dominez votre secteur !";
    } else if (score >= 7) {
      message = "🌟 Très bonne performance ! Quelques ajustements pour exceller";
    } else if (score >= 5) {
      message = "📈 Performance correcte avec des axes d'amélioration";
    } else if (score >= 3) {
      message = "⚠️ Des améliorations importantes sont nécessaires";
    } else {
      message = "🚨 Performance critique - Focus sur les fondamentaux";
    }

    return {
      message,
      type,
      suggestions,
      score: Math.max(0, Math.min(10, score))
    };
  }

  static getMotivationalMessage(score: number): string {
    if (score >= 9) return "🏆 Vous êtes un champion ! Continuez ainsi !";
    if (score >= 7) return "🌟 Excellente journée ! Vous êtes sur la bonne voie !";
    if (score >= 5) return "📈 Bonne progression ! Travaillez les points faibles !";
    if (score >= 3) return "💪 Courage ! Chaque effort compte !";
    return "🚀 Demain sera meilleur ! Gardez la motivation !";
  }
}