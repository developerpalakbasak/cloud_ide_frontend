"use client";

import { useState } from "react";
import { FiChevronDown, FiChevronRight, FiFile, FiFolder } from "react-icons/fi";

export default function TreeNode({ node }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;

  const handleClick = () => {
    if (hasChildren) setExpanded((prev) => !prev);
    // 📌 If it's a file, you can call onFileOpen(node) from props later
  };

  
console.log(node)


  return (
    <div className="select-none">
      {/* Row */}
      <div
        className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-slate-800/40"
        onClick={handleClick}
      >
        {/* Arrow for folders */}
        {hasChildren ? (
          expanded ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />
        ) : (
          <span className="w-[14px]" />
        )}

        {/* Icon */}
        {hasChildren ? (
          <FiFolder size={14} className="text-yellow-400" />
        ) : (
          <FiFile size={14} className="text-slate-300" />
        )}

        {/* Label */}
        <span>{node.name}</span>
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="ml-5 border-l border-slate-700/40 pl-2">
          {node.children.map((child, idx) => (
            <TreeNode key={idx} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}
