"use client";
import { createContext, useContext, useEffect, useState } from "react";
import API from "@/services/api";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const router = useRouter();

  // ✅ Login logic
  const login = async (email, password) => {
    try {
      const res = await API.post("/user/login", { email, password });

      setLoggedInUser(res.data.user);

      return res.data;
    } catch (error) {
      throw error;
    }
  };
  //  Create account logic 
  const createUser = async (name, username, email, password) => {
    try {
      const res = await API.post("/user/create", { name, username, email, password });
      setLoggedInUser(res.data.user);

      return res.data;
    } catch (error) {
      throw error;
    }
  };

  // ✅ Logout logic
  const logout = async () => {
    setAuthLoading(true);
    setLoggedInUser(null);
    const res = await API.get("/user/logout");

    if (res.data.success) {
      router.push("/");
      setTimeout(() => {
        setAuthLoading(false);
      }, 200);
    }
  };

  // ✅ Fetch user on initial load
  const fetchUser = async () => {
    try {
      const res = await API.get("/user/info");

      const { user } = res.data;
      setLoggedInUser(user);

      return res.data;
    } catch (err) {
      setLoggedInUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  // ✅ Effect to fetch user & connect socket only after auth
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ loggedInUser, login, createUser, logout, authLoading, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
