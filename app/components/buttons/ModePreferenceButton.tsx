import { Sun } from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "@/app/providers/ThemeProvider";

export default function ModePreferenceButton() {
  const { toggleMode } = useContext(ThemeContext);
  return (
    <>
      <button className="cursor-pointer pr-4" onClick={toggleMode}>
        <Sun />
      </button>
    </>
  );
}
