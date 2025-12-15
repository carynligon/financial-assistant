import cn from "classnames";
import Link from "next/link";

export default function SideDrawer({
  drawerOpen,
  closeDrawer,
}: {
  drawerOpen: boolean;
  closeDrawer: () => void;
}) {
  const classes = cn(
    "text-white bg-black shadow-md shadow-white w-2/5 h-screen fixed top-0 transition-all p-4",
    {
      "-left-2/5": !drawerOpen,
      "left-0": drawerOpen,
    },
  );
  return (
    <div className={classes}>
      <button
        className="w-full text-4xl text-right text-white cursor-pointer"
        onClick={closeDrawer}
      >
        x
      </button>
      <nav>
        <Link href="/expenses">View expenses</Link>
      </nav>
    </div>
  );
}
