import { useState } from "react";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState("");

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
  ];

  const handleFile = (file) => {
    setError("");
    setScanResult(null);

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file format. Please upload JPG, PNG or PDF.");
      return;
    }

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

      setScanResult({
        status: "Verified",
        score: 94,
        message:
          "Document passed initial AI-based authenticity screening.",
      });
    }, 2000);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setScanResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
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

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8">
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

        {/* Stats */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

        {/* Upload Section */}
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

          {/* Drop Zone */}
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

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              ⚠ {error}
            </div>
          )}

          {/* Selected File */}
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

              {/* Scan Button */}
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

          {/* Scanning */}
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

          {/* Result */}
          {scanResult && !isScanning && (
            <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Screening Result
                  </p>

                  <h4 className="mt-1 text-2xl font-bold text-emerald-400">
                    ✓ {scanResult.status}
                  </h4>

                  <p className="mt-2 max-w-xl text-sm text-slate-400">
                    {scanResult.message}
                  </p>
                </div>

                <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 border-emerald-500/30">
                  <span className="text-2xl font-bold text-emerald-400">
                    {scanResult.score}%
                  </span>

                  <span className="text-[10px] uppercase text-slate-500">
                    Confidence
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Security Features */}
        <section className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="text-2xl">🔍</div>

            <h3 className="mt-3 font-semibold">
              Document Analysis
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              AI checks document structure, text and visual patterns.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="text-2xl">🛡️</div>

            <h3 className="mt-3 font-semibold">
              Fraud Detection
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Suspicious documents can be flagged for further review.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="text-2xl">🤖</div>

            <h3 className="mt-3 font-semibold">
              AI Confidence
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Screening results include an AI confidence score.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;