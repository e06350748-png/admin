import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session when app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
        syncProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth state changes (sign in, sign out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
        syncProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ✅ Create profile if it doesn’t exist
  const syncProfile = async (userObj: any) => {
    const { id, email } = userObj;
    try {
      const { data: existing, error: fetchError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error checking profile:", fetchError);
        return;
      }

      if (!existing) {
        const { error: insertError } = await supabase.from("profiles").insert([
          {
            id,
            email,
            full_name: "",
            phone: "",
            address: "",
            city: "",
            postal_code: "",
            country: "Egypt",
          },
        ]);

        if (insertError) console.error("Error creating profile:", insertError);
      }
    } catch (err) {
      console.error("syncProfile error:", err);
    }
  };

  // ✅ Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Sign up only (profile created later)
  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  // ✅ Sign in existing user
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  // ✅ Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // ✅ Update profile
  const updateProfile = async (userData: Partial<User>) => {
    if (!user) return { error: "No user logged in" };

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(userData)
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;
      setUser(data);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signUp, signIn, signOut, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
