"use client";

import Link from "next/link";
import MenuButton from "./components/buttons/MenuButton";
import SideDrawer from "./components/drawer/SideDrawer";
import { useState } from "react";

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openSideDrawer = () => setDrawerOpen(true);

  const closeSideDrawer = () => setDrawerOpen(false);
  return (
    <div>
      <MenuButton menuOnClick={openSideDrawer} />
      <SideDrawer closeDrawer={closeSideDrawer} drawerOpen={drawerOpen} />
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
          <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
            <Link
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
              href="/expenses/create"
            >
              Add expense
            </Link>
            <Link
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
              href="/chat"
            >
              Chat
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
