"use client";

import { CircleFadingPlus, PanelLeftClose } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const Header = (props: any) => {
  const { handleToggleSidebar, isSidebarOpen } = props;
  const router = useRouter();

  const handleNewConversation = () => {
    router.push("/chat");
  };

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    if (window.location.pathname === "/chat") {
      e.preventDefault();
      router.refresh();
    }
  };

  return (
    <div className="fixed top-0 w-full h-auto border-2 border-[#42424281] bg-black flex items-center px-2">
      {!isSidebarOpen && (
        <div className="m-1 hover:bg-zinc-800 rounded-md">
          <PanelLeftClose
            onClick={handleToggleSidebar}
            className="hover:cursor-pointer m-2"
          />
        </div>
      )}
      {!isSidebarOpen && (
        <div className="m-1 hover:bg-zinc-800 rounded-md">
          <CircleFadingPlus
            onClick={handleNewConversation}
            className="hover:cursor-pointer m-2"
          />
        </div>
      )}
      <Link href={"/chat"} className="cursor-pointer" onClick={handleLinkClick}>
        <h1 className="p-4 font-bold text-lg">Math Tutorial Assistant</h1>
      </Link>
    </div>
  );
};

export default Header;
