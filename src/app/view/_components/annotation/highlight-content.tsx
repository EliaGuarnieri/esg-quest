import { type RenderHighlightTargetProps } from "@react-pdf-viewer/highlight";
import { useContext, useState } from "react";

import { FileName } from "@/app/view/_context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import { toast } from "sonner";

export const HighlightContent = (props: RenderHighlightTargetProps) => {
  const { fileName } = useContext(FileName);

  const [objective, setObjective] = useState<string | undefined>();
  const [condition, setCondition] = useState<string | undefined>();

  const utils = api.useUtils();
  const addNoteMutation = api.annotation.add.useMutation({
    onSuccess: () => {
      toast.success("Note added");
    },
    onError: () => {
      toast.error("Failed to add note", {
        description: "Please try again",
      });
    },
    onSettled: () => {
      void utils.annotation.invalidate();
    },
  });

  const addNote = () => {
    addNoteMutation.mutate({
      fileName,
      id: `${fileName}-${props.selectionRegion.pageIndex}-${Date.now()}`,
      areas: props.highlightAreas,
      text: props.selectedText,
      pageIndex: props.selectionRegion.pageIndex,
      objective,
      condition,
    });

    props.toggle();
  };

  return (
    <Card className="mb-2 w-80 border border-accent bg-card text-sm shadow-md shadow-accent transition-colors">
      <CardContent className="p-2">
        <div className="space-y-4 pb-0 pt-2">
          <div>
            <h4 className="mb-1 font-bold">Objectives</h4>
            <Select
              value={objective}
              onValueChange={(value) => setObjective(value)}
            >
              <SelectTrigger className="w-full text-left focus:ring-0 focus:ring-ring focus:ring-offset-0">
                <SelectValue placeholder="Select the objective" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="climate change mitigation">
                  climate change mitigation
                </SelectItem>
                <SelectItem value="climate change adaptation">
                  climate change adaptation
                </SelectItem>
                <SelectItem value="pollution prevention and control">
                  pollution prevention and control
                </SelectItem>
                <SelectItem value="protection and restoration of biodiversity and ecosystems">
                  protection and restoration of biodiversity and ecosystems
                </SelectItem>
                <SelectItem value="sustainable use and protection of water and marine resources">
                  sustainable use and protection of water and marine resources
                </SelectItem>
                <SelectItem value="transition to a circular economy">
                  transition to a circular economy
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h4 className="mb-1 font-bold">Conditions</h4>
            <Select
              value={condition}
              onValueChange={(value) => setCondition(value)}
            >
              <SelectTrigger className="w-full text-left focus:ring-0 focus:ring-ring focus:ring-offset-0">
                <SelectValue placeholder="Select the condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="do not significant harm">
                  do not significant harm
                </SelectItem>
                <SelectItem value="substantial contribution">
                  substantial contribution
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h4 className="mb-1 font-bold">Selected text</h4>
            <p className="select-none rounded-md border bg-card p-2 text-xs">
              {props.selectedText}
            </p>
          </div>

          <Button className="w-full" onClick={() => addNote()}>
            Add annotation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
