// src/app/[username]/[project]/page.jsx
"use client";

import { notFound } from "next/navigation";
import { TiHomeOutline } from "react-icons/ti";
import { HiMenu, HiX } from "react-icons/hi";
import { use, useEffect, useState } from "react";
import { IoTerminalOutline } from "react-icons/io5";
import { FiChevronDown } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import Link from "next/link";
import TerminalComponent from "@/components/TerminalComponent";
import API from "@/services/api";
import FileTree from "@/components/FileTree";
import Editor from "@monaco-editor/react";
import socket from "@/utils/socket";
import { useRouter } from "next/navigation";
import Loader from "@/components/loaders/Loader";
import toast from "react-hot-toast";
import LoaderLine from "@/components/loaders/LoaderLine";
import { MdOutlineCloudDone } from "react-icons/md";
import { AiOutlineCloudSync } from "react-icons/ai";



export default function ProjectPage({ params }) {
  const { username: rawUsername, project: rawProject } = use(params);
  let username = decodeURIComponent(rawUsername);
  let project = decodeURIComponent(rawProject);
  username = username.startsWith("@") ? username.slice(1) : username;

  if (!username || !project) return notFound();

  const [showSidebar, setShowSidebar] = useState(false);
  const [editScript, setEditScript] = useState(false);
  const [output, setOutput] = useState(true);
  const [bash, setBash] = useState(false);
  const [runClicked, setRunClicked] = useState(false);
  const [projectTree, setProjectTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(null);
  const [framework, setFramework] = useState(null);
  const [currentFileLanguage, setCurrentFileLanguage] = useState(null);
  const [loadingFile, setLoadingFile] = useState(true);
  const [currentFile, setCurrentFile] = useState(null);
  const [currentFileCode, setCurrentFileCode] = useState(null);
  const [changedFiles, setChangedFiles] = useState({});
  const [editEntryFile, setEditEntryFile] = useState("");
  const [entryFile, setEntryFile] = useState("");
  const [runCodeResult, setRunCodeResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isChangeSaved, setIsChangeSaved] = useState(true);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [liveServer, setLiveServer] = useState(null);
  const router = useRouter();


  // Fetch project tree
  const fetchProjectTree = async () => {
    console.log("fetchProjectTree")
    try {
      const res = await API.get(`project/${project}/tree`);
      setLanguage(res.data.language)
      setFramework(res.data.framework)
      setEntryFile(res.data.entryFile);
      setProjectTree(res.data.tree);

    } catch (err) {
      if (err.response.status == 404) {
        router.push("/not-found")
      }
      if (err.response.data.redirect) {
        router.push("/");
        return;
      }

    } finally {
      setLoadingFile(false);
    }
  };






  // fetch single file
  const fetchFile = async () => {

    // Load unsaved changes first
    if (changedFiles[currentFile] !== undefined) {
      setCurrentFileCode(changedFiles[currentFile]);
      return;
    }

    try {
      console.log("fetch file")
      const res = await API.get(`project/${project}/file?path=${currentFile}`);
      setCurrentFileCode(res.data?.content);
    } catch (err) {
      toast.error(err.response.data.message)
      setCurrentFileCode("");
    }
  };



  // auto save after three second for liveservers like express

  // AUTO SAVE AFTER 3 SECONDS OF NO TYPING
  useEffect(() => {
    if (!framework || Object.keys(changedFiles).length === 0) return;

    const saveTimeout = setTimeout(() => {

      socket.emit("saveProject", {
        project,
        files: changedFiles,
      });
      socket.emit("restartServer", {
        project,
      });

      console.log("💾 Auto-saved project");

    }, 1000);

    // Cleanup timeout if user types again before 3s
    return () => clearTimeout(saveTimeout);
  }, [changedFiles, framework, project]);





  // Fetch file content or load unsaved changes
  useEffect(() => {
    if (!currentFile) return;

    fetchFile();

    setCurrentFileLanguage(getLanguageFromFilename(currentFile))
  }, [currentFile]);


  // Track changes in editor
  const handleEditorChange = (value) => {
    // console.log(value)
    // console.log(currentFile);

    isFirstRender && setIsFirstRender(false)
    setCurrentFileCode(value);
    if (currentFile) {
      setIsChangeSaved(false);
      setChangedFiles((prev) => ({
        ...prev,
        [currentFile]: value,
      }));
    }
  };




  useEffect(() => {
    // Fetch project tree
    fetchProjectTree();

    socket.connect()
    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("projectSaved", (data) => {
      if (data.success) {
        setChangedFiles({})
        setTimeout(() => setIsChangeSaved(true), 2000);

      } else {
        alert("Failed to save project");
      }
    });

    socket.on("token:refreshed", async ({ access_token }) => {
      await API.post("/update-token", { access_token })
    });

    return () => {
      socket.emit("leaveProject", { project });
      socket.disconnect();
      console.log("❌ Socket disconnected");
    };

  }, [project]);


  useEffect(() => {
    if (language && project) {
      socket.emit("startContainer", { language, framework, project });
    }

  }, [language])


  const autoSaveAndRun = () => {
    if (Object.keys(changedFiles).length > 0) {
      socket.emit("saveProject", {
        project,
        files: changedFiles,
      });

    }
    setRunClicked(true)
    setOutput(true)

    socket.emit("runCode", {
      project,
      language,
      entryFile
    })
  };

  const stopServer = () => {
    socket.emit("stopServer", {
      project,
    });
  };

  const startServer = () => {
    isFirstRender && setIsFirstRender(false)
    socket.emit("startServer", {
      project,
    });
  };

  //executeable file edit src/index.js
  const editExeScriptHandler = async () => {
    if (entryFile == editEntryFile) {
      toast.error("Please edit path")
      return
    } else {

      setEditScript(false)
      try {
        const res = await API.post(`project/${project}/editexescript`, { entryFile: editEntryFile })
        toast.success(res.data.message)
        setEntryFile(editEntryFile);


      } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
      }
    }


  };

  socket.on("runCodeResult", (data) => {
    if (data.success) {
      setRunClicked(false)
      setRunCodeResult(data.output);
    } else {
      setRunClicked(false)
      toast.error(data.error)
    }
  });

  socket.on("containerError", (data) => {
    toast.error(data.message)
  });

  {
    framework && socket.on("serverError", (data) => {
      toast.error(data.message)
    });
  }


  socket.on("isDengerousCmd", ({ success, message }) => {
    console.log(message)
    if (!success) {
      toast.error(message)
    }
  });

  socket.on("containerStarted", (data) => {

    if (data.success) {
      setLoading(false)
    } else if (!data.success && data.message) {
      toast.error(data.message)
    }
    if (data.framework) {
      setFramework(data.framework)
    }
  });

  socket.on("serverStatus", (data) => {
    setIsRunning(data.running)
    setLiveServer(data.liveServer)
  });

  socket.on("terminalStarted", ({ success }) => {
    // success && toast.success("Virtual terminal started")
    success && console.log("Virtual terminal started")
  });

  // if socket failed 
  socket.on("errorOccurred", ({ success, message }) => {
    toast.error(message)
  });



  return (
    loading ? <div> <Loader /> </div> : <div className=" flex-1 w-full overflow-hidden bg-slate-900 text-slate-100 flex flex-col">
      {/* Top bar */}
      <header className="h-12 border-b border-slate-800 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSidebar(true)}
            className="md:hidden p-1 hover:bg-slate-800 rounded"
          >
            <HiMenu size={22} />
          </button>

          <Link href="/">
            <TiHomeOutline size={22} />
          </Link>
          <span className="font-medium">{project}</span>
        </div>

        <span className="flex gap-1 items-center">

          {loading ? <p className="px-3 py-1.5 flex gap-2 items-center bg-gray-700 rounded cursor-pointer">Loading...</p>
            : <button
              onClick={framework ? isRunning ? stopServer : startServer : autoSaveAndRun}
              className={`px-3 py-1.5 flex gap-2 items-center ${!isRunning ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-800 "} rounded cursor-pointer`}
            >
              {isRunning && <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>}

              {framework ? isRunning ? "Working..." : "Run" : "Run"}
            </button>}

          <span>
            {isChangeSaved ?
              <MdOutlineCloudDone size={22} />
              :
              <AiOutlineCloudSync size={22} />}
          </span>

          {!framework && <span
            className="cursor-pointer"
            onClick={() => setEditScript((prev) => !prev)}
          >
            <BsThreeDots size={20} />
          </span>}

        </span>

        <div className="text-sm opacity-70">@{username}</div>
      </header>

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}


        <aside
          className={`
            bg-slate-950 border-r border-slate-800
            min-w-[220px] w-[280px] max-w-[360px]
            flex-shrink-0 overflow-y-auto
            transition-transform duration-300 ease-in-out
            fixed inset-y-0 left-0 z-10 md:static
            ${showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <div className="md:hidden flex justify-end p-2">
            <button
              onClick={() => setShowSidebar(false)}
              className="p-1 cursor-pointer hover:bg-slate-800 rounded"
            >
              <HiX size={22} />
            </button>
          </div>

          <div className="p-2">
            {projectTree && (
              loadingFile ? <span>Loading Files...</span>
                : <FileTree
                  fetchFile={fetchFile}
                  setCurrentFile={setCurrentFile}
                  currentFile={currentFile}
                  setBash={setBash}
                  rawTree={projectTree}
                  project={project}
                  fetchProjectTree={fetchProjectTree}
                  socket={socket}
                />
            )}
          </div>
        </aside>

        {/* Overlay */}
        {showSidebar && (<div onClick={() => setShowSidebar(false)} className="fixed cursor-pointer inset-0 bg-slate-900/80 z-1 md:hidden" />)}




        {/* Editor */}
        <main className="flex-1 min-w-0 overflow-hidden relative h-full">
          {/* Editor header */}
          <div className="h-10 border-b border-slate-800 flex items-center px-3 gap-3 shrink-0">
            {currentFile && (
              <span
                onClick={() => setBash(false)}
                className="text-sm cursor-pointer px-2 py-1 rounded bg-slate-800"
              >
                {currentFile}
              </span>
            )}

            <span
              className="text-sm cursor-pointer px-2 py-1 flex gap-1 items-center rounded hover:bg-slate-800/40"
              onClick={() => setBash(true)}
            >
              <IoTerminalOutline size={15} /> <p>bash</p>
            </span>
          </div>

          {/* Editor body */}
          <div className="h-[calc(100%-2.5rem)]">
            {bash ? (
              <TerminalComponent
                project={project}
                socket={socket}
              />
            ) : (
              <div className="h-full">
                <div
                  className="w-full overflow-auto p-0"
                  style={{
                    height: output
                      ? `calc(100% - ${framework ? "2.5rem" : "15rem"})`
                      : "100%",
                  }}
                >
                  {currentFile && (
                    <Editor
                      height="100%"
                      language={currentFileLanguage}
                      // defaultLanguage={language == "nodejs" ? "javascript" : language}
                      value={currentFileCode}
                      onChange={handleEditorChange}
                      theme="vs-dark"
                    />
                  )}
                </div>

                {/* Output */}
                {output && !framework && (
                  <div className="bg-slate-700 h-[15rem] p-2 text-sm flex flex-col">
                    <div className="flex justify-between mb-2 shrink-0">
                      <p className="text-slate-400">Output</p>
                      <span
                        onClick={() => setOutput(false)}
                        className="cursor-pointer"
                      >
                        <FiChevronDown size={20} color="#90a1b9" />
                      </span>
                    </div>

                    {runClicked && <LoaderLine />}

                    {!runClicked && runCodeResult && <div className="flex-1 overflow-y-auto space-y-0.5 font-mono custom-scrollbar">
                      <p>{runCodeResult}</p>
                    </div>}


                  </div>
                )}
                {framework && <div className="bg-slate-700 h-[2.5rem] p-2 text-sm flex flex-col">
                  <div className="flex justify-between mb-2 shrink-0">
                    {!isFirstRender ? <div className="flex justify-between items-center gap-1 ">
                      <span className="inline-block w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                      <p className="text-slate-400">Server running at:-</p>
                    </div> :
                      <div className="flex justify-between items-center gap-1 ">
                        <span className="inline-block w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                        <p className="text-slate-400">Server not running</p>
                      </div>

                    }
                    {framework && liveServer && isChangeSaved ? <Link
                      href={liveServer}
                      target="_blank"
                      className="underline">
                      {liveServer}
                    </Link> : <>
                      {!isFirstRender && <p className="text-slate-400">Waiting for server to restart</p>}
                    </>
                    }
                  </div>
                </div>}


              </div>
            )}
          </div>

          {/* Edit scripts modal */}
          {editScript && (
            <div className="absolute inset-0 flex justify-center items-center w-full h-full bg-slate-950/70">
              <div className="w-[400px] h-[200px] bg-slate-950 p-2 rounded shadow-lg flex flex-col">
                <p className="text-slate-500 text-sm py-1">
                  Edit main file path
                </p>
                <textarea
                  className="flex-1 w-full bg-slate-900 text-slate-100 font-mono text-sm p-2 rounded resize-none outline-none"
                  placeholder={entryFile}
                  onChange={(e) => setEditEntryFile(e.target.value)}
                />

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setEditScript(false)}
                    className="mt-2 cursor-pointer px-4 py-1 bg-slate-800 hover:bg-slate-900 rounded text-white"
                  >
                    cancel
                  </button>
                  <button
                    onClick={editExeScriptHandler}
                    className="mt-2 cursor-pointer px-4 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white">
                    save
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}







export function getLanguageFromFilename(filename = "") {
  const ext = filename.split(".").pop()?.toLowerCase();

  const map = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    py: "python",
    java: "java",
    json: "json",
    html: "html",
    css: "css",
    md: "markdown",
    txt: "plaintext",
    sh: "shell",
    c: "c",
    cpp: "cpp",
  };

  // Special cases by filename (no extension or unique files)
  if (filename === "Dockerfile") return "dockerfile";
  if (filename === "Makefile") return "makefile";
  if (filename === "package.json") return "json";

  return map[ext] || "plaintext";
}
