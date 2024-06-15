"use client";

import { type Plugin, Worker } from "@react-pdf-viewer/core";
import { useState } from "react";

import { PageNavigation } from "./_components/page-navigation";
import { Toolbar } from "./_components/toolbar";
import { PluginsInstance } from "./_context";

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout(props: Props) {
  const { children } = props;
  const [plugins, setPlugins] = useState<Plugin[]>([]);

  return (
    <main className="relative">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
        <PluginsInstance.Provider value={{ plugins, setPlugins }}>
          <Toolbar />
          {children}
          <PageNavigation />
        </PluginsInstance.Provider>
      </Worker>
    </main>
  );
}
