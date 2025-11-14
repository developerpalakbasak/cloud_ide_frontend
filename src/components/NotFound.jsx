import React from 'react'

const NotFound = ({rawPath, username}) => {
  return (
    <div className="h-[70vh] w-full flex flex-col gap-5 justify-center items-center">
      <h4 className="text-6xl">404 Not Found</h4>
      {rawPath && <p>{rawPath} is not available</p>}
      {username && <p>User @{username} is not available</p>}
    </div>
  )
}

export default NotFound