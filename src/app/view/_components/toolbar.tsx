"use client";

import { Zoom } from "./zoom";

export const Toolbar = () => {
  return (
    <div className="sticky top-0 z-10 flex bg-accent px-4 py-2 text-foreground">
      <Zoom />
    </div>
  );
};
