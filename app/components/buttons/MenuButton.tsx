import styles from "./MenuButton.module.css";

export default function MenuButton({
  menuOnClick,
}: {
  menuOnClick: () => void;
}) {
  return (
    <button className={styles.menuButton} onClick={menuOnClick}>
      <div className={styles.menuBar}></div>
      <div className={styles.menuBar}></div>
      <div className={styles.menuBar}></div>
    </button>
  );
}
