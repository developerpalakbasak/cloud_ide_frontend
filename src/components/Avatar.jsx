"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import Sidebar from './Sidebar';

import { RxAvatar } from "react-icons/rx";


const Avatar = () => {

    const [nav, setNav] = useState(false)

    const img = "https://res.cloudinary.com/ddfimjibr/image/upload/v1747958541/developerpalakbasak/kckvjxi1tvtxxgzowf63.jpg"


    return (
        <div className='relative w-full flex justify-end'>
            {/* <Image onClick={() => setNav(true)} src={img} height={50} width={50} alt='avatar' className='rounded-full h-10 w-10 cursor-pointer' /> */}

            <RxAvatar size={40} onClick={() => setNav(true)} height={50} width={50} alt='avatar' className='rounded-full h-10 w-10 cursor-pointer' />

            {/* <div className='w-full bg-red-500'> */}

            <Sidebar setNav={setNav} nav={nav} />

            {/* </div> */}
        </div>
    )
}

export default Avatar