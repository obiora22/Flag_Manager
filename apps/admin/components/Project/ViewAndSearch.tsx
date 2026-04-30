import { Search } from "lucide-react";
import React from "react";

export function ViewAndSearch({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: "list" | "grid";
  setViewMode: (viewMode: "list" | "grid") => void;
}) {
  console.log({ viewMode });
  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1.5 rounded ${
              viewMode === "grid" ? "bg-slate-700 text-white" : "text-slate-400"
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 rounded ${
              viewMode === "list" ? "bg-slate-700 text-white" : "text-slate-400"
            }`}
          >
            List
          </button>
        </div>
      </div>
    </div>
  );
}
