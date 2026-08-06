import Image from "next/image";
import type { Asset as AssetType } from "@/lib/projects";
import styles from "./Asset.module.css";

type AssetProps = {
  asset: AssetType;
  alt?: string;
  sizes: string;
  preload?: boolean;
  loading?: "eager" | "lazy";
  className?: string;
};

export function Asset({
  asset,
  alt = "",
  sizes,
  preload = false,
  loading,
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
        loading={loading}
        draggable={false}
      />
    </span>
  );
}
