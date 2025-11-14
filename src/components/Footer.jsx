import React from 'react'
import Logo from './Logo'

const Footer = () => {
  return (
    // don't use margin or padding parent div have height
    <div className='flex flex-col gap-4 justify-center items-center'>
      <Logo />
      <p>All rights reserves to @codesphere</p>
    </div>
  )
}

export default Footer