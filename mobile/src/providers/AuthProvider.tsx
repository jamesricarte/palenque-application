import React, { createContext, useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
import { Session } from "@supabase/supabase-js";

type AuthContextType = {
  session: Session | null;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getUserId = async (session: any) => {
    const userId = session?.user?.id || null;
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw new Error(error.message);

      if (!data) {
        throw new Error("User is not registered.");
      }

      session.user.id = data?.id || null;

      return session;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(await getUserId(data.session));
      setIsLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(await getUserId(session));
      },
    );

    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
