"use client"
import React, { useEffect, useState } from "react";
import CodeCard from "./CodeCard";
import API from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import Spinner from "./loaders/Spinner";

const CodeSection = () => {


  const { loggedInUser } = useAuth();


  // console.log(loggedInUser)
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true)


const fetchProject = async () => {
  console.log("fetch project clicked");

  try {
    const res = await API.get("project/getall");
    setProjects(res.data.projects);
  } catch (err) {
    console.error("Fetch project error:", err);
    setProjects([]); // fallback
  } finally {
    // setLoading(true); 
    setLoading(false); 
  }
};


  useEffect(() => {
    if (loggedInUser._id || loggedInUser.id) fetchProject();
  }, [loggedInUser]);



  return (

    <div
      className="flex flex-col items-center gap-6"
    >
      {
        !loading ? projects.length > 0 ?
          (<div className="grid grid-cols-1 mx-auto sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {projects.map((project, i) => (

              <CodeCard key={i} {...project} fetchProject={fetchProject} setLoading={setLoading} />
            ))}
          </div>)

          : (
            <div>
              <h1>No Projects Available</h1>
            </div>
          ) :
          <>
            <Spinner/>
          </>
      }

    </div>

  );
};

export default CodeSection;
