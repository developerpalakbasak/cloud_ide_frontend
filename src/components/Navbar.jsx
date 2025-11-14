"use client"
import Logo from "./Logo";
import Avatar from "./Avatar";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { loggedInUser, authLoading } = useAuth();
    // console.log(authLoading)

    return (
        <nav className="bg-gray-900 w-full h-15 md:h-18 flex items-center">
            <div className="w-full max-w-6xl mx-auto flex items-center">
                {loggedInUser ? (
                    <div className="flex justify-between w-full items-center">
                        <Logo />
                        <Avatar />
                    </div>
                ) : (
                    <div className="flex justify-center w-full">
                        <Logo />
                    </div>
                )}
            </div>
        </nav>

    );
}
