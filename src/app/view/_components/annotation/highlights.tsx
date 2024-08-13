/**
 * TODO: Add annotations view in sidebar
 * @see https://react-pdf-viewer.dev/plugins/highlight/ (Display notes in a sidebar)
 *
 */
import { type RenderHighlightsProps } from "@react-pdf-viewer/highlight";
import { useContext } from "react";

import { FileName } from "@/app/view/_context";
import { api } from "@/trpc/react";

export const Highlights = (props: RenderHighlightsProps) => {
  const { fileName } = useContext(FileName);

  const { data, isLoading } = api.annotation.getAll.useQuery({
    name: fileName,
    pageIndex: props.pageIndex,
  });

  if (isLoading || !data) return null;

  return data
    ?.filter((chunk) => chunk.area.pageIndex === props.pageIndex)
    .map((chunk, idx) => (
      <button
        key={idx}
        id="highlight-area-test"
        className="highlight-area border-2 border-yellow-500"
        onClick={() => console.log("Clicked")}
        style={Object.assign(
          {},
          {
            background: "yellow",
            padding: 4,
            boxSizing: "content-box",
            borderRadius: 4,
            border: "none",
            opacity: 0.4,
            zIndex: 1000,
          },
          // Calculate the position
          // to make the highlight area displayed at the desired position
          // when users zoom or rotate the document
          props.getCssProperties(chunk.area, props.rotation),
        )}
      />
    ));
};
