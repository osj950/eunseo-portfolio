"use client";

import { WORK_CATEGORIES, WorkCategory } from "@/lib/types";

interface CategoryFilterProps {
  selected: WorkCategory | "all";
  onChange: (category: WorkCategory | "all") => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {WORK_CATEGORIES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-4 py-1.5 font-sans text-sm tracking-wider border transition-colors ${
            selected === value
              ? "bg-brown text-cream border-brown"
              : "bg-transparent text-brown/60 border-brown/30 hover:border-brown hover:text-brown"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
