// CodeEditor.jsx
import React, { useState } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = () => {
  const [code, setCode] = useState("// Write your code here");

  const handleEditorChange = (value, event) => {
    setCode(value);
  };

  return (
    <div style={{ height: "500px", border: "1px solid #ccc" }}>
      <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue="// Write your code here"
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
      />
    </div>
  );
};

export default CodeEditor;
