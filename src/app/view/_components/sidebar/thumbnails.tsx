import "@react-pdf-viewer/thumbnail/lib/styles/index.css";

import { useIsomorphicLayoutEffect } from "@react-pdf-viewer/core";
import {
  type RenderThumbnailItemProps,
  thumbnailPlugin,
} from "@react-pdf-viewer/thumbnail";
import { useContext, useState } from "react";

import { PluginsInstance } from "@/app/view/_context";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Thumbnails = () => {
  const [jumpToPage, setJumpToPage] = useState<(pageIndex: number) => void>();
  const thumbnailPluginInstance = thumbnailPlugin({
    thumbnailWidth: 150,
  });
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { Thumbnails } = thumbnailPluginInstance;

  const { plugins, setPlugins } = useContext(PluginsInstance);

  useIsomorphicLayoutEffect(() => {
    plugins.forEach((plugin) => {
      if ("jumpToPage" in plugin) {
        setJumpToPage(() => {
          return plugin.jumpToPage as (pageIndex: number) => void;
        });
      }
    });
  }, [plugins]);

  useIsomorphicLayoutEffect(() => {
    setPlugins((plugins) => {
      if (plugins.includes(thumbnailPluginInstance)) {
        return plugins;
      }
      return [...plugins, thumbnailPluginInstance];
    });
  }, []);

  const renderThumbnailItem = (props: RenderThumbnailItemProps) => (
    <Card
      key={props.key}
      className={cn(
        "mb-2 cursor-pointer border border-accent bg-card shadow-md shadow-accent transition-colors hover:border-slate-50 hover:bg-slate-50",
        props.currentPage === props.pageIndex && "bg-accent",
      )}
      onClick={() => jumpToPage?.(props.pageIndex)}
    >
      <CardContent className="p-2">
        <div className="z-10 overflow-hidden rounded-sm">
          {props.renderPageThumbnail}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center p-2 pt-0">
        <span className="rounded-full bg-card px-4 text-sm text-foreground">
          {props.renderPageLabel}
        </span>
      </CardFooter>
    </Card>
  );

  return <Thumbnails renderThumbnailItem={renderThumbnailItem} />;
};
