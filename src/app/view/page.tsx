"use client";

import "@react-pdf-viewer/core/lib/styles/index.css";

import type { DocumentLoadEvent, PageLayout } from "@react-pdf-viewer/core";
import { useIsomorphicLayoutEffect, Viewer } from "@react-pdf-viewer/core";
import { useContext } from "react";

import { extractArea } from "@/lib/utils";
import { api } from "@/trpc/react";

import { PageLayer } from "./_components/page-layer";
import { Document, FileName, PluginsInstance } from "./_context";
import { type ExtendedPageTextItem } from "./_types";

export default function View() {
  const { plugins } = useContext(PluginsInstance);
  const { fileName, setFileName } = useContext(FileName);
  const { document, setDocument } = useContext(Document);

  const pageLayout: PageLayout = {
    transformSize: ({ size }) => ({
      height: size.height + 30,
      width: size.width + 30,
    }),
    buildPageStyles: () => ({
      marginBlock: "15px",
    }),
  };

  const { data: isAnnotated, isLoading: isLoadingFile } =
    api.file.isAnnotated.useQuery(
      { name: fileName },
      { staleTime: Infinity, enabled: !!fileName },
    );

  const { data, isLoading } = api.annotation.getData.useQuery(
    {
      name: "prova_ferrovie.json",
    },
    {
      staleTime: Infinity,
    },
  );
  const addNote = api.annotation.add.useMutation();

  const utils = api.useUtils();
  const setIsAnnotated = api.file.setAnnotated.useMutation({
    onSettled: () => {
      utils.annotation.invalidate();
    },
  });

  useIsomorphicLayoutEffect(() => {
    /**
     * TODO: trigger the annotation process when the a function is called.
     * @description: It cannot be done in the backend because the annotation process requires the viewport of the page that is defined in the frontend.
     */
    if (!fileName || !document || isLoading || !data) return;

    if (isAnnotated || isLoadingFile) return;

    void (async () => {
      for (let pageNum = 0; pageNum < document.numPages; pageNum++) {
        await Promise.all(
          data
            .filter((item) => item.page === pageNum)
            .map(async (item, index) => {
              const texts = item.texts;
              const pageIndex = item.page + 1;

              const page = await document.getPage(pageIndex);
              const viewport = page.getViewport({ scale: 1 });
              const items = (await page.getTextContent())
                .items as ExtendedPageTextItem[];

              /**
               * Filter the text items that match the highlighted text
               */
              const filteredItems = items.filter((item) =>
                texts.includes(item.str),
              );

              /**
               * Extract the area of the highlighted text
               * @see extractArea in src/lib/utils.ts
               */
              const areas = extractArea({
                items: filteredItems,
                viewport,
                pageIndex,
              });

              /**
               * Concatenate the filtered text items and remove the line breaks
               */
              const text = filteredItems
                .map((item) => item.str)
                .join("\r\n")
                .replace(/(-\r\n)/gm, "");

              addNote.mutate({
                id: `${fileName}-${pageNum}-${index}`,
                fileName,
                areas,
                text,
                pageIndex: item.page,
                objective: item.objective, // TODO: objective: item.objective, need to be added to incoming data
                condition: item.condition, // TODO: condition: item.condition, need to be added to incoming data
              });
            }),
        );
      }

      setIsAnnotated.mutate({ name: fileName });
    })();
  }, [data, document, isLoading, fileName, isAnnotated, isLoadingFile]);

  const handleDocumentLoad = (e: DocumentLoadEvent) => {
    const trimmedFileName = e.file.name.split(".")[0]!.replace(/^\/+/, "");
    setFileName(trimmedFileName);
    setDocument(e.doc);
  };

  return (
    <div className="h-safe">
      <Viewer
        fileUrl="/Ferrovie_dello_stato.pdf"
        defaultScale={1}
        pageLayout={pageLayout}
        plugins={plugins}
        onDocumentLoad={handleDocumentLoad}
        renderPage={(renderPageProps) => <PageLayer {...renderPageProps} />}
      />
    </div>
  );
}
