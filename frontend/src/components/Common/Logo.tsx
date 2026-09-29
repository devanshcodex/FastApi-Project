import { Link } from "@tanstack/react-router"

import { cn } from "@/lib/utils"

interface LogoProps {
  variant?: "full" | "icon" | "responsive"
  className?: string
  asLink?: boolean
}

export function Logo({ variant = "full", className, asLink = true }: LogoProps) {
  const content = variant === "icon" ? (
    <div className={cn("flex size-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground", className)}>T</div>
  ) : (
    <div className={cn("font-bold tracking-tight", className)}>
      Task<span className="text-primary">Flow</span>
    </div>
  )

  if (!asLink) return content
  return <Link to="/">{content}</Link>
}
