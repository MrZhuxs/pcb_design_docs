import React from 'react';
import styles from '../pcb/pcb-figures.module.css';

type CircuitVideoProps = {
  /** 左上角编号，例如 "VIDEO · C05" */
  no: string;
  title: string;
  meta?: string;
  src: string;
  poster?: string;
  caption?: React.ReactNode;
  note?: React.ReactNode;
};

/**
 * 视频图：版式与 SVG 图（FigureShell）保持一致——同一张卡片、同一套编号与图注。
 * 用原生 <video>，不依赖客户端 JS，SSR 出来就能点播。
 */
export function CircuitVideo({ no, title, meta, src, poster, caption, note }: CircuitVideoProps) {
  return (
    <figure className={styles.figure}>
      <div className={styles.head}>
        <span className={styles.no}>{no}</span>
        <span className={styles.title}>{title}</span>
        {meta ? <span className={styles.meta}>{meta}</span> : null}
      </div>
      <div style={{ padding: '0 10px 10px' }}>
        <video
          src={src}
          poster={poster}
          controls
          loop
          muted
          playsInline
          preload="metadata"
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            borderRadius: 10,
            background: '#0A0A0A',
          }}
        />
      </div>
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
      {note ? <div className={styles.note}>{note}</div> : null}
    </figure>
  );
}
