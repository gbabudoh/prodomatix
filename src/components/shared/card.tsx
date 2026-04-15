import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "glass" | "gradient";
  hover?: boolean;
}

export function Card({
  children,
  className,
  variant = "default",
  hover = false,
  ...props
}: CardProps) {
  const variants = {
    default: "bg-gray-900/80 border border-gray-800 shadow-sm",
    glass: "bg-gray-900/40 backdrop-blur-xl border border-gray-700/50",
    gradient:
      "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700",
  };

  return (
    <div
      className={cn(
        "rounded-xl p-4 transition-all duration-200",
        variants[variant],
        hover && "cursor-pointer hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold text-white", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-gray-400 mt-1", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-4 pt-4 border-t border-gray-800", className)}
      {...props}
    >
      {children}
    </div>
  );
}
