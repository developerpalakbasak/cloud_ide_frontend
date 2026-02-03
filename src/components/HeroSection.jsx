"use client"
import React from 'react'
import { motion } from 'framer-motion'
import FancyText from './FancyText'
import Logo from './Logo'
import AuthLinks from './AuthLinks'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { RxAvatar } from "react-icons/rx";
import Image from 'next/image'

const HeroSection = () => {

    const { authLoading, loggedInUser } = useAuth();

    // console.log(loggedInUser)

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
                        {loggedInUser.avatar ? (
                            <Image
                                className="rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
                                src={loggedInUser.avatar}
                                width={200}   // doesn't matter, Tailwind overrides it
                                height={200}
                                alt={loggedInUser.username}
                            />
                        ) : (
                            <div className="rounded-full flex justify-center items-center
        w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 ">
                                <RxAvatar className="w-full h-full" />
                            </div>
                        )}


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