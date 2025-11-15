import { brand } from "@/lib/brand";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-sans">
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-12 py-16 px-8">
        {/* 品牌标题区域 */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-foreground">
            {brand.name}
          </h1>
          <p className="text-xl text-muted-foreground">
            {brand.slogan}
          </p>
        </div>

        {/* 品牌色彩展示 */}
        <div className="w-full space-y-8">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                主色调 / Primary Color
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                智慧蓝 #4B6CB7 - 用于重要按钮、导航
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 lg:grid-cols-11">
              {Object.entries(brand.colors.primary).map(([key, value]) => (
                <div
                  key={key}
                  className="flex flex-col items-center gap-2 rounded-lg p-4"
                  style={{ backgroundColor: value }}
                >
                  <div className="text-sm font-medium text-white drop-shadow-md">
                    {key}
                  </div>
                  <div className="text-xs text-white/80 drop-shadow-md">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                辅色 / Secondary Color
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                活力黄 #FFD166 - 用于提醒、行动号召
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 lg:grid-cols-11">
              {Object.entries(brand.colors.secondary).map(([key, value]) => (
                <div
                  key={key}
                  className="flex flex-col items-center gap-2 rounded-lg p-4"
                  style={{ backgroundColor: value }}
                >
                  <div className={`text-sm font-medium drop-shadow-md ${
                    parseInt(key) >= 300 ? 'text-gray-900' : 'text-white'
                  }`}>
                    {key}
                  </div>
                  <div className={`text-xs drop-shadow-md ${
                    parseInt(key) >= 300 ? 'text-gray-700' : 'text-white/80'
                  }`}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                点缀色 / Accent Color
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                成功绿 #06D6A0 - 用于完成状态、积极反馈
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 lg:grid-cols-11">
              {Object.entries(brand.colors.accent).map(([key, value]) => (
                <div
                  key={key}
                  className="flex flex-col items-center gap-2 rounded-lg p-4"
                  style={{ backgroundColor: value }}
                >
                  <div className="text-sm font-medium text-white drop-shadow-md">
                    {key}
                  </div>
                  <div className="text-xs text-white/80 drop-shadow-md">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* shadcn/ui Button 组件展示 */}
        <div className="w-full space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              shadcn/ui Button 组件 / Button Components
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              基于品牌色彩配置的按钮主题变体
            </p>
          </div>

          {/* 主色调按钮组 */}
          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">
                主色调 - 智慧蓝 (Primary)
              </h3>
              <p className="text-sm text-muted-foreground">
                用于重要按钮、导航元素
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="default">主要按钮</Button>
              <Button variant="outline">轮廓按钮</Button>
              <Button variant="ghost">幽灵按钮</Button>
              <Button variant="link">链接按钮</Button>
            </div>
          </div>

          {/* 辅色按钮组 */}
          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">
                辅色 - 活力黄 (Secondary)
              </h3>
              <p className="text-sm text-muted-foreground">
                用于提醒、行动号召
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary">提醒按钮</Button>
              <Button variant="outline-secondary">轮廓按钮</Button>
            </div>
          </div>

          {/* 点缀色按钮组 */}
          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">
                点缀色 - 成功绿 (Success)
              </h3>
              <p className="text-sm text-muted-foreground">
                用于完成状态、积极反馈
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="success">完成状态</Button>
              <Button variant="outline-success">轮廓按钮</Button>
            </div>
          </div>

          {/* 其他按钮变体 */}
          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">
                其他变体 / Other Variants
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="destructive">删除操作</Button>
              <Button variant="default" disabled>禁用按钮</Button>
            </div>
          </div>

          {/* 按钮尺寸 */}
          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">
                按钮尺寸 / Button Sizes
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="default" size="sm">小号</Button>
              <Button variant="default" size="default">默认</Button>
              <Button variant="default" size="lg">大号</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
