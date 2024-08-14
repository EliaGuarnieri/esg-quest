// Import styles
import "@react-pdf-viewer/highlight/lib/styles/index.css";

import { useIsomorphicLayoutEffect } from "@react-pdf-viewer/core";
import { highlightPlugin } from "@react-pdf-viewer/highlight";
import { MoveRight } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

import { AnnotationContent } from "./annotation-content";
import { HighlightTarget } from "./highlight-target";
import { Highlights } from "./highlights";
import { set } from "zod";

type Props = {
  setActiveTab: Dispatch<SetStateAction<string>>;
};

export const Annotations = (props: Props) => {
  const { fileName } = useContext(FileName);

  const [value, setValue] = useState<string>("");
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  const noteElementsRef = useRef<Map<string, HTMLElement>>(new Map());
  const currentPage = useRef<number>(0);

  const jumpToNote = (note: Note) => {
    if (noteElementsRef.current.has(note.id)) {
      noteElementsRef.current.get(note.id)!.scrollIntoView({
        behavior: "smooth",
      });
      setSelectedNote((prev) => (prev === note.id ? prev : note.id));
      setValue(note.id);
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

  const { data, isLoading } = api.annotation.getAll.useQuery(
    { name: fileName },
    { enabled: !!fileName },
  );

  if (isLoading || !data) return null;

  const { jumpToHighlightArea } = highlightPluginInstance;

  const handleNoteClick = (note: Note) => {
    setSelectedNote((prev) => (prev === note.id ? prev : note.id));
    jumpToHighlightArea(note.areas[0]!);
  };

  return data.map((note, index) => {
    const isSamePage = currentPage.current === note.pageIndex;
    if (!isSamePage) {
      currentPage.current = note.pageIndex;
    }
    return (
      <Fragment key={note.id}>
        {!isSamePage && (
          <div
            className={cn("flex justify-center pb-2", index !== 0 && "pt-4")}
          >
            <span className="rounded-full bg-accent px-4 text-sm text-foreground">
              Page {currentPage.current + 1}
            </span>
          </div>
        )}
        <Card
          className={cn(
            "group mb-2 border border-accent bg-card text-sm shadow-md shadow-accent transition-colors",
            selectedNote === note.id && "border-4",
          )}
          ref={(ref) =>
            void noteElementsRef.current.set(note.id, ref as HTMLElement)
          }
        >
          <CardContent className="relative p-2">
            <AnnotationContent note={note} value={value} setValue={setValue} />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleNoteClick(note)}
                  className="absolute right-2 top-2 h-9 w-9 opacity-0 transition-all group-hover:opacity-100"
                >
                  <MoveRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Jump to annotation</TooltipContent>
            </Tooltip>
          </CardContent>
        </Card>
      </Fragment>
    );
  });
};
