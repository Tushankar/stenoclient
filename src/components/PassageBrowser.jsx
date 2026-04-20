import React, { useState, useEffect } from "react";
import { Search, BookOpen, Sparkles, X } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const PassageBrowser = ({ onSelectPassage, onClose, mode = "all" }) => {
  const [passages, setPassages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    difficulty: "",
    examType: "",
    category: "",
    searchText: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  useEffect(() => {
    fetchPassages();
  }, [filters, pagination.page]);

  const fetchPassages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.difficulty) params.append("difficulty", filters.difficulty);
      if (filters.examType) params.append("examType", filters.examType);
      if (filters.category) params.append("category", filters.category);
      params.append("limit", pagination.limit);
      params.append("page", pagination.page);

      const res = await api.get(`/texts?${params.toString()}`);
      if (res.data.success) {
        // Filter by search text client-side
        let filteredTexts = res.data.texts;
        if (filters.searchText) {
          filteredTexts = filteredTexts.filter(
            (t) =>
              t.title
                .toLowerCase()
                .includes(filters.searchText.toLowerCase()) ||
              t.content
                .toLowerCase()
                .includes(filters.searchText.toLowerCase()),
          );
        }
        setPassages(filteredTexts);
        setPagination((prev) => ({
          ...prev,
          total: res.data.total,
        }));
      }
    } catch (err) {
      toast.error("Failed to load passages");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSelectPassage = (passage) => {
    onSelectPassage(passage);
    toast.success(`Selected: ${passage.title}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[var(--color-surface)] border-b border-[var(--color-border)] p-6 flex justify-between items-center">
          <h2 className="text-2xl font-black text-[var(--color-primary-light)] flex items-center gap-2">
            <BookOpen size={28} /> Select Passage
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-surface-2)] rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-[var(--color-border)] space-y-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-3.5 text-[var(--color-text-muted)]"
            />
            <input
              type="text"
              placeholder="Search passages by title or content..."
              value={filters.searchText}
              onChange={(e) => handleFilterChange("searchText", e.target.value)}
              className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg px-10 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)] transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange("difficulty", e.target.value)}
              className="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)] transition"
            >
              <option value="">All Difficulties</option>
              <option value="beginner">Easy</option>
              <option value="intermediate">Medium</option>
              <option value="advanced">Hard</option>
            </select>

            <select
              value={filters.examType}
              onChange={(e) => handleFilterChange("examType", e.target.value)}
              className="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)] transition"
            >
              <option value="">All Exam Types</option>
              <option value="SSC">SSC</option>
              <option value="Railway">Railway</option>
              <option value="Court">Court</option>
              <option value="General">General</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)] transition"
            >
              <option value="">All Categories</option>
              <option value="general">General</option>
              <option value="legal">Legal</option>
              <option value="government">Government</option>
              <option value="education">Education</option>
              <option value="technology">Technology</option>
              <option value="environment">Environment</option>
              <option value="health">Health</option>
              <option value="economy">Economy</option>
              <option value="ai-generated">AI Generated</option>
            </select>
          </div>
        </div>

        {/* Passages List */}
        <div className="p-6 space-y-3 max-h-[calc(90vh-300px)] overflow-y-auto">
          {loading ? (
            <div className="text-center py-8 text-[var(--color-text-muted)]">
              Loading passages...
            </div>
          ) : passages.length === 0 ? (
            <div className="text-center py-8 text-[var(--color-text-muted)]">
              No passages found. Try adjusting filters.
            </div>
          ) : (
            passages.map((passage) => (
              <button
                key={passage._id}
                onClick={() => handleSelectPassage(passage)}
                className="w-full text-left p-4 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-white group-hover:text-[var(--color-primary-light)] transition flex items-center gap-2">
                      {passage.title}
                      {passage.category === "ai-generated" && (
                        <Sparkles size={14} className="text-indigo-400" />
                      )}
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1 line-clamp-2">
                      {passage.content}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 text-xs font-bold whitespace-nowrap">
                    <span className="bg-[var(--color-primary)]/20 text-[var(--color-primary-light)] px-2 py-1 rounded capitalize">
                      {passage.difficulty === "beginner"
                        ? "Easy"
                        : passage.difficulty === "intermediate"
                          ? "Medium"
                          : "Hard"}
                    </span>
                    <span className="bg-[var(--color-accent)]/20 text-[var(--color-accent)] px-2 py-1 rounded">
                      {passage.examType}
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Pagination */}
        {passages.length > 0 && (
          <div className="sticky bottom-0 bg-[var(--color-surface)] border-t border-[var(--color-border)] p-4 flex justify-between items-center">
            <span className="text-sm text-[var(--color-text-muted)]">
              Page {pagination.page} • Total: {pagination.total} passages
            </span>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPagination((p) => ({
                    ...p,
                    page: Math.max(1, p.page - 1),
                  }))
                }
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-border)] transition disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setPagination((p) => ({
                    ...p,
                    page: p.page + 1,
                  }))
                }
                disabled={
                  pagination.page * pagination.limit >= pagination.total
                }
                className="px-4 py-2 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-border)] transition disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PassageBrowser;
