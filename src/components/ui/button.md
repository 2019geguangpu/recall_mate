# Button 组件使用文档

## 概述

Button 组件是基于 shadcn/ui 的按钮组件，已根据品牌色彩进行了主题配置。

## 品牌色彩映射

| 变体 | 品牌色 | 用途 | 颜色值 |
|------|--------|------|--------|
| `default` | 主色调 (Primary) | 重要按钮、导航 | #4B6CB7 (智慧蓝) |
| `secondary` | 辅色 (Secondary) | 提醒、行动号召 | #FFD166 (活力黄) |
| `success` | 点缀色 (Accent) | 完成状态、积极反馈 | #06D6A0 (成功绿) |
| `destructive` | 破坏性操作 | 删除、危险操作 | 红色系 |
| `outline` | 主色调轮廓 | 次要操作 | 智慧蓝边框 |
| `outline-secondary` | 辅色轮廓 | 次要提醒 | 活力黄边框 |
| `outline-success` | 点缀色轮廓 | 次要成功状态 | 成功绿边框 |
| `ghost` | 幽灵样式 | 轻量操作 | 主色调悬停 |
| `link` | 链接样式 | 文本链接 | 主色调文本 |

## 使用方法

### 基础用法

```tsx
import { Button } from "@/components/ui/button";

// 主要按钮（默认使用主色调 - 智慧蓝）
<Button>主要按钮</Button>

// 辅色按钮（活力黄）
<Button variant="secondary">提醒按钮</Button>

// 成功按钮（成功绿）
<Button variant="success">完成状态</Button>
```

### 所有变体

```tsx
// 主色调系列
<Button variant="default">主要按钮</Button>
<Button variant="outline">轮廓按钮</Button>
<Button variant="ghost">幽灵按钮</Button>
<Button variant="link">链接按钮</Button>

// 辅色系列
<Button variant="secondary">提醒按钮</Button>
<Button variant="outline-secondary">轮廓按钮</Button>

// 点缀色系列
<Button variant="success">完成状态</Button>
<Button variant="outline-success">轮廓按钮</Button>

// 其他
<Button variant="destructive">删除操作</Button>
```

### 尺寸

```tsx
<Button size="sm">小号</Button>
<Button size="default">默认</Button>
<Button size="lg">大号</Button>
<Button size="icon">图标按钮</Button>
```

### 禁用状态

```tsx
<Button disabled>禁用按钮</Button>
```

### 组合使用

```tsx
<div className="flex gap-2">
  <Button variant="default">保存</Button>
  <Button variant="outline">取消</Button>
  <Button variant="success">完成</Button>
  <Button variant="destructive">删除</Button>
</div>
```

## 使用场景建议

### 主色调 (Primary - 智慧蓝)
- ✅ 主要操作按钮（保存、提交、确认）
- ✅ 导航栏按钮
- ✅ 重要表单提交
- ✅ 主要 CTA（行动号召）

### 辅色 (Secondary - 活力黄)
- ✅ 提醒、警告按钮
- ✅ 次要行动号召
- ✅ 需要用户注意的操作

### 点缀色 (Success - 成功绿)
- ✅ 完成状态按钮
- ✅ 成功反馈
- ✅ 积极操作确认

### 破坏性 (Destructive)
- ✅ 删除操作
- ✅ 危险操作
- ✅ 不可逆操作

## 技术细节

- **组件位置**: `src/components/ui/button.tsx`
- **依赖**: 
  - `class-variance-authority` - 变体管理
  - `@radix-ui/react-slot` - 插槽支持
  - `@/lib/utils` - 工具函数（cn）
- **样式系统**: Tailwind CSS + CSS Variables
- **主题支持**: 明暗模式自动适配

## 自定义

如需自定义按钮样式，可以：

1. **修改变体**: 编辑 `src/components/ui/button.tsx` 中的 `buttonVariants`
2. **调整颜色**: 修改 `src/app/globals.css` 中的品牌色彩变量
3. **添加新变体**: 在 `buttonVariants` 的 `variants.variant` 中添加新变体

