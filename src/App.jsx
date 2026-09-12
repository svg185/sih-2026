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
    setResult({
  status: "Verified",
  confidence: 94,
  riskScore: 8,
  document: "Identity Document",
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
    documentType: "Identity Card",
    name: "Sample User",
    dateOfBirth: "XX/XX/XXXX",
    documentNumber: "XXXX-XXXX-XXXX",
    issuingAuthority: "Government Authority",
  },
});

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

        {/* Advanced Screening Result */}
{result && (
  <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8">

    {/* Result Header */}
    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

      <div>
        <p className="text-sm text-slate-400">
          AI Screening Complete
        </p>

        <h3 className="mt-1 text-3xl font-bold text-emerald-400">
          ✓ {result.status}
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Automated identity and document authenticity analysis
        </p>
      </div>

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-8 py-4 text-center">
        <p className="text-xs text-slate-400">
          AI Confidence
        </p>

        <p className="mt-1 text-4xl font-bold text-emerald-400">
          {result.confidence}%
        </p>
      </div>

    </div>

    {/* Risk Score */}
    <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-6">

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Overall Risk Score
          </p>

          <p className="mt-1 text-2xl font-bold text-emerald-400">
            {result.riskScore}/100
          </p>
        </div>

        <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
          {result.risk}
        </span>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-emerald-500"
          style={{ width: `${100 - result.riskScore}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Lower score indicates lower fraud risk
      </p>

    </div>

    {/* Verification Checks */}
    <div className="mt-6">

      <h4 className="text-lg font-semibold">
        Verification Checks
      </h4>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-sm text-slate-400">
            Document Authenticity
          </p>

          <p className="mt-3 text-2xl font-bold text-emerald-400">
            {result.authenticity}%
          </p>

          <p className="mt-1 text-xs text-emerald-500">
            ✓ Authentic
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-sm text-slate-400">
            Face Match
          </p>

          <p className="mt-3 text-2xl font-bold text-emerald-400">
            {result.faceMatch}%
          </p>

          <p className="mt-1 text-xs text-emerald-500">
            ✓ Strong Match
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-sm text-slate-400">
            OCR Accuracy
          </p>

          <p className="mt-3 text-2xl font-bold text-blue-400">
            {result.ocrAccuracy}%
          </p>

          <p className="mt-1 text-xs text-blue-400">
            ✓ Text Verified
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-sm text-slate-400">
            Tampering Detection
          </p>

          <p className="mt-3 text-lg font-bold text-emerald-400">
            ✓ {result.tampering}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            No modification indicators
          </p>
        </div>

      </div>
    </div>

    {/* Extracted Information */}
    <div className="mt-8">

      <h4 className="text-lg font-semibold">
        Extracted Information
      </h4>

      <div className="mt-4 grid gap-4 md:grid-cols-2">

        <div className="rounded-xl bg-slate-950 p-4">
          <p className="text-xs text-slate-500">
            Document Type
          </p>
          <p className="mt-1 font-medium">
            {result.extractedData.documentType}
          </p>
        </div>

        <div className="rounded-xl bg-slate-950 p-4">
          <p className="text-xs text-slate-500">
            Name
          </p>
          <p className="mt-1 font-medium">
            {result.extractedData.name}
          </p>
        </div>

        <div className="rounded-xl bg-slate-950 p-4">
          <p className="text-xs text-slate-500">
            Date of Birth
          </p>
          <p className="mt-1 font-medium">
            {result.extractedData.dateOfBirth}
          </p>
        </div>

        <div className="rounded-xl bg-slate-950 p-4">
          <p className="text-xs text-slate-500">
            Document Number
          </p>
          <p className="mt-1 font-medium">
            {result.extractedData.documentNumber}
          </p>
        </div>

        <div className="rounded-xl bg-slate-950 p-4 md:col-span-2">
          <p className="text-xs text-slate-500">
            Issuing Authority
          </p>
          <p className="mt-1 font-medium">
            {result.extractedData.issuingAuthority}
          </p>
        </div>

      </div>
    </div>

    {/* Risk Indicators */}
    <div className="mt-8">

      <h4 className="text-lg font-semibold">
        AI Risk Analysis
      </h4>

      <div className="mt-4 space-y-3">

        {result.indicators.map((indicator, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-sm text-emerald-400">
              ✓
            </span>

            <span className="text-sm text-slate-300">
              {indicator}
            </span>
          </div>
        ))}

      </div>

    </div>

    {/* Final Message */}
    <div className="mt-8 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">

      <div className="flex gap-3">

        <span className="text-xl">
          🛡️
        </span>

        <div>
          <p className="font-semibold text-emerald-400">
            Low Fraud Risk
          </p>

          <p className="mt-1 text-sm text-slate-400">
            The document passed the current automated screening
            checks. Further verification can be performed through
            the backend AI service.
          </p>
        </div>

      </div>

    </div>

  </div>
)}

      </main>
    </div>
  );
}

export default App;