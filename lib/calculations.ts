export function formatPKR(amount: number): string {
  if (amount === 0) return 'Rs. 0';
  
  if (amount >= 10000000) {
    return `Rs. ${(amount / 10000000).toFixed(2)} Crore`;
  }
  if (amount >= 100000) {
    return `Rs. ${(amount / 100000).toFixed(2)} Lakh`;
  }
  
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

export function calculateGreedScore(dowry: number, groomBackground: string): number {
  // Higher dowry = higher greed score (0-100% scale)
  let baseScore = (dowry / 5000000) * 100; // Normalize based on 50 lakh as reference
  
  // Adjust based on background
  const adjustments: Record<string, number> = {
    'wealthy': 0.8, // Wealthier groom, expectations are more proportional
    'middle-class': 1.0,
    'upper-middle': 1.1,
    'lower-middle': 1.4, // Lower income, higher greed relative to ability
  };
  
  const factor = adjustments[groomBackground] || 1.0;
  return Math.min(Math.max(baseScore * factor, 0), 100);
}

export function calculateToxicityIndex(greedScore: number, dowry: number): number {
  // Combines greed score and dowry amount to assess relationship toxicity
  const dowryFactor = (dowry / 5000000) * 40; // Up to 40 points
  const greedFactor = (greedScore / 100) * 60; // Up to 60 points
  return Math.min(dowryFactor + greedFactor, 100);
}

export function calculateIslamicEthicsScore(greedScore: number, humanityScore: number): number {
  // Based on Islamic principles of moderation, kindness, and fairness
  const greedPenalty = (greedScore / 100) * 50; // Greed reduces score
  const humanityBonus = (humanityScore / 100) * 50; // Humanity increases score
  return Math.max(50 - greedPenalty + humanityBonus, 0);
}

export function calculateHumanityScore(dowry: number, expectations: string[]): number {
  // Lower dowry = higher humanity score (0-100% scale)
  let baseScore = Math.max(100 - (dowry / 50000) * 2, 0); // Every 50k reduces score by 2
  
  // Adjust based on expectations
  const positiveExpectations = [
    'education',
    'career support',
    'equal partnership',
    'family harmony',
    'mutual respect',
    'love',
    'understanding',
  ];
  
  const matches = expectations.filter(e => 
    positiveExpectations.some(pe => e.toLowerCase().includes(pe))
  ).length;
  
  baseScore = Math.min(baseScore + (matches * 5), 100);
  
  return Math.max(baseScore, 0);
}

export function calculateRecoveryImpact(loanAmount: number, monthlyIncome: number): number {
  if (monthlyIncome === 0) return 100;
  const ratio = loanAmount / (monthlyIncome * 12);
  return Math.min(ratio * 10, 10);
}

export function generateAICommentary(greedScore: number, humanityScore: number, toxicityScore: number): string {
  if (greedScore > 80) {
    return "Marriage expectations appear heavily material-driven. Love not included in package.";
  }
  if (greedScore > 60) {
    return "Financial pressure risk is elevated. Emotional compatibility may be affected by transactional expectations.";
  }
  if (humanityScore > 80) {
    return "This couple prioritizes emotional connection over material gain. A rare find indeed!";
  }
  if (toxicityScore > 75) {
    return "Severe material demands detected. Emotional pressure indicators suggest relationship strain.";
  }
  if (toxicityScore > 50) {
    return "Moderate financial pressure detected. Consider discussion about realistic expectations.";
  }
  return "Expectations appear balanced with realistic financial considerations.";
}

export function generateSatiricalResponse(greedScore: number): string {
  if (greedScore > 90) {
    return "Congratulations! Human emotions successfully converted into a business transaction. 🎉";
  }
  if (greedScore > 75) {
    return "Marriage successfully transformed into a commercial venture. Profit maximization achieved! 💰";
  }
  if (greedScore > 60) {
    return "Love and greed achieving a harmonious balance. Aristotle's golden mean in action! ⚖️";
  }
  if (greedScore > 40) {
    return "Surprisingly, some humanity remains intact. Marriage still has a pulse! 💚";
  }
  return "Is this actually a Rishta or a genuine connection? Plot twist incoming! 🎭";
}

export function generateShareableQuote(greedScore: number, humanityScore: number): string {
  if (greedScore > 80) {
    return "The greed is REAL with this one! 💸";
  }
  if (greedScore > 60) {
    return "Someone's got expensive taste! 🎯";
  }
  if (humanityScore > 80) {
    return "Bless their heart, they actually care about each other 💚";
  }
  if (humanityScore > 60) {
    return "Not bad! Some humanity left in there 🌟";
  }
  return "It's complicated, but love conquers all (we hope) 🤞";
}

export function estimateWeddingCost(guests: number, categoryPerHead: number): number {
  return guests * categoryPerHead;
}

export function calculateDownPayment(totalCost: number, percentage: number = 30): number {
  return (totalCost * percentage) / 100;
}
