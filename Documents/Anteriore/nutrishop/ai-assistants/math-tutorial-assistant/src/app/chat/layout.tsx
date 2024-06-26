"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // Set initial state based on screen size
  useEffect(() => {
    if (typeof window !== "undefined") {
      setMenuOpen(window.innerWidth >= 830);
    }
  }, []);

  const toggleSidebar = () => {
    setMenuOpen((prevState) => !prevState);
  };

  // Update sidebar visibility based on screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 830) {
        setMenuOpen(true);
      } else {
        setMenuOpen(false);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    <div className="flex flex-col w-full h-auto bg-[#1a1a1a]">
      <Header handleToggleSidebar={toggleSidebar} isSidebarOpen={menuOpen} />
      <div className="flex w-full h-full">
        {menuOpen && <Sidebar closeSidebar={toggleSidebar} />}
        <main className={`flex-grow ${menuOpen ? "ml-60" : "ml-0"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
