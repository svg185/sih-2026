import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Activity,
  AlertTriangle,
  Bell,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Database,
  FileCheck2,
  FileSearch,
  FileText,
  Fingerprint,
  FolderSearch,
  Gauge,
  History,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  UserRound,
  X,
  XCircle,
  Zap,
} from "lucide-react";

const historyData = [
  {
    id: 1,
    file: "Aadhaar_Card_01.pdf",
    type: "Aadhaar",
    status: "Verified",
    score: 96,
    time: "2 min ago",
  },
  {
    id: 2,
    file: "Passport_User02.jpg",
    type: "Passport",
    status: "Suspicious",
    score: 68,
    time: "18 min ago",
  },
  {
    id: 3,
    file: "Driving_License.png",
    type: "Driving License",
    status: "Verified",
    score: 92,
    time: "42 min ago",
  },
  {
    id: 4,
    file: "PAN_Card_Sample.pdf",
    type: "PAN Card",
    status: "Fake Detected",
    score: 31,
    time: "1 hr ago",
  },
  {
    id: 5,
    file: "Passport_03.pdf",
    type: "Passport",
    status: "Verified",
    score: 94,
    time: "2 hrs ago",
  },
];

const activityData = [
  { day: "Mon", verified: 38, suspicious: 8, fake: 3 },
  { day: "Tue", verified: 46, suspicious: 11, fake: 4 },
  { day: "Wed", verified: 42, suspicious: 7, fake: 2 },
  { day: "Thu", verified: 55, suspicious: 13, fake: 5 },
  { day: "Fri", verified: 61, suspicious: 9, fake: 3 },
  { day: "Sat", verified: 48, suspicious: 12, fake: 6 },
  { day: "Sun", verified: 67, suspicious: 10, fake: 4 },
];

const riskData = [
  { name: "Low Risk", value: 71 },
  { name: "Medium Risk", value: 19 },
  { name: "High Risk", value: 10 },
];

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Document Upload", icon: UploadCloud },
  { name: "Verification", icon: ShieldCheck },
  { name: "Risk Dashboard", icon: Gauge },
  { name: "Forensic Analysis", icon: FileSearch },
  { name: "Investigation", icon: FolderSearch },
];

const bottomItems = [
  { name: "Audit Logs", icon: History },
  { name: "Settings", icon: Settings },
];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [history, setHistory] = useState(historyData);

  const [settings, setSettings] = useState({
    aiScreening: true,
    biometric: true,
    alerts: true,
    externalDatabase: false,
  });

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch = item.file
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ? true : item.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [history, search, filter]);

  const handleFile = (file) => {
    setError("");
    setScanResult(null);

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG and PDF files are supported.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10 MB.");
      return;
    }

    setSelectedFile(file);
  };

  const handleFileChange = (e) => {
    handleFile(e.target.files?.[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const startScreening = () => {
    if (!selectedFile || isScanning) return;

    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
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
          name: "SAMPLE USER",
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
      setIsScanning(false);

      const newRecord = {
        id: Date.now(),
        file: selectedFile.name,
        type: result.extractedData.documentType,
        status: result.status,
        score: result.score,
        time: "Just now",
      };

      setHistory((prev) => [newRecord, ...prev]);
    }, 2200);
  };

  const navigate = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <BackgroundGlow />

      <Sidebar
        activePage={activePage}
        navigate={navigate}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="lg:ml-[270px] min-h-screen relative">
        <Header
          activePage={activePage}
          setSidebarOpen={setSidebarOpen}
          search={search}
          setSearch={setSearch}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          {activePage === "Dashboard" && (
            <Dashboard
              navigate={navigate}
              history={filteredHistory}
              scanResult={scanResult}
            />
          )}

          {activePage === "Document Upload" && (
            <UploadPage
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              handleDrop={handleDrop}
              handleFileChange={handleFileChange}
              startScreening={startScreening}
              isScanning={isScanning}
              error={error}
              scanResult={scanResult}
            />
          )}

          {activePage === "Verification" && (
            <VerificationPage
              scanResult={scanResult}
              navigate={navigate}
              selectedFile={selectedFile}
              startScreening={startScreening}
              isScanning={isScanning}
            />
          )}

          {activePage === "Risk Dashboard" && <RiskDashboard />}

          {activePage === "Forensic Analysis" && (
            <ForensicPage scanResult={scanResult} />
          )}

          {activePage === "Investigation" && (
            <InvestigationPage history={history} />
          )}

          {activePage === "Audit Logs" && (
            <AuditLogs history={history} />
          )}

          {activePage === "Settings" && (
            <SettingsPage settings={settings} setSettings={setSettings} />
          )}
        </main>
      </div>
    </div>
  );
}

/* =========================
   BACKGROUND
========================= */

function BackgroundGlow() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </>
  );
}

/* =========================
   SIDEBAR
========================= */

function Sidebar({
  activePage,
  navigate,
  sidebarOpen,
  setSidebarOpen,
}) {
  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[270px] flex-col border-r border-white/10 bg-[#080d1d]/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[78px] items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 ring-1 ring-cyan-400/30">
              <Shield className="h-5 w-5 text-cyan-300" />
              <div className="absolute inset-0 rounded-xl bg-cyan-400/10 blur-lg" />
            </div>

            <div>
              <h1 className="text-sm font-bold tracking-wide">
                ID<span className="text-cyan-400">GUARD</span>
              </h1>
              <p className="text-[10px] text-slate-500">
                AI SCREENING PLATFORM
              </p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-4 pt-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
            Main Menu
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.name)}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-all ${
                    active
                      ? "bg-cyan-400/10 text-cyan-300 shadow-[inset_3px_0_0_#22d3ee]"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <Icon
                    size={18}
                    className={
                      active
                        ? "text-cyan-300"
                        : "text-slate-500 group-hover:text-slate-300"
                    }
                  />

                  <span>{item.name}</span>

                  {active && (
                    <ChevronRight className="ml-auto h-4 w-4 text-cyan-400" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto px-4 pb-5">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
            System
          </p>

          {bottomItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                onClick={() => navigate(item.name)}
                className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm ${
                  activePage === item.name
                    ? "bg-white/5 text-white"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </button>
            );
          })}

          <div className="mt-5 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>

              <span className="text-xs font-semibold text-emerald-300">
                All Systems Operational
              </span>
            </div>

            <p className="mt-2 text-[10px] leading-4 text-slate-500">
              AI engine, OCR and verification services are running normally.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

/* =========================
   HEADER
========================= */

function Header({
  activePage,
  setSidebarOpen,
  search,
  setSearch,
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050816]/80 backdrop-blur-xl">
      <div className="flex h-[78px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-slate-400 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-bold text-white">
            {activePage}
          </h2>
          <p className="hidden text-xs text-slate-500 sm:block">
            AI-powered identity and document security
          </p>
        </div>

        <div className="hidden w-64 md:block">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
            <Search size={16} className="text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents..."
              className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-600"
            />
          </div>
        </div>

        <button
          type="button"
          title="Notifications"
          className="relative rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-slate-400 hover:text-white"
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-400" />
        </button>

        <div className="hidden h-9 w-px bg-white/10 sm:block" />

        <div className="hidden items-center gap-3 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/30 to-blue-500/20 ring-1 ring-white/10">
            <UserRound size={17} className="text-cyan-300" />
          </div>

          <div className="hidden xl:block">
            <p className="text-xs font-semibold">Security Admin</p>
            <p className="text-[10px] text-slate-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}

/* =========================
   DASHBOARD
========================= */

function Dashboard({ navigate, history, scanResult }) {
  return (
    <div className="mx-auto max-w-[1600px] space-y-7">
      <PageHeading
        eyebrow="SECURITY OVERVIEW"
        title="Identity Screening Dashboard"
        description="Monitor document authenticity, risk signals and verification activity."
        action={
          <button
            onClick={() => navigate("Document Upload")}
            className="flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-[0_0_25px_rgba(34,211,238,.18)] transition hover:bg-cyan-300"
          >
            <UploadCloud size={17} />
            New Screening
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Documents Screened"
          value="1,284"
          change="+12.8%"
          icon={FileCheck2}
          tone="cyan"
          description="vs. last 30 days"
        />

        <StatCard
          title="Verified Documents"
          value="1,071"
          change="+8.4%"
          icon={ShieldCheck}
          tone="green"
          description="83.4% verification rate"
        />

        <StatCard
          title="Suspicious Cases"
          value="142"
          change="+4.2%"
          icon={AlertTriangle}
          tone="yellow"
          description="Requires review"
        />

        <StatCard
          title="Fake Detected"
          value="71"
          change="+2.1%"
          icon={XCircle}
          tone="red"
          description="Blocked by AI engine"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
        <Panel>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">Screening Activity</p>
              <p className="mt-1 text-xs text-slate-500">
                Verification activity over the last 7 days
              </p>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-slate-500">
              <LegendDot color="bg-emerald-400" label="Verified" />
              <LegendDot color="bg-amber-400" label="Suspicious" />
              <LegendDot color="bg-red-400" label="Fake" />
            </div>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="verifiedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,.05)"
                />

                <XAxis
                  dataKey="day"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    background: "#0b1224",
                    border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: 12,
                    color: "#fff",
                    fontSize: 12,
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="verified"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  fill="url(#verifiedGradient)"
                />

                <Area
                  type="monotone"
                  dataKey="suspicious"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="transparent"
                />

                <Area
                  type="monotone"
                  dataKey="fake"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <div className="mb-4">
            <p className="text-sm font-bold">Risk Distribution</p>
            <p className="mt-1 text-xs text-slate-500">
              Current screening risk profile
            </p>
          </div>

          <div className="relative h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={88}
                  paddingAngle={4}
                  stroke="none"
                >
                  {riskData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    background: "#0b1224",
                    border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black">71%</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500">
                Low Risk
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {riskData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: COLORS[index] }}
                />

                <span className="flex-1 text-xs text-slate-400">
                  {item.name}
                </span>

                <span className="text-xs font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <RecentScreenings history={history} />

        <Panel>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">AI Engine Status</p>
              <p className="mt-1 text-xs text-slate-500">
                Current system diagnostics
              </p>
            </div>

            <Activity className="text-emerald-400" size={19} />
          </div>

          <div className="space-y-4">
            <SystemStatus
              icon={BrainCircuit}
              name="AI Screening Engine"
              status="Operational"
              value="99.8%"
            />

            <SystemStatus
              icon={FileText}
              name="OCR Extraction"
              status="Operational"
              value="98.6%"
            />

            <SystemStatus
              icon={Fingerprint}
              name="Biometric Matching"
              status="Operational"
              value="97.9%"
            />

            <SystemStatus
              icon={Database}
              name="Identity Database"
              status="Connected"
              value="24ms"
            />
          </div>

          {scanResult && (
            <div className="mt-5 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.04] p-4">
              <div className="flex items-center gap-2 text-cyan-300">
                <Sparkles size={16} />
                <span className="text-xs font-bold">
                  Latest Screening Result
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="truncate text-xs text-slate-400">
                  {scanResult.extractedData.documentType}
                </span>
                <span className="font-bold text-emerald-400">
                  {scanResult.score}%
                </span>
              </div>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

/* =========================
   UPLOAD PAGE
========================= */
function UploadPage({
  selectedFile,
  setSelectedFile,
  isDragging,
  setIsDragging,
  handleDrop,
  handleFileChange,
  startScreening,
  isScanning,
  error,
  scanResult,
}) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!selectedFile || !selectedFile.type?.startsWith("image/")) {
      setPreviewUrl(null);
      return undefined;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <PageHeading
        eyebrow="AI DOCUMENT ANALYSIS"
        title="Upload & Screen"
        description="Upload an identity document and let the AI engine perform multi-layer authenticity analysis."
      />

      {!selectedFile ? (
        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
          {/* UPLOAD AREA */}
          <Panel className="overflow-hidden">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative flex min-h-[430px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed p-8 text-center transition-all duration-300 ${
                isDragging
                  ? "border-cyan-400 bg-cyan-400/[0.08] shadow-[0_0_60px_rgba(34,211,238,.08)]"
                  : "border-white/10 bg-white/[0.015] hover:border-cyan-400/30"
              }`}
            >
              {/* Decorative grid */}
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(34,211,238,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.08) 1px, transparent 1px)",
                  backgroundSize: "45px 45px",
                }}
              />

              {/* Glow */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[90px]" />

              {/* Top status */}
              <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-[9px] font-bold tracking-wider text-slate-500">
                  SECURE UPLOAD CHANNEL
                </span>
              </div>

              {/* Upload icon */}
              <div className="relative z-10 mb-7">
                <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-cyan-400/20 bg-cyan-400/[0.07] shadow-[0_0_50px_rgba(34,211,238,.08)]">
                  <UploadCloud
                    size={42}
                    strokeWidth={1.5}
                    className="text-cyan-300"
                  />
                </div>

                <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-400/20 bg-[#0a1020]">
                  <ShieldCheck size={14} className="text-cyan-300" />
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-black tracking-tight">
                  Drop your document here
                </h3>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
                  Securely upload an identity document for AI-powered
                  authenticity, OCR, biometric and forensic analysis.
                </p>

                <label className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-cyan-50">
                  <UploadCloud size={17} />
                  Select Document

                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                  />
                </label>

                <p className="mt-4 text-[10px] text-slate-600">
                  JPG • PNG • PDF &nbsp;|&nbsp; Maximum 10 MB
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-400/20 bg-red-400/[0.05] p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-400/10">
                  <AlertTriangle size={15} className="text-red-400" />
                </div>

                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}
          </Panel>

          {/* SECURITY FEATURES */}
          <Panel>
            <div className="mb-6">
              <p className="text-sm font-bold">AI Verification Pipeline</p>
              <p className="mt-1 text-xs text-slate-500">
                Every document passes through multiple security layers.
              </p>
            </div>

            <div className="space-y-3">
              <SecurityStep
                number="01"
                icon={FileSearch}
                title="Visual Analysis"
                text="Detect document structure and manipulation."
              />

              <SecurityStep
                number="02"
                icon={FileText}
                title="OCR Intelligence"
                text="Extract and validate identity information."
              />

              <SecurityStep
                number="03"
                icon={Fingerprint}
                title="Biometric Match"
                text="Compare facial identity signals."
              />

              <SecurityStep
                number="04"
                icon={BrainCircuit}
                title="Fraud Detection"
                text="Identify anomalies and suspicious patterns."
              />
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.06] to-blue-500/[0.02] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
                  <LockKeyhole size={18} className="text-cyan-300" />
                </div>

                <div>
                  <p className="text-xs font-bold">Protected Processing</p>
                  <p className="mt-1 text-[10px] text-slate-600">
                    Secure document analysis environment
                  </p>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      ) : (
        <div className="space-y-5">
          {/* DOCUMENT PREVIEW */}
          <Panel>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold">Document Preview</p>
                <p className="mt-1 text-xs text-slate-500">
                  Review the uploaded document before screening.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-[9px] font-bold text-emerald-300">
                  FILE VALID
                </span>

                <button
                  onClick={() => setSelectedFile(null)}
                  className="rounded-lg border border-white/10 p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
              {/* Preview */}
              <div className="relative flex min-h-[390px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#050816] p-6">
                <div
                  className="pointer-events-none absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(34,211,238,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.12) 1px, transparent 1px)",
                    backgroundSize: "35px 35px",
                  }}
                />

                {selectedFile.type.startsWith("image/") ? (
                  <div className="relative max-h-[350px] max-w-full overflow-hidden rounded-xl border border-white/10 shadow-2xl">
                    <img
                      src={previewUrl}
                      alt="Uploaded document"
                      className="max-h-[350px] max-w-full object-contain"
                    />

                    {/* AI scan overlay */}
                    {isScanning && (
                      <>
                        <div className="scan-line absolute left-0 right-0 h-[2px] bg-cyan-300 shadow-[0_0_18px_5px_rgba(34,211,238,.65)]" />

                        <div className="absolute inset-0 bg-cyan-400/[0.04]" />

                        <div className="absolute left-3 top-3 rounded-lg border border-cyan-400/30 bg-black/50 px-2.5 py-1.5 text-[9px] font-bold text-cyan-300 backdrop-blur">
                          AI ANALYZING
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="relative flex w-full max-w-md flex-col items-center rounded-2xl border border-white/10 bg-white/[0.025] p-12">
                    <FileText
                      size={70}
                      strokeWidth={1.2}
                      className="text-red-300"
                    />

                    <p className="mt-5 max-w-full truncate text-sm font-bold">
                      {selectedFile.name}
                    </p>

                    <p className="mt-2 text-xs text-slate-600">
                      PDF document
                    </p>

                    {isScanning && (
                      <div className="absolute inset-x-8 bottom-5">
                        <div className="scan-progress" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* File information */}
              <div className="flex flex-col">
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    Document Information
                  </p>

                  <div className="mt-5 space-y-4">
                    <InfoRow
                      label="File Name"
                      value={selectedFile.name}
                    />

                    <InfoRow
                      label="File Type"
                      value={selectedFile.type || "PDF"}
                    />

                    <InfoRow
                      label="File Size"
                      value={`${(
                        selectedFile.size /
                        1024 /
                        1024
                      ).toFixed(2)} MB`}
                    />

                    <InfoRow
                      label="Upload Status"
                      value="Validated"
                      green
                    />
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.035] p-5">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-cyan-300" />

                    <span className="text-xs font-bold">
                      Ready for AI Analysis
                    </span>
                  </div>

                  <p className="mt-2 text-[10px] leading-5 text-slate-600">
                    The screening engine will evaluate document integrity,
                    extracted data, biometric signals and fraud indicators.
                  </p>
                </div>

                <button
                  onClick={startScreening}
                  disabled={isScanning}
                  className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-4 text-sm font-black text-slate-950 shadow-[0_0_35px_rgba(34,211,238,.12)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isScanning ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                      AI ENGINE RUNNING...
                    </>
                  ) : (
                    <>
                      <BrainCircuit size={18} />
                      Start AI Screening
                    </>
                  )}
                </button>
              </div>
            </div>
          </Panel>

          {/* LIVE SCANNING */}
          {isScanning && <AIScanningPanel />}

          {/* RESULT */}
          {scanResult && !isScanning && (
            <ResultSection result={scanResult} />
          )}
        </div>
      )}
    </div>
  );
}

/* =========================
   VERIFICATION
========================= */

function VerificationPage({
  scanResult,
  navigate,
  selectedFile,
  startScreening,
  isScanning,
}) {
  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <PageHeading
        eyebrow="IDENTITY VERIFICATION"
        title="Verification Center"
        description="Review the latest document authenticity and identity matching result."
      />

      {!scanResult ? (
        <Panel className="py-20 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-400/10">
            <ShieldCheck size={38} className="text-cyan-300" />
          </div>

          <h3 className="mt-6 text-xl font-bold">
            No verification result available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Upload a document first and run the AI screening pipeline to view
            verification results.
          </p>

          <button
            onClick={() => navigate("Document Upload")}
            className="mt-6 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950"
          >
            Upload Document
          </button>
        </Panel>
      ) : (
        <ResultSection result={scanResult} />
      )}

      {selectedFile && !scanResult && (
        <button
          onClick={startScreening}
          disabled={isScanning}
          className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950"
        >
          {isScanning ? "Scanning..." : "Run Screening"}
        </button>
      )}
    </div>
  );
}

/* =========================
   RISK DASHBOARD
========================= */

function RiskDashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <PageHeading
        eyebrow="RISK INTELLIGENCE"
        title="Risk Dashboard"
        description="Analyze fraud signals and identify documents requiring investigation."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <RiskCard
          title="Low Risk"
          value="71%"
          count="912 documents"
          tone="green"
          icon={ShieldCheck}
        />

        <RiskCard
          title="Medium Risk"
          value="19%"
          count="244 documents"
          tone="yellow"
          icon={AlertTriangle}
        />

        <RiskCard
          title="High Risk"
          value="10%"
          count="128 documents"
          tone="red"
          icon={XCircle}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Panel>
          <div className="mb-6">
            <p className="text-sm font-bold">Risk Score Trend</p>
            <p className="mt-1 text-xs text-slate-500">
              Suspicious and fake cases across screening activity
            </p>
          </div>

          <div className="h-[310px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,.05)"
                />

                <XAxis
                  dataKey="day"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    background: "#0b1224",
                    border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />

                <Bar
                  dataKey="suspicious"
                  fill="#f59e0b"
                  radius={[5, 5, 0, 0]}
                />

                <Bar
                  dataKey="fake"
                  fill="#ef4444"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <p className="text-sm font-bold">Risk Factors</p>
          <p className="mt-1 text-xs text-slate-500">
            Most common suspicious signals
          </p>

          <div className="mt-6 space-y-5">
            <RiskFactor title="Image Tampering" value={78} />
            <RiskFactor title="Font Inconsistency" value={61} />
            <RiskFactor title="Face Mismatch" value={44} />
            <RiskFactor title="Metadata Anomaly" value={37} />
            <RiskFactor title="OCR Structure Issue" value={24} />
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* =========================
   FORENSIC
========================= */

function ForensicPage({ scanResult }) {
  const result = scanResult || {
    forensic: {
      documentIntegrity: 96,
      ocrAccuracy: 98,
      faceMatch: 94,
      liveness: 97,
      tampering: 8,
      riskScore: 12,
    },
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <PageHeading
        eyebrow="FORENSIC INTELLIGENCE"
        title="Forensic Analysis"
        description="Inspect document integrity, tampering signals and biometric confidence."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={FileCheck2}
          title="Document Integrity"
          value={result.forensic.documentIntegrity}
          suffix="%"
        />

        <MetricCard
          icon={FileText}
          title="OCR Accuracy"
          value={result.forensic.ocrAccuracy}
          suffix="%"
        />

        <MetricCard
          icon={Fingerprint}
          title="Face Match"
          value={result.forensic.faceMatch}
          suffix="%"
        />

        <MetricCard
          icon={Activity}
          title="Liveness"
          value={result.forensic.liveness}
          suffix="%"
        />
      </div>

      <Panel>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold">Document Tampering Heatmap</p>
            <p className="mt-1 text-xs text-slate-500">
              AI-assisted visualization of suspicious document regions
            </p>
          </div>

          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-[10px] font-bold text-emerald-300">
            LOW TAMPERING
          </span>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#080d1d] p-5">
          <div className="mx-auto max-w-3xl">
            <div className="relative aspect-[1.6/1] overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-950">
              <div className="absolute inset-4 rounded-lg border border-cyan-400/20" />

              <div className="absolute left-[9%] top-[12%] h-20 w-24 rounded-lg border border-cyan-400/20 bg-cyan-400/5" />

              <div className="absolute right-[10%] top-[12%] h-28 w-24 rounded-lg border border-amber-400/30 bg-amber-400/10 shadow-[0_0_35px_rgba(245,158,11,.12)]" />

              <div className="absolute bottom-[22%] left-[12%] h-3 w-[55%] rounded bg-white/10" />
              <div className="absolute bottom-[14%] left-[12%] h-3 w-[42%] rounded bg-white/5" />

              <div className="absolute right-[12%] bottom-[15%] h-14 w-14 rounded-full border border-red-400/30 bg-red-400/10 shadow-[0_0_30px_rgba(239,68,68,.15)]" />

              <div className="absolute inset-x-0 top-1/2 border-t border-cyan-400/10" />
              <div className="absolute inset-y-0 left-1/2 border-l border-cyan-400/10" />

              <div className="absolute left-4 top-4 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-[10px] text-slate-400 backdrop-blur">
                DOCUMENT REGION ANALYSIS
              </div>
            </div>
          </div>

          <div className="mx-auto mt-5 flex max-w-3xl flex-wrap items-center justify-center gap-5 text-[10px] text-slate-500">
            <LegendDot color="bg-emerald-400" label="Authentic region" />
            <LegendDot color="bg-amber-400" label="Review region" />
            <LegendDot color="bg-red-400" label="High anomaly" />
          </div>
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel>
          <p className="text-sm font-bold">Integrity Checks</p>

          <div className="mt-5 space-y-4">
            <CheckRow title="Document structure" value="Passed" />
            <CheckRow title="Text consistency" value="Passed" />
            <CheckRow title="Image manipulation" value="Low" />
            <CheckRow title="Metadata inspection" value="Passed" />
            <CheckRow title="Security pattern analysis" value="Passed" />
          </div>
        </Panel>

        <Panel>
          <p className="text-sm font-bold">Forensic Summary</p>

          <div className="mt-5 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10">
                <ShieldCheck className="text-emerald-400" />
              </div>

              <div>
                <p className="text-sm font-bold text-emerald-300">
                  Document appears authentic
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Overall forensic risk score:{" "}
                  <span className="font-bold text-white">
                    {result.forensic.riskScore}/100
                  </span>
                </p>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* =========================
   INVESTIGATION
========================= */

function InvestigationPage({ history }) {
  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <PageHeading
        eyebrow="CASE MANAGEMENT"
        title="Investigation Center"
        description="Review suspicious screening cases and prioritize manual investigation."
      />

      <Panel>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold">Investigation Queue</p>
            <p className="mt-1 text-xs text-slate-500">
              Documents requiring analyst attention
            </p>
          </div>

          <span className="rounded-full border border-amber-400/20 bg-amber-400/5 px-3 py-1.5 text-[10px] font-bold text-amber-300">
            12 OPEN CASES
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-slate-600">
                <th className="px-4 py-3">Document</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Risk</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {history
                .filter((x) => x.status !== "Verified")
                .map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-400/10">
                          <FileText size={16} className="text-red-300" />
                        </div>

                        <span className="text-xs font-semibold">
                          {item.file}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-xs text-slate-400">
                      {item.type}
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-xs font-bold text-red-300">
                        {100 - item.score}/100
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="px-4 py-4">
                      <button
                        type="button"
                        className="rounded-lg border border-white/10 px-3 py-2 text-[10px] font-bold text-slate-300 hover:bg-white/5"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

/* =========================
   AUDIT LOGS
========================= */

function AuditLogs({ history }) {
  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <PageHeading
        eyebrow="SECURITY AUDIT"
        title="Audit Logs"
        description="Track screening operations and system activity."
      />

      <Panel>
        <div className="space-y-1">
          {history.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-xl p-4 transition hover:bg-white/[0.025]"
            >
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
                  <Activity size={17} className="text-cyan-300" />
                </div>

                {index !== history.length - 1 && (
                  <div className="absolute left-1/2 top-10 h-7 w-px bg-white/10" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold">
                  Document screening completed
                </p>

                <p className="mt-1 truncate text-[11px] text-slate-500">
                  {item.file} • AI screening engine
                </p>
              </div>

              <StatusBadge status={item.status} />

              <span className="hidden text-[10px] text-slate-600 sm:block">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* =========================
   SETTINGS
========================= */

function SettingsPage({ settings, setSettings }) {
  const toggleSetting = (key) => {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <PageHeading
        eyebrow="PLATFORM CONFIGURATION"
        title="Settings"
        description="Configure security and screening preferences."
      />

      <Panel>
        <SettingRow
          icon={BrainCircuit}
          title="AI Screening Engine"
          description="Enable automated document authenticity analysis."
          enabled={settings.aiScreening}
          onToggle={() => toggleSetting("aiScreening")}
        />

        <SettingRow
          icon={Fingerprint}
          title="Biometric Verification"
          description="Enable face matching and liveness verification."
          enabled={settings.biometric}
          onToggle={() => toggleSetting("biometric")}
        />

        <SettingRow
          icon={AlertTriangle}
          title="High Risk Alerts"
          description="Generate alerts for high-risk screening results."
          enabled={settings.alerts}
          onToggle={() => toggleSetting("alerts")}
        />

        <SettingRow
          icon={Database}
          title="External Identity Database"
          description="Use connected identity verification services."
          enabled={settings.externalDatabase}
          onToggle={() => toggleSetting("externalDatabase")}
        />
      </Panel>

      <div className="grid gap-4 sm:grid-cols-2">
        <Panel className="border-cyan-400/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
              <ShieldCheck size={18} className="text-cyan-300" />
            </div>
            <div>
              <p className="text-xs font-bold">Security Profile</p>
              <p className="mt-1 text-[10px] text-slate-600">
                Recommended configuration is enabled.
              </p>
            </div>
          </div>
        </Panel>

        <Panel className="border-emerald-400/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
              <Activity size={18} className="text-emerald-300" />
            </div>
            <div>
              <p className="text-xs font-bold">System Status</p>
              <p className="mt-1 text-[10px] text-emerald-400">
                Configuration saved locally
              </p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* =========================
   RECENT SCREENINGS
========================= */

function RecentScreenings({ history }) {
  return (
    <Panel className="overflow-hidden">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold">Recent Screenings</p>
          <p className="mt-1 text-xs text-slate-500">
            Latest document verification activity
          </p>
        </div>

        <span className="flex items-center gap-1 text-[10px] font-bold text-cyan-300">
          Latest Activity
          <ChevronRight size={13} />
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-slate-600">
              <th className="px-3 py-3">Document</th>
              <th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">Score</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Time</th>
            </tr>
          </thead>

          <tbody>
            {history.slice(0, 5).map((item) => (
              <tr
                key={item.id}
                className="border-b border-white/5 last:border-0"
              >
                <td className="px-3 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                      <FileText size={14} className="text-slate-400" />
                    </div>

                    <span className="max-w-[180px] truncate text-xs font-medium">
                      {item.file}
                    </span>
                  </div>
                </td>

                <td className="px-3 py-4 text-xs text-slate-500">
                  {item.type}
                </td>

                <td className="px-3 py-4">
                  <span
                    className={`text-xs font-bold ${
                      item.score >= 85
                        ? "text-emerald-400"
                        : item.score >= 60
                        ? "text-amber-400"
                        : "text-red-400"
                    }`}
                  >
                    {item.score}%
                  </span>
                </td>

                <td className="px-3 py-4">
                  <StatusBadge status={item.status} />
                </td>

                <td className="px-3 py-4 text-[10px] text-slate-600">
                  {item.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* =========================
   RESULT
========================= */

function ResultSection({ result }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <Panel>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Screening Result
              </p>

              <h3 className="mt-2 text-2xl font-black">
                {result.status}
              </h3>
            </div>

            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-emerald-400/20">
              <div className="absolute inset-1 rounded-full border-4 border-emerald-400 border-r-transparent" />

              <div className="text-center">
                <p className="text-xl font-black text-emerald-400">
                  {result.score}
                </p>
                <p className="text-[8px] text-slate-500">SCORE</p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0 text-emerald-400"
              />

              <p className="text-xs leading-5 text-slate-400">
                {result.message}
              </p>
            </div>
          </div>
        </Panel>

        <Panel>
          <p className="text-sm font-bold">Extracted Identity Data</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {Object.entries(result.extractedData).map(([key, value]) => (
              <div
                key={key}
                className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
              >
                <p className="text-[9px] uppercase tracking-wider text-slate-600">
                  {key.replace(/([A-Z])/g, " $1")}
                </p>

                <p className="mt-2 text-xs font-bold text-slate-200">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel>
          <p className="text-sm font-bold">Forensic Metrics</p>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <MetricCard
              icon={FileCheck2}
              title="Integrity"
              value={result.forensic.documentIntegrity}
              suffix="%"
              compact
            />

            <MetricCard
              icon={FileText}
              title="OCR"
              value={result.forensic.ocrAccuracy}
              suffix="%"
              compact
            />

            <MetricCard
              icon={Fingerprint}
              title="Face Match"
              value={result.forensic.faceMatch}
              suffix="%"
              compact
            />

            <MetricCard
              icon={Activity}
              title="Liveness"
              value={result.forensic.liveness}
              suffix="%"
              compact
            />
          </div>
        </Panel>

        <Panel>
          <p className="text-sm font-bold">AI Findings</p>

          <div className="mt-5 space-y-3">
            {result.anomalies.map((item, index) => (
              <Finding
                key={index}
                text={item}
                positive={!item.toLowerCase().includes("alteration")}
              />
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* =========================
   COMPONENTS
========================= */

function PageHeading({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          <p className="text-[10px] font-bold tracking-[0.2em] text-cyan-400">
            {eyebrow}
          </p>
        </div>

        <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
          {title}
        </h2>

        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          {description}
        </p>
      </div>

      {action}
    </div>
  );
}

function Panel({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-white/[0.08] bg-[#0a1020]/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,.18)] backdrop-blur-xl ${className}`}
    >
      {children}
    </section>
  );
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  tone,
  description,
}) {
  const tones = {
    cyan: "text-cyan-300 bg-cyan-400/10 ring-cyan-400/10",
    green: "text-emerald-300 bg-emerald-400/10 ring-emerald-400/10",
    yellow: "text-amber-300 bg-amber-400/10 ring-amber-400/10",
    red: "text-red-300 bg-red-400/10 ring-red-400/10",
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a1020]/80 p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/[0.14]">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-400/5 blur-2xl transition group-hover:bg-cyan-400/10" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-black tracking-tight">{value}</p>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-[10px] font-bold text-emerald-400">
              {change}
            </span>

            <span className="text-[10px] text-slate-600">
              {description}
            </span>
          </div>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${tones[tone]}`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  title,
  value,
  suffix,
  compact = false,
}) {
  return (
    <div
      className={`rounded-xl border border-white/5 bg-white/[0.02] ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-500">{title}</span>
        <Icon size={15} className="text-cyan-400" />
      </div>

      <div className="mt-3 flex items-end gap-1">
        <span className={`${compact ? "text-xl" : "text-2xl"} font-black`}>
          {value}
        </span>
        <span className="mb-0.5 text-xs text-slate-600">{suffix}</span>
      </div>

      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function RiskCard({
  title,
  value,
  count,
  tone,
  icon: Icon,
}) {
  const styles = {
    green: "border-emerald-400/10 bg-emerald-400/[0.035] text-emerald-400",
    yellow: "border-amber-400/10 bg-amber-400/[0.035] text-amber-400",
    red: "border-red-400/10 bg-red-400/[0.035] text-red-400",
  };

  return (
    <div className={`rounded-2xl border p-5 ${styles[tone]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-black">{value}</p>
          <p className="mt-1 text-[10px] text-slate-600">{count}</p>
        </div>

        <Icon size={21} />
      </div>
    </div>
  );
}

function RiskFactor({ title, value }) {
  return (
    <div>
      <div className="mb-2 flex justify-between">
        <span className="text-xs text-slate-400">{title}</span>
        <span className="text-[10px] font-bold text-slate-500">
          {value}%
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function SystemStatus({
  icon: Icon,
  name,
  status,
  value,
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
        <Icon size={16} className="text-slate-400" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold">{name}</p>
        <p className="mt-1 text-[10px] text-emerald-400">{status}</p>
      </div>

      <span className="text-[10px] font-bold text-slate-500">
        {value}
      </span>
    </div>
  );
}

function PipelineStep({
  number,
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex gap-4">
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/5">
        <Icon size={17} className="text-cyan-300" />

        <span className="absolute -right-2 -top-2 rounded-md bg-[#0a1020] px-1.5 text-[8px] font-bold text-slate-600">
          {number}
        </span>
      </div>

      <div>
        <p className="text-xs font-bold">{title}</p>
        <p className="mt-1 text-[10px] leading-4 text-slate-600">
          {description}
        </p>
      </div>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Verified:
      "border-emerald-400/20 bg-emerald-400/5 text-emerald-300",
    Suspicious:
      "border-amber-400/20 bg-amber-400/5 text-amber-300",
    "Fake Detected":
      "border-red-400/20 bg-red-400/5 text-red-300",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[9px] font-bold ${
        styles[status] ||
        "border-slate-400/20 bg-slate-400/5 text-slate-300"
      }`}
    >
      {status}
    </span>
  );
}

function Finding({ text, positive }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
      {positive ? (
        <CheckCircle2
          size={16}
          className="mt-0.5 shrink-0 text-emerald-400"
        />
      ) : (
        <AlertTriangle
          size={16}
          className="mt-0.5 shrink-0 text-amber-400"
        />
      )}

      <p className="text-xs leading-5 text-slate-400">{text}</p>
    </div>
  );
}

function CheckRow({ title, value }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
      <div className="flex items-center gap-2">
        <CheckCircle2 size={14} className="text-emerald-400" />
        <span className="text-xs text-slate-400">{title}</span>
      </div>

      <span className="text-[10px] font-bold text-emerald-400">
        {value}
      </span>
    </div>
  );
}

function SettingRow({
  icon: Icon,
  title,
  description,
  enabled,
  onToggle,
}) {
  return (
    <div className="flex items-center gap-4 border-b border-white/5 py-5 last:border-0">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/5">
        <Icon size={18} className="text-cyan-300" />
      </div>

      <div className="flex-1">
        <p className="text-xs font-bold">{title}</p>
        <p className="mt-1 text-[10px] text-slate-600">{description}</p>
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-label={`Toggle ${title}`}
        aria-pressed={enabled}
        className={`h-6 w-11 rounded-full p-1 text-left transition ${
          enabled ? "bg-cyan-400" : "bg-white/10"
        }`}
      >
        <div
          className={`h-4 w-4 rounded-full bg-white transition ${
            enabled ? "ml-5" : "ml-0"
          }`}
        />
      </button>
    </div>
  );
}


function SecurityStep({ number, icon: Icon, title, text }) {
  return (
    <div className="group flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition hover:border-cyan-400/10 hover:bg-cyan-400/[0.025]">
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/5">
        <Icon size={17} className="text-cyan-300" />
        <span className="absolute -right-1.5 -top-1.5 rounded-md border border-white/10 bg-[#0a1020] px-1 text-[7px] font-bold text-slate-600">
          {number}
        </span>
      </div>
      <div>
        <p className="text-xs font-bold">{title}</p>
        <p className="mt-1 text-[10px] leading-4 text-slate-600">{text}</p>
      </div>
    </div>
  );
}

function InfoRow({ label, value, green = false }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0">
      <span className="text-[10px] text-slate-600">{label}</span>
      <span
        className={`max-w-[65%] truncate text-right text-[10px] font-semibold ${
          green ? "text-emerald-400" : "text-slate-300"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function AIScanningPanel() {
  const stages = [
    {
      icon: FileSearch,
      title: "Document Structure",
      text: "Analyzing visual patterns...",
      progress: 100,
    },
    {
      icon: FileText,
      title: "OCR Extraction",
      text: "Reading identity information...",
      progress: 82,
    },
    {
      icon: Fingerprint,
      title: "Biometric Analysis",
      text: "Matching identity signals...",
      progress: 56,
    },
    {
      icon: BrainCircuit,
      title: "AI Risk Assessment",
      text: "Calculating fraud probability...",
      progress: 28,
    },
  ];

  return (
    <Panel className="relative overflow-hidden border-cyan-400/10">
      <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-cyan-400/10 blur-[90px]" />

      <div className="relative">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
              </span>
              <span className="text-xs font-black tracking-wider text-cyan-300">
                AI SCREENING IN PROGRESS
              </span>
            </div>
            <p className="mt-2 text-[10px] text-slate-600">
              Multi-layer authenticity analysis is currently running.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-cyan-400/10 bg-cyan-400/5 px-3 py-1.5">
            <Zap size={12} className="text-cyan-300" />
            <span className="text-[9px] font-bold text-cyan-300">
              AI ENGINE ONLINE
            </span>
          </div>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {stages.map((stage) => {
            const Icon = stage.icon;

            return (
              <div
                key={stage.title}
                className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/5">
                    <Icon size={16} className="text-cyan-300" />
                  </div>
                  <span className="text-[9px] font-bold text-cyan-400">
                    {stage.progress}%
                  </span>
                </div>

                <p className="mt-4 text-xs font-bold">{stage.title}</p>
                <p className="mt-1 text-[10px] text-slate-600">
                  {stage.text}
                </p>

                <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700"
                    style={{ width: `${stage.progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-slate-600">
          <Activity size={13} className="animate-pulse text-cyan-400" />
          Processing document intelligence...
        </div>
      </div>
    </Panel>
  );
}

export default App;