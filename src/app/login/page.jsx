"use client";
import { useState } from "react";
import Link from "next/link";
import { SiCodecrafters } from "react-icons/si";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import API from "@/services/api";



export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const { login, loggedInUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await login(email, password);
            if (res.success) {
                router.push("/");
            }

        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleOauthLogin = (provider) => {
        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URI}/auth/${provider}`
    };



    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center px-4">
            <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-8 text-gray-100">
                <div className="text-center mb-6">
                    <div className="text-2xl flex justify-center items-center font-bold text-blue-500">
                        <Link href="/" className="flex gap-2">
                            <SiCodecrafters size={35} />
                            <h1> CodeSphere</h1>
                        </Link>
                    </div>
                    <p className="text-gray-400 mt-2">Sign in to your account</p>
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-4">
                    <button
                        onClick={() => handleOauthLogin("google")}
                        className="w-full flex items-center cursor-pointer justify-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-800 rounded-md transition-colors"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 533.5 544.3">
                            <path fill="#fff" d="M533.5 278.4c0-18.3-1.5-36-4.3-53.3H272v100.9h147c-6.3 34.2-25.1 63.3-53.5 82.7v68h86.3c50.5-46.6 79.7-115 79.7-198.3z" />
                            <path fill="#fff" d="M272 544.3c72.9 0 134.1-24.3 178.8-66.1l-86.3-68c-24 16.1-54.6 25.6-92.5 25.6-70.9 0-131-47.9-152.4-112.2H30.9v70.4C75.5 484.1 167 544.3 272 544.3z" />
                            <path fill="#fff" d="M119.6 320.1c-5.6-16.1-8.8-33.2-8.8-50.1s3.2-34 8.8-50.1V149.5H30.9c-18.9 37.8-30.9 80.6-30.9 123.9s12 86.1 30.9 123.9l88.7-76.1z" />
                            <path fill="#fff" d="M272 107.5c38.7 0 73.3 13.3 100.7 39.4l75.3-75.3C406.1 24.6 344.9 0 272 0 167 0 75.5 60.2 30.9 149.5l88.7 70.4C141 155.4 201.1 107.5 272 107.5z" />
                        </svg>
                        Continue with Google
                    </button>

                    <button
                        onClick={() => handleOauthLogin("github")}
                        className="w-full flex items-center cursor-pointer justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 0C5.372 0 0 5.372 0 12c0 5.303 3.438 9.8 8.205 11.387.6.11.82-.258.82-.577v-2.234c-3.338.726-4.033-1.415-4.033-1.415-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.082-.729.082-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.304.762-1.604-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.468-2.382 1.235-3.222-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 6 0c2.292-1.552 3.3-1.23 3.3-1.23.652 1.653.24 2.873.117 3.176.77.84 1.234 1.912 1.234 3.222 0 4.61-2.804 5.624-5.475 5.921.429.37.813 1.102.813 2.222v3.293c0 .319.218.694.825.576C20.565 21.796 24 17.3 24 12c0-6.628-5.372-12-12-12z" clipRule="evenodd" />
                        </svg>
                        Continue with GitHub
                    </button>
                </div>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <hr className="flex-grow border-gray-700" />
                    <span className="mx-3 text-gray-400">or</span>
                    <hr className="flex-grow border-gray-700" />
                </div>

                {/* Email / Password Form */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                {error && <p className="text-red-500 text-center mt-3">{error}</p>}

                <p className="text-gray-400 text-center mt-4">
                    Don’t have an account?{" "}
                    <Link href="/signup" className="text-blue-500 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
