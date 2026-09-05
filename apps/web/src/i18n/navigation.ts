/**
 * next-intl navigation helpers — use these instead of `next/navigation`
 * anywhere you need locale-aware Link, redirect, usePathname, or useRouter.
 */
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
