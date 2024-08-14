import { Trash } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

import { type Note } from "@/app/view/_types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import { toast } from "sonner";

type Props = {
  note: Note;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
};

export const AnnotationContent = (props: Props) => {
  const { note, value, setValue } = props;

  const [objective, setObjective] = useState<string | undefined>();
  const [condition, setCondition] = useState<string | undefined>();

  const noteMutation = api.annotation.update.useMutation();

  const updateNote = (value: string, type: "objective" | "condition") => {
    noteMutation.mutate({
      id: note.id,
      [type]: value,
    });

    if (type === "objective") setObjective(value);
    if (type === "condition") setCondition(value);
  };

  const utils = api.useUtils();
  const deleteNoteMutation = api.annotation.delete.useMutation({
    onSuccess: () => {
      toast.success("Note deleted");
    },
    onError: () => {
      toast.error("Failed to delete note", {
        description: "Please try again",
      });
    },
    onSettled: () => {
      void utils.annotation.invalidate();
    },
  });

  const deleteNote = () => {
    deleteNoteMutation.mutate({ id: note.id });
  };

  console.log({ value });

  return (
    <Accordion
      type="single"
      collapsible
      value={value}
      onValueChange={(value) => setValue(value)}
    >
      <AccordionItem value={note.id}>
        <AccordionTrigger className="justify-start py-2 data-[state=open]:pb-4">
          <span className="max-w-56 truncate transition-all group-hover:max-w-48">
            {note.text}
          </span>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pb-0 pt-2">
          <div>
            <h4 className="mb-1 font-bold">Objectives</h4>
            <Select
              value={objective ?? note.objective ?? undefined}
              onValueChange={(value) => updateNote(value, "objective")}
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
              value={condition ?? note.condition ?? undefined}
              onValueChange={(value) => updateNote(value, "condition")}
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
            <p className="rounded-md border bg-card p-2 text-xs">{note.text}</p>
          </div>

          <Button
            variant="secondary"
            className="w-full text-red-600"
            onClick={() => deleteNote()}
          >
            Delete note <Trash className="ml-2 h-4 w-4" />
          </Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
