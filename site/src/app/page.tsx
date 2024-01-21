import Image from "next/image";
import styles from "./page.module.css";
import Example from "../components/Example";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <Example></Example>
      </div>
    </main>
  );
}
