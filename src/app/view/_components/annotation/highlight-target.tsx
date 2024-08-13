import { type RenderHighlightTargetProps } from "@react-pdf-viewer/highlight";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export const HighlightTarget = (props: RenderHighlightTargetProps) => {
  return (
    <div
      className="absolute left-full z-10 pl-4"
      style={{
        top: `${props.selectionRegion.top}%`,
      }}
    >
      <Button variant="ghost" onClick={props.toggle}>
        <Plus className="mr-2 h-4 w-4" /> Add annotation
      </Button>
    </div>
  );
};
