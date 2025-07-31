import { useEffect } from "react";
import { useLocation } from "wouter";

export function useAuthRedirect() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const currentPath = window.location.pathname;
    
    // If not authenticated and not on login page, redirect to login
    if (!isAuthenticated && currentPath !== "/login") {
      setLocation("/login");
    }
    
    // If authenticated and on login page, redirect to campaigns
    if (isAuthenticated && currentPath === "/login") {
      setLocation("/campaigns");
    }
  }, [setLocation]);
}

export function useAuth() {
  return {
    isAuthenticated: !!localStorage.getItem("isAuthenticated"),
    projectName: localStorage.getItem("projectName"),
    login: (projectName: string) => {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("projectName", projectName);
    },
    logout: () => {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("projectName");
    }
  };
}