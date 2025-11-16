"use client"
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { BsThreeDots } from "react-icons/bs";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaCaretUp } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import API from "@/services/api";


const CodeCard = (props) => {

    const [option, setOption] = useState(false)
    const [deletePopup, setDeletePopup] = useState(false)



    const deleteProjectHandler = async () => {
        setDeletePopup(false);
        setOption(false);
        const res = await API.delete(`project/delete/${props._id}`)
        if (res.data.success) {
            props.fetchProject()
        }
    }

    // map technologies to colors
    const techColors = {
        nodejs: "bg-green-500",
        mongodb: "bg-green-500",
        javascript: "bg-yellow-400",
        typescript: "bg-blue-500",
        react: "bg-blue-500",
        python: "bg-blue-600",
        express: "bg-yellow-500"

    };

    const { loggedInUser } = useAuth()

    function formatMongoDate(mongoTimestamp) {
        // If it's an ObjectId, extract timestamp
        if (mongoTimestamp._bsontype === "ObjectID" || mongoTimestamp.constructor.name === "ObjectId") {
            mongoTimestamp = mongoTimestamp.getTimestamp();
        }

        const date = new Date(mongoTimestamp);

        // Format as "YYYY-MM-DD"
        return date.toISOString().split("T")[0];
    }
    // normalize input → lowercase + remove dots
    const normalizedTech = props?.language?.toLowerCase().replace(".", "") || props?.framework?.toLowerCase().replace(".", "")


    return (
        <motion.div
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
            viewport={{ once: true, amount: 0 }}
            className="bg-slate-800  mt-3 rounded-2xl py-5 px-2 shadow-md transition hover:shadow-lg relative overflow-hidden"
        >

            <div>
                <div>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <Link
                            onClick={()=> props.setLoading(true)}
                                href={`@${loggedInUser.username}/${props.slug}`}
                                className="text-base font-medium  hover:bg-slate-700/80  text-gray-200 rounded text-left pl-2 pr-3 py-1">
                                <span className="flex gap-4 items-center ">
                                    {props.name}
                                    <FaExternalLinkAlt />
                                </span>
                            </Link>
                            <span className="flex gap-2 w-[40%] justify-center items-center">
                                <p className="text-xs font-light text-gray-200">{formatMongoDate(props.createdAt)}</p>
                                <span
                                    className="px-2 cursor-pointer  hover:bg-slate-700 rounded"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setOption((prev) => !prev);
                                    }}
                                >
                                    {option ? <FaCaretUp size={20} /> : <FaCaretDown size={20} />}
                                </span>

                            </span>

                        </div>
                        <div className="flex items-center gap-3 px-2">
                            <div
                                className={`w-3 h-3 rounded-full ${techColors[normalizedTech] || "bg-gray-500"
                                    }`}
                            ></div>
                            <span className="text-sm text-gray-300 font-light">{props?.framework || props.language}</span>
                        </div>

                    </div>

                </div>

                <AnimatePresence>
                    {option && !deletePopup && (
                        <motion.span
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute mt-2 top-1/2 right-8 h-8 flex justify-center items-center 
               w-8 hover:bg-slate-700 cursor-pointer z-50"
                            onClick={() => setDeletePopup(true)}
                        >

                            <RiDeleteBin5Fill color="red" size={20} />
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {deletePopup &&
                <div className="bg-slate-600 absolute top-0 left-0 h-full w-full">
                    <span className="w-full h-full flex flex-col justify-center items-center gap-2">
                        <p>Are you sure?</p>
                        <span className=" flex justify-center items-center gap-8">
                            <MdCancel
                                onClick={() => setDeletePopup(false)}
                                color="white" cursor="pointer" size={40} />
                            <RiDeleteBin5Fill
                                onClick={deleteProjectHandler}
                                color="red" cursor="pointer" size={40} />
                        </span>
                    </span>
                </div>
            }



        </motion.div>
    );
};

export default CodeCard;
