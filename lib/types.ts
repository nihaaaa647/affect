export interface UserProfile {
  country: string;
  city?: string;
  age: string;
  employment: string;
  housing: string;
  income: string;
  loans: string;
  savingsType: string[];
  savingsAmount?: string;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export interface ImpactData {
  impactLine: string;
  impactAmount: string;
  impactAmountSub: string;
  impactSeverity: "HIGH" | "MODERATE" | "LOW";
  impactColor: "red" | "amber" | "green";
  affectedCategories: string[];
  whatHappened: string;
  whyItMattersForYou: string;
}

export interface ArticleWithImpact extends Article {
  impact: ImpactData;
}
