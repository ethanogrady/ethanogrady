const VARIANT_WIDTHS = [256, 384, 640, 900, 1200, 2048];

export default function projectImageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
}) {
  const variant =
    VARIANT_WIDTHS.find((candidate) => candidate >= width) ??
    VARIANT_WIDTHS[VARIANT_WIDTHS.length - 1];
  return `${src}-${variant}.webp`;
}
