import { useEffect, useState, type ImgHTMLAttributes, type SyntheticEvent } from "react";

type AppImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};

export function AppImage({
  src,
  fallbackSrc = "/icons/logo.webp",
  onError,
  ...props
}: AppImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(
    typeof src === "string" ? src : undefined,
  );

  useEffect(() => {
    setCurrentSrc(typeof src === "string" ? src : undefined);
  }, [src]);

  const handleError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }

    onError?.(event);
  };

  return <img {...props} src={currentSrc ?? fallbackSrc} onError={handleError} />;
}
