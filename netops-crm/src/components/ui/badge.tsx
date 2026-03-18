import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:scale-105",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:shadow-md",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:shadow-sm",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:shadow-md",
        outline: "text-foreground hover:bg-accent hover:text-accent-foreground",
        success: "border-transparent bg-green-500/15 text-green-700 dark:text-green-400 hover:shadow-sm",
        warning: "border-transparent bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 hover:shadow-sm",
        info: "border-transparent bg-blue-500/15 text-blue-700 dark:text-blue-400 hover:shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
