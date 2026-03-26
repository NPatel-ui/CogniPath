/**
 * Cognipath — Frontend API Client
 * =================================
 * All calls to the FastAPI backend go through this file.
 * Update BASE_URL for production deployment.
 *
 * Usage:
 *   import api from "@/utils/api.js";
 *
 *   const overview  = await api.getOverview();
 *   const students  = await api.getStudents({ at_risk: true });
 *   const result    = await api.uploadCSV(file);
 *   const prediction = await api.predictStudent({ CGPA: 7.5, ... });
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

async function request(method, path, body = null, isFile = false) {
  const options = {
    method,
    headers: isFile ? {} : { "Content-Type": "application/json" },
  };

  if (body && !isFile) options.body = JSON.stringify(body);
  if (body && isFile)  options.body = body;   // FormData

  const res = await fetch(`${BASE_URL}${path}`, options);

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API error ${res.status}`);
  }

  return res.json();
}

const get    = (path)           => request("GET",    path);
const post   = (path, body)     => request("POST",   path, body);
const del    = (path)           => request("DELETE", path);
const upload = (path, formData) => request("POST",   path, formData, true);


// ─── Health ───────────────────────────────────────────────────────────────────

const health = () => get("/api/health");


// ─── Predictions ──────────────────────────────────────────────────────────────

/**
 * Predict placement probability for a single student.
 * @param {Object} student - Student fields matching StudentInput schema
 */
const predictStudent = (student) => post("/api/predict", student);

/**
 * Predict for multiple students at once.
 * @param {Array} students - Array of student objects
 */
const predictBatch = (students) => post("/api/predict/batch", students);


// ─── CSV Upload ───────────────────────────────────────────────────────────────

/**
 * Upload a student CSV file. Returns predictions for all rows.
 * @param {File} file - The CSV file from an <input type="file">
 */
const uploadCSV = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return upload("/api/upload/csv", formData);
};


// ─── Students ─────────────────────────────────────────────────────────────────

/**
 * Get paginated student list with optional filters.
 *
 * @param {Object} options
 * @param {number}  options.page     - Page number (default 1)
 * @param {number}  options.limit    - Students per page (default 50)
 * @param {string}  options.branch   - Filter by branch (CSE, ECE, ME, Civil, IT)
 * @param {boolean} options.at_risk  - Filter at-risk only (true) or safe (false)
 * @param {number}  options.min_prob - Min probability filter (0–1)
 * @param {number}  options.max_prob - Max probability filter (0–1)
 * @param {string}  options.sort_by  - "probability" | "cgpa" | "name" | "backlogs"
 * @param {string}  options.order    - "asc" | "desc"
 */
const getStudents = ({
  page = 1,
  limit = 50,
  branch,
  at_risk,
  min_prob,
  max_prob,
  sort_by = "probability",
  order = "asc",
} = {}) => {
  const params = new URLSearchParams({ page, limit, sort_by, order });
  if (branch   !== undefined) params.append("branch",   branch);
  if (at_risk  !== undefined) params.append("at_risk",  at_risk);
  if (min_prob !== undefined) params.append("min_prob", min_prob);
  if (max_prob !== undefined) params.append("max_prob", max_prob);
  return get(`/api/students?${params}`);
};

/**
 * Get a single student by ID.
 * @param {string} id - Student ID
 */
const getStudent = (id) => get(`/api/students/${id}`);

/**
 * Delete all student data (reset).
 */
const resetStudents = () => del("/api/students/reset");


// ─── Analytics ────────────────────────────────────────────────────────────────

/** Dashboard KPI overview stats */
const getOverview  = () => get("/api/analytics/overview");

/** Branch-wise placement rates */
const getBranches  = () => get("/api/analytics/branches");

/** Skill gap analysis */
const getSkillGaps = () => get("/api/analytics/skillgaps");

/** CGPA vs placement rate buckets */
const getCGPA      = () => get("/api/analytics/cgpa");

/** Monthly placement trend */
const getTrend     = () => get("/api/analytics/trend");


// ─── Default export ───────────────────────────────────────────────────────────

const api = {
  health,
  predictStudent,
  predictBatch,
  uploadCSV,
  getStudents,
  getStudent,
  resetStudents,
  getOverview,
  getBranches,
  getSkillGaps,
  getCGPA,
  getTrend,
};

export default api;