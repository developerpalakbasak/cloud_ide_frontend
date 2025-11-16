"use client";
import API from "@/services/api";
import React, { useEffect, useRef, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FaNodeJs, FaPython } from "react-icons/fa";
import { SiExpress, SiFlask, SiDjango } from "react-icons/si";
import { BiLogoTypescript } from "react-icons/bi";
import toast from "react-hot-toast";
import Loader from "./loaders/Loader";

const CreateProject = () => {
  const [createProject, setCreateProject] = useState(false);
  const [projectName, setProjectName] = useState("");

  const [language, setLanguage] = useState({ label: "NodeJS", value: "nodejs" });
  const [openPopup, setOpenPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const [framework, setframework] = useState({ label: "Express", value: "express", language: "javascript" });

  const [currentSeleted, setCurrentSeleted] = useState("language")

  const router = useRouter();
  const { loggedInUser } = useAuth();
  const ref = useRef()

  const handleCreate = async () => {

    if (!projectName) {
      toast.error("Project name is required");
    } else if (!language.value) {
      toast.error("Please select a language or frameworks")
    } else if (projectName && currentSeleted == "language" && language.value) {

      setLoading(true);

      try {
        const res = await API.post("/create/languageproject", {
          name: projectName,
          language: language.value,
        });
        if (res.data.success) {
          router.push(`@${loggedInUser?.username}/${res.data.project.slug}`);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      } 
    } else if (projectName && currentSeleted == "framework" && framework.value) {
      try {
        const res = await API.post("/create/frameworkproject", {
          name: projectName,
          framework: framework.value,
          language: framework.language,
        });

        if (res.data.success) {
          router.push(`@${loggedInUser?.username}/${res.data.project.slug}`);
        }

      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  const languages = [
    {
      label: "NodeJS",
      value: "nodejs",
      icon: <FaNodeJs className="text-green-500" />,
    },
    {
      label: "Python",
      value: "python",
      icon: <FaPython className="text-yellow-400" />,
    },
    {
      label: "TypeScript",
      value: "typescript",
      icon: <BiLogoTypescript className="text-blue-500" />,
    },
  ];


  const frameworks = [
    {
      label: "Express",
      value: "express",
      language: "javascript",
      icon: <SiExpress color="white" />,
      availability: true
    },
    {
      label: "Flask",
      value: "flask",
      language: "python",
      icon: <SiFlask className="text-black" />,
      availability: false
    },
    {
      label: "Django",
      value: "django",
      language: "python",
      icon: <SiDjango className="text-green-800" />,
      availability: false
    },
  ];


  useEffect(() => {

    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setCreateProject(false);
        setOpenPopup(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setCreateProject]);


  return (
    <div className="my-5 relative">
      <button
        onClick={() => setCreateProject(true)}
        className="px-4 py-2 flex justify-center items-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors text-white cursor-pointer"
      >
        Create new project
        <CiCirclePlus size={20} />
      </button>

      {!loading ? createProject && (
        <div className="fixed inset-0 flex justify-center items-center bg-slate-950/70 z-50">
          <div ref={ref} className="w-[400px] bg-slate-900 p-5 rounded-lg shadow-lg flex flex-col gap-4">
            <p className="text-slate-400 text-sm">Enter project details</p>

            {/* Project Name Input */}
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreate()
                }
              }}


              className="w-full bg-slate-800 text-slate-100 font-mono text-sm p-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Project name"
            />

            {/* Custom Language Dropdown */}
            <div className="relative">
              <div className="flex flex-col gap-3">

                {/* framework / language select button */}

                <div className="flex items-center justify-center space-x-4 py-0.5 bg-slate-800 rounded-md">
                  <button
                    onClick={() => setCurrentSeleted("language")}
                    className={`px-3 py-1 ${currentSeleted == "language" && "bg-slate-700"} hover:bg-slate-700 rounded text-white transition-colors cursor-pointer`}>
                    Language
                  </button>
                  <button
                    onClick={() => setCurrentSeleted("framework")}
                    className={`px-3 py-1 ${currentSeleted == "framework" && "bg-slate-700"} hover:bg-slate-700 rounded text-white transition-colors cursor-pointer`}>
                    Framework
                  </button>
                </div>







                {/* language select button */}
                <button
                  onClick={() => setOpenPopup((prev) => !prev)}
                  className="w-full flex justify-between items-center bg-slate-800 text-slate-100 text-sm p-2 rounded outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    {
                      currentSeleted == "language" ? languages.find((l) => l.value === language.value)?.icon
                        :
                        frameworks.find((f) => f.value === framework.value)?.icon
                    }
                    {currentSeleted == "language" ? language.label : framework.label}
                  </span>
                  <span className="text-slate-400">▼</span>
                </button>

              </div>
              {openPopup && (
                <div className="absolute mt-1 w-full bg-slate-800 rounded shadow-lg z-10">
                  {currentSeleted == "language" ? languages.map((lang) => (
                    <div
                      key={lang.value}
                      onClick={() => {
                        setLanguage({ label: lang.label, value: lang.value });
                        setOpenPopup(false);
                      }}
                      className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-slate-700 ${lang.value === language.value ? "bg-slate-700" : ""
                        }`}
                    >
                      {lang.icon}
                      {lang.label}
                    </div>
                  )) : frameworks.map((framework) => (
                    <div
                      key={framework.value}
                      onClick={() => {
                        framework.availability && setframework({ label: framework.label, value: framework.value, language: framework.language });
                        setOpenPopup(false);
                      }}
                      className={`flex justify-between items-center gap-2 px-3 py-2 ${framework.availability ? "cursor-pointer" : "cursor-auto"} hover:bg-slate-700 ${framework.value === framework.value ? "bg-slate-700" : ""
                        }`}
                    >
                      <span className="flex justify-center items-center gap-2">
                        {framework.icon}
                        <p>
                          {framework.label}
                        </p>
                      </span>
                      {!framework.availability && <p className="text-xs text-slate-400"> under development</p>}


                    </div>
                  ))




                  }
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setCreateProject(false)}
                className="px-3 py-1 bg-slate-700 hover:bg-slate-800 rounded text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white transition-colors cursor-pointer"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      ) : <>
        <div className="fixed inset-0 flex flex-col justify-center items-center bg-slate-950/70 z-50">
          <Loader/>
        </div>
      </>}
    </div>
  );
};

export default CreateProject;
