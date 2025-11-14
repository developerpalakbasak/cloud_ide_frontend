"use client";

import { useState, useEffect } from "react";
import { FiChevronDown, FiChevronRight, FiFile, FiFolder } from "react-icons/fi";

function TreeNode({ node, parentPath = "", onFileClick }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;

  // Full path from root
  const fullPath = parentPath ? `${parentPath}/${node.name}` : node.name;

  const handleClick = () => {
    if (hasChildren) {
      setExpanded((prev) => !prev);
    } else {
      onFileClick(fullPath); // pass full path
    }
  };

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-slate-800/40"
        onClick={handleClick}
      >
        {hasChildren ? (
          expanded ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />
        ) : (
          <span className="w-[14px]" />
        )}

        {hasChildren ? (
          <FiFolder size={14} className="text-yellow-400" />
        ) : (
          <FiFile size={14} className="text-slate-300" />
        )}

        <span>{node.name}</span>
      </div>

      {hasChildren && expanded && (
        <div className="ml-5 border-l border-slate-700/40 pl-2">
          {node.children.map((child, idx) => (
            <TreeNode
              key={idx}
              node={child}
              parentPath={fullPath} // pass current path down
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileTree({ rawTree, setCurrentFile }) {
  const [tree, setTree] = useState([]);

  useEffect(() => {
    if (rawTree) setTree(transformTree(rawTree));
  }, [rawTree]);

  const handleFileClick = (fullPath) => {
    // console.log("File clicked:", fullPath);
    setCurrentFile(fullPath)
  };

  return (
    <div className="bg-slate-900 text-white p-3 rounded-lg w-72 font-mono text-sm">
      {tree.map((node, idx) => (
        <TreeNode key={idx} node={node} onFileClick={handleFileClick} />
      ))}
    </div>
  );
}

// Transform API object -> { name, children }[]
function transformTree(obj) {
  return Object.entries(obj).map(([key, value]) => {
    if (value === null) return { name: key, children: [] };
    return { name: key, children: transformTree(value) };
  });
}
