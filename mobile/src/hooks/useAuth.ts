import { useContext } from "react";
import { AuthContext } from "@/src/providers/AuthProvider";

export function useAuth() {
  return useContext(AuthContext);
}
