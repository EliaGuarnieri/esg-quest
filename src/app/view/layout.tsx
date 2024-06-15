"use client";

import { type Plugin, Worker } from "@react-pdf-viewer/core";
import { useState } from "react";

import { BottomBar } from "./_components/bottombar";
import { Toolbar } from "./_components/toolbar";
import { FileName, PluginsInstance } from "./_context";

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout(props: Props) {
  const { children } = props;
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [fileName, setFileName] = useState<string>("");

  return (
    <main className="relative">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
        <PluginsInstance.Provider value={{ plugins, setPlugins }}>
          <FileName.Provider value={{ fileName, setFileName }}>
            <Toolbar />
            {children}
            <BottomBar />
          </FileName.Provider>
        </PluginsInstance.Provider>
      </Worker>
    </main>
  );
}
