/**
 * 品牌配置
 * Brand Configuration
 */
export const brand = {
  name: "Recall Mate",
  slogan: "Your Thoughtful Memory Partner",
  colors: {
    // 主色调 - Primary (智慧蓝 #4B6CB7) - 用于重要按钮、导航
    primary: {
      50: "#EFF2F9",
      100: "#D9E0F0",
      200: "#B8C7E3",
      300: "#8FA5D2",
      400: "#6B84C0",
      500: "#4B6CB7", // 品牌主色 - 智慧蓝
      600: "#3A5AA5",
      700: "#304A8A",
      800: "#2C3F72",
      900: "#29385F",
      950: "#1A2438",
    },
    // 辅色 - Secondary (活力黄 #FFD166) - 用于提醒、行动号召
    secondary: {
      50: "#FFFBF0",
      100: "#FFF5D9",
      200: "#FFE8B3",
      300: "#FFD880",
      400: "#FFD166", // 品牌辅色 - 活力黄
      500: "#FFC233",
      600: "#FFA500",
      700: "#E68900",
      800: "#CC7700",
      900: "#A66300",
      950: "#7A4A00",
    },
    // 点缀色 - Accent (成功绿 #06D6A0) - 用于完成状态、积极反馈
    accent: {
      50: "#E6FDF7",
      100: "#B3FAE8",
      200: "#80F7D9",
      300: "#4DF4CA",
      400: "#1AF1BB",
      500: "#06D6A0", // 品牌点缀色 - 成功绿
      600: "#05B886",
      700: "#049A6C",
      800: "#037C52",
      900: "#025E38",
      950: "#01401E",
    },
  },
} as const;

