"use client";

import { ReactNode, useState, createContext, useContext } from "react";

import { cn } from "@/lib/utils";

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export interface TabsListProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "pills" | "underline";
}

export interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  variant?: "default" | "pills" | "underline";
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs components must be used within Tabs");
  return context;
}

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleValueChange = (newValue: string) => {
    if (controlledValue === undefined) setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  children,
  className,
  variant = "default",
}: TabsListProps) {
  const variantStyles = {
    default: "bg-gray-100 p-1 rounded-xl",
    pills: "gap-2",
    underline: "border-b border-gray-200",
  };

  const currentContext = useTabsContext();

  return (
    <TabsContext.Provider value={{ ...currentContext, variant }}>
      <div
        className={cn(
          "inline-flex items-center justify-start",
          variantStyles[variant],
          className,
        )}
        role="tablist"
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsTrigger({
  value: triggerValue,
  children,
  className,
  disabled = false,
}: TabsTriggerProps) {
  const { value, onValueChange, variant = "default" } = useTabsContext();
  const isActive = value === triggerValue;

  const variantStyles = {
    default: cn(
      "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-base font-heading",
      isActive
        ? "bg-white text-gray-900 shadow-sm"
        : "text-gray-500 hover:text-gray-900 hover:bg-white/50",
    ),
    pills: cn(
      "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-base font-heading",
      isActive
        ? "bg-primary text-white shadow-md shadow-primary/20"
        : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700",
    ),
    underline: cn(
      "px-4 py-3 text-sm font-semibold transition-all duration-base border-b-2 -mb-[2px] font-heading",
      isActive
        ? "border-primary text-primary"
        : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300",
    ),
  };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      disabled={disabled}
      className={cn(
        variantStyles[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      onClick={() => !disabled && onValueChange(triggerValue)}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value: contentValue,
  children,
  className,
}: TabsContentProps) {
  const { value } = useTabsContext();
  if (value !== contentValue) return null;

  return (
    <div
      role="tabpanel"
      className={cn(
        "mt-6 animate-in fade-in slide-in-from-top-1 duration-base",
        className,
      )}
    >
      {children}
    </div>
  );
}
