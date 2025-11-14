// layout.tsx
import { Space_Grotesk } from "next/font/google";
import "@/css/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";


const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata = {
  title: "Code Sphere",
  description: "Best Cloud IDE for Python, nodejs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="px-5">
        <AuthProvider>
          {children}
          <Toaster
            toastOptions={{
              style: {
                background: "#333",
                color: "#fff",
              },
              success: {
                iconTheme: {
                  primary: "green",
                  secondary: "white",
                },
              },
            }}
          />

        </AuthProvider>
      </body>
    </html>
  );
}
