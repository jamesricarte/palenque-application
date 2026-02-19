import React, { createContext, useEffect, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsAuthenticated(false);
      setIsLoading(false);
    }, 1000);
  });

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
