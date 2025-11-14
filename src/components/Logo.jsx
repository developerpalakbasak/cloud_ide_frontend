"use client"
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import React from 'react'
import { SiCodecrafters } from 'react-icons/si'

const Logo = () => {

    const{loggedInUser} = useAuth()

    return (
        <Link href="/" className="text-2xl flex justify-center items-center gap-2 font-bold text-blue-500">
            <SiCodecrafters size={35} />
            <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl"> CodeSphere</h1>
        </Link>
    )
}

export default Logo