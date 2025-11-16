"use client";
import { use, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/loaders/Loader";
import Navbar from "@/components/Navbar";
import NotFound from "@/components/NotFound";
import OthersProfile from "@/components/OthersProfile";
import API from "@/services/api";
import { usePathname } from "next/navigation";

export default function ProfileLayout({ children, params }) {
  const { username: rawPath } = use(params);
  const { loggedInUser, authLoading } = useAuth();

  const pathName = usePathname();
  const usernameOfPath = pathName.split("/")[1].replace("@", "");

  const [user, setUser] = useState(null);
  const [resolved, setResolved] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null); // null = not determined yet

  // Decode username
  let username = decodeURIComponent(rawPath);

  username = username.startsWith("@") ? username.slice(1) : null;

  const isSubRoute = pathName.split("/")[2] ? true : false


  // Fetch user data
  useEffect(() => {
    if (!username) {
      setResolved(true);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await API.get(`user/${username}`);
        setUser(res.data.user);
      } catch (err) {
        if (err.response?.status === 404) {
          setUser(null);
        }
      } finally {
        setResolved(true);
      }
    };

    username && fetchUser();
  }, [username]);

  // Determine if logged-in user is viewing their own profile
  useEffect(() => {
    if (!authLoading && resolved && user && loggedInUser) {
      setIsAdmin(user.username === loggedInUser.username);
    } else if (!authLoading && resolved) {
      setIsAdmin(false);
    }
  }, [user, loggedInUser, authLoading, resolved]);

  // **Render logic**
  if (authLoading || !resolved || isAdmin === null) return <Loader />;

  if (!username || !user) return <NotFound rawPath={rawPath} username={username} />;

  if (isAdmin) {
    return (
      <main className="h-screen flex flex-col items-center">
        <Navbar />
        {children}
      </main>
    );
  }

  if (!isAdmin && isSubRoute) return <NotFound />;


  // Viewing someone else's profile
  return <>
    <Navbar />
    <OthersProfile user={user} />
  </>;
}
