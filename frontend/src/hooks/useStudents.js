import { useState, useMemo } from "react";
import { STUDENTS } from "@/utils/mockData";

/**
 * useStudents — filtered, sorted, paginated student list hook
 */
export function useStudents({
  defaultFilter = "all",
  defaultSort   = "probability",
  pageSize      = 20,
} = {}) {
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState(defaultFilter); // "all" | "at_risk" | "safe" | "critical"
  const [sortBy,  setSortBy]  = useState(defaultSort);   // "probability" | "cgpa" | "name" | "backlogs"
  const [sortDir, setSortDir] = useState("asc");
  const [page,    setPage]    = useState(1);

  const filtered = useMemo(() => {
    let list = [...STUDENTS];

    // Filter
    if (filter === "at_risk")  list = list.filter(s => s.atRisk);
    if (filter === "safe")     list = list.filter(s => !s.atRisk);
    if (filter === "critical") list = list.filter(s => s.probability < 0.3);

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q)   ||
        s.branch.toLowerCase().includes(q) ||
        s.degree.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      let va = a[sortBy], vb = b[sortBy];
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [search, filter, sortBy, sortDir]);

  const paginated = useMemo(
    () => filtered.slice(0, page * pageSize),
    [filtered, page, pageSize]
  );

  const toggleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(field); setSortDir("asc"); }
  };

  const loadMore = () => {
    if (page * pageSize < filtered.length) setPage(p => p + 1);
  };

  return {
    students:  paginated,
    total:     filtered.length,
    hasMore:   page * pageSize < filtered.length,
    search, setSearch,
    filter, setFilter,
    sortBy, sortDir, toggleSort,
    loadMore,
  };
}

/**
 * useStudentStats — derived stats from the student list
 */
export function useStudentStats() {
  return useMemo(() => {
    const total     = STUDENTS.length;
    const atRisk    = STUDENTS.filter(s => s.atRisk).length;
    const critical  = STUDENTS.filter(s => s.probability < 0.3).length;
    const placed    = STUDENTS.filter(s => !s.atRisk).length;
    const avgProb   = STUDENTS.reduce((acc, s) => acc + s.probability, 0) / total;
    const avgCgpa   = STUDENTS.reduce((acc, s) => acc + s.cgpa, 0) / total;
    const withBL    = STUDENTS.filter(s => s.backlogs > 0).length;
    const noIntern  = STUDENTS.filter(s => s.internships === 0).length;
    return { total, atRisk, critical, placed, avgProb, avgCgpa, withBL, noIntern };
  }, []);
}
