import React from "react";

export interface SquirrelEllipsisProps {
  component: HTMLElement;
  ellipsis?: string | React.ReactNode;
  action?: string | React.ReactNode;
  basedOn?: "word" | "letter";
  maxLine: number | null;
  text: string;
  trimEndPunc: boolean;
  className?: string;
  onReflow?: (clamped: boolean, text: string) => void;
}
