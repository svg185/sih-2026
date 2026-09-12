import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [screening, setScreening] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);

    if (selectedFile.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleScreening = () => {
    if (!file) return;

    setScreening(true);
    setResult(null);

    setTimeout(() => {
      setScreening(false);

      setResult({
        status: "Verified",
        confidence: 94,
        document: "Identity Document",
        faceMatch: "98%",
        tampering: "Not Detected",
        risk: "Low Risk",
      });
    }, 2000);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div>
            <h1 className="text-xl font-bold">
              AI Identity Screening
            </h1>

            <p className="text-sm text-slate-400">
              Fake Identity & Documents Detection System
            </p>
          </div>

          <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
            ● System Online
          </div>

        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8">

        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Screening Dashboard
          </h2>

          <p className="mt-2 text-slate-400">
            AI-powered identity and document verification platform
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Documents Screened
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              1,248
            </h3>

            <p className="mt-2 text-xs text-slate-500">
              Total documents processed
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/10 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Verified
            </p>

            <h3 className="mt-2 text-3xl font-bold text-emerald-400">
              1,086
            </h3>

            <p className="mt-2 text-xs text-emerald-500">
              87.0% verification rate
            </p>
          </div>

          <div className="rounded-2xl border border-yellow-500/10 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Suspicious
            </p>

            <h3 className="mt-2 text-3xl font-bold text-yellow-400">
              117
            </h3>

            <p className="mt-2 text-xs text-yellow-500">
              Requires investigation
            </p>
          </div>

          <div className="rounded-2xl border border-red-500/10 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Fake Detected
            </p>

            <h3 className="mt-2 text-3xl font-bold text-red-400">
              45
            </h3>

            <p className="mt-2 text-xs text-red-500">
              Fraudulent documents
            </p>
          </div>

        </div>

        {/* Upload Section */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8">

          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">

            <div>
              <h3 className="text-xl font-semibold">
                Document Screening
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Upload an identity document for AI-powered analysis.
              </p>
            </div>

            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
              AI Analysis Ready
            </span>

          </div>

          {/* Upload Area */}
          {!file ? (
            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/50 px-6 py-12 transition hover:border-blue-500 hover:bg-blue-500/5">

              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl">
                📄
              </div>

              <p className="text-lg font-medium">
                Upload Identity Document
              </p>

              <p className="mt-2 text-center text-sm text-slate-500">
                Drag & drop your document or click to browse
              </p>

              <p className="mt-3 text-xs text-slate-600">
                JPG, PNG or PDF • Maximum 10MB
              </p>

              <span className="mt-5 rounded-lg bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-500">
                Choose Document
              </span>

              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
                onChange={handleFileChange}
              />

            </label>
          ) : (

            /* Selected File */
            <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950 p-5">

              <div className="flex flex-col gap-5 md:flex-row">

                {/* Preview */}
                <div className="flex h-48 w-full items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-slate-900 md:w-64">

                  {preview ? (
                    <img
                      src={preview}
                      alt="Document preview"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-5xl">📑</div>
                      <p className="mt-2 text-sm text-slate-400">
                        PDF Document
                      </p>
                    </div>
                  )}

                </div>

                {/* File Details */}
                <div className="flex-1">

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <p className="text-lg font-semibold">
                        {file.name}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    <button
                      onClick={removeFile}
                      className="rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                    >
                      Remove
                    </button>

                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">

                    <div className="rounded-lg bg-slate-900 p-3">
                      <p className="text-xs text-slate-500">
                        File Type
                      </p>
                      <p className="mt-1 text-sm">
                        {file.type || "Document"}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-900 p-3">
                      <p className="text-xs text-slate-500">
                        Status
                      </p>
                      <p className="mt-1 text-sm text-emerald-400">
                        Ready
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-900 p-3">
                      <p className="text-xs text-slate-500">
                        Security
                      </p>
                      <p className="mt-1 text-sm text-blue-400">
                        Scannable
                      </p>
                    </div>

                  </div>

                  <button
                    onClick={handleScreening}
                    disabled={screening}
                    className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {screening
                      ? "AI Screening in Progress..."
                      : "Start AI Screening"}
                  </button>

                </div>

              </div>

            </div>
          )}

        </div>

        {/* Screening Result */}
        {result && (
          <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-slate-900 p-8">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>
                <p className="text-sm text-slate-400">
                  AI Screening Result
                </p>

                <h3 className="mt-1 text-2xl font-bold text-emerald-400">
                  ✓ {result.status}
                </h3>
              </div>

              <div className="rounded-xl bg-emerald-500/10 px-5 py-3 text-center">
                <p className="text-xs text-slate-400">
                  AI Confidence
                </p>

                <p className="text-2xl font-bold text-emerald-400">
                  {result.confidence}%
                </p>
              </div>

            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs text-slate-500">
                  Document Type
                </p>
                <p className="mt-2 font-medium">
                  {result.document}
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs text-slate-500">
                  Face Match
                </p>
                <p className="mt-2 font-medium text-emerald-400">
                  {result.faceMatch}
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs text-slate-500">
                  Tampering
                </p>
                <p className="mt-2 font-medium text-emerald-400">
                  {result.tampering}
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs text-slate-500">
                  Risk Level
                </p>
                <p className="mt-2 font-medium text-emerald-400">
                  {result.risk}
                </p>
              </div>

            </div>

            <div className="mt-6 rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">
              <p className="text-sm text-blue-300">
                AI analysis completed successfully. No significant
                authenticity or tampering indicators were detected.
              </p>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

export default App;