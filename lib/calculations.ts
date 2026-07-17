export function formatPKR(amount: number): string {
  if (amount === 0) return 'Rs. 0';
  if (amount >= 10000000) return `Rs. ${(amount / 10000000).toFixed(2)} Crore`;
  if (amount >= 100000) return `Rs. ${(amount / 100000).toFixed(2)} Lakh`;
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

export function calculateGreedScore(
  dowry: number,
  groomBackground: string,
  groomIncome: number = 0,
  brideFatherIncome: number = 0,
  brideEmploymentStatus: string = 'not-employed'
): number {
  const groomAnnualIncome = groomIncome * 12;
  const brideFatherAnnualIncome = brideFatherIncome * 12;

  // 1. Affordability strain on bride's family (0-40 points)
  let affordabilityPoints = 0;
  if (brideFatherAnnualIncome > 0) {
    const affordabilityRatio = dowry / brideFatherAnnualIncome;
    if (affordabilityRatio >= 5) affordabilityPoints = 40;
    else if (affordabilityRatio >= 2) affordabilityPoints = 20 + ((affordabilityRatio - 2) / 3) * 20;
    else if (affordabilityRatio >= 1) affordabilityPoints = 10 + (affordabilityRatio - 1) * 10;
    else affordabilityPoints = affordabilityRatio * 10;
  } else {
    affordabilityPoints = 20;
  }

  // 2. How unjustified the demand is given groom's own income (0-35 points)
  let selfSufficiencyPoints = 0;
  if (groomAnnualIncome > 0) {
    const relianceRatio = dowry / groomAnnualIncome;
    if (relianceRatio >= 5) selfSufficiencyPoints = 35;
    else if (relianceRatio >= 2) selfSufficiencyPoints = 20 + ((relianceRatio - 2) / 3) * 15;
    else if (relianceRatio >= 1) selfSufficiencyPoints = 10 + (relianceRatio - 1) * 10;
    else selfSufficiencyPoints = relianceRatio * 10;
  } else {
    selfSufficiencyPoints = 35;
  }

  // 3. Raw amount (0-15 points)
  const amountPoints = Math.min((dowry / 5000000) * 15, 15);

  // 4. Background adjustment
  const backgroundAdjustment: Record<string, number> = {
    'wealthy': -5,
    'upper-middle': 0,
    'middle-class': 2,
    'lower-middle': 5,
  };
  const bgAdjust = backgroundAdjustment[groomBackground] ?? 0;

  // 5. Bride's financial independence discount
  let brideDiscount = 0;
  if (brideEmploymentStatus === 'job' || brideEmploymentStatus === 'business') brideDiscount = -8;
  else if (brideEmploymentStatus === 'student') brideDiscount = -3;

  const total = affordabilityPoints + selfSufficiencyPoints + amountPoints + bgAdjust + brideDiscount;
  return Math.min(Math.max(total, 0), 100);
}

export function calculateHumanityScore(
  dowry: number,
  expectations: string[],
  brideEmploymentStatus: string = 'not-employed',
  brideFatherIncome: number = 0,
  groomIncome: number = 0
): number {
  // Humanity is fully INDEPENDENT of greed score.
  // It measures how fair/ethical the arrangement is on its own terms.
  
  // Start at 50 — neutral baseline
  let score = 50;

  // 1. Absolute dowry amount penalty (-30 to 0)
  // The bigger the demand, the less humane regardless of who's rich
  if (dowry >= 10000000) score -= 30;        // 1 Crore+
  else if (dowry >= 5000000) score -= 20;    // 50 Lakh+
  else if (dowry >= 2000000) score -= 10;    // 20 Lakh+
  else if (dowry >= 500000) score -= 5;      // 5 Lakh+
  else score += 5;                            // Small/reasonable amount

  // 2. Bride's financial independence boost (+0 to +25)
  // If the bride contributes financially, the dynamic is more equal
  if (brideEmploymentStatus === 'job' || brideEmploymentStatus === 'business') score += 25;
  else if (brideEmploymentStatus === 'student') score += 10;
  // not-employed = no boost

  // 3. Groom's self-sufficiency boost (+0 to +20)
  // If groom earns well, demanding dowry is less ethical
  const groomAnnualIncome = groomIncome * 12;
  if (groomAnnualIncome > 0) {
    const ratio = dowry / groomAnnualIncome;
    if (ratio < 0.5) score += 20;       // Groom could easily afford himself
    else if (ratio < 1) score += 12;
    else if (ratio < 2) score += 5;
    else score -= 5;                     // Groom is offloading burden
  }

  // 4. Bride's family burden awareness (+0 to +10)
  const brideFatherAnnual = brideFatherIncome * 12;
  if (brideFatherAnnual > 0) {
    const burden = dowry / brideFatherAnnual;
    if (burden < 0.5) score += 10;      // Very affordable for family
    else if (burden < 1) score += 5;
    else if (burden >= 3) score -= 10;  // Crushing burden
    else if (burden >= 2) score -= 5;
  }

  // 5. Positive expectations bonus (+0 to +10)
  const positiveExpectations = [
    'education', 'career support', 'equal partnership',
    'family harmony', 'mutual respect', 'love', 'understanding',
  ];
  const matches = expectations.filter(e =>
    positiveExpectations.some(pe => e.toLowerCase().includes(pe))
  ).length;
  score += Math.min(matches * 3, 10);

  return Math.min(Math.max(Math.round(score), 0), 100);
}

export function calculateToxicityIndex(greedScore: number, humanityScore: number): number {
  // High greed + low humanity = very toxic
  // These are now truly independent inputs so this gives meaningful results
  const toxicity = greedScore * 0.6 + (100 - humanityScore) * 0.4;
  return Math.min(Math.max(Math.round(toxicity), 0), 100);
}

export function calculateIslamicEthicsScore(greedScore: number, humanityScore: number): number {
  // Islamic ethics rewards low greed AND high humanity equally
  const greedPenalty = (greedScore / 100) * 50;
  const humanityBonus = (humanityScore / 100) * 50;
  return Math.min(Math.max(Math.round(50 - greedPenalty + humanityBonus), 0), 100);
}

export function calculateRecoveryImpact(loanAmount: number, monthlyIncome: number): number {
  if (monthlyIncome === 0) return 100;
  const ratio = loanAmount / (monthlyIncome * 12);
  return Math.min(ratio * 10, 10);
}

export function generateAICommentary(greedScore: number, humanityScore: number, toxicityScore: number): string {
  const extreme = [
    "Jahaiz aik laanat hai — aur aap us laanat ke CEO hain. Head office bhi ghar pe hai. 🏢",
    "Humein sirf aapki beti chahiye — aur fridge, car, sofa set, gold, cash, aur property. Bas itna sa chota sa kaam. 😇",
    "Jab beti bhi aap dein ge aur ghar ka samaan bhi aap dein ge toh beta rukhsat bhi kar dein — humein beech mein aane ki zaroorat hi kya hai? 🚪",
    "Beghairat ho aap — seedha bol dete 'beti mat do, sirf jahaiz courier kar do.' Home delivery free hai? 🚚",
    "Ye jahaiz hai ya Itwaar Bazaar? Fridge, sofa, car, AC... bas tandoor aur khokha reh gaya hai list mein. 🛒",
    "Is score pe toh laanat bhi sharmaaye. Double laanat — aik Allah ki taraf se, aik is calculator ki taraf se. 📱",
  ];
  const veryHigh = [
    "Humein toh sirf aapki beti chahiye — aur uske saath jo kuch bhi unhone apni poori zindagi mein kamaya. Bas. 😌",
    "Itna jahaiz maanga ke larki ke baap ne socha — beta hi de deta hoon, sasta padega. 👦",
    "Beghairat ho bhai — pehle kaha 'humein sirf beti chahiye' aur phir list nikali jo supermarket catalogue se bari thi. 📋",
    "Jahaiz ek laanat hai aur aap ne us laanat ko career bana liya hai. LinkedIn pe daalo: 'Professional Jahaiz Demander.' 💼",
    "Larki ke baap ne bank loan apply kiya — manager ne poochi purpose: 'Shaadi.' Manager ne bola: 'Sorry, ye mortgage qualify nahi karta.' 🏦",
  ];
  const high = [
    "Humein sirf aapki beti chahiye — kehte kehte car aur fridge bhi maang li. Sirf wala matlab samajh nahi aaya. 🤦",
    "Jab ghar ka samaan bhi hum dein ge toh dulha kya leke aaya hai? Khud ko? Kafi nahi hai yaar. 😐",
    "Thodi beghairti, thodi sharam — mix mein sharam ki quantity bohot kam hai. Quality control fail. 📉",
    "Ye rishta nahi, ye installment plan hai. 3 saal mein poora jahaiz milega. Terms and conditions apply. 📄",
    "Larki ki qualities? Zero interest. Larki ke baap ki property? Full interest. Priorities crystal clear hain. 💎",
  ];
  const moderate = [
    "Na poori mohabbat, na poora paisa. Ye rishta 'chalta hai' mode mein chal raha hai. ☕",
    "Thodi demands hain, thodi sharam bhi bachi hai — abhi pata nahi kaun jeetega. Live match chal raha hai. 🏏",
    "Beech ka raasta — na Itwaar Bazaar, na dil ka rishta. Somewhere in between, lost in translation. 🗺️",
    "Humein sirf aapki beti chahiye — aur thoda sa jahaiz. Thoda matlab unka alag hai, humara alag. 🤷",
  ];
  const low = [
    "Mashallah! Ye banda actually insaan nikla. Rare species — almost extinct in desi rishta market. 🦋",
    "Na jahaiz ki list, na beghairti — seedha dil se rishta maanga. Aaj kal itna mushkil hai ke news banta hai. 📰",
    "Humein sirf aapki beti chahiye — aur is baar ye sach mein sirf beti chahiye. Plot twist of the century. 🎭",
    "Greed score itna low? Ya toh bohot acha insaan hai, ya abhi list complete nahi ki. Dua karo pehla option ho. 🤲",
    "Jab ghar ka samaan unhone nahi maanga toh larki ke baap ne socha — kuch toh gadbad hai. Trust issues dono taraf. 😅",
  ];

  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  if (greedScore >= 90) return pick(extreme);
  if (greedScore >= 75) return pick(veryHigh);
  if (greedScore >= 55) return pick(high);
  if (greedScore >= 35) return pick(moderate);
  return pick(low);
}

export function generateSatiricalResponse(greedScore: number): string {
  const extreme = [
    "Mubarak ho! Aapne jahaiz ko ek thriving business mein convert kar diya. Next step: franchise. 🏪",
    "Ye dulha nahi, ye moving company hai — sab kuch ek jagah se doosri jagah shift ho raha hai. Larki ke ghar se. 🚛",
    "Beghairat Hall of Fame mein aapka naam golden letters mein likha ja raha hai. Proud moment. 🏆",
    "Jahaiz laanat hai — ye baat sunne mein 5 seconds lagte hain. List banana mein 5 din lage. Priorities. ⏱️",
    "Larki ke baap ne retirement cancel kar diya. New plan: jahaiz bharo, phir dekhte hain. 📅",
    "Itwaar Bazaar se bhi zyada items hain is list mein. Aur wahan toh discount bhi milta hai. 🛍️",
  ];
  const veryHigh = [
    "Shaadi ka card nahi, ye quotation hai. Revised estimate baad mein aayegi. 🧾",
    "Humein sirf aapki beti chahiye — aur ye 47 items. Sirf. 😇",
    "Larki wale itne items sun ke somnambulant ho gaye — neend mein bhi jahaiz ki list bol rahe hain. 😴",
    "Is rishte mein love story nahi, supply chain hai. Logistics department larki wale hain. 📦",
    "Beta ghar aaya hai ya inventory check karne? Sab cheez note kar raha tha. 📝",
    "Jab beti aur samaan dono hum dein ge toh dulha ne exactly kya contribute kiya? Presence? Kafi nahi yaar. 🤷",
  ];
  const high = [
    "Mohabbat thi — lekin jahaiz list ne daba diya. RIP feelings, you will be missed. 💀",
    "60% transaction, 40% rishta. Calculator aage hai, dil peeche. Abhi bhi race chal rahi hai. 🏃",
    "Beghairti ka level: Intermediate. Advanced ke liye aur items add karo list mein. 📈",
    "Larki ke baap ne loan apply kiya — purpose mein likha 'Beti ki Khushi.' Bank ne socha ye kya category hai. 🏦",
  ];
  const moderate = [
    "Na Itwaar Bazaar, na dil ka mela — ye rishta neighborhood kiryana store level pe hai. ☕",
    "Average demands, average rishta. Is couple ka theme song: 'Chalta Hai.' 🎵",
    "Thodi si beghairti bachi hai — lekin sharam bhi completely nahi gayi. Abhi hope hai. 🕯️",
    "Ye rishta 'under construction' hai. Final result ka intezaar karo. 🚧",
  ];
  const low = [
    "Greed score low hai — ya toh ye banda bahut acha hai, ya WiFi slow tha aur list load nahi hui. 📶",
    "Oho! Genuine rishta! Itna rare hai ke David Attenborough documentary bana raha hai is par. 🎥",
    "Na jahaiz, na beghairti — seedha mohabbat. Desi society mein ye rebel move hai. ✊",
    "Larki ke baap ne sunta hai toh roya — khushi se. Pehli baar kisi ne list nahi di. 😢💚",
    "Ye insaan hai ya alien? Itna decent koi hota nahi. Verify karo. 🛸",
  ];

  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  if (greedScore >= 90) return pick(extreme);
  if (greedScore >= 75) return pick(veryHigh);
  if (greedScore >= 55) return pick(high);
  if (greedScore >= 35) return pick(moderate);
  return pick(low);
}

export function generateShareableQuote(greedScore: number, humanityScore: number): string {
  const quotes: string[] = [];

  if (greedScore >= 90) {
    quotes.push(
      "Jahaiz ek laanat hai — aur ye banda us ka brand ambassador hai. 🚮",
      "Itwaar Bazaar wali list thi ya shaadi ki? Dono ek hi lagi. 🛒",
      "Beghairat ho aap — aur ye calculator gawah hai. 📱",
      "Humein sirf aapki beti chahiye — aur ye 50+ cheezein. Sirf. 😇"
    );
  } else if (greedScore >= 70) {
    quotes.push(
      "Jab samaan bhi hum dein ge toh dulha ne kya kiya exactly? 🤔",
      "Humein beti chahiye — kehte kehte fridge bhi maang li. Classic. 🤦",
      "Beghairti intermediate level pe hai. Advanced se door raho. 📉",
      "Jahaiz laanat hai — ye sunna chahiye tha, list banana band hoti. 📋"
    );
  } else if (greedScore >= 50) {
    quotes.push(
      "Na poori mohabbat na poora jahaiz. Ye rishta 'chalta hai' pe hai. ☕",
      "Thodi beghairti, thodi sharam — abhi balance sheet clear nahi. ⚖️"
    );
  } else if (humanityScore >= 80) {
    quotes.push(
      "Humein sirf aapki beti chahiye — aur is baar ye sach mein sirf beti thi. Miracle. 🌹",
      "Na jahaiz, na list — seedha dil se maanga. 2024 mein ye news hai. 📰",
      "Beghairat nahi, be-niyaz hai ye banda. Salute karo. 🫡"
    );
  } else if (humanityScore >= 60) {
    quotes.push(
      "Theek thaak rishta — na bahut acha, na bahut bura.",
      "Kuch insaaniyat bachi hai abhi. Hope is alive. 🕯️"
    );
  } else {
    quotes.push(
      "Complicated hai — lekin kya karo, dil ka kya pata. 🤷",
      "Is rishte ka outcome: Allah ke haath mein. Prayers on. 🤲"
    );
  }

  return quotes[Math.floor(Math.random() * quotes.length)];
}

export function estimateWeddingCost(guests: number, categoryPerHead: number): number {
  return guests * categoryPerHead;
}

export function calculateDownPayment(totalCost: number, percentage: number = 30): number {
  return (totalCost * percentage) / 100;
}