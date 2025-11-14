"use client"
import CodeSection from "@/components/CodeSection";
import CreateProject from "@/components/CreateProject";
import { useAuth } from "@/context/AuthContext";


const ProfilePage = () => {


  
  const { loggedInUser } = useAuth();

  return (
    
    
    <div className="mx-auto max-w-6xl mb-5 px-5">
       
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold mb-4">Project Page</h1>
          <p className="text-2xl">
            Username: <span className="font-semibold">{loggedInUser?.username}</span>
          </p>

          {loggedInUser && (
            <p className="mt-2 text-green-600">
              Logged in as {loggedInUser?.username}
            </p>
          )}

          <div>
            <CreateProject />
          </div>
        </div>
        {loggedInUser && <CodeSection loggedInUser={loggedInUser} />}
      </div>
    
  )
}

export default ProfilePage