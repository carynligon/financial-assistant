import cn from "classnames";
import Link from "next/link";
import styles from "./SideDrawer.module.css";

export default function SideDrawer({
  drawerOpen,
  closeDrawer,
}: {
  drawerOpen: boolean;
  closeDrawer: () => void;
}) {
  return (
    <div
      className={cn(styles.drawer, {
        [styles.drawerOpen]: drawerOpen,
        [styles.drawerClosed]: !drawerOpen,
      })}
    >
      <button className={styles.closeButton} onClick={closeDrawer}>
        x
      </button>
      <nav className={styles.nav}>
        <Link href="/expenses" className={styles.navLink}>
          View expenses
        </Link>
      </nav>
    </div>
  );
}
