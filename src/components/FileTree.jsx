"use client";
import { useState, useEffect, useRef } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FiChevronDown, FiChevronRight, FiFile, FiFolder } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { VscNewFile, VscNewFolder } from "react-icons/vsc";
import API from "@/services/api";
import { CiEdit } from "react-icons/ci";
import toast from "react-hot-toast";
import { FaFileAlt, FaJs, FaNodeJs, FaPython } from "react-icons/fa";
import { BiLogoTypescript } from "react-icons/bi";


export default function FileTree({ fetchFile, setCurrentFile, currentFile, setBash, rawTree, project, fetchProjectTree, socket, setShowSidebar }) {
  const [tree, setTree] = useState([]);

  const [fileName, setFileName] = useState("")
  const [fileInp, setFileInp] = useState(false)
  const [mimeType, setmimetype] = useState(null);
  const [targetForNew, setTargetForNew] = useState("");
  const [activeOptionPath, setActiveOptionPath] = useState(null);

  useEffect(() => {
    if (rawTree) setTree(transformTree(rawTree));

    socket.on("fetchFileTree", (data) => {
      console.log(data)
    });

  }, [rawTree]);

  const handleFileClick = (targetPath) => {
    setShowSidebar(false);
    setCurrentFile(targetPath);
    setBash(false);
  };

  const handleNew = async () => {
    try {

      if (!fileName.trim()) {
        return toast.error("Please enter a name.");
      }

      if (mimeType === "file") {
        // Check for valid extension like .js, .txt, .py
        const validExtension = /\.[a-zA-Z0-9]+$/;
        if (!validExtension.test(fileName)) {
          return toast.error("File extension is required");
        }
      }

      const res = await API.post(
        `project/${project}/new?target=${targetForNew}&type=${mimeType}&name=${fileName}`
      );
      setFileName("");
      setFileInp(false);
      if (res.data.success) {
        toast.success(res.data.message || "Created successfully!");
        await fetchProjectTree();
      } else {
        toast.error(res.data.message || "Failed to create.");
      }
    } catch (error) {
      // console.error(`Error creating ${mimeType}:`, error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="relative">
      <span className="flex gap-3 my-2
      ">
        <button onClick={() => {
          setmimetype("file");
          setFileInp(true);
          setTargetForNew("/")
        }}
          className="bg-slate-800 hover:bg-slate-800/40 p-2 rounded cursor-pointer"> <VscNewFile size={15} /></button>

        <button onClick={() => {
          setmimetype("folder")
          setFileInp(true);
        }}
          className="bg-slate-800 hover:bg-slate-800/40 p-2 rounded cursor-pointer"> <VscNewFolder size={15} /></button>

      </span>

      {fileInp && <div className="absolute inset-0 bg-slate-950/70 flex justify-center z-10">
        <div className="w-[400px] h-[200px] bg-slate-950 p-2 rounded shadow-lg flex flex-col">

          <p className="text-slate-500 text-sm py-1">
            {`Type ${mimeType}name`}
          </p>

          <InputBox setFileName={setFileName} handleNew={handleNew} />


          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setmimetype(null);
                setFileInp(false)
              }}
              className="mt-2 cursor-pointer px-4 py-1 bg-slate-800 hover:bg-slate-900 rounded text-white"
            >
              cancel
            </button>
            <button
              onClick={() => handleNew()}
              className="mt-2 cursor-pointer px-4 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white">
              create
            </button>
          </div>

        </div>
      </div>}




      {tree?.length > 0 ?
        <div className="bg-slate-900 text-white py-1.5 rounded-lg w-full font-mono text-sm">
          {tree.map((node, idx) => (

            <TreeNode
              fetchFile={fetchFile}
              key={idx}
              node={node}
              onFileClick={handleFileClick}
              activeOptionPath={activeOptionPath}
              setActiveOptionPath={setActiveOptionPath}
              project={project}
              fetchProjectTree={fetchProjectTree}
              handleNew={handleNew}
              setFileInp={setFileInp}
              setmimetype={setmimetype}
              setTargetForNew={setTargetForNew}
              setCurrentFile={setCurrentFile}
              currentFile={currentFile}
            />

          ))}
        </div>
        : <>
          <p>No files</p>
        </>}
    </div>
  );
}





function TreeNode({
  fetchFile,
  node,
  parentPath = "",
  onFileClick,
  activeOptionPath,
  setActiveOptionPath,
  project,
  fetchProjectTree,
  handleNew,
  setFileInp,
  setmimetype,
  setTargetForNew,
  setCurrentFile,
  currentFile,
}) {

  const [expanded, setExpanded] = useState(false);
  const isFolder = node.type === "folder";
  const targetPath = parentPath ? `${parentPath}/${node.name}` : node.name;
  const containerRef = useRef();
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveOptionPath(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // console.log(node);
  // console.log(addFileTypeRecursive(node));

  const handleClick = () => {
    if (isFolder) setExpanded((prev) => !prev);
    else onFileClick(targetPath);
  };

  const handleOption = (e) => {
    e.stopPropagation();
    setActiveOptionPath((prev) => (prev === targetPath ? null : targetPath));
  };


  const handleClickedOption = async (type) => {
    try {
      if (type === "file") {
        // console.log(`New ${type} to ${activeOptionPath}`);
        // console.log(activeOptionPath);
        setFileInp(true)
        setmimetype("file")
        setTargetForNew(targetPath);
        // your API call for creating file can go here
      }

      if (type === "folder") {
        console.log(`New ${type} to ${activeOptionPath}`);
        setFileInp(true)
        setmimetype("folder")
        setTargetForNew(targetPath);
        // your API call for creating folder can go here
      }

      if (type === "rename") {
        console.log(`${type} to ${activeOptionPath}`);
        // your rename logic
      }

      if (type === "delete") {

        const res = await API.post(
          `project/${project}/deletefile?target=${activeOptionPath}`
        );

        if (res.data.success) {
          if (activeOptionPath == currentFile) {
            setCurrentFile(null)
          }
          await fetchProjectTree();
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message || "Failed to delete file");
        }

      }
      setActiveOptionPath(null)
    } catch (error) {
      console.error("Error performing action:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };


  // console.log(activeOptionPath);
  // console.log(targetPath);




  return (
    <div className="select-none">
      <div className="flex w-full justify-between mr-5 items-center relative">

        <div className="flex mr-5 justify-between w-[80%]">
          <span
            className="flex items-center w-full gap-2 px-2 mr-2 py-1 rounded cursor-pointer hover:bg-slate-800/40"
            onClick={handleClick}
          >

            {isFolder ? (
              expanded ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />
            ) : (
              <span className="w-[14px]" />
            )}

            {/* icon  */}
            {isFolder ? (
              <FiFolder size={14} className="text-yellow-400" />
            ) : (
              getFileIcon(node.name)
            )}

            {/* name  */}
            <span className="truncate overflow-hidden text-ellipsis">
              {node.name}
            </span>
          </span>
        </div>

        <span className="cursor-pointer w-[10%] p-1 rounded hover:bg-slate-700/40" onClick={handleOption}>
          <BsThreeDots />
        </span>

        {activeOptionPath === targetPath && (
          <div
            ref={containerRef}
            className="absolute z-10 bg-slate-800 rounded p-0.5 right-0 top-full">
            <span className="flex flex-col gap-1">
              {isFolder && (
                <>
                  <p
                    onClick={() => handleClickedOption("file")}
                    className="cursor-pointer flex justify-start items-center gap-1.5 hover:bg-slate-900 rounded-xs px-2 py-1"
                  >
                    <VscNewFile size={15} /> New file
                  </p>

                  <p
                    onClick={() => handleClickedOption("folder")}
                    className="cursor-pointer flex justify-start items-center gap-1.5 hover:bg-slate-900 rounded-xs px-2 py-1"
                  >
                    <VscNewFolder size={15} /> New folder
                  </p>
                </>
              )}

              {/* <p
                onClick={() => handleClickedOption("rename")}
                className="cursor-pointer flex justify-start items-center gap-1.5 hover:bg-slate-900 rounded-xs px-2 py-1 text-slate-500">
                <CiEdit size={15} /> Rename
              </p> */}

              <p
                onClick={() => handleClickedOption("delete")}
                className="cursor-pointer text-red-600 flex justify-start items-center gap-1.5 hover:bg-slate-900 rounded-xs px-2 py-1">
                <AiOutlineDelete size={15} color="red" /> Delete
              </p>
            </span>
          </div>
        )}
      </div>

      {isFolder && expanded && (
        <div className="ml-1 border-l border-slate-700/40 pl-2">
          {node.children.length > 0 ? (
            node.children.map((child, idx) => (
              <TreeNode
                key={idx}
                node={child}
                parentPath={targetPath}
                onFileClick={onFileClick}
                activeOptionPath={activeOptionPath}
                setActiveOptionPath={setActiveOptionPath}
                fetchFile={fetchFile}
                project={project}
                expanded={expanded}
                setExpanded={setExpanded}
                fetchProjectTree={fetchProjectTree}
                handleNew={handleNew}
                setFileInp={setFileInp}
                setmimetype={setmimetype}
                setTargetForNew={setTargetForNew}
                setCurrentFile={setCurrentFile}
                currentFile={currentFile}
              />
            ))
          ) : (
            <p className="text-[13px] text-slate-400 ml-[18px]">no files available</p>
          )}
        </div>
      )}


    </div>
  );
}


// Transform API object -> { name, children }[]
function transformTree(obj) {
  return Object.entries(obj).map(([key, value]) => {
    if (value === null) return { name: key, children: [], type: "file" };
    return { name: key, children: transformTree(value), type: "folder" };
  });
}


function InputBox({ setFileName, handleNew }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleNew();
    }
  };

  return (
    <input
      type="text"
      ref={inputRef}
      onChange={(e) => setFileName(e.target.value)}
      onKeyDown={handleKeyDown} // ✅ trigger on Enter
      className="w-full bg-slate-900 text-slate-100 font-mono text-sm p-2 rounded resize-none outline-none"
    />
  );
}

function addFileTypeRecursive(node) {
  const fileTypeMap = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    html: 'html',
    css: 'css',
    json: 'json',
    md: 'markdown',
    txt: 'text',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    sh: 'bash',
  };

  // If it's a file, add fileType
  if (node.type === 'file') {
    const ext = node.name.split('.').pop().toLowerCase();
    node.fileType = fileTypeMap[ext] || 'unknown';
  }

  // If it's a folder, recursively process children
  if (node.type === 'folder' && Array.isArray(node.children)) {
    node.children = node.children.map(child => addFileTypeRecursive(child));
  }

  return node;
}
function getFileIcon(filename) {
  const ext = filename.split(".").pop().toLowerCase();

  const icons = {
    js: <FaJs className="text-yellow-400" size={15} />,
    py: <FaPython className="text-yellow-400" size={15} />,
    ts: <BiLogoTypescript className="text-blue-500" size={15} />,
    txt: <FiFile className="text-slate-400" size={15} />,
  };

  return icons[ext] || <FaFileAlt className="text-slate-400" />;
}
