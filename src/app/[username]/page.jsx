"use client"
import CodeSection from "@/components/CodeSection";
import CreateProject from "@/components/CreateProject";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";


const ProfilePage = () => {



  const { loggedInUser } = useAuth();

  return (


    <div className="mx-auto max-w-6xl w-full mb-5 px-5">

      <div className="flex flex-col items-center justify-center text-center">
        <motion.h1
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true, amount: 0 }}
          className="text-4xl font-bold mb-4"
        >
          Project Page
        </motion.h1>


        <motion.p
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35 }}
          viewport={{ once: true, amount: 0 }}

          className="text-2xl">
          Username: <span className="font-semibold">{loggedInUser?.username}</span>
        </motion.p>

        {loggedInUser && (
          <motion.p
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.39 }}
            viewport={{ once: true, amount: 0 }}

            className="mt-2 text-green-600">
            Logged in as {loggedInUser?.username}
          </motion.p>
        )}

        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.42 }}
          viewport={{ once: true, amount: 0 }}

        >
          <CreateProject />
        </motion.div>
      </div>
      {loggedInUser &&
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.46 }}
          viewport={{ once: true, amount: 0 }}

        >
          <CodeSection />
        </motion.div>


      }
    </div>

  )
}

export default ProfilePage