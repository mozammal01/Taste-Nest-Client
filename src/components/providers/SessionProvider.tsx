"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function SessionProvider({ children }: Props) {
  return <>{children}</>;
}
