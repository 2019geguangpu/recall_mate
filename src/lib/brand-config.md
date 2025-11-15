# 品牌配置说明 / Brand Configuration

## 品牌信息 / Brand Information

- **名称 / Name**: Recall Mate
- **Slogan**: Your Thoughtful Memory Partner

## 品牌色彩 / Brand Colors

### 主色调 / Primary Color
- **品牌主色**: `#4B6CB7` (智慧蓝 / Wisdom Blue)
- **用途**: 重要按钮、导航元素
- **Tailwind 类**: `bg-primary-500`, `text-primary-500`, `border-primary-500` 等

### 辅色 / Secondary Color
- **品牌辅色**: `#FFD166` (活力黄 / Vitality Yellow)
- **用途**: 提醒、行动号召
- **Tailwind 类**: `bg-secondary-400`, `text-secondary-400`, `border-secondary-400` 等

### 点缀色 / Accent Color
- **品牌点缀色**: `#06D6A0` (成功绿 / Success Green)
- **用途**: 完成状态、积极反馈
- **Tailwind 类**: `bg-accent-500`, `text-accent-500`, `border-accent-500` 等

## 色阶 / Color Scale

### Primary 色阶 (基于 #4B6CB7 - 智慧蓝)
- `primary-50`: #EFF2F9 (最浅)
- `primary-100`: #D9E0F0
- `primary-200`: #B8C7E3
- `primary-300`: #8FA5D2
- `primary-400`: #6B84C0
- `primary-500`: #4B6CB7 ⭐ **品牌主色**
- `primary-600`: #3A5AA5
- `primary-700`: #304A8A
- `primary-800`: #2C3F72
- `primary-900`: #29385F
- `primary-950`: #1A2438 (最深)

### Secondary 色阶 (基于 #FFD166 - 活力黄)
- `secondary-50`: #FFFBF0 (最浅)
- `secondary-100`: #FFF5D9
- `secondary-200`: #FFE8B3
- `secondary-300`: #FFD880
- `secondary-400`: #FFD166 ⭐ **品牌辅色**
- `secondary-500`: #FFC233
- `secondary-600`: #FFA500
- `secondary-700`: #E68900
- `secondary-800`: #CC7700
- `secondary-900`: #A66300
- `secondary-950`: #7A4A00 (最深)

### Accent 色阶 (基于 #06D6A0 - 成功绿)
- `accent-50`: #E6FDF7 (最浅)
- `accent-100`: #B3FAE8
- `accent-200`: #80F7D9
- `accent-300`: #4DF4CA
- `accent-400`: #1AF1BB
- `accent-500`: #06D6A0 ⭐ **品牌点缀色**
- `accent-600`: #05B886
- `accent-700`: #049A6C
- `accent-800`: #037C52
- `accent-900`: #025E38
- `accent-950`: #01401E (最深)

## 使用方式 / Usage

### 在代码中使用品牌配置

```typescript
import { brand } from '@/lib/brand';

// 获取品牌名称
const brandName = brand.name; // "Recall Mate"

// 获取 Slogan
const slogan = brand.slogan; // "Your Thoughtful Memory Partner"

// 获取品牌主色
const primaryColor = brand.colors.primary[500]; // "#4B6CB7"

// 获取品牌辅色
const secondaryColor = brand.colors.secondary[400]; // "#FFD166"

// 获取品牌点缀色
const accentColor = brand.colors.accent[500]; // "#06D6A0"
```

### 在 Tailwind CSS 中使用

```tsx
// 使用主色调（智慧蓝）- 用于重要按钮、导航
<div className="bg-primary-500 text-white">主色调背景</div>
<button className="bg-primary-500 hover:bg-primary-600">主要按钮</button>

// 使用辅色（活力黄）- 用于提醒、行动号召
<div className="bg-secondary-400 text-gray-900">辅色背景</div>
<button className="bg-secondary-400 hover:bg-secondary-500 text-gray-900">提醒按钮</button>

// 使用点缀色（成功绿）- 用于完成状态、积极反馈
<div className="bg-accent-500 text-white">点缀色背景</div>
<button className="bg-accent-500 hover:bg-accent-600">完成状态</button>

// 使用 shadcn/ui 主题变量
<div className="bg-primary text-primary-foreground">使用主题变量</div>
<div className="bg-secondary text-secondary-foreground">使用主题变量</div>
<div className="bg-accent text-accent-foreground">使用主题变量</div>
```

### 在 shadcn/ui 组件中使用

shadcn/ui 组件会自动使用配置的主题色彩：

```tsx
import { Button } from '@/components/ui/button';

// Button 会自动使用 primary 颜色
<Button>主要按钮</Button>

// 使用 variant
<Button variant="secondary">次要按钮</Button>
```

## 主题配置 / Theme Configuration

品牌色彩已集成到 shadcn/ui 主题系统中：

- **Primary**: 使用品牌主色调 (#4B6CB7 - 智慧蓝) - 用于重要按钮、导航
- **Secondary**: 使用品牌辅色 (#FFD166 - 活力黄) - 用于提醒、行动号召
- **Accent**: 使用品牌点缀色 (#06D6A0 - 成功绿) - 用于完成状态、积极反馈
- **Ring**: 使用品牌主色调作为焦点环颜色

所有主题变量都支持明暗两种模式，会根据系统偏好自动切换。

