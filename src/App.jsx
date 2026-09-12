import { useRef, useState } from "react";

function App() {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);

  const [stats, setStats] = useState({
    screened: 1248,
    verified: 1086,
    suspicious: 117,
    fake: 45,
  });

  const [history, setHistory] = useState([
    {
      name: "Aadhaar_Card.pdf",
      type: "PDF",
      result: "Verified",
      score: 94,
      time: "2 min ago",
    },
    {
      name: "Passport_Image.jpg",
      type: "JPG",
      result: "Suspicious",
      score: 61,
      time: "18 min ago",
    },
    {
      name: "Driving_License.png",
      type: "PNG",
      result: "Verified",
      score: 97,
      time: "32 min ago",
    },
    {
      name: "Identity_Document.pdf",
      type: "PDF",
      result: "Fake Detected",
      score: 18,
      time: "1 hr ago",
    },
  ]);

  const processFile = (selectedFile) => {
    if (!selectedFile) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Please upload JPG, PNG or PDF files only.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10 MB.");
      return;
    }

    setFile(selectedFile);
    setResult(null);
  };

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  };

  const startScreening = () => {
    if (!file) {
      alert("Please choose a document first.");
      return;
    }

    setIsScanning(true);
    setResult(null);

    setTimeout(() => {
      const random = Math.random();

      let screeningResult;
      let score;

      if (random < 0.65) {
        screeningResult = "Verified";
        score = Math.floor(Math.random() * 10) + 90;
      } else if (random < 0.9) {
        screeningResult = "Suspicious";
        score = Math.floor(Math.random() * 20) + 45;
      } else {
        screeningResult = "Fake Detected";
        score = Math.floor(Math.random() * 30) + 5;
      }

      setResult({
        status: screeningResult,
        score,
      });

      setStats((prev) => ({
        ...prev,
        screened: prev.screened + 1,
        verified:
          screeningResult === "Verified"
            ? prev.verified + 1
            : prev.verified,
        suspicious:
          screeningResult === "Suspicious"
            ? prev.suspicious + 1
            : prev.suspicious,
        fake:
          screeningResult === "Fake Detected"
            ? prev.fake + 1
            : prev.fake,
      }));

      setHistory((prev) => [
        {
          name: file.name,
          type: file.name.split(".").pop().toUpperCase(),
          result: screeningResult,
          score,
          time: "Just now",
        },
        ...prev,
      ]);

      setIsScanning(false);
    }, 2200);
  };

  const resetScreening = () => {
    setFile(null);
    setResult(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getResultStyle = (status) => {
    if (status === "Verified") {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }

    if (status === "Suspicious") {
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }

    return "bg-red-500/10 text-red-400 border-red-500/20";
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-[#060b18] text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08101f]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-xl ring-1 ring-cyan-400/20">
              🛡️
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                AI Identity Screening
              </h1>

              <p className="text-xs text-slate-400">
                Fake Identity & Documents Detection System
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-medium text-emerald-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              System Online
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
              AI Engine v2.4
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-[1500px] px-5 py-7 lg:px-8">
        {/* TITLE */}
        <div className="mb-7">
          <p className="mb-1 text-sm font-medium text-cyan-400">
            SECURITY OVERVIEW
          </p>

          <h2 className="text-3xl font-bold tracking-tight">
            Screening Dashboard
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Monitor identity verification, document authenticity and AI risk
            detection.
          </p>
        </div>

        {/* STATS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* TOTAL */}
          <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-transparent p-5 transition hover:border-blue-400/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Documents Screened
                </p>

                <h3 className="mt-3 text-3xl font-bold">
                  {stats.screened.toLocaleString()}
                </h3>
              </div>

              <div className="rounded-xl bg-blue-500/10 p-3 text-xl">
                📄
              </div>
            </div>

            <div className="mt-4 text-xs text-blue-400">
              ↑ 12.8% from last month
            </div>
          </div>

          {/* VERIFIED */}
          <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-transparent p-5 transition hover:border-emerald-400/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Verified</p>

                <h3 className="mt-3 text-3xl font-bold text-emerald-400">
                  {stats.verified.toLocaleString()}
                </h3>
              </div>

              <div className="rounded-xl bg-emerald-500/10 p-3 text-xl">
                ✓
              </div>
            </div>

            <div className="mt-4 text-xs text-emerald-400">
              {((stats.verified / stats.screened) * 100).toFixed(1)}% approval
              rate
            </div>
          </div>

          {/* SUSPICIOUS */}
          <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-yellow-500/10 to-transparent p-5 transition hover:border-yellow-400/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Suspicious</p>

                <h3 className="mt-3 text-3xl font-bold text-yellow-400">
                  {stats.suspicious.toLocaleString()}
                </h3>
              </div>

              <div className="rounded-xl bg-yellow-500/10 p-3 text-xl">
                ⚠
              </div>
            </div>

            <div className="mt-4 text-xs text-yellow-400">
              Requires manual review
            </div>
          </div>

          {/* FAKE */}
          <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-red-500/10 to-transparent p-5 transition hover:border-red-400/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Fake Detected</p>

                <h3 className="mt-3 text-3xl font-bold text-red-400">
                  {stats.fake.toLocaleString()}
                </h3>
              </div>

              <div className="rounded-xl bg-red-500/10 p-3 text-xl">
                🚨
              </div>
            </div>

            <div className="mt-4 text-xs text-red-400">
              High-risk documents
            </div>
          </div>
        </div>

        {/* TWO COLUMN AREA */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.8fr]">
          {/* UPLOAD */}
          <section className="rounded-2xl border border-white/10 bg-[#0b1425] p-6 shadow-2xl shadow-black/20">
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-cyan-400" />

                  <h3 className="text-xl font-semibold">
                    AI Document Screening
                  </h3>
                </div>

                <p className="mt-2 text-sm text-slate-400">
                  Upload an identity document and let the AI engine analyze
                  authenticity.
                </p>
              </div>

              <div className="h-fit rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-400">
                Max 10 MB
              </div>
            </div>

            {/* DROP ZONE */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`mt-6 rounded-2xl border-2 border-dashed p-8 text-center transition-all sm:p-12 ${
                isDragging
                  ? "border-cyan-400 bg-cyan-400/10"
                  : "border-slate-700 bg-slate-950/40 hover:border-slate-500"
              }`}
            >
              {!file ? (
                <>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-3xl">
                    📤
                  </div>

                  <h4 className="mt-5 text-lg font-semibold">
                    Drag & drop your document
                  </h4>

                  <p className="mt-2 text-sm text-slate-500">
                    or choose a file from your computer
                  </p>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-6 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
                  >
                    Choose Document
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <p className="mt-4 text-xs text-slate-600">
                    Supported: JPG, PNG, PDF
                  </p>
                </>
              ) : (
                <div>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl">
                    📄
                  </div>

                  <h4 className="mt-4 break-all text-lg font-semibold">
                    {file.name}
                  </h4>

                  <p className="mt-2 text-sm text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>

                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={startScreening}
                      disabled={isScanning}
                      className="rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isScanning
                        ? "AI Screening..."
                        : "Start AI Screening"}
                    </button>

                    <button
                      onClick={resetScreening}
                      disabled={isScanning}
                      className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* SCANNING */}
            {isScanning && (
              <div className="mt-5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-cyan-300">
                    AI engine analyzing document...
                  </span>

                  <span className="text-cyan-400">
                    Processing
                  </span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-1/2 animate-pulse rounded-full bg-cyan-400" />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500 sm:grid-cols-4">
                  <span>✓ OCR Analysis</span>
                  <span>✓ Face Match</span>
                  <span>✓ Tamper Check</span>
                  <span>• Risk Analysis</span>
                </div>
              </div>
            )}

            {/* RESULT */}
            {result && !isScanning && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500">
                      Screening Result
                    </p>

                    <div
                      className={`mt-2 inline-flex rounded-lg border px-4 py-2 text-sm font-bold ${getResultStyle(
                        result.status
                      )}`}
                    >
                      {result.status}
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs text-slate-500">
                      AI Confidence Score
                    </p>

                    <p
                      className={`mt-1 text-4xl font-bold ${getScoreColor(
                        result.score
                      )}`}
                    >
                      {result.score}%
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-xs text-slate-500">OCR Match</p>
                    <p className="mt-1 font-semibold text-emerald-400">
                      Passed
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-xs text-slate-500">Tampering</p>
                    <p className="mt-1 font-semibold text-emerald-400">
                      No Issues
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-xs text-slate-500">Risk Level</p>
                    <p
                      className={`mt-1 font-semibold ${
                        result.score >= 80
                          ? "text-emerald-400"
                          : result.score >= 50
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {result.score >= 80
                        ? "Low"
                        : result.score >= 50
                        ? "Medium"
                        : "High"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* AI RISK PANEL */}
          <section className="rounded-2xl border border-white/10 bg-[#0b1425] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  AI Risk Analysis
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Current system intelligence
                </p>
              </div>

              <div className="rounded-lg bg-purple-500/10 px-3 py-2 text-xs text-purple-400">
                AI ACTIVE
              </div>
            </div>

            <div className="mt-7 flex justify-center">
              <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-[14px] border-cyan-500/20">
                <div className="absolute inset-0 rounded-full border-[14px] border-transparent border-t-cyan-400 border-r-cyan-400" />

                <div className="text-center">
                  <p className="text-4xl font-bold">92%</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Accuracy
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-xs">
                  <span className="text-slate-400">Face Verification</span>
                  <span className="text-emerald-400">96%</span>
                </div>

                <div className="h-2 rounded-full bg-slate-800">
                  <div className="h-full w-[96%] rounded-full bg-emerald-400" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-xs">
                  <span className="text-slate-400">Document Integrity</span>
                  <span className="text-cyan-400">91%</span>
                </div>

                <div className="h-2 rounded-full bg-slate-800">
                  <div className="h-full w-[91%] rounded-full bg-cyan-400" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-xs">
                  <span className="text-slate-400">Fraud Detection</span>
                  <span className="text-purple-400">94%</span>
                </div>

                <div className="h-2 rounded-full bg-slate-800">
                  <div className="h-full w-[94%] rounded-full bg-purple-400" />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">
                  AI Engine Healthy
                </span>
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                All screening modules are operating normally.
              </p>
            </div>
          </section>
        </div>

        {/* ANALYTICS */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* ACTIVITY */}
          <section className="rounded-2xl border border-white/10 bg-[#0b1425] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  Screening Activity
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Documents processed this week
                </p>
              </div>

              <span className="text-xs text-cyan-400">
                Last 7 days
              </span>
            </div>

            <div className="mt-8 flex h-52 items-end justify-between gap-3">
              {[
                ["Mon", 55],
                ["Tue", 72],
                ["Wed", 48],
                ["Thu", 86],
                ["Fri", 68],
                ["Sat", 92],
                ["Sun", 76],
              ].map(([day, height]) => (
                <div
                  key={day}
                  className="flex h-full flex-1 flex-col justify-end"
                >
                  <div
                    className="rounded-t-lg bg-gradient-to-t from-cyan-600 to-cyan-300 opacity-80 transition hover:opacity-100"
                    style={{ height: `${height}%` }}
                  />

                  <span className="mt-3 text-center text-[11px] text-slate-500">
                    {day}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* DISTRIBUTION */}
          <section className="rounded-2xl border border-white/10 bg-[#0b1425] p-6">
            <h3 className="text-lg font-semibold">
              Screening Distribution
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Current document classification
            </p>

            <div className="mt-7 space-y-5">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-300">Verified</span>
                  <span className="text-emerald-400">
                    {(
                      (stats.verified / stats.screened) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>

                <div className="h-3 rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-emerald-400"
                    style={{
                      width: `${
                        (stats.verified / stats.screened) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-300">Suspicious</span>
                  <span className="text-yellow-400">
                    {(
                      (stats.suspicious / stats.screened) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>

                <div className="h-3 rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-yellow-400"
                    style={{
                      width: `${
                        (stats.suspicious / stats.screened) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-300">Fake Detected</span>
                  <span className="text-red-400">
                    {(
                      (stats.fake / stats.screened) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>

                <div className="h-3 rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-red-400"
                    style={{
                      width: `${
                        (stats.fake / stats.screened) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* HISTORY */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1425]">
          <div className="flex items-center justify-between border-b border-white/10 p-6">
            <div>
              <h3 className="text-lg font-semibold">
                Recent Screening History
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Latest documents analyzed by the system
              </p>
            </div>

            <span className="hidden rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-400 sm:block">
              {history.length} Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Document</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Result</th>
                  <th className="px-6 py-4">AI Score</th>
                  <th className="px-6 py-4">Time</th>
                </tr>
              </thead>

              <tbody>
                {history.map((item, index) => (
                  <tr
                    key={`${item.name}-${index}`}
                    className="border-b border-white/5 transition hover:bg-white/[0.03]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-white/5 p-2">
                          📄
                        </div>

                        <span className="max-w-[250px] truncate text-sm font-medium text-slate-200">
                          {item.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      {item.type}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${getResultStyle(
                          item.result
                        )}`}
                      >
                        {item.result}
                      </span>
                    </td>

                    <td
                      className={`px-6 py-4 text-sm font-semibold ${getScoreColor(
                        item.score
                      )}`}
                    >
                      {item.score}%
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      {item.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FOOTER STATUS */}
        <div className="mt-6 flex flex-col gap-3 border-t border-white/10 py-5 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>
            AI Identity Screening System • Secure Processing Environment
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            All systems operational
          </span>
        </div>
      </main>
    </div>
  );
}

export default App;