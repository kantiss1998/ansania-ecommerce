import React from "react";

import { cn } from "@/lib/utils";

import { Container } from "./Container";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  background?: "default" | "muted" | "primary" | "secondary" | "dark";
  containerVariant?: "default" | "narrow" | "wide" | "full";
}

export const Section = ({
  children,
  className,
  spacing = "md",
  background = "default",
  containerVariant = "default",
  ...props
}: SectionProps) => {
  const spacings = {
    none: "py-0",
    sm: "py-8 md:py-12",
    md: "py-12 md:py-20",
    lg: "py-20 md:py-32",
    xl: "py-32 md:py-48",
  };

  const backgrounds = {
    default: "bg-transparent",
    muted: "bg-gray-50",
    primary: "bg-primary-50",
    secondary: "bg-secondary-light",
    dark: "bg-gray-900 text-white",
  };

  return (
    <section
      className={cn(spacings[spacing], backgrounds[background], className)}
      {...props}
    >
      <Container variant={containerVariant}>{children}</Container>
    </section>
  );
};
