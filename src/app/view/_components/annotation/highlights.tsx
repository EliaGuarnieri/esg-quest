import { type PdfJs, useIsomorphicLayoutEffect } from "@react-pdf-viewer/core";
import {
  type HighlightArea,
  type RenderHighlightsProps,
} from "@react-pdf-viewer/highlight";
import { useCallback, useContext, useEffect, useState } from "react";
import { text } from "stream/consumers";

import { Document } from "@/app/view/_context";
import { api } from "@/trpc/react";

type ExtendedPageTextItem = PdfJs.PageTextItem & {
  height: number;
  width: number;
  transform: [number, number, number, number, number, number];
};

type HighlightChunks = {
  chunk: string;
  area: HighlightArea;
};

export const Highlights = (props: RenderHighlightsProps) => {
  const { document } = useContext(Document);
  const { data, isLoading } = api.annotation.get.useQuery(
    {
      text: "prova_ferrovie.json",
    },
    {
      staleTime: Infinity,
    },
  );
  const [highlightChunks, setHighlightChunks] = useState<HighlightChunks[]>([]);

  useIsomorphicLayoutEffect(() => {
    if (!document || isLoading || !data) return;

    void (async () => {
      await Promise.all(
        data
          .filter((item) => item.page === props.pageIndex)
          .map(async (item, chunk) => {
            const texts = item.texts;
            const pageIndex = item.page + 1;
            const page = await document.getPage(pageIndex);
            const viewport = page.getViewport({ scale: 1 });
            const items = (await page.getTextContent())
              .items as ExtendedPageTextItem[];

            const filteredItems = items.filter((item) =>
              texts.includes(item.str),
            );

            filteredItems.forEach((item) => {
              const itemHeight = item.height;
              const itemWidth = item.width;

              // The transform array holds [a, b, c, d, e, f] where [e, f] is the translation component
              const itemLeft = item.transform[4];
              const itemTop = item.transform[5] - 3;

              const viewportHeight = viewport.height;
              const viewportWidth = viewport.width;

              // Convert the item's coordinates to the viewport's coordinate system
              const left = (itemLeft / viewportWidth) * 100;
              const top =
                ((viewportHeight - itemTop - itemHeight) / viewportHeight) *
                100;

              // Convert the item's dimensions to percentages relative to the viewport's dimensions
              const width = (itemWidth / viewportWidth) * 100;
              const height = (itemHeight / viewportHeight) * 100;

              const area = {
                height,
                width,
                top,
                left,
                pageIndex: pageIndex - 1,
              };

              const chunkArea = {
                chunk: item.str,
                area,
              };

              setHighlightChunks((items) => {
                if (items.some((item) => item.chunk === chunkArea.chunk))
                  return items;
                return [...items, chunkArea];
              });
            });
          }),
      );
    })();
  }, [data, document, isLoading]);

  return highlightChunks
    ?.filter((chunk) => chunk.area.pageIndex === props.pageIndex)
    .map((chunk, idx) => (
      <div
        key={idx}
        id="highlight-area-test"
        className="highlight-area border-2 border-yellow-500"
        style={Object.assign(
          {},
          {
            background: "yellow",
            padding: 2,
            borderRadius: 4,
            border: "none",
            opacity: 0.4,
          },
          // Calculate the position
          // to make the highlight area displayed at the desired position
          // when users zoom or rotate the document
          props.getCssProperties(chunk.area, props.rotation),
        )}
      />
    ));
};
