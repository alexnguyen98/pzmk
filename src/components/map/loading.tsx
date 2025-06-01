import { LucideLoader } from "lucide-react";

export const Loading = () => (
  <div className="fixed top-4 text-sm font-medium left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white rounded-full shadow-lg px-3 py-1">
    <LucideLoader className="animate-spin" size={14} />
    Loading data...
  </div>
);
