import { useState } from "react";

function App() {
  // =========================================
  // STATES
  // =========================================

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState("");

  // Search + Filter
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // =========================================
  // SCREENING HISTORY
  // =========================================

  const [history, setHistory] = useState([
    {
      id: 1,
      name: "Aadhaar_Card_01.pdf",
      type: "PDF",
      status: "Verified",
      score: 96,
      date: "12 Sep 2026, 03:42 PM",
    },
    {
      id: 2,
      name: "Passport_User02.jpg",
      type: "JPG",
      status: "Suspicious",
      score: 68,
      date: "12 Sep 2026, 02:18 PM",
    },
    {
      id: 3,
      name: "Driving_License.png",
      type: "PNG",
      status: "Verified",
      score: 92,
      date: "12 Sep 2026, 01:05 PM",
    },
    {
      id: 4,
      name: "PAN_Card_Sample.pdf",
      type: "PDF",
      status: "Fake Detected",
      score: 31,
      date: "11 Sep 2026, 06:27 PM",
    },
  ]);

  // =========================================
  // ALLOWED FILE TYPES
  // =========================================

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
  ];

  // =========================================
  // FILE HANDLING
  // =========================================

  const handleFile = (file) => {
    setError("");
    setScanResult(null);

    if (!file) return;

    // File type validation
    if (!allowedTypes.includes(file.type)) {
      setError(
        "Invalid file format. Please upload JPG, PNG or PDF."
      );
      return;
    }

    // File size validation
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10 MB.");
      return;
    }

    setSelectedFile(file);
  };

  const handleFileChange = (event) => {
    handleFile(event.target.files[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  // =========================================
  // START AI SCREENING
  // =========================================

  const startScreening = () => {
    if (!selectedFile) {
      setError("Please select a document first.");
      return;
    }

    setError("");
    setIsScanning(true);
    setScanResult(null);

    // Demo AI screening simulation
    setTimeout(() => {
      setIsScanning(false);

      // =====================================
      // DEMO FORENSIC RESULT
      // =====================================

      const result = {
        status: "Verified",
        score: 94,
        message:
          "Document passed initial AI-based authenticity screening.",

        forensic: {
          documentIntegrity: 96,
          ocrAccuracy: 98,
          faceMatch: 94,
          liveness: 97,
          tampering: 8,
          riskScore: 12,
        },

        extractedData: {
          documentType: "Aadhaar Card",
          documentNumber: "XXXX XXXX 4821",
          name: "RAHUL SAMMAL",
          dob: "15 Aug 2004",
          gender: "Male",
        },

        anomalies: [
          "No visible document alteration detected",
          "OCR text structure is consistent",
          "Face region matches identity photo",
        ],
      };

      setScanResult(result);

      // =====================================
      // ADD TO SCREENING HISTORY
      // =====================================

      const extension =
        selectedFile.name.split(".").pop()?.toUpperCase() ||
        "FILE";

      const newHistory = {
        id: Date.now(),
        name: selectedFile.name,
        type: extension,
        status: result.status,
        score: result.score,
        date: new Date().toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setHistory((previousHistory) => [
        newHistory,
        ...previousHistory,
      ]);
    }, 2000);
  };

  // =========================================
  // REMOVE FILE
  // =========================================

  const removeFile = () => {
    setSelectedFile(null);
    setScanResult(null);
    setError("");
  };

  // =========================================
  // SEARCH + FILTER
  // =========================================

  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || item.status === filter;

    return matchesSearch && matchesFilter;
  });

  // =========================================
  // UI
  // =========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* =====================================
          HEADER
      ===================================== */}

      <header className="border-b border-slate-800 bg-slate-900/90">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              AI Identity Screening
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Fake Identity & Documents Detection System
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">

            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>

            System Online

          </div>

        </div>

      </header>

      {/* =====================================
          MAIN
      ===================================== */}

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* =====================================
            PAGE TITLE
        ===================================== */}

        <div className="mb-8">

          <p className="text-sm font-medium text-blue-400">
            AI DOCUMENT ANALYSIS
          </p>

          <h2 className="mt-1 text-3xl font-bold">
            Screening Dashboard
          </h2>

          <p className="mt-2 text-slate-400">
            Upload and analyze identity documents using AI-powered
            screening.
          </p>

        </div>

        {/* =====================================
            STATS
        ===================================== */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Documents Screened */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">

            <p className="text-sm text-slate-400">
              Documents Screened
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              1,248
            </h3>

            <p className="mt-2 text-xs text-slate-500">
              Total processed
            </p>

          </div>

          {/* Verified */}

          <div className="rounded-2xl border border-emerald-500/10 bg-slate-900 p-5 shadow-lg">

            <p className="text-sm text-slate-400">
              Verified
            </p>

            <h3 className="mt-2 text-3xl font-bold text-emerald-400">
              1,086
            </h3>

            <p className="mt-2 text-xs text-emerald-400/70">
              87.0% verification rate
            </p>

          </div>

          {/* Suspicious */}

          <div className="rounded-2xl border border-yellow-500/10 bg-slate-900 p-5 shadow-lg">

            <p className="text-sm text-slate-400">
              Suspicious
            </p>

            <h3 className="mt-2 text-3xl font-bold text-yellow-400">
              117
            </h3>

            <p className="mt-2 text-xs text-yellow-400/70">
              Requires review
            </p>

          </div>

          {/* Fake */}

          <div className="rounded-2xl border border-red-500/10 bg-slate-900 p-5 shadow-lg">

            <p className="text-sm text-slate-400">
              Fake Detected
            </p>

            <h3 className="mt-2 text-3xl font-bold text-red-400">
              45
            </h3>

            <p className="mt-2 text-xs text-red-400/70">
              Potential fraud
            </p>

          </div>

        </div>

        {/* =====================================
            UPLOAD SECTION
        ===================================== */}

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

          <div>

            <h3 className="text-xl font-semibold">
              Upload Identity Document
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Upload a document to start AI-powered authenticity
              screening.
            </p>

          </div>

          {/* DROP ZONE */}

          <label
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`mt-6 flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${
              isDragging
                ? "border-blue-400 bg-blue-500/10"
                : "border-slate-700 bg-slate-950/40 hover:border-blue-500/60 hover:bg-slate-950/70"
            }`}
          >

            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl">
              📄
            </div>

            <p className="text-lg font-medium text-slate-200">
              {isDragging
                ? "Drop your document here"
                : "Drag & drop your document here"}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              or click to browse from your computer
            </p>

            <p className="mt-4 text-xs text-slate-600">
              JPG, PNG, PDF • Maximum size 10 MB
            </p>

          </label>

          {/* ERROR */}

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              ⚠ {error}
            </div>
          )}

          {/* SELECTED FILE */}

          {selectedFile && (
            <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950/70 p-4">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                    📎
                  </div>

                  <div>

                    <p className="max-w-xs truncate font-medium text-slate-200">
                      {selectedFile.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>

                  </div>

                </div>

                <button
                  onClick={removeFile}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 transition hover:border-red-500/40 hover:text-red-400"
                >
                  Remove
                </button>

              </div>

              {/* SCAN BUTTON */}

              <button
                onClick={startScreening}
                disabled={isScanning}
                className="mt-5 w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isScanning
                  ? "AI Screening in Progress..."
                  : "Start AI Screening"}
              </button>

            </div>
          )}

          {/* =====================================
              SCANNING
          ===================================== */}

          {isScanning && (
            <div className="mt-5 rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">

              <div className="flex items-center justify-between text-sm">

                <span className="text-blue-300">
                  Analyzing document...
                </span>

                <span className="text-blue-400">
                  AI
                </span>

              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">

                <div className="h-full w-2/3 animate-pulse rounded-full bg-blue-500"></div>

              </div>

              <div className="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-3">

                <span>✓ OCR Analysis</span>

                <span>✓ Identity Check</span>

                <span>◌ Fraud Detection</span>

              </div>

            </div>
          )}

        </section>

        {/* =====================================
            FORENSIC ANALYSIS RESULT
        ===================================== */}

        {scanResult && !isScanning && (
          <section className="mt-8 space-y-6">

            {/* MAIN RESULT */}

            <div className="rounded-2xl border border-emerald-500/20 bg-slate-950 p-6 shadow-xl">

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                <div>

                  <p className="text-sm font-medium text-blue-400">
                    AI VERIFICATION COMPLETE
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-emerald-400">
                    ✓ {scanResult.status}
                  </h3>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    {scanResult.message}
                  </p>

                </div>

                {/* AI SCORE */}

                <div className="flex h-32 w-32 shrink-0 flex-col items-center justify-center rounded-full border-8 border-emerald-500/20 bg-emerald-500/5">

                  <span className="text-3xl font-bold text-emerald-400">
                    {scanResult.score}%
                  </span>

                  <span className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
                    AI Confidence
                  </span>

                </div>

              </div>

            </div>

            {/* =================================
                FORENSIC METRICS
            ================================= */}

            <div>

              <div className="mb-4">

                <p className="text-sm font-medium text-blue-400">
                  FORENSIC ANALYSIS
                </p>

                <h3 className="mt-1 text-xl font-semibold">
                  Document Intelligence Report
                </h3>

              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {/* DOCUMENT INTEGRITY */}

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

                  <div className="flex items-center justify-between">

                    <span className="text-sm text-slate-400">
                      Document Integrity
                    </span>

                    <span className="text-xl">
                      🔐
                    </span>

                  </div>

                  <div className="mt-4 flex items-end justify-between">

                    <span className="text-3xl font-bold text-emerald-400">
                      {scanResult.forensic.documentIntegrity}%
                    </span>

                    <span className="text-xs text-emerald-400">
                      Excellent
                    </span>

                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">

                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{
                        width: `${scanResult.forensic.documentIntegrity}%`,
                      }}
                    />

                  </div>

                </div>

                {/* OCR ACCURACY */}

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

                  <div className="flex items-center justify-between">

                    <span className="text-sm text-slate-400">
                      OCR Accuracy
                    </span>

                    <span className="text-xl">
                      📝
                    </span>

                  </div>

                  <div className="mt-4 flex items-end justify-between">

                    <span className="text-3xl font-bold text-blue-400">
                      {scanResult.forensic.ocrAccuracy}%
                    </span>

                    <span className="text-xs text-blue-400">
                      High Accuracy
                    </span>

                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">

                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{
                        width: `${scanResult.forensic.ocrAccuracy}%`,
                      }}
                    />

                  </div>

                </div>

                {/* FACE MATCH */}

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

                  <div className="flex items-center justify-between">

                    <span className="text-sm text-slate-400">
                      Face Match
                    </span>

                    <span className="text-xl">
                      👤
                    </span>

                  </div>

                  <div className="mt-4 flex items-end justify-between">

                    <span className="text-3xl font-bold text-purple-400">
                      {scanResult.forensic.faceMatch}%
                    </span>

                    <span className="text-xs text-purple-400">
                      Matched
                    </span>

                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">

                    <div
                      className="h-full rounded-full bg-purple-500"
                      style={{
                        width: `${scanResult.forensic.faceMatch}%`,
                      }}
                    />

                  </div>

                </div>

                {/* LIVENESS */}

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

                  <div className="flex items-center justify-between">

                    <span className="text-sm text-slate-400">
                      Liveness Detection
                    </span>

                    <span className="text-xl">
                      🧬
                    </span>

                  </div>

                  <div className="mt-4 flex items-end justify-between">

                    <span className="text-3xl font-bold text-cyan-400">
                      {scanResult.forensic.liveness}%
                    </span>

                    <span className="text-xs text-cyan-400">
                      Genuine
                    </span>

                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">

                    <div
                      className="h-full rounded-full bg-cyan-500"
                      style={{
                        width: `${scanResult.forensic.liveness}%`,
                      }}
                    />

                  </div>

                </div>

                {/* TAMPERING */}

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

                  <div className="flex items-center justify-between">

                    <span className="text-sm text-slate-400">
                      Tampering Probability
                    </span>

                    <span className="text-xl">
                      🛡️
                    </span>

                  </div>

                  <div className="mt-4 flex items-end justify-between">

                    <span className="text-3xl font-bold text-emerald-400">
                      {scanResult.forensic.tampering}%
                    </span>

                    <span className="text-xs text-emerald-400">
                      Low Risk
                    </span>

                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">

                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{
                        width: `${scanResult.forensic.tampering}%`,
                      }}
                    />

                  </div>

                </div>

                {/* RISK SCORE */}

                <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">

                  <div className="flex items-center justify-between">

                    <span className="text-sm text-slate-400">
                      Overall Risk Score
                    </span>

                    <span className="text-xl">
                      ⚠️
                    </span>

                  </div>

                  <div className="mt-4 flex items-end justify-between">

                    <span className="text-3xl font-bold text-emerald-400">
                      {scanResult.forensic.riskScore}/100
                    </span>

                    <span className="text-xs text-emerald-400">
                      Low Risk
                    </span>

                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">

                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{
                        width: `${scanResult.forensic.riskScore}%`,
                      }}
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* =====================================
    FORENSIC HEATMAP
===================================== */}

<div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

  {/* HEADER */}

  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

    <div>
      <p className="text-sm font-medium text-blue-400">
        FORENSIC VISUALIZATION
      </p>

      <h3 className="mt-1 text-xl font-semibold">
        Document Tampering Analysis
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        AI-based analysis of suspicious document regions.
      </p>
    </div>

    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400">
      ● Analysis Complete
    </div>

  </div>

  {/* FORENSIC AREA */}

  <div className="mt-6 grid gap-6 lg:grid-cols-2">

    {/* DOCUMENT PREVIEW */}

    <div>

      <p className="mb-3 text-sm font-medium text-slate-400">
        DOCUMENT ANALYSIS VIEW
      </p>

      <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-2xl border border-slate-700 bg-slate-950">

        {/* Fake document */}

        <div className="relative h-[280px] w-[420px] max-w-[90%] rounded-xl border border-slate-600 bg-slate-800 p-5 shadow-2xl">

          {/* Document Header */}

          <div className="flex items-center gap-3 border-b border-slate-700 pb-4">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-xl">
              🇮🇳
            </div>

            <div>

              <div className="h-2 w-32 rounded bg-slate-500"></div>

              <div className="mt-2 h-1.5 w-24 rounded bg-slate-700"></div>

            </div>

          </div>

          {/* Photo */}

          <div className="absolute left-5 top-24 flex h-24 w-20 items-center justify-center rounded-lg border border-slate-600 bg-slate-700 text-3xl">
            👤
          </div>

          {/* Text */}

          <div className="absolute left-32 top-24 space-y-3">

            <div className="h-2 w-36 rounded bg-slate-600"></div>

            <div className="h-2 w-28 rounded bg-slate-700"></div>

            <div className="h-2 w-32 rounded bg-slate-700"></div>

            <div className="h-2 w-24 rounded bg-slate-700"></div>

          </div>

          {/* Document Number */}

          <div className="absolute bottom-12 left-5">

            <div className="h-2 w-44 rounded bg-slate-600"></div>

          </div>

          {/* HEATMAP MARKERS */}

          <div className="absolute left-[35%] top-[38%] h-14 w-20 rounded-lg border-2 border-emerald-400/70 bg-emerald-400/10 shadow-[0_0_25px_rgba(52,211,153,0.25)]">
          </div>

          <div className="absolute right-[12%] top-[55%] h-12 w-16 rounded-lg border-2 border-yellow-400/80 bg-yellow-400/10 shadow-[0_0_25px_rgba(250,204,21,0.25)]">
          </div>

          <div className="absolute left-[45%] bottom-[15%] h-10 w-24 rounded-lg border-2 border-red-400/90 bg-red-400/20 shadow-[0_0_30px_rgba(248,113,113,0.35)]">
          </div>

        </div>

        {/* HEATMAP LABEL */}

        <div className="absolute bottom-4 left-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          ⚠ Potential alteration region
        </div>

      </div>

      {/* LEGEND */}

      <div className="mt-4 flex flex-wrap gap-4 text-xs">

        <div className="flex items-center gap-2 text-slate-400">
          <span className="h-3 w-3 rounded-full bg-emerald-400"></span>
          Authentic
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
          Review
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="h-3 w-3 rounded-full bg-red-400"></span>
          Suspicious
        </div>

      </div>

    </div>

    {/* FORENSIC FINDINGS */}

    <div>

      <p className="mb-3 text-sm font-medium text-slate-400">
        FORENSIC FINDINGS
      </p>

      <div className="space-y-3">

        {/* Finding 1 */}

        <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-4">

          <div className="flex items-center justify-between">

            <span className="text-sm font-medium text-slate-200">
              Document Structure
            </span>

            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400">
              PASS
            </span>

          </div>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Document layout and structural patterns are consistent
            with the expected format.
          </p>

        </div>

        {/* Finding 2 */}

        <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-4">

          <div className="flex items-center justify-between">

            <span className="text-sm font-medium text-slate-200">
              Font Consistency
            </span>

            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400">
              PASS
            </span>

          </div>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Font characteristics remain consistent across detected
            text regions.
          </p>

        </div>

        {/* Finding 3 */}

        <div className="rounded-xl border border-yellow-500/10 bg-yellow-500/5 p-4">

          <div className="flex items-center justify-between">

            <span className="text-sm font-medium text-slate-200">
              Pixel Anomaly
            </span>

            <span className="rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs text-yellow-400">
              REVIEW
            </span>

          </div>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Minor pixel-level inconsistencies detected in one
            document region.
          </p>

        </div>

        {/* Finding 4 */}

        <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-4">

          <div className="flex items-center justify-between">

            <span className="text-sm font-medium text-slate-200">
              Manipulation Indicator
            </span>

            <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs text-red-400">
              LOW
            </span>

          </div>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Low probability of digital alteration detected by the
            forensic analysis layer.
          </p>

        </div>

      </div>

      {/* FORENSIC SUMMARY */}

      <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950/60 p-5">

        <div className="flex items-center justify-between">

          <span className="text-sm text-slate-400">
            Forensic Confidence
          </span>

          <span className="text-xl font-bold text-emerald-400">
            96%
          </span>

        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">

          <div
            className="h-full rounded-full bg-emerald-500"
            style={{ width: "96%" }}
          ></div>

        </div>

        <p className="mt-3 text-xs leading-5 text-slate-600">
          Overall forensic analysis indicates a low probability
          of document manipulation.
        </p>

      </div>

    </div>

  </div>

</div>

            {/* =================================
                EXTRACTED DATA + ANOMALIES
            ================================= */}

            <div className="grid gap-6 lg:grid-cols-2">

              {/* EXTRACTED DATA */}

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-blue-400">
                      OCR EXTRACTION
                    </p>

                    <h3 className="mt-1 text-xl font-semibold">
                      Extracted Identity Data
                    </h3>

                  </div>

                  <span className="text-2xl">
                    📋
                  </span>

                </div>

                <div className="mt-6 space-y-4">

                  {/* DOCUMENT TYPE */}

                  <div className="flex justify-between border-b border-slate-800 pb-3">

                    <span className="text-sm text-slate-500">
                      Document Type
                    </span>

                    <span className="text-sm font-medium text-slate-200">
                      {scanResult.extractedData.documentType}
                    </span>

                  </div>

                  {/* DOCUMENT NUMBER */}

                  <div className="flex justify-between border-b border-slate-800 pb-3">

                    <span className="text-sm text-slate-500">
                      Document Number
                    </span>

                    <span className="text-sm font-medium text-slate-200">
                      {scanResult.extractedData.documentNumber}
                    </span>

                  </div>

                  {/* NAME */}

                  <div className="flex justify-between border-b border-slate-800 pb-3">

                    <span className="text-sm text-slate-500">
                      Name
                    </span>

                    <span className="text-sm font-medium text-slate-200">
                      {scanResult.extractedData.name}
                    </span>

                  </div>

                  {/* DOB */}

                  <div className="flex justify-between border-b border-slate-800 pb-3">

                    <span className="text-sm text-slate-500">
                      Date of Birth
                    </span>

                    <span className="text-sm font-medium text-slate-200">
                      {scanResult.extractedData.dob}
                    </span>

                  </div>

                  {/* GENDER */}

                  <div className="flex justify-between">

                    <span className="text-sm text-slate-500">
                      Gender
                    </span>

                    <span className="text-sm font-medium text-slate-200">
                      {scanResult.extractedData.gender}
                    </span>

                  </div>

                </div>

              </div>

              {/* DETECTED INDICATORS */}

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-blue-400">
                      SECURITY ANALYSIS
                    </p>

                    <h3 className="mt-1 text-xl font-semibold">
                      Detected Indicators
                    </h3>

                  </div>

                  <span className="text-2xl">
                    🔎
                  </span>

                </div>

                <div className="mt-6 space-y-3">

                  {scanResult.anomalies.map(
                    (anomaly, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-4"
                      >

                        <span className="mt-0.5 text-emerald-400">
                          ✓
                        </span>

                        <p className="text-sm leading-6 text-slate-300">
                          {anomaly}
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>

            </div>

          </section>
        )}

        {/* =====================================
            SECURITY FEATURES
        ===================================== */}

        <section className="mt-8 grid gap-5 md:grid-cols-3">

          {/* DOCUMENT ANALYSIS */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

            <div className="text-2xl">
              🔍
            </div>

            <h3 className="mt-3 font-semibold">
              Document Analysis
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              AI checks document structure, text and visual patterns.
            </p>

          </div>

          {/* FRAUD DETECTION */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

            <div className="text-2xl">
              🛡️
            </div>

            <h3 className="mt-3 font-semibold">
              Fraud Detection
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Suspicious documents can be flagged for further review.
            </p>

          </div>

          {/* AI CONFIDENCE */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

            <div className="text-2xl">
              🤖
            </div>

            <h3 className="mt-3 font-semibold">
              AI Confidence
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Screening results include an AI confidence score.
            </p>

          </div>

        </section>

        {/* =====================================
            SCREENING HISTORY
        ===================================== */}

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

          {/* HISTORY HEADER */}

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <p className="text-sm font-medium text-blue-400">
                RECENT ACTIVITY
              </p>

              <h3 className="mt-1 text-xl font-semibold">
                Screening History
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Previously analyzed identity documents.
              </p>

            </div>

            {/* SEARCH + FILTER */}

            <div className="flex flex-col gap-3 sm:flex-row">

              {/* SEARCH */}

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search document..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 sm:w-64"
              />

              {/* FILTER */}

              <select
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value)
                }
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-blue-500"
              >

                <option value="All">
                  All Status
                </option>

                <option value="Verified">
                  Verified
                </option>

                <option value="Suspicious">
                  Suspicious
                </option>

                <option value="Fake Detected">
                  Fake Detected
                </option>

              </select>

            </div>

          </div>

          {/* HISTORY TABLE */}

          <div className="mt-6 overflow-x-auto">

            {filteredHistory.length === 0 ? (

              <div className="rounded-xl border border-slate-800 bg-slate-950/50 px-6 py-10 text-center">

                <div className="text-3xl">
                  🔎
                </div>

                <p className="mt-3 font-medium text-slate-300">
                  No documents found
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  Try another search or filter.
                </p>

              </div>

            ) : (

              <table className="w-full min-w-[700px] text-left">

                <thead>

                  <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">

                    <th className="px-4 py-4 font-medium">
                      Document
                    </th>

                    <th className="px-4 py-4 font-medium">
                      Type
                    </th>

                    <th className="px-4 py-4 font-medium">
                      Status
                    </th>

                    <th className="px-4 py-4 font-medium">
                      AI Score
                    </th>

                    <th className="px-4 py-4 font-medium">
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredHistory.map((item) => (

                    <tr
                      key={item.id}
                      className="border-b border-slate-800/70 transition hover:bg-slate-950/60"
                    >

                      {/* DOCUMENT */}

                      <td className="px-4 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                            📄
                          </div>

                          <div>

                            <p className="max-w-[220px] truncate text-sm font-medium text-slate-200">
                              {item.name}
                            </p>

                            <p className="text-xs text-slate-600">
                              Screening ID #{item.id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* TYPE */}

                      <td className="px-4 py-4">

                        <span className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-slate-400">
                          {item.type}
                        </span>

                      </td>

                      {/* STATUS */}

                      <td className="px-4 py-4">

                        {item.status === "Verified" && (
                          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">

                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>

                            Verified

                          </span>
                        )}

                        {item.status === "Suspicious" && (
                          <span className="inline-flex items-center gap-2 rounded-full bg-yellow-500/10 px-3 py-1.5 text-xs font-medium text-yellow-400">

                            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400"></span>

                            Suspicious

                          </span>
                        )}

                        {item.status === "Fake Detected" && (
                          <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400">

                            <span className="h-1.5 w-1.5 rounded-full bg-red-400"></span>

                            Fake Detected

                          </span>
                        )}

                      </td>

                      {/* SCORE */}

                      <td className="px-4 py-4">

                        <div className="flex items-center gap-3">

                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-800">

                            <div
                              className={`h-full rounded-full ${
                                item.score >= 80
                                  ? "bg-emerald-500"
                                  : item.score >= 50
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{
                                width: `${item.score}%`,
                              }}
                            />

                          </div>

                          <span
                            className={`text-sm font-semibold ${
                              item.score >= 80
                                ? "text-emerald-400"
                                : item.score >= 50
                                ? "text-yellow-400"
                                : "text-red-400"
                            }`}
                          >
                            {item.score}%
                          </span>

                        </div>

                      </td>

                      {/* DATE */}

                      <td className="px-4 py-4 text-sm text-slate-500">
                        {item.date}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            )}

          </div>

          {/* HISTORY FOOTER */}

          <div className="mt-5 flex flex-col gap-2 border-t border-slate-800 pt-4 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">

            <span>
              Showing {filteredHistory.length} of{" "}
              {history.length} screenings
            </span>

            <span>
              AI screening records
            </span>

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;