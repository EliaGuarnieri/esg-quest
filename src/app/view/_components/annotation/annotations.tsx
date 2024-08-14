// Import styles
import "@react-pdf-viewer/highlight/lib/styles/index.css";

import { useIsomorphicLayoutEffect } from "@react-pdf-viewer/core";
import { highlightPlugin } from "@react-pdf-viewer/highlight";
import {
  type Dispatch,
  Fragment,
  type SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";

import { FileName, PluginsInstance } from "@/app/view/_context";
import { type Note } from "@/app/view/_types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

import { AnnotationContent } from "./annotation-content";
import { HighlightTarget } from "./highlight-target";
import { Highlights } from "./highlights";

type Props = {
  setActiveTab: Dispatch<SetStateAction<string>>;
};
export const Annotations = (props: Props) => {
  const { fileName } = useContext(FileName);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const noteElementsRef = useRef<Map<string, HTMLElement>>(new Map());
  const currentPage = useRef<number>(0);

  const jumpToNote = (note: Note) => {
    if (noteElementsRef.current.has(note.id)) {
      noteElementsRef.current.get(note.id)!.scrollIntoView({
        behavior: "smooth",
      });
      setSelectedNote((prev) => (prev === note.id ? prev : note.id));
      props.setActiveTab("annotations");
    }
  };

  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget: (props) => <HighlightTarget {...props} />,
    renderHighlights: (props) => (
      <Highlights {...props} jumpToNote={jumpToNote} />
    ),
  });

  const { setPlugins } = useContext(PluginsInstance);
  useIsomorphicLayoutEffect(() => {
    setPlugins((plugins) => {
      if (plugins.includes(highlightPluginInstance)) {
        return plugins;
      }
      return [...plugins, highlightPluginInstance];
    });
  }, []);

  const { data, isLoading } = api.annotation.getAll.useQuery({
    name: fileName,
  });

  if (isLoading || !data) return null;

  const { jumpToHighlightArea } = highlightPluginInstance;

  const handleNoteClick = (note: Note) => {
    setSelectedNote((prev) => (prev === note.id ? prev : note.id));
    jumpToHighlightArea(note.area);
  };

  return data.map((note, index) => {
    const isSamePage = currentPage.current === note.area.pageIndex;
    if (!isSamePage) {
      currentPage.current = note.area.pageIndex;
    }
    return (
      <Fragment key={note.id}>
        {!isSamePage && (
          <div
            className={cn("flex justify-center pb-2", index !== 0 && "pt-4")}
          >
            <span className="rounded-full bg-accent px-4 text-sm text-foreground">
              On page {currentPage.current}
            </span>
          </div>
        )}
        <Card
          className={cn(
            "mb-2 border border-accent bg-card text-sm shadow-md shadow-accent transition-colors",
            selectedNote === note.id && "bg-accent",
          )}
          ref={(ref) =>
            void noteElementsRef.current.set(note.id, ref as HTMLElement)
          }
        >
          <CardContent className="p-2">
            <AnnotationContent note={note} goToNote={handleNoteClick} />
          </CardContent>
        </Card>
      </Fragment>
    );
  });
};
