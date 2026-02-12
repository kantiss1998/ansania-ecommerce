import React from "react";

import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "narrow" | "wide" | "full";
  as?: React.ElementType;
}

export const Container = ({
  children,
  className,
  variant = "default",
  as: Component = "div",
  ...props
}: ContainerProps) => {
  const variants = {
    default: "max-w-7xl",
    narrow: "max-w-4xl",
    wide: "max-w-[1440px]",
    full: "max-w-full px-0",
  };

  return (
    <Component
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
