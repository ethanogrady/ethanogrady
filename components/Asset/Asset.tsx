import Image from "next/image";
import type { Asset as AssetType } from "@/lib/projects";
import styles from "./Asset.module.css";

type AssetProps = {
  asset: AssetType;
  alt?: string;
  sizes: string;
  preload?: boolean;
  className?: string;
};

export function Asset({
  asset,
  alt = "",
  sizes,
  preload = false,
  className,
}: AssetProps) {
  return (
    <span className={[styles.container, className].filter(Boolean).join(" ")}>
      <Image
        className={styles.asset}
        src={asset.src}
        width={asset.width}
        height={asset.height}
        alt={alt}
        sizes={sizes}
        preload={preload}
        draggable={false}
      />
    </span>
  );
}
