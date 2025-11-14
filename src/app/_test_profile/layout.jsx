import Navbar from "@/components/Navbar";

// app/profile/layout.jsx
export default function ProfileLayout({ children }) {
  return (
      <main>
        <Navbar/>
        {children}
      </main>
  );
}
