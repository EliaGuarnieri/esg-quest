"use client";

import "@react-pdf-viewer/core/lib/styles/index.css";

import type { DocumentLoadEvent, PageLayout } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import { useContext } from "react";

import { PageLayer } from "./_components/page-layer";
import { Document, FileName, PluginsInstance } from "./_context";

export default function View() {
  const { plugins } = useContext(PluginsInstance);
  const { setFileName } = useContext(FileName);
  const { setDocument } = useContext(Document);

  const pageLayout: PageLayout = {
    transformSize: ({ size }) => ({
      height: size.height + 30,
      width: size.width + 30,
    }),
    buildPageStyles: () => ({
      marginBlock: "15px",
    }),
  };

  const handleDocumentLoad = (e: DocumentLoadEvent) => {
    setFileName(e.file.name);
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
