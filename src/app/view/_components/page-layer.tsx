import { type RenderPageProps } from "@react-pdf-viewer/core";
import { useEffect } from "react";

export const PageLayer = (props: RenderPageProps) => {
  const {
    textLayer,
    canvasLayer,
    annotationLayer,
    markRendered,
    pageIndex,
    textLayerRendered,
  } = props;

  useEffect(() => {
    if (textLayerRendered) {
      markRendered(pageIndex);
    }
  }, [textLayerRendered, markRendered, pageIndex]);

  return (
    <div className="border-slate-150 relative h-full w-full overflow-hidden rounded-md border border-accent bg-card shadow-md shadow-accent">
      {canvasLayer.children}
      {textLayer.children}
      {annotationLayer.children}
    </div>
  );
};
