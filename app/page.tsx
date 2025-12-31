"use client";

import Link from "next/link";
import MenuButton from "./components/buttons/MenuButton";
import SideDrawer from "./components/drawer/SideDrawer";
import { Sun, Moon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import styles from "./Home.module.css";
import ThemeProvider, { ThemeContext } from "./providers/ThemeProvider";
import ModePreferenceButton from "./components/buttons/ModePreferenceButton";

export default function Home() {
  const { mode } = useContext(ThemeContext);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    console.log("mode changed", mode);
  }, [mode]);

  const openSideDrawer = () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setDrawerOpen(true);
      });
    } else {
      setDrawerOpen(true);
    }
  };

  const closeSideDrawer = () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setDrawerOpen(false);
      });
    } else {
      setDrawerOpen(false);
    }
  };
  return (
    <ThemeProvider>
      <div className="flex justify-between">
        <MenuButton menuOnClick={openSideDrawer} />
        <ModePreferenceButton />
      </div>
      <SideDrawer closeDrawer={closeSideDrawer} drawerOpen={drawerOpen} />
      <div className={styles.mainWrapper}>
        <main className={styles.main}>
          <div className={styles.buttonContainer}>
            <Link className={styles.button} href="/expenses/create">
              Add expense
            </Link>
            <Link className={styles.button} href="/chat">
              Chat
            </Link>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
