import Link from 'next/link'
import React from 'react'

const AuthLinks = () => {
    return (
        <div className="space-x-4">
            <Link
                href="/login"
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors"
            >
                Login
            </Link>
            <Link
                href="/signup"
                className="px-4 py-2 rounded-md border border-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
            >
                Sign Up
            </Link>
        </div>
    )
}

export default AuthLinks