/**
 * 用户画像类型定义
 * User Profile Type Definitions
 */

// 作息规律
export interface SleepPattern {
  bedtime: string; // 就寝时间，如 "23:00"
  wakeTime: string; // 起床时间，如 "07:00"
  sleepDuration: number; // 睡眠时长（小时）
  sleepQuality: "excellent" | "good" | "fair" | "poor"; // 睡眠质量
  regularity: number; // 规律性评分 0-100
}

// 工作模式
export interface WorkPattern {
  workHours: {
    start: string; // 工作开始时间
    end: string; // 工作结束时间
  };
  workDays: number[]; // 工作日，0-6 (0=周日)
  workStyle: "remote" | "office" | "hybrid" | "flexible"; // 工作方式
  productivityPeak: "morning" | "afternoon" | "evening" | "night"; // 效率高峰期
  breakFrequency: number; // 休息频率（次/天）
}

// 健康需求
export interface HealthNeeds {
  exerciseFrequency: "daily" | "weekly" | "occasional" | "rarely"; // 运动频率
  exerciseTime: string; // 偏好运动时间
  waterIntake: number; // 每日饮水量（毫升）
  mealTimes: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  healthGoals: string[]; // 健康目标
  medications: Array<{
    name: string;
    time: string;
    frequency: string;
  }>;
}

// 行为模式
export interface BehaviorPattern {
  communicationStyle: "direct" | "diplomatic" | "analytical" | "expressive"; // 沟通风格
  decisionMaking: "quick" | "deliberate" | "collaborative" | "intuitive"; // 决策方式
  stressResponse: "calm" | "moderate" | "high"; // 压力反应
  socialActivity: "high" | "moderate" | "low"; // 社交活跃度
  preferredChannels: string[]; // 偏好的沟通渠道
}

// 记忆特征
export interface MemoryCharacteristics {
  shortTermCapacity: number; // 短期记忆容量 0-100
  longTermRetention: number; // 长期记忆保留率 0-100
  recallSpeed: "fast" | "moderate" | "slow"; // 回忆速度
  preferredMemoryAids: string[]; // 偏好的记忆辅助方式
  forgetfulnessPatterns: string[]; // 遗忘模式
}

// 消费偏好
export interface ConsumptionPreferences {
  budgetRange: {
    min: number;
    max: number;
  };
  spendingCategories: Array<{
    category: string;
    percentage: number; // 占比 0-100
  }>;
  shoppingFrequency: "daily" | "weekly" | "monthly" | "as-needed"; // 购物频率
  preferredBrands: string[]; // 偏好品牌
  priceSensitivity: "high" | "moderate" | "low"; // 价格敏感度
}

// 习惯分析
export interface HabitAnalysis {
  dailyHabits: Array<{
    name: string;
    time: string;
    frequency: "daily" | "weekly" | "occasional";
    consistency: number; // 一致性评分 0-100
  }>;
  weeklyHabits: Array<{
    name: string;
    day: string;
    frequency: number; // 每周次数
  }>;
  habitStrengths: string[]; // 习惯优势
  habitChallenges: string[]; // 习惯挑战
}

// 个性标签
export interface PersonalityTags {
  traits: string[]; // 个性特质，如 ["organized", "creative", "analytical"]
  values: string[]; // 价值观，如 ["efficiency", "work-life-balance"]
  interests: string[]; // 兴趣爱好
  strengths: string[]; // 优势
  areasForGrowth: string[]; // 成长领域
}

// 统一用户画像
export interface UserProfile {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  
  // 核心维度
  sleepPattern: SleepPattern;
  workPattern: WorkPattern;
  healthNeeds: HealthNeeds;
  behaviorPattern: BehaviorPattern;
  memoryCharacteristics: MemoryCharacteristics;
  consumptionPreferences: ConsumptionPreferences;
  habitAnalysis: HabitAnalysis;
  personalityTags: PersonalityTags;
  
  // 元数据
  profileCompleteness: number; // 画像完整度 0-100
  lastAnalysisDate: string; // 最后分析日期
}

// 默认用户画像
export const defaultUserProfile: UserProfile = {
  id: "default",
  name: "用户",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  
  sleepPattern: {
    bedtime: "23:00",
    wakeTime: "07:00",
    sleepDuration: 8,
    sleepQuality: "good",
    regularity: 70,
  },
  
  workPattern: {
    workHours: {
      start: "09:00",
      end: "18:00",
    },
    workDays: [1, 2, 3, 4, 5],
    workStyle: "hybrid",
    productivityPeak: "morning",
    breakFrequency: 3,
  },
  
  healthNeeds: {
    exerciseFrequency: "weekly",
    exerciseTime: "18:00",
    waterIntake: 2000,
    mealTimes: {
      breakfast: "08:00",
      lunch: "12:30",
      dinner: "19:00",
    },
    healthGoals: [],
    medications: [],
  },
  
  behaviorPattern: {
    communicationStyle: "direct",
    decisionMaking: "deliberate",
    stressResponse: "moderate",
    socialActivity: "moderate",
    preferredChannels: ["app", "email"],
  },
  
  memoryCharacteristics: {
    shortTermCapacity: 70,
    longTermRetention: 60,
    recallSpeed: "moderate",
    preferredMemoryAids: ["reminder", "note"],
    forgetfulnessPatterns: [],
  },
  
  consumptionPreferences: {
    budgetRange: {
      min: 0,
      max: 10000,
    },
    spendingCategories: [],
    shoppingFrequency: "as-needed",
    preferredBrands: [],
    priceSensitivity: "moderate",
  },
  
  habitAnalysis: {
    dailyHabits: [],
    weeklyHabits: [],
    habitStrengths: [],
    habitChallenges: [],
  },
  
  personalityTags: {
    traits: [],
    values: [],
    interests: [],
    strengths: [],
    areasForGrowth: [],
  },
  
  profileCompleteness: 20,
  lastAnalysisDate: new Date().toISOString(),
};

