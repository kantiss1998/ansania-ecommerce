import React from "react";

import { cn } from "@/lib/utils";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  sm?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  md?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  lg?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  xl?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
}

export const Grid = ({
  children,
  className,
  cols = 1,
  sm,
  md,
  lg,
  xl,
  gap = 4,
  ...props
}: GridProps) => {
  return (
    <div
      className={cn(
        "grid",
        `grid-cols-${cols}`,
        sm && `sm:grid-cols-${sm}`,
        md && `md:grid-cols-${md}`,
        lg && `lg:grid-cols-${lg}`,
        xl && `xl:grid-cols-${xl}`,
        gap === 0 ? "gap-0" : `gap-${gap}`,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
