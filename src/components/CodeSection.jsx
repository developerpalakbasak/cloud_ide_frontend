"use client"
import React, { useEffect, useState } from "react";
import CodeCard from "./CodeCard";
import API from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const CodeSection = () => {


  const { loggedInUser } = useAuth();


  // console.log(loggedInUser)
  const [projects, setProjects] = useState([]);



  const fetchProject = async () => {
    console.log("fetch project clicked")
    const res = await API.get("project/getall");
    setProjects(res.data.projects);
  };

  useEffect(() => {
    if (loggedInUser?.id) fetchProject();
  }, [loggedInUser]);



  console.log(projects)


  return (

    <div
      className="flex flex-col items-center gap-6"
    >
      {
        projects.length > 0 ?
          (<div className="grid grid-cols-1 mx-auto sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {projects.map((project, i) => (

              <CodeCard key={i} {...project}  fetchProject={fetchProject}/>
            ))}
          </div>)

          : (
            <div>
              <h1>No Projects Available</h1>
            </div>
          )
      }

    </div>

  );
};

export default CodeSection;
