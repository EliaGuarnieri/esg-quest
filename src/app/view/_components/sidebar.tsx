import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Bookmark, File } from "lucide-react";
import { useState } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tabs,
  TabsContent as StaticTabContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

const TabsContent = motion(StaticTabContent);

export const Sidebar = () => {
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);

  const handleTabChange = (value: string | undefined) => {
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
    <div className="h-safe fixed top-[52px] z-10">
      <Tabs
        className="flex gap-2"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="h-safe z-10 flex flex-col justify-start gap-2 rounded-none border-t bg-accent p-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <TabsTrigger
                  className="rounded-md p-2"
                  value="pages"
                  onMouseDown={() => handleTabClick("pages")}
                >
                  <File className="pointer-events-none" />
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">Pages preview</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <TabsTrigger
                  className="rounded-md p-2"
                  value="bookmarks"
                  onMouseDown={() => handleTabClick("bookmarks")}
                >
                  <Bookmark className="pointer-events-none" />
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">Bookmarks</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TabsList>
        <AnimatePresence initial={false}>
          <TabsContent
            key="pages"
            value="pages"
            className="h-safe absolute left-12 top-0 mt-0 w-80 border-t bg-accent p-2"
            forceMount
            variants={variants}
            animate={activeTab === "pages" ? "open" : "closed"}
          >
            <ScrollArea
              className="h-full w-full rounded-md bg-white"
              type="auto"
            >
              <div className="w-full p-4">
                Make changes to your account here.
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent
            key="bookmarks"
            value="bookmarks"
            className="h-safe absolute left-12 top-0 mt-0 w-80 border-t bg-accent p-2"
            forceMount
            variants={variants}
            animate={activeTab === "bookmarks" ? "open" : "closed"}
          >
            <ScrollArea
              className="h-full w-full rounded-md bg-white"
              type="auto"
            >
              <div className="w-full p-4">Change your password here.</div>
            </ScrollArea>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};
