import { type RenderHighlightsProps } from "@react-pdf-viewer/highlight";
import { useContext } from "react";

import { FileName } from "@/app/view/_context";
import { type Note } from "@/app/view/_types";
import { api } from "@/trpc/react";

export const Highlights = (
  props: RenderHighlightsProps & {
    jumpToNote: (note: Note) => void;
  },
) => {
  const { fileName } = useContext(FileName);

  const { data, isLoading } = api.annotation.getByPageIndex.useQuery({
    name: fileName,
    pageIndex: props.pageIndex,
  });

  if (isLoading || !data) return null;

  return data
    ?.filter((note) => note.pageIndex === props.pageIndex)
    .map((note, idx) => (
      <button key={idx} onClick={() => props.jumpToNote(note)}>
        {note.areas.map((area, index) => (
          <span
            key={index}
            style={Object.assign(
              {},
              {
                background: "yellow",
                padding: 2,
                boxSizing: "content-box",
                borderRadius: 4,
                border: "none",
                opacity: 0.4,
                zIndex: 1000,
              },
              // Calculate the position
              // to make the highlight area displayed at the desired position
              // when users zoom or rotate the document
              props.getCssProperties(area, props.rotation),
            )}
          />
        ))}
      </button>
    ));
};
