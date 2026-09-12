import { useRef, useState } from "react";

function App() {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [screening, setScreening] = useState(false);
  const [result, setResult] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [history, setHistory] = useState([
    {
      id: "SCR-1248",
      document: "Aadhaar Card",
      status: "Verified",
      confidence: 97,
      risk: "Low",
      time: "2 min ago",
    },
    {
      id: "SCR-1247",
      document: "Passport",
      status: "Suspicious",
      confidence: 71,
      risk: "Medium",
      time: "18 min ago",
    },
    {
      id: "SCR-1246",
      document: "Driving License",
      status: "Verified",
      confidence: 95,
      risk: "Low",
      time: "42 min ago",
    },
    {
      id: "SCR-1245",
      document: "PAN Card",
      status: "Fake Detected",
      confidence: 32,
      risk: "High",
      time: "1 hour ago",
    },
  ]);

  const filteredHistory = history.filter((item) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      item.document.toLowerCase().includes(searchText) ||
      item.id.toLowerCase().includes(searchText);

    const matchesFilter =
      filter === "All" || item.status === filter;

    return matchesSearch && matchesFilter;
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB.");
      return;
    }

    setFile(selectedFile);
    setResult(null);

    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setResult(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleScreening = () => {
    if (!file || screening) return;

    setScreening(true);
    setResult(null);

    setTimeout(() => {
      const newScreening = {
        id: `SCR-${1249 + history.length}`,
        document: file.name,
        status: "Verified",
        confidence: 94,
        risk: "Low",
        time: "Just now",
      };

      setHistory((prev) => [newScreening, ...prev]);

      setResult({
        status: "Verified",
        confidence: 94,
        riskScore: 8,
        document: file.name,
        faceMatch: 98,
        authenticity: 96,
        ocrAccuracy: 97,
        tampering: "Not Detected",
        risk: "Low Risk",
        indicators: [
          "Document structure appears authentic",
          "No suspicious modifications detected",
          "Face similarity is within acceptable range",
          "Extracted text is consistent",
        ],
        extractedData: {
          documentType: "Identity Document",
          name: "Sample User",
          dateOfBirth: "XX/XX/XXXX",
          documentNumber: "XXXX-XXXX-XXXX",
          issuingAuthority: "Government Authority",
        },
      });

      setScreening(false);
    }, 2000);
  };

  const getStatusClass = (status) => {
    if (status === "Verified") {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }

    if (status === "Suspicious") {
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }

    return "bg-red-500/10 text-red-400 border-red-500/20";
  };

  const getRiskClass = (risk) => {
    if (risk === "Low") return "text-emerald-400";
    if (risk === "Medium") return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl shadow-lg shadow-blue-600/20">
              🛡️
            </div>

            <div>
              <h1 className="text-lg font-bold">
                AI Identity Screening
              </h1>

              <p className="text-xs text-slate-500">
                Fake Identity & Documents Detection System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-400 sm:block">
              AI Engine v1.0
            </div>

            <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              System Online
            </div>
          </div>

        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* HERO */}
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>
              <p className="mb-2 text-sm font-medium text-blue-400">
                SECURITY OPERATIONS CENTER
              </p>

              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Screening Dashboard
              </h2>

              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                AI-powered identity verification, document authenticity
                analysis and fraud detection.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
              <p className="text-xs text-slate-500">
                Detection Accuracy
              </p>

              <p className="mt-1 text-xl font-bold text-blue-400">
                96.8%
              </p>
            </div>

          </div>
        </div>

        {/* STATS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-1 hover:border-blue-500/40">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">
                Documents Screened
              </span>

              <span className="rounded-lg bg-blue-500/10 p-2">
                📄
              </span>
            </div>

            <h3 className="mt-4 text-3xl font-bold">
              1,248
            </h3>

            <p className="mt-2 text-xs text-slate-500">
              Total documents processed
            </p>
          </div>

          <div className="group rounded-2xl border border-emerald-500/10 bg-slate-900 p-5 transition hover:-translate-y-1 hover:border-emerald-500/40">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">
                Verified
              </span>

              <span className="rounded-lg bg-emerald-500/10 p-2">
                ✓
              </span>
            </div>

            <h3 className="mt-4 text-3xl font-bold text-emerald-400">
              1,086
            </h3>

            <p className="mt-2 text-xs text-emerald-500">
              87.0% verification rate
            </p>
          </div>

          <div className="group rounded-2xl border border-yellow-500/10 bg-slate-900 p-5 transition hover:-translate-y-1 hover:border-yellow-500/40">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">
                Suspicious
              </span>

              <span className="rounded-lg bg-yellow-500/10 p-2">
                ⚠
              </span>
            </div>

            <h3 className="mt-4 text-3xl font-bold text-yellow-400">
              117
            </h3>

            <p className="mt-2 text-xs text-yellow-500">
              Requires investigation
            </p>
          </div>

          <div className="group rounded-2xl border border-red-500/10 bg-slate-900 p-5 transition hover:-translate-y-1 hover:border-red-500/40">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">
                Fake Detected
              </span>

              <span className="rounded-lg bg-red-500/10 p-2">
                ✕
              </span>
            </div>

            <h3 className="mt-4 text-3xl font-bold text-red-400">
              45
            </h3>

            <p className="mt-2 text-xs text-red-500">
              Fraudulent documents
            </p>
          </div>

        </div>

        {/* UPLOAD + ANALYSIS */}
        <div className="mt-8 grid gap-6 lg:grid-cols-5">

          {/* UPLOAD */}
          <div className="lg:col-span-3 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">
                  Document Screening
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Upload an identity document for AI analysis.
                </p>
              </div>

              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                AI Ready
              </span>
            </div>

            {!file ? (
              <label
                htmlFor="document-upload"
                className="mt-6 flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/60 p-8 text-center transition hover:border-blue-500 hover:bg-blue-500/5"
              >

                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500/10 text-4xl">
                  📁
                </div>

                <h4 className="mt-5 text-lg font-semibold">
                  Upload Identity Document
                </h4>

                <p className="mt-2 max-w-md text-sm text-slate-500">
                  Drag and drop your document here or click to browse files.
                </p>

                <p className="mt-3 text-xs text-slate-600">
                  JPG • JPEG • PNG • PDF • Maximum 10MB
                </p>

                <span className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold transition hover:bg-blue-500">
                  Choose Document
                </span>

                <input
                  ref={fileInputRef}
                  id="document-upload"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />

              </label>
            ) : (
              <div className="mt-6">

                <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950">

                  <div className="flex flex-col md:flex-row">

                    {/* PREVIEW */}
                    <div className="flex h-64 w-full items-center justify-center bg-slate-900 md:w-64">

                      {preview ? (
                        <img
                          src={preview}
                          alt="Document preview"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="text-center">
                          <div className="text-6xl">
                            📑
                          </div>

                          <p className="mt-3 text-sm text-slate-400">
                            PDF Document
                          </p>
                        </div>
                      )}

                    </div>

                    {/* DETAILS */}
                    <div className="flex-1 p-6">

                      <div className="flex items-start justify-between gap-4">

                        <div className="min-w-0">
                          <p className="truncate text-lg font-semibold">
                            {file.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>

                        <button
                          onClick={removeFile}
                          className="rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-500/10"
                        >
                          Remove
                        </button>

                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-3">

                        <div className="rounded-xl bg-slate-900 p-3">
                          <p className="text-[10px] uppercase text-slate-600">
                            Type
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-300">
                            {file.type || "Document"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-900 p-3">
                          <p className="text-[10px] uppercase text-slate-600">
                            Status
                          </p>

                          <p className="mt-1 text-xs text-emerald-400">
                            Ready
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-900 p-3">
                          <p className="text-[10px] uppercase text-slate-600">
                            Security
                          </p>

                          <p className="mt-1 text-xs text-blue-400">
                            Scannable
                          </p>
                        </div>

                      </div>

                      <button
                        onClick={handleScreening}
                        disabled={screening}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {screening ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            AI Screening in Progress...
                          </>
                        ) : (
                          <>
                            🔍 Start AI Screening
                          </>
                        )}
                      </button>

                    </div>

                  </div>

                </div>

              </div>
            )}

          </div>

          {/* AI ENGINE */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                🤖
              </div>

              <div>
                <h3 className="font-semibold">
                  AI Analysis Engine
                </h3>

                <p className="text-xs text-slate-500">
                  Multi-layer verification
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">
                    Face Matching
                  </span>
                  <span className="text-sm font-semibold text-emerald-400">
                    98%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-[98%] rounded-full bg-emerald-500" />
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">
                    Document Authenticity
                  </span>
                  <span className="text-sm font-semibold text-blue-400">
                    96%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-[96%] rounded-full bg-blue-500" />
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">
                    OCR Accuracy
                  </span>
                  <span className="text-sm font-semibold text-purple-400">
                    97%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-[97%] rounded-full bg-purple-500" />
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    Tampering Detection
                  </span>

                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                    Active
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* RESULT */}
        {result && (
          <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-slate-900 p-6">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl">
                  ✓
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-emerald-400">
                    Screening Complete
                  </p>

                  <h3 className="mt-1 text-2xl font-bold">
                    {result.status}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {result.document}
                  </p>
                </div>

              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-4 text-center">
                <p className="text-xs text-slate-500">
                  Confidence Score
                </p>

                <p className="mt-1 text-3xl font-bold text-emerald-400">
                  {result.confidence}%
                </p>
              </div>

            </div>

            {/* RESULT METRICS */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs text-slate-500">
                  Face Match
                </p>

                <p className="mt-2 text-2xl font-bold text-emerald-400">
                  {result.faceMatch}%
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs text-slate-500">
                  Authenticity
                </p>

                <p className="mt-2 text-2xl font-bold text-blue-400">
                  {result.authenticity}%
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs text-slate-500">
                  OCR Accuracy
                </p>

                <p className="mt-2 text-2xl font-bold text-purple-400">
                  {result.ocrAccuracy}%
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs text-slate-500">
                  Risk Score
                </p>

                <p className="mt-2 text-2xl font-bold text-emerald-400">
                  {result.riskScore}/100
                </p>
              </div>

            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">

              {/* INDICATORS */}
              <div>
                <h4 className="font-semibold">
                  AI Verification Indicators
                </h4>

                <div className="mt-3 space-y-2">
                  {result.indicators.map((indicator, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-lg bg-slate-950 px-4 py-3 text-sm text-slate-300"
                    >
                      <span className="text-emerald-400">
                        ✓
                      </span>

                      {indicator}
                    </div>
                  ))}
                </div>
              </div>

              {/* EXTRACTED DATA */}
              <div>
                <h4 className="font-semibold">
                  Extracted Document Data
                </h4>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">

                  <div className="rounded-lg bg-slate-950 p-3">
                    <p className="text-[10px] uppercase text-slate-600">
                      Document Type
                    </p>

                    <p className="mt-1 text-sm text-slate-300">
                      {result.extractedData.documentType}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-950 p-3">
                    <p className="text-[10px] uppercase text-slate-600">
                      Name
                    </p>

                    <p className="mt-1 text-sm text-slate-300">
                      {result.extractedData.name}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-950 p-3">
                    <p className="text-[10px] uppercase text-slate-600">
                      Date of Birth
                    </p>

                    <p className="mt-1 text-sm text-slate-300">
                      {result.extractedData.dateOfBirth}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-950 p-3">
                    <p className="text-[10px] uppercase text-slate-600">
                      Document Number
                    </p>

                    <p className="mt-1 text-sm text-slate-300">
                      {result.extractedData.documentNumber}
                    </p>
                  </div>

                </div>
              </div>

            </div>

          </div>
        )}

        {/* HISTORY */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>
              <h3 className="text-xl font-semibold">
                Screening History
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Track recently analyzed identity documents.
              </p>
            </div>

            <div className="rounded-lg bg-blue-500/10 px-4 py-2 text-xs text-blue-400">
              {history.length} Total Screenings
            </div>

          </div>

          {/* SEARCH */}
          <div className="mt-6 flex flex-col gap-3 md:flex-row">

            <div className="relative flex-1">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search document or screening ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-blue-500"
              />

            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Verified">Verified</option>
              <option value="Suspicious">Suspicious</option>
              <option value="Fake Detected">Fake Detected</option>
            </select>

          </div>

          {/* TABLE */}
          <div className="mt-6 overflow-x-auto">

            <table className="w-full min-w-[750px] text-left">

              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-600">

                  <th className="px-4 py-4">
                    Screening ID
                  </th>

                  <th className="px-4 py-4">
                    Document
                  </th>

                  <th className="px-4 py-4">
                    Status
                  </th>

                  <th className="px-4 py-4">
                    Confidence
                  </th>

                  <th className="px-4 py-4">
                    Risk
                  </th>

                  <th className="px-4 py-4">
                    Time
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredHistory.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-800/60 transition hover:bg-slate-950"
                  >

                    <td className="px-4 py-4 font-mono text-sm text-blue-400">
                      {item.id}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800">
                          📄
                        </div>

                        <span className="max-w-[180px] truncate text-sm text-slate-300">
                          {item.document}
                        </span>

                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-3">

                        <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-blue-500"
                            style={{
                              width: `${item.confidence}%`,
                            }}
                          />
                        </div>

                        <span className="text-sm text-slate-300">
                          {item.confidence}%
                        </span>

                      </div>

                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`text-sm font-medium ${getRiskClass(
                          item.risk
                        )}`}
                      >
                        {item.risk}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-600">
                      {item.time}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

            {filteredHistory.length === 0 && (
              <div className="py-14 text-center">

                <div className="text-4xl">
                  🔎
                </div>

                <p className="mt-3 text-sm text-slate-400">
                  No screenings found
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Try changing your search or filter.
                </p>

              </div>
            )}

          </div>

        </div>

        {/* FOOTER */}
        <div className="py-8 text-center text-xs text-slate-700">
          AI Identity Screening System • Secure Document Analysis Platform
        </div>

      </main>
    </div>
  );
}

export default App;