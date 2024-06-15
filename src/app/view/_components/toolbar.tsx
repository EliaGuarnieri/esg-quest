"use client";

import { useContext } from "react";

import { FileName } from "../_context";
import { Breadcrumb } from "./breadcrumb";

export const Toolbar = () => {
  const { fileName } = useContext(FileName);

  return (
    <div className="sticky top-0 z-10 grid-cols-3 bg-accent p-2 text-foreground">
      <div className="col-start-2 col-end-2 flex justify-center">
        <Breadcrumb fileName={fileName} />
      </div>
    </div>
  );
};
