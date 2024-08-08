"use client";

import { type PdfJs, type Plugin, Worker } from "@react-pdf-viewer/core";
import { useState } from "react";

import { BottomBar } from "./_components/bottombar";
import { Sidebar } from "./_components/sidebar";
import { Toolbar } from "./_components/toolbar";
import { Document, FileName, PluginsInstance } from "./_context";

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout(props: Props) {
  const { children } = props;
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [document, setDocument] = useState<PdfJs.PdfDocument | null>(null);

  return (
    <main className="relative">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
        <PluginsInstance.Provider value={{ plugins, setPlugins }}>
          <FileName.Provider value={{ fileName, setFileName }}>
            <Document.Provider value={{ document, setDocument }}>
              <Toolbar />
              <Sidebar />
              {children}
              <BottomBar />
            </Document.Provider>
          </FileName.Provider>
        </PluginsInstance.Provider>
      </Worker>
    </main>
  );
}
