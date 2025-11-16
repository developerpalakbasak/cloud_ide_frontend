"use client"
import React from 'react'
import { motion } from 'framer-motion'
import FancyText from './FancyText'
import Logo from './Logo'
import AuthLinks from './AuthLinks'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import Loader from './loaders/Loader'
import Image from 'next/image'

const HeroSection = () => {

    const { authLoading, loggedInUser } = useAuth();

    console.log(loggedInUser)

    return (
        // don't use margin or padding parent div have height
        <div className='flex flex-col items-center justify-center gap-3'>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true, amount: 0 }}
            >

                <Logo />
            </motion.div>

            <motion.div
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.35 }}
                viewport={{ once: true, amount: 0 }}
            >

                <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold'>Coading Never Lie's</h1>
            </motion.div>

            <motion.div
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true, amount: 0 }}
            >

                <p className='text-blue-500'>Do something better</p>
            </motion.div>
            <FancyText />
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45 }}
                viewport={{ once: true, amount: 0 }}
                className='flex flex-col gap-8 justify-center items-center'
            >

                {!authLoading && loggedInUser ?
                    <div className='flex flex-col gap-2 justify-center items-center'>
                        <Image
                            className='h-25 w-25 rounded-full'
                            src={loggedInUser.avatar}
                            width={250}
                            height={250}
                            alt={loggedInUser.username}
                        />
                        <p className='text-slate-400'>@{loggedInUser.username}</p>
                        <Link href={`@${loggedInUser.username}`} className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors"
                        >Profile</Link>
                    </div>
                    : <AuthLinks />}


                <div className='flex flex-col'>
                    <p>Card of code for social collabration and fork</p>
                </div>


            </motion.div>
        </div>
    )
}

export default HeroSection