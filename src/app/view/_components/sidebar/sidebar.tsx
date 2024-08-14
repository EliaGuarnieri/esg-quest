import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Bookmark, File } from "lucide-react";
import { useState } from "react";

import { Annotations } from "@/app/view/_components/annotation";
// import { Search } from "@/app/view/_components/annotation/search";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tabs,
  TabsContent as StaticTabContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";

import { Thumbnails } from "./thumbnails";

const TabsContent = motion(StaticTabContent);

export const Sidebar = () => {
  const [activeTab, setActiveTab] = useState<string>("closed");

  const handleTabChange = (value: string) => {
    if (value === activeTab) return setActiveTab("closed");
    return setActiveTab(value);
  };

  const handleTabClick = (value: string) => {
    handleTabChange(value);
  };

  const variants: Variants = {
    open: {
      translateX: "0",
      display: "block",
      transition: { duration: 0.2, type: "tween", bounce: 0 },
      transitionEnd: { display: "block" },
    },
    closed: {
      translateX: "-100%",
      display: "none",
      transition: { duration: 0.2, type: "tween", bounce: 0 },
      transitionEnd: { display: "none" },
    },
  };

  return (
    <div className="fixed top-[52px] z-10 h-safe">
      <Tabs
        className="flex gap-2"
        activationMode="manual"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="z-10 flex h-safe flex-col justify-start gap-2 rounded-none border-t bg-accent p-2">
          <TabsTrigger
            className="rounded-md p-0"
            value="pages"
            onMouseDown={() => handleTabClick("pages")}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <File className="h-10 w-10 rounded-md p-2" />
              </TooltipTrigger>
              <TooltipContent side="right">Pages preview</TooltipContent>
            </Tooltip>
          </TabsTrigger>

          <TabsTrigger
            className="rounded-md p-0"
            value="annotations"
            onMouseDown={() => handleTabClick("annotations")}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Bookmark className="h-10 w-10 rounded-md p-2" />
              </TooltipTrigger>
              <TooltipContent side="right">Annotations</TooltipContent>
            </Tooltip>
          </TabsTrigger>
        </TabsList>

        <AnimatePresence initial={false}>
          <TabsContent
            key="pages"
            value="pages"
            className="absolute left-12 top-0 mt-0 h-safe w-80 border-t bg-accent p-2"
            forceMount
            variants={variants}
            animate={activeTab === "pages" ? "open" : "closed"}
          >
            <ScrollArea
              className="h-full w-full rounded-md bg-white"
              type="auto"
            >
              <div className="w-full p-4">
                <Thumbnails />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent
            key="annotations"
            value="annotations"
            className="absolute left-12 top-0 mt-0 h-safe w-80 border-t bg-accent p-2"
            forceMount
            variants={variants}
            animate={activeTab === "annotations" ? "open" : "closed"}
          >
            <ScrollArea
              className="h-full w-full rounded-md bg-white"
              type="auto"
            >
              <div className="w-full p-4">
                <Annotations setActiveTab={setActiveTab} />
              </div>
            </ScrollArea>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};
