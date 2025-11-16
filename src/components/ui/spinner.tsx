/**
 * Spinner 组件
 * 统一的加载动画组件，符合品牌风格
 */

import { cn } from "@/lib/utils";

interface SpinnerProps {
  /**
   * 尺寸大小
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  
  /**
   * 颜色变体
   * @default "primary"
   */
  variant?: "primary" | "secondary" | "accent" | "muted";
  
  /**
   * 自定义类名
   */
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

const variantClasses = {
  primary: "text-primary-500",
  secondary: "text-secondary-400",
  accent: "text-accent-500",
  muted: "text-muted-foreground",
};

export function Spinner({ 
  size = "md", 
  variant = "primary",
  className 
}: SpinnerProps) {
  return (
    <svg
      className={cn(
        "animate-spin",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

