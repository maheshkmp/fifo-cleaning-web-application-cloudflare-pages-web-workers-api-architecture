"use client";

import { Filter, ArrowUpDown } from "lucide-react";

export type SortOption = "date_asc" | "date_desc";
export type StatusFilter = "pending" | "quoted" | "closed" | "";
export type ServiceFilter =
  | "house_cleaning"
  | "office_cleaning"
  | "moving_cleaning"
  | "deep_cleaning"
  | "";

export interface FilterState {
  status: StatusFilter;
  serviceType: ServiceFilter;
  sort: SortOption;
}

export interface FilterBarLabels {
  allStatuses: string;
  allServices: string;
  sortDateDesc: string;
  sortDateAsc: string;
  label: string;
  sortLabel: string;
}

const SERVICE_OPTIONS: { value: ServiceFilter; label: string }[] = [
  { value: "", label: "" }, // filled by allServices
  { value: "house_cleaning", label: "House Cleaning" },
  { value: "office_cleaning", label: "Office Cleaning" },
  { value: "moving_cleaning", label: "Moving Cleaning" },
  { value: "deep_cleaning", label: "Deep Cleaning" },
];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "", label: "" }, // filled by allStatuses
  { value: "pending", label: "Pending" },
  { value: "quoted", label: "Quoted" },
  { value: "closed", label: "Closed" },
];

function selectCls() {
  return [
    "h-8 rounded-md border border-border bg-background",
    "px-2.5 pr-7 text-xs font-medium text-foreground",
    "focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]/30",
    "transition-shadow appearance-none cursor-pointer",
  ].join(" ");
}

type Props = {
  filters: FilterState;
  labels: FilterBarLabels;
  onChange: (next: FilterState) => void;
};

export function QuoteFilterBar({ filters, labels, onChange }: Props) {
  function set<K extends keyof FilterState>(key: K, val: FilterState[K]) {
    onChange({ ...filters, [key]: val });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Status filter */}
      <div className="flex items-center gap-1.5">
        <Filter className="size-3.5 text-muted-foreground shrink-0" />
        <span className="text-xs text-muted-foreground">{labels.label}</span>
        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => set("status", e.target.value as StatusFilter)}
            className={selectCls()}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.value === "" ? labels.allStatuses : o.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>

      {/* Service type filter */}
      <div className="relative">
        <select
          value={filters.serviceType}
          onChange={(e) => set("serviceType", e.target.value as ServiceFilter)}
          className={selectCls()}
        >
          {SERVICE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.value === "" ? labels.allServices : o.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>

      {/* Sort toggle */}
      <button
        onClick={() =>
          set("sort", filters.sort === "date_desc" ? "date_asc" : "date_desc")
        }
        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-xs font-medium text-foreground hover:bg-accent transition-colors"
      >
        <ArrowUpDown className="size-3.5 text-muted-foreground" />
        {labels.sortLabel}:&nbsp;
        <span className="text-[color:var(--brand)]">
          {filters.sort === "date_desc" ? labels.sortDateDesc : labels.sortDateAsc}
        </span>
      </button>
    </div>
  );
}
