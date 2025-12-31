import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import styles from "./BackButton.module.css";

export default function BackButton() {
  return (
    <Link className={styles.backButton} href="/">
      <ArrowLeft className={styles.icon} />
      Back
    </Link>
  );
}
