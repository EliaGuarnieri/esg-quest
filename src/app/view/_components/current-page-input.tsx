"use client";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";

type CurrentPageInputProps = {
  currentPage: number;
  numberOfPages: number;
  jumpToPage: (pageIndex: number) => void;
  jumpToNextPage: () => void;
  jumpToPreviousPage: () => void;
};
export const CurrentPageInput = (props: CurrentPageInputProps) => {
  const {
    currentPage,
    numberOfPages,
    jumpToPreviousPage,
    jumpToPage,
    jumpToNextPage,
  } = props;

  const [editingPage, setEditingPage] = useState("1");

  useEffect(() => setEditingPage(`${currentPage + 1}`), [currentPage]);

  const jump = () => {
    const newPage = parseInt(editingPage, 10);
    editingPage === "" || newPage < 1 || newPage > numberOfPages
      ? setEditingPage(`${currentPage + 1}`)
      : jumpToPage(newPage - 1);
  };

  const keydownPage = (e: React.KeyboardEvent): void => {
    switch (e.key) {
      // Up key is pressed
      case "ArrowUp":
        jumpToPreviousPage();
        break;
      // Down key
      case "ArrowDown":
        jumpToNextPage();
        break;
      // Enter key
      case "Enter":
        jump();
        break;
      default:
        break;
    }
  };

  const onChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEditingPage(e.target.value);

  const onBlurEvent = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setEditingPage(`${currentPage + 1}`);
    }
  };

  return (
    <Input
      className="h-auto bg-input p-1 text-center"
      size={4}
      type="text"
      value={editingPage}
      onChange={onChangeEvent}
      onKeyDown={keydownPage}
      onBlur={onBlurEvent}
    />
  );
};
