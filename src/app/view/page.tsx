"use client";

import "@react-pdf-viewer/core/lib/styles/index.css";

import type { PageLayout } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import { useContext } from "react";

import { PluginsInstance } from "./_context";

export default function View() {
  const { plugins } = useContext(PluginsInstance);

  const pageLayout: PageLayout = {
    transformSize: ({ size }) => ({
      height: size.height + 30,
      width: size.width + 30,
    }),
    buildPageStyles: () => ({
      marginBlock: "15px",
    }),
  };

  return (
    <div className="h-svh">
      <Viewer
        fileUrl="/Ferrovie_dello_stato.pdf"
        defaultScale={1}
        pageLayout={pageLayout}
        plugins={plugins}
      />
    </div>
  );
}
