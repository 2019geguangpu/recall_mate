import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        // 主色调 - 智慧蓝 (#4B6CB7) - 用于重要按钮、导航
        default: "bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500/50 dark:bg-primary-500 dark:hover:bg-primary-600",
        // 辅色 - 活力黄 (#FFD166) - 用于提醒、行动号召
        secondary:
          "bg-secondary-400 text-gray-900 hover:bg-secondary-500 focus-visible:ring-secondary-400/50 dark:bg-secondary-400 dark:hover:bg-secondary-500 dark:text-gray-900",
        // 点缀色 - 成功绿 (#06D6A0) - 用于完成状态、积极反馈
        success:
          "bg-accent-500 text-white hover:bg-accent-600 focus-visible:ring-accent-500/50 dark:bg-accent-500 dark:hover:bg-accent-600",
        // 破坏性操作
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        // 轮廓样式 - 使用主色调边框
        outline:
          "border-2 border-primary-500 bg-transparent text-primary-500 shadow-xs hover:bg-primary-50 hover:text-primary-600 focus-visible:ring-primary-500/50 dark:border-primary-500 dark:bg-transparent dark:text-primary-400 dark:hover:bg-primary-950 dark:hover:text-primary-300",
        // 次要轮廓样式 - 使用辅色边框
        "outline-secondary":
          "border-2 border-secondary-400 bg-transparent text-gray-900 shadow-xs hover:bg-secondary-50 hover:border-secondary-500 focus-visible:ring-secondary-400/50 dark:border-secondary-400 dark:text-gray-900 dark:hover:bg-secondary-950",
        // 成功轮廓样式 - 使用点缀色边框
        "outline-success":
          "border-2 border-accent-500 bg-transparent text-accent-500 shadow-xs hover:bg-accent-50 hover:text-accent-600 focus-visible:ring-accent-500/50 dark:border-accent-500 dark:text-accent-400 dark:hover:bg-accent-950 dark:hover:text-accent-300",
        // 幽灵样式 - 使用主色调
        ghost:
          "hover:bg-primary-50 hover:text-primary-600 focus-visible:ring-primary-500/50 dark:hover:bg-primary-950 dark:hover:text-primary-300",
        // 链接样式 - 使用主色调
        link: "text-primary-500 underline-offset-4 hover:underline hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
