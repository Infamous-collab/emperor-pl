import { useState, useEffect, useCallback, useMemo } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  CartesianGrid,
} from "recharts";

const STORAGE_KEY = "emperor-pl-entries";

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const save = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Save failed", e);
  }
};

const formatCurrency = (val) => {
  if (val === null || val === undefined || isNaN(val)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(val);
};

const formatPct = (val) => {
  if (val === null || val === undefined || isNaN(val)) return "0.0%";
  return `${val.toFixed(1)}%`;
};

// Icons
const TrendUp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
const TrendDown = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const defaultEntry = () => ({
  id: Date.now().toString(),
  date: new Date().toISOString().split("T")[0],
  revenue: "",
  adSpend: "",
  cogs: "",
  shipping: "",
  otherCosts: "",
});

const calcProfit = (e) => {
  const rev = parseFloat(e.revenue) || 0;
  const ad = parseFloat(e.adSpend) || 0;
  const cogs = parseFloat(e.cogs) || 0;
  const ship = parseFloat(e.shipping) || 0;
  const other = parseFloat(e.otherCosts) || 0;
  const totalCosts = ad + cogs + ship + other;
  const profit = rev - totalCosts;
  const margin = rev > 0 ? (profit / rev) * 100 : 0;
  const roas = ad > 0 ? rev / ad : 0;
  return { profit, margin, roas, totalCosts, rev };
};

const profitColor = (val) => (val >= 0 ? "#00E69D" : "#FF4D6A");
const marginColor = (val) =>
  val >= 30 ? "#00E69D" : val >= 15 ? "#FFB800" : "#FF4D6A";

export default function App() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState(defaultEntry());
  const [editingId, setEditingId] = useState(null);
  const [editEntry, setEditEe x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const defaultEntry = () => ({
  id: Date.now().toString(),
  date: new Date().toISOString().split("T")[0],
  revenue: "",
  adSpend: "",
  cogs: "",
  shipping: "",
  otntry] = useState(null);
  const [view, setView] = useState("input");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setEntries(load());
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const updateEntries = (data) => {
    setEntries(data);
    save(data);
  };

  const handleAdd = () => {
    if (!newEntry.revenue && !newEntry.adSpend) return;
    const updated = [newEntry, ...entries];
    updateEntries(updated);
    setNewEntry(defaultEntry());
    showToast("Entry logged ✓");
  };

  const handleDelete = (id) => {
    updateEntries(entries.filter((e) => e.id !== id));
    showToast("Deleted");
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setEditEntry({ ...entry });
  };n
  const handleSaveEdit = () => {
    updateEntries(entries.map((e) => (e.id === editingId ? editEntry : e)));
    setEditingId(null);
    setEditEntry(null);
    showToast("Updated ✓");
  };

  const handleClearAll = () => {
    if (confirm("Clear all data? This cannot be undone.")) {
      updateEntries([]);
    }
  };

  // Stats
  const stats = useMemo(() => {
    if (entries.length === 0)
      return { totalProfit: 0, avgMargin: 0, avgRoas: 0, totalRevenue: 0, totalAdSpend: 0, days: 0 };
    let totalProfit = 0, totalRev = 0, totalAd = 0, margins = [];
    entries.forEach((e) => {
      const { profit, margin, rev } = calcProfit(e);
      totalProfit += profit;
      totalRev += rev;
      totalAd += parseFloat(e.adSpend) || 0;
      margins.push(margin);
    });
    return {
      totalProfit,
      avgMargin: margins.reduce((a, b) => a + b, 0) / margins.length,
      avgRoas: totalAd > 0 ? totalRev / totalAd : 0,
      totalRevenue: totalRev,
      totalAdSpend: totalAd,
      days: entries.length,
    };
  }, [entries]);

  // Charts
  const chartData = useMemo(() => {
    return [...entries]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((e) => {
        const { profit, margin, roas } = calcProfit(e);
        return { date: e.date.slice(5), profit, margin, roas };
      });
  }, [entries]);

  // Filtered
  const filteredEntries = useMemo(() => {
    if (selectedMonth === "all") return entries;
    return entries.filter((e) => e.date.slice(0, 7) === selectedMonth);
  }, [entries, selectedMonth]);

  const availableMonths = useMemo(() => {
    return Array.from(new Set(entries.map((e) => e.date.slice(0, 7)))).sort().reverse();
  }, [entries]);

  const filteredStats = useMemo(() => {
    if (filteredEntries.length === 0) return { profit: 0, margin: 0 };
    const profit = filteredEntries.reduce((s, e) => s + calcProfit(e).profit, 0);
    const margin = filteredEntries.reduce((s, e) => s + calcProfit(e).margin, 0) / filteredEntries.length;
    return { profit, margin };
  }, [filteredEntries]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        
        html { 
          background: #0A0A0F; 
          -webkit-text-size-adjust: 100%;
          -webkit-tap-highlight-color: transparent;
        }
        
        body { 
          background: #0A0A0F; 
          margin: 0; 
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }
        
        .root {
          font-family: 'Outfit', -apple-system, sans-serif;
          color: #E8E8ED;
          max-width: 860px;
          margin: 0 auto;
          padding: 20px 16px 80px;
          min-height: 100vh;
          min-height: 100dvh;
        }
        
        input[type="number"], input[type="date"], select {
          background: #14141F;
          border: 1px solid #1E1E2E;
          color: #E8E8ED;
          font-family: 'JetBrains Mono', monospace;
          font-size: 15px;
          padding: 12px 14px;
          border-radius: 10px;
          outline: none;
          width: 100%;
          transition: border-color 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
        }
        
        input:focus {
          border-color: #00E69D;
          box-shadow: 0 0 0 3px rgba(0, 230, 157, 0.1);
        }
        
        input::placeholder { color: #3A3A4A; }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; }
        
        .hero-num {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          line-height: 1;
          letter-spacing: -2px;
          transition: color 0.4s;
        }
        
        .card {
          background: #111118;
          border: 1px solid #1A1A28;
          border-radius: 14px;
          padding: 16px 18px;
          transition: transform 0.15s, border-color 0.15s;
        }
        .card:hover { border-color: #252535; }
        
        .label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #555566;
          font-weight: 600;
          margin-bottom: 6px;
        }
        
        .mono { font-family: 'JetBrains Mono', monospace; }
        
        .tab {
          background: none;
          border: none;
          color: #555566;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 500;
          padding: 8px 14px;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .tab:hover { color: #999; }
        .tab.on { color: #E8E8ED; background: #1A1A28; }
        
        .btn {
          background: #00E69D;
          color: #0A0A0F;
          border: none;
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 15px;
          padding: 12px 24px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.15s;
          width: 100%;
        }
        .btn:hover { background: #00CC8B; }
        .btn:active { transform: scale(0.98); }
        
        .btn-sm {
          background: none;
          border: 1px solid #1E1E2E;
          color: #888;
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.15s;
        }
        .btn-sm:hover { border-color: #333; color: #bbb; }
        .btn-sm.red:hover { border-color: #FF4D6A44; color: #FF4D6A; }
        
        .grid-input {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (min-width: 600px) {
          .grid-input { grid-template-columns: repeat(3, 1fr); }
        }
        
        .grid-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        @media (min-width: 600px) {
          .grid-stats { grid-template-columns: repeat(4, 1fr); }
        }
        
        .ig label {
          display: block;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #555566;
          font-weight: 600;
          margin-bottom: 6px;
        }
        
        .glow {
          height: 1px;
          background: linear-gradient(90deg, transparent, #00E69D33, transparent);
          margin-bottom: 28px;
        }
        
        .pulse {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #00E69D;
          animation: pulse 2s ease infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        
        .fade { animation: fadeUp 0.4s ease forwards; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .toast {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: #1A1A28;
          border: 1px solid #2A2A3A;
          color: #00E69D;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          padding: 10px 20px;
          border-radius: 10px;
          z-index: 100;
          animation: toastIn 0.3s ease;
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        
        /* History table — scrollable on mobile */
        .h-row {
          display: grid;
          grid-template-columns: 72px 1fr 1fr 1fr 64px 60px 52px;
          gap: 6px;
          align-items: center;
          padding: 10px 12px;
          border-radius: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
        }
        .h-row:hover { background: #111118; }
        
        .h-head {
          display: grid;
          grid-template-columns: 72px 1fr 1fr 1fr 64px 60px 52px;
          gap: 6px;
          padding: 6px 12px;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #444455;
          font-weight: 600;
        }
        
        @media (max-width: 599px) {
          .h-row, .h-head {
            grid-template-columns: 60px 1fr 1fr 56px 46px;
            font-size: 11px;
          }
          .h-hide { display: none; }
          .hero-num { font-size: 52px !important; }
        }
        
        .scroll-x {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>

      <div className="root">
        {/* Toast */}
        {toast && <div className="toast">{toast}</div>}

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "34px", height: "34px", borderRadius: "9px",
              background: "linear-gradient(135deg, #00E69D, #00B87A)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "17px", fontWeight: "800", color: "#0A0A0F"
            }}>E</div>
            <h1 style={{ fontSize: "19px", fontWeight: "700", letterSpacing: "-0.5px" }}>Emperor P&L</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div className="pulse" />
            <span className="mono" style={{ fontSize: "11px", color: "#555" }}>
              {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </span>
          </div>
        </div>
        <div className="glow" />

        {/* Hero Margin */}
        <div style={{ textAlign: "center", marginBottom: "28px" }} className="fade">
          <div className="label" style={{ marginBottom: "6px" }}>Avg Profit Margin</div>
          <div className="hero-num" style={{
            fontSize: "64px",
            color: entries.length > 0 ? marginColor(stats.avgMargin) : "#2A2A3A"
          }}>
            {entries.length > 0 ? formatPct(stats.avgMargin) : "—"}
          </div>
          {entries.length > 0 && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "6px", marginTop: "8px",
              color: profitColor(stats.totalProfit), fontSize: "14px", fontWeight: "500"
            }}>
              {stats.totalProfit >= 0 ? <TrendUp /> : <TrendDown />}
              <span className="mono">{formatCurrency(stats.totalProfit)} total profit</span>
            </div>
          )}
        </div>

        {/* Stat Cards */}
        {entries.length > 0 && (
          <div className="grid-stats fade" style={{ marginBottom: "24px" }}>
            <div className="card">
              <div className="label">Revenue</div>
              <div className="mono" style={{ fontSize: "20px", fontWeight: "600" }}>{formatCurrency(stats.totalRevenue)}</div>
            </div>
            <div className="card">
              <div className="label">Ad Spend</div>
              <div className="mono" style={{ fontSize: "20px", fontWeight: "600", color: "#FF8C42" }}>{formatCurrency(stats.totalAdSpend)}</div>
            </div>
            <div className="card">
              <div className="label">Meta ROAS</div>
              <div className="mono" style={{
                fontSize: "20px", fontWeight: "600",
                color: stats.avgRoas >= 3 ? "#00E69D" : stats.avgRoas >= 2 ? "#FFB800" : "#FF4D6A"
              }}>{stats.avgRoas.toFixed(2)}x</div>
            </div>
            <div className="card">
              <div className="label">Days Tracked</div>
              <div className="mono" style={{ fontSize: "20px", fontWeight: "600" }}>{stats.days}</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{
          display: "flex", gap: "4px", marginBottom: "18px",
          borderBottom: "1px solid #1A1A28", paddingBottom: "12px",
          overflowX: "auto"
        }}>
          {[
            ["input", "＋ Log"],
            ["history", "History"],
            ["trends", "Trends"],
          ].map(([key, label]) => (
            <button key={key} className={`tab ${view === key ? "on" : ""}`} onClick={() => setView(key)}>
              {label}
            </button>
          ))}
          {entries.length > 0 && (
            <button className="btn-sm red" style={{ marginLeft: "auto", fontSize: "11px" }} onClick={handleClearAll}>
              Clear
            </button>
          )}
        </div>

        {/* ──────── INPUT ──────── */}
        {view === "input" && (
          <div className="fade">
            <div className="card" style={{ padding: "22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
                <span style={{ fontSize: "15px", fontWeight: "600" }}>Daily Entry</span>
              </div>

              <div className="grid-input">
                <div className="ig">
                  <label>Date</label>
                  <input type="date" value={newEntry.date} onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })} />
                </div>
                <div className="ig">
                  <label>Revenue</label>
                  <input type="number" inputMode="decimal" placeholder="0.00" step="0.01"
                    value={newEntry.revenue} onChange={(e) => setNewEntry({ ...newEntry, revenue: e.target.value })} />
                </div>
                <div className="ig">
                  <label>Meta Ad Spend</label>
                  <input type="number" inputMode="decimal" placeholder="0.00" step="0.01"
                    value={newEntry.adSpend} onChange={(e) => setNewEntry({ ...newEntry, adSpend: e.target.value })} />
                </div>
                <div className="ig">
                  <label>COGS</label>
                  <input type="number" inputMode="decimal" placeholder="0.00" step="0.01"
                    value={newEntry.cogs} onChange={(e) => setNewEntry({ ...newEntry, cogs: e.target.value })} />
                </div>
                <div className="ig">
                  <label>Shipping</label>
                  <input type="number" inputMode="decimal" placeholder="0.00" step="0.01"
                    value={newEntry.shipping} onChange={(e) => setNewEntry({ ...newEntry, shipping: e.target.value })} />
                </div>
                <div className="ig">
                  <label>Other Costs</label>
                  <input type="number" inputMode="decimal" placeholder="0.00" step="0.01"
                    value={newEntry.otherCosts} onChange={(e) => setNewEntry({ ...newEntry, otherCosts: e.target.value })} />
                </div>
              </div>

              {/* Live Preview */}
              {(newEntry.revenue || newEntry.adSpend) && (
                <div style={{
                  marginTop: "18px", padding: "16px",
                  background: "#0A0A0F", borderRadius: "10px", border: "1px solid #1E1E2E"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <span className="label">Live Profit</span>
                      <div className="mono" style={{ fontSize: "26px", fontWeight: "700", color: profitColor(calcProfit(newEntry).profit) }}>
                        {formatCurrency(calcProfit(newEntry).profit)}
                      </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div className="mono" style={{ fontSize: "20px", fontWeight: "600", color: marginColor(calcProfit(newEntry).margin) }}>
                        {formatPct(calcProfit(newEntry).margin)}
                      </div>
                      <span style={{ fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "1px" }}>margin</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="mono" style={{ fontSize: "20px", fontWeight: "600", color: "#88AAFF" }}>
                        {calcProfit(newEntry).roas.toFixed(2)}x
                      </div>
                      <span style={{ fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "1px" }}>ROAS</span>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginTop: "16px" }}>
                <button className="btn" onClick={handleAdd}>
                  <PlusIcon /> Log Entry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ──────── HISTORY ──────── */}
        {view === "history" && (
          <div className="fade">
            {entries.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#333" }}>
                <p style={{ fontSize: "16px", fontWeight: "500", color: "#444" }}>No entries yet</p>
                <p style={{ fontSize: "13px", marginTop: "4px" }}>Switch to Log to add your first day</p>
              </div>
            ) : (
              <>
                {availableMonths.length > 1 && (
                  <div style={{ display: "flex", gap: "4px", marginBottom: "14px", flexWrap: "wrap" }}>
                    <button className={`tab ${selectedMonth === "all" ? "on" : ""}`}
                      onClick={() => setSelectedMonth("all")} style={{ fontSize: "12px", padding: "4px 10px" }}>All</button>
                    {availableMonths.map((m) => (
                      <button key={m} className={`tab ${selectedMonth === m ? "on" : ""}`}
                        onClick={() => setSelectedMonth(m)} style={{ fontSize: "12px", padding: "4px 10px" }}>
                        {new Date(m + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </button>
                    ))}
                  </div>
                )}

                <div className="scroll-x">
                  <div className="h-head">
                    <span>Date</span>
                    <span>Revenue</span>
                    <span className="h-hide">Costs</span>
                    <span>Profit</span>
                    <span>Margin</span>
                    <span className="h-hide">ROAS</span>
                    <span></span>
                  </div>

                  {filteredEntries.map((entry) => {
                    const { profit, margin, roas, totalCosts } = calcProfit(entry);
                    if (editingId === entry.id) {
                      return (
                        <div key={entry.id} className="card" style={{ marginBottom: "6px", border: "1px solid #00E69D33", padding: "16px" }}>
                          <div className="grid-input" style={{ marginBottom: "12px" }}>
                            {[
                              ["Date", "date", "date"],
                              ["Revenue", "revenue", "number"],
                              ["Ad Spend", "adSpend", "number"],
                              ["COGS", "cogs", "number"],
                              ["Shipping", "shipping", "number"],
                              ["Other", "otherCosts", "number"],
                            ].map(([lbl, key, type]) => (
                              <div className="ig" key={key}>
                                <label>{lbl}</label>
                                <input type={type} value={editEntry[key]}
                                  onChange={(e) => setEditEntry({ ...editEntry, [key]: e.target.value })} />
                              </div>
                            ))}
                          </div>
                          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                            <button className="btn-sm" onClick={() => { setEditingId(null); setEditEntry(null); }}>Cancel</button>
                            <button className="btn" style={{ width: "auto", padding: "8px 16px", fontSize: "13px" }} onClick={handleSaveEdit}>Save</button>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={entry.id} className="h-row">
                        <span style={{ color: "#777" }}>{entry.date.slice(5)}</span>
                        <span>{formatCurrency(parseFloat(entry.revenue) || 0)}</span>
                        <span className="h-hide" style={{ color: "#FF8C42" }}>{formatCurrency(totalCosts)}</span>
                        <span style={{ color: profitColor(profit), fontWeight: "600" }}>{formatCurrency(profit)}</span>
                        <span style={{ color: marginColor(margin), fontWeight: "600" }}>{formatPct(margin)}</span>
                        <span className="h-hide" style={{ color: "#88AAFF" }}>{roas.toFixed(2)}x</span>
                        <div style={{ display: "flex", gap: "4px" }}>
                          <button className="btn-sm" onClick={() => handleEdit(entry)} style={{ padding: "4px 6px" }}><EditIcon /></button>
                          <button className="btn-sm red" onClick={() => handleDelete(entry.id)} style={{ padding: "4px 6px" }}><TrashIcon /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Period Summary */}
                <div className="card" style={{ marginTop: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <div className="label">Period Profit</div>
                      <div className="mono" style={{ fontSize: "18px", fontWeight: "700", color: profitColor(filteredStats.profit) }}>
                        {formatCurrency(filteredStats.profit)}
                      </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div className="label">Avg Margin</div>
                      <div className="mono" style={{ fontSize: "18px", fontWeight: "700", color: marginColor(filteredStats.margin) }}>
                        {formatPct(filteredStats.margin)}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="label">Entries</div>
                      <div className="mono" style={{ fontSize: "18px", fontWeight: "700" }}>{filteredEntries.length}</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ──────── TRENDS ──────── */}
        {view === "trends" && (
          <div className="fade">
            {chartData.length < 2 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#333" }}>
                <p style={{ fontSize: "16px", fontWeight: "500", color: "#444" }}>Need more data</p>
                <p style={{ fontSize: "13px", marginTop: "4px" }}>Log at least 2 days to see trends</p>
              </div>
            ) : (
              <>
                {[
                  { key: "profit", label: "Daily Profit", color: "#00E69D", fmt: (v) => `$${v}` },
                  { key: "margin", label: "Profit Margin %", color: "#FFB800", fmt: (v) => `${v}%` },
                  { key: "roas", label: "Meta ROAS", color: "#88AAFF", fmt: (v) => `${v}x` },
                ].map(({ key, label, color, fmt }) => (
                  <div key={key} style={{ marginBottom: "28px" }}>
                    <div className="label" style={{ marginBottom: "10px" }}>{label}</div>
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id={`g-${key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                            <stop offset="100%" stopColor={color} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1A1A28" />
                        <XAxis dataKey="date" stroke="#333" tick={{ fill: "#555", fontSize: 10, fontFamily: "JetBrains Mono" }} />
                        <YAxis stroke="#333" tick={{ fill: "#555", fontSize: 10, fontFamily: "JetBrains Mono" }} tickFormatter={fmt} />
                        <Tooltip
                          contentStyle={{ background: "#1A1A28", border: "1px solid #2A2A3A", borderRadius: "8px", fontFamily: "JetBrains Mono", fontSize: "12px", color: "#E8E8ED" }}
                          formatter={(v) => [key === "profit" ? formatCurrency(v) : key === "margin" ? formatPct(v) : `${v.toFixed(2)}x`, label]}
                        />
                        <Area type="monotone" dataKey={key} stroke={color} fill={`url(#g-${key})`} strokeWidth={2} dot={{ fill: color, r: 3 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        <div style={{ marginTop: "40px", textAlign: "center", fontSize: "10px", color: "#222", fontFamily: "'JetBrains Mono', monospace" }}>
          Emperor P&L · Built for profit, not vanity metrics
        </div>
      </div>
    </>
  );
}
