import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";

export const ThemeContext = createContext({
  mode: "default",
  toggleMode: () => {},
});

function ThemeProvider({ children }: { children: ReactNode }) {
  const [modePreference, updateModePreference] = useState("default");

  const toggleMode = useCallback(() => {
    updateModePreference((prevTheme) => {
      console.log("???", prevTheme);
      return prevTheme === "light" ? "dark" : "light";
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      mode: modePreference,
      toggleMode,
    }),
    [modePreference, toggleMode],
  );
  return (
    <ThemeContext.Provider value={contextValue}>
      <div className={`${modePreference}-mode`}>{children}</div>
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
