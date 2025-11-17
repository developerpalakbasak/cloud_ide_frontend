# 🧩 Code-Sphere Frontend  
A modern, high-performance **Cloud IDE frontend** built with **Next.js 15**, featuring a fully interactive coding environment with:

- Monaco Editor (VS Code editor)  
- Real-time terminal (XTerm.js)  
- Docker container integration  
- Live command output via Socket.IO  
- Git support (clone/import)  
- User workspace management  
- OAuth-ready login system  

Backend deployed at: **http://103.174.51.218**

> **Note:** Google and GitHub Sign-In are temporarily disabled because the production domain has not been added yet.

---

## 🚀 Live Backend

The frontend connects to this backend API & terminal server:

👉 **http://103.174.51.218**

The backend provides:

- Project isolation  
- Container execution  
- Terminal streaming  
- Git clone support  
- File operations  

---

# 🛠️ Tech Stack

### **Framework**
- Next.js 15 (App Router)
- React 19  
- Turbopack (for ultra-fast dev mode)

### **UI & Components**
- Tailwind CSS 4 (no PostCSS config needed)
- Framer Motion  
- React Icons  
- React Hot Toast  

### **Editor & Terminal**
- Monaco Editor (`@monaco-editor/react`)
- XTerm.js (`@xterm/xterm`)
- XTerm Fit Addon (`@xterm/addon-fit`)

### **Networking**
- Axios  
- Socket.IO Client  
- JWT / JOSE for auth  

---

# ✨ Features

### ✔️ VSCode-like Code Editor  
Fully featured Monaco Editor with syntax highlighting and auto layout.

### ✔️ Real-time Terminal  
XTerm.js terminal connected to backend Docker containers.
