// ThemeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

// 1. Define the shape of the context value
type ThemeContextType = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

// 2. Create the context with a default (undefined) to enforce use inside provider
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 3. Define the provider props
type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 4. Hook to use the theme
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
