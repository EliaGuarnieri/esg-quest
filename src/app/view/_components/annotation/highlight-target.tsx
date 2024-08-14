import { type RenderHighlightTargetProps } from "@react-pdf-viewer/highlight";

import { HighlightContent } from "./highlight-content";

export const HighlightTarget = (props: RenderHighlightTargetProps) => {
  return (
    <div className="absolute left-full top-1/3 z-10 pl-4">
      <HighlightContent {...props} />
    </div>
  );
};
