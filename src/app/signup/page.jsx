"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiCodecrafters } from "react-icons/si";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import API from "@/services/api";

export default function SignupPage() {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [usernameAvailablity, setUsernameAvailablity] = useState();
    const router = useRouter();
    const { createUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // ✅ Check username conditions
        if (username.includes(" ")) {
            toast.error("Username cannot contain spaces");
            return;
        }

        if (username.length > 30) {
            toast.error("Username cannot exceed 30 characters");
            return;
        }

        // ✅ Check password match
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const res = await createUser(name, username, email, password);
            if (res.success) {
                router.push("/");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!username) return; // don’t call API if username is empty

        const checkUsername = async () => {
            try {
                const res = await API.post("user/username-ableablity", { username });
                setUsernameAvailablity(res.data)
            } catch (err) {
                setUsernameAvailablity(err.response.data)
            }
        };

        // ✅ debounce: wait 500ms after user stops typing
        const timer = setTimeout(() => {
            checkUsername();
        }, 500);

        // cleanup previous timer
        return () => clearTimeout(timer);
    }, [username]);

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center px-4">
            <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-8 text-gray-100">
                <div className="text-center mb-6">
                    <div className="text-2xl flex justify-center items-center font-bold text-blue-500">
                        <Link href="/" className="flex gap-2">
                            <SiCodecrafters size={35} />
                            <h1>CodeSphere</h1>
                        </Link>
                    </div>
                    <p className="text-gray-400 mt-2">Create your account</p>
                </div>

                {/* Signup Form */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            autoComplete="username"
                        />
                        {usernameAvailablity && (
                            <p
                                className={`${usernameAvailablity.success ? "text-green-500" : "text-red-600"
                                    } text-xs mt-1`}
                            >
                                {usernameAvailablity.message}
                            </p>
                        )}
                    </div>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        autoComplete="email"
                    />

                    <input
                        id="name"
                        name="name"
                        type="name"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        autoComplete="name"
                    />

                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        autoComplete="new-password"
                    />

                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        autoComplete="new-password"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
                    >
                        {loading ? "Creating account..." : "Sign up"}
                    </button>
                </form>


                {error && <p className="text-red-500 text-center mt-3">{error}</p>}

                <p className="text-gray-400 text-center mt-4">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-500 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
