"use client"
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import { LuUser } from 'react-icons/lu'
import { CiSettings } from "react-icons/ci";
import { PiSignOut } from "react-icons/pi";
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { RxAvatar } from 'react-icons/rx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaArrowLeft } from "react-icons/fa6";
import Loader from './Loader';




const Sidebar = ({ setNav, nav }) => {
    const { loggedInUser, logout, authLoading } = useAuth();



    const ref = useRef();
    const img = "https://res.cloudinary.com/ddfimjibr/image/upload/v1747958541/developerpalakbasak/kckvjxi1tvtxxgzowf63.jpg"

    const navItems = [

        { text: "Settings", icon: <CiSettings size={20} />, href: `/@${loggedInUser?.username}/settings` },

        // { text: "Sign out", icon: <PiSignOut size={20} /> }
    ];

    const logoutHandler = async () => {
        await logout()
    }

    const path = usePathname()

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setNav(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setNav]);



    return (<>
        {nav && <div className='fixed inset-0 bg-slate-900/85 z-40' />}
        <div className={`fixed z-50 right-0 top-0 w-full flex justify-end
            transition-transform duration-300 
            ${nav ? "translate-x-0" : "translate-x-full"}
            `}>

            {authLoading ? <Loader />
                :
                <ul
                    ref={ref}
                    className=" flex flex-col 3 px-2 py-5 bg-slate-950 rounded w-2/3 sm:w-1/2 max-w-96 max-h-screen h-screen border-2 border-slate-500"
                >

                    <span className='flex justify-between items-center px-3 mb-5'>
                        <span className='flex gap-2 items-center'>
                            {/* <Image src={img} height={50} width={50} alt='avatar' className='rounded-full h-10 w-10 cursor-pointer' />
                         */}


                            {path === `/@${loggedInUser?.username}` ? (
                                <FaArrowLeft
                                    onClick={() => setNav(false)}
                                    className='rounded-full h-5 w-5 cursor-pointer'
                                />
                            ) : (
                                <Link href={`/@${loggedInUser?.username}`}>
                                    <RxAvatar
                                        size={40}
                                        onClick={() => setNav(false)}
                                        className='rounded-full h-8 w-8 cursor-pointer'
                                    />
                                </Link>
                            )}

                            <p>@{loggedInUser?.username}</p>
                        </span>
                        <p onClick={() => setNav(false)} className='cursor-pointer rounded px-2 py-1 bg-slate-700'>x</p>
                    </span>
                    {navItems.map((item) => (
                        <div onClick={() => setNav(false)} key={item.text}>
                            <Link href={item.href} className='px-3 cursor-pointer py-2 hover:bg-slate-800 rounded flex gap-1 items-center'>
                                <span>
                                    {item.icon}
                                </span>
                                {item.text}
                            </Link>
                        </div>
                    ))}




                    {loggedInUser && <li className='px-3 cursor-pointer py-2 hover:bg-slate-800 rounded flex gap-1 items-center' onClick={logoutHandler}>
                        <span>
                            <PiSignOut size={20} />
                        </span>
                        Sign Out
                    </li>}


                </ul>
            }

            {/* </div> */}
        </div>
    </>
    )
}

export default Sidebar