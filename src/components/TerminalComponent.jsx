"use client";
import React, { useEffect, useRef, useState } from "react";
import "@xterm/xterm/css/xterm.css";
import toast from "react-hot-toast";

export default function TerminalComponent({ project, socket }) {
  const terminalRef = useRef(null);
  const [isTerminalInit, setIsTerminalInit] = useState(false);

  useEffect(() => {
    let xterm, fitAddon;
    let promptBuffer = "";
    let inputBuffer = "";


    const initTerminal = async () => {
      const { Terminal } = await import("@xterm/xterm");
      const { FitAddon } = await import("@xterm/addon-fit");

      xterm = new Terminal({
        cursorBlink: true,
        cursorStyle: "block",
        fontSize: 14,
        theme: {
          background: "#1e1e1e",
          foreground: "#ffffff",
        },
      });

      fitAddon = new FitAddon();
      xterm.loadAddon(fitAddon);

      xterm.open(terminalRef.current);
      fitAddon.fit();

      xterm.writeln("Welcome to your Virtual terminal");
      xterm.write("~");

      // Replace xterm.onKey with:
      xterm.onData((data) => {

        // Ignore esc 
        if (/^\x1B\[[0-9;]*R$/.test(data)) return;

        // Handle Enter
        if (data === "\r") {
          socket.emit("terminalInput", { input: inputBuffer });
          xterm.write("\r\n");
          inputBuffer = "";
        }
        // Handle Backspace
        else if (data === "\x7f") {

          if (inputBuffer.length > 0) {
            inputBuffer = inputBuffer.slice(0, -1);
            xterm.write("\b \b");
          }

        }
        // Normal characters / pasted content
        else {
          inputBuffer += data;
          xterm.write(data);
        }
      });


      socket.on("terminalStarted", ({ success }) => {
        success && socket.emit("terminalResize", { rows: xterm.rows, cols: xterm.cols });
      });



      let resizeTimeout;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(() => {
          fitAddon.fit();
          socket.emit("terminalResize", { rows: xterm.rows, cols: xterm.cols });
        }, 300);
      });



      setIsTerminalInit(true);
    };

    initTerminal();


    socket.on("terminalOutput", (data) => {
      const output = data.output;
      xterm.write(output)
      xterm.write(inputBuffer);
    });

    socket.on("terminalError", (data) => {
      toast.error(data.message)
    });



    return () => {
      window.removeEventListener("resize", () => fitAddon.fit?.());
      xterm?.dispose();
    };
  }, []);

  isTerminalInit && socket.emit("terminalOpen", { project });

  return (
    <div className="w-full h-full flex">
      <div ref={terminalRef} className="flex-1 h-full w-full" />
    </div>
  );
}
