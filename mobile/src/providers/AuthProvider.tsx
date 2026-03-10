import React, { createContext, useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
import { Session } from "@supabase/supabase-js";

type userType = {
  status: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  delivery_address: string | null;
  phone: string;
};

type vendorDataType = {
  id: string;
  description: string;
  vendor_status: string;
};

type AuthContextType = {
  session: Session | null;
  user: userType | null;
  vendorData: vendorDataType | null;
  setVendorData: React.Dispatch<React.SetStateAction<vendorDataType | null>>;
  isLoading: boolean;
  fetchUserData: (session: Session | null) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  vendorData: null,
  setVendorData: () => {},
  isLoading: true,
  fetchUserData: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<userType | null>(null);
  const [vendorData, setVendorData] = useState<vendorDataType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) fetchUserData(session);
  }, [session]);

  const fetchUserData = async (session: Session | null) => {
    if (!session) return;

    try {
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) throw new Error(error.message);

      if (!data) throw new Error("User doesnt have user's info yet.");

      setUser(data);
    } catch (error) {
      console.error(error);
      setUser(null);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setVendorData(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        vendorData,
        setVendorData,
        isLoading,
        fetchUserData,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
