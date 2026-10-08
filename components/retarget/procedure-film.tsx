"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import styles from "@/app/retarget/retarget.module.css";

export function ProcedureFilm() {
  const [started, setStarted] = useState(false);

  return <div className={styles.film}>
    {started ? <video className={styles.video} src="/retarget/eboo-procedure.mp4" poster="/retarget/eboo-procedure-poster.jpg" controls autoPlay playsInline preload="none" aria-label="What happens during EBOO: a 23-second clinic film" /> : <button type="button" className={styles.playFilm} onClick={() => setStarted(true)} aria-label="Play 23-second EBOO procedure film">
      {/* The video element and its 10 MB source are created only after this click. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/retarget/eboo-procedure-poster.jpg" alt="EBOO clinic film: follow the two lines" width="1080" height="1920" loading="lazy" />
      <span className={styles.playCircle}><Play fill="currentColor" size={25} aria-hidden /></span><span className={styles.playCaption}>WATCH THE FILM <span>00:23</span></span>
    </button>}
  </div>;
}
