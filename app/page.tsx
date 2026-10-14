"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Info,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { PreventionChecklist } from "./components/prevention-checklist";
import { RiskReportForm } from "./components/risk-report-form";
import type { RiskReport, RiskStatus } from "./types";

const STORAGE_KEY = "dengueguard-lk:reports:v1";

const SAMPLE_REPORTS: RiskReport[] = [
  {
    id: "sample-1",
    location: "Kirulapone",
    district: "Colombo",
    category: "Blocked drain",
    severity: "High",
    description: "Drain beside the bus stop has held stagnant water for several days.",
    status: "Pending",
    createdAt: "2026-10-12T08:30:00.000Z",
    isSample: true,
  },
  {
    id: "sample-2",
    location: "Nugegoda",
    district: "Colombo",
    category: "Discarded containers",
    severity: "Medium",
    description: "Open containers behind a row of shops collect rainwater.",
    status: "Clean-up planned",
    createdAt: "2026-10-11T11:20:00.000Z",
    isSample: true,
  },
  {
    id: "sample-3",
    location: "Kadawatha",
    district: "Gampaha",
    category: "Standing water",
    severity: "High",
    description: "Water remains in an uncovered construction pit after rainfall.",
    status: "Pending",
    createdAt: "2026-10-10T05:45:00.000Z",
    isSample: true,
  },
  {
    id: "sample-4",
    location: "Katugastota",
    district: "Kandy",
    category: "Waste accumulation",
    severity: "Low",
    description: "Mixed waste near a lane included bottles that could retain water.",
    status: "Resolved",
    createdAt: "2026-10-09T14:10:00.000Z",
    isSample: true,
  },
];

const statusOrder: RiskStatus[] = ["Pending", "Clean-up planned", "Resolved"];

function readSavedReports(): RiskReport[] {
  if (typeof window === "undefined") return SAMPLE_REPORTS;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return SAMPLE_REPORTS;
    const parsed = JSON.parse(stored) as unknown;
    return Array.isArray(parsed) ? (parsed as RiskReport[]) : SAMPLE_REPORTS;
  } catch {
    return SAMPLE_REPORTS;
  }
}

export default function Home() {
  const [reports, setReports] = useState<RiskReport[]>(SAMPLE_REPORTS);
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("All districts");
  const [status, setStatus] = useState("All statuses");
  const [menuOpen, setMenuOpen] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    setReports(readSavedReports());
  }, []);

  const districts = useMemo(
    () => ["All districts", ...Array.from(new Set(reports.map((report) => report.district))).sort()],
    [reports],
  );

  const filteredReports = useMemo(() => {
    const term = search.trim().toLowerCase();
    return reports.filter((report) => {
      const matchesTerm =
        !term ||
        report.location.toLowerCase().includes(term) ||
        report.category.toLowerCase().includes(term) ||
        report.description.toLowerCase().includes(term);
      const matchesDistrict = district === "All districts" || report.district === district;
      const matchesStatus = status === "All statuses" || report.status === status;
      return matchesTerm && matchesDistrict && matchesStatus;
    });
  }, [district, reports, search, status]);

  const pendingCount = reports.filter((report) => report.status !== "Resolved").length;
  const highRiskCount = reports.filter(
    (report) => report.severity === "High" && report.status !== "Resolved",
  ).length;

  function persistReports(nextReports: RiskReport[]) {
    setReports(nextReports);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextReports));
  }

  function addReport(report: RiskReport) {
    persistReports([report, ...reports]);
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 3500);
  }

  function advanceStatus(reportId: string) {
    const nextReports = reports.map((report) => {
      if (report.id !== reportId) return report;
      const currentIndex = statusOrder.indexOf(report.status);
      return { ...report, status: statusOrder[(currentIndex + 1) % statusOrder.length] };
    });
    persistReports(nextReports);
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="DengueGuard LK home">
          <span className="brand-mark" aria-hidden="true">
            <ShieldCheck size={22} strokeWidth={2.25} />
          </span>
          <span>DengueGuard <strong>LK</strong></span>
        </a>
        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav className={menuOpen ? "nav-links is-open" : "nav-links"} aria-label="Main navigation">
          <a href="#problem" onClick={() => setMenuOpen(false)}>The problem</a>
          <a href="#report" onClick={() => setMenuOpen(false)}>Report risk</a>
          <a href="#dashboard" onClick={() => setMenuOpen(false)}>Dashboard</a>
          <a href="#prevention" onClick={() => setMenuOpen(false)}>Prevention</a>
        </nav>
      </header>

      <section className="hero section" id="home">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={15} /> Built for Sri Lankan communities</p>
          <h1>Find mosquito risks.<br /><span>Act before they spread.</span></h1>
          <p className="hero-lead">
            A simple community tool to identify possible dengue breeding places, organise clean-up action,
            and build safer everyday habits.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#report">Report a risk <ArrowRight size={18} /></a>
            <a className="button button-quiet" href="#dashboard">Explore demo reports</a>
          </div>
          <p className="prototype-note"><Info size={15} /> Educational prototype - not an official reporting channel.</p>
        </div>
        <div className="hero-visual" aria-label="Dengue risk overview">
          <div className="visual-grid" aria-hidden="true" />
          <div className="map-card">
            <div className="map-card-top">
              <span>Community risk pulse</span>
              <span className="live-dot">Demo data</span>
            </div>
            <div className="risk-orbit" aria-hidden="true">
              <span className="orbit orbit-one" />
              <span className="orbit orbit-two" />
              <span className="location-pin pin-one"><MapPin size={20} /></span>
              <span className="location-pin pin-two"><MapPin size={18} /></span>
              <span className="location-pin pin-three"><MapPin size={18} /></span>
              <span className="shield-center"><ShieldCheck size={44} /></span>
            </div>
            <div className="mini-stats">
              <div><strong>{reports.length}</strong><span>Total reports</span></div>
              <div><strong>{pendingCount}</strong><span>Need action</span></div>
              <div><strong>{highRiskCount}</strong><span>High priority</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="problem-section section" id="problem">
        <div className="section-heading narrow-heading">
          <p className="eyebrow">Why it matters</p>
          <h2>Dengue remains a shared local challenge</h2>
          <p>
            Dengue is endemic across Sri Lanka, and reducing breeding places depends on timely awareness,
            environmental management, and community participation.
          </p>
        </div>
        <div className="problem-grid">
          <article className="problem-story">
            <span className="story-number">01</span>
            <h3>Small hazards are easy to miss</h3>
            <p>Blocked drains, open containers, and construction sites can retain water close to where people live and work.</p>
          </article>
          <article className="problem-story accent-story">
            <span className="story-number">02</span>
            <h3>Shared visibility helps action</h3>
            <p>A lightweight tracker turns observations into a clear list that communities can search, prioritise, and resolve.</p>
          </article>
          <article className="problem-story">
            <span className="story-number">03</span>
            <h3>Prevention starts at home</h3>
            <p>A repeatable checklist makes weekly inspection easier and gives households an immediate safety score.</p>
          </article>
        </div>
        <p className="source-line">
          Context source: <a href="https://www.dengue.health.gov.lk/sri-lanka-situation/" target="_blank" rel="noreferrer">National Dengue Control Unit, Sri Lanka</a>
        </p>
      </section>

      <section className="report-section section" id="report">
        <div className="section-heading split-heading">
          <div><p className="eyebrow">Feature 01</p><h2>Log a possible breeding risk</h2></div>
          <p>Capture only what is useful. Reports stay in this browser and can be updated from the dashboard.</p>
        </div>
        <RiskReportForm onAddReport={addReport} />
      </section>

      <section className="dashboard-section section" id="dashboard">
        <div className="section-heading split-heading">
          <div><p className="eyebrow">Feature 02</p><h2>Prioritise community action</h2></div>
          <p>Search, filter, and update reports so high-priority locations remain visible until they are resolved.</p>
        </div>

        <div className="summary-row">
          <div className="summary-card"><span className="summary-icon red"><MapPin size={20} /></span><div><strong>{reports.length}</strong><span>Reports tracked</span></div></div>
          <div className="summary-card"><span className="summary-icon amber"><BarChart3 size={20} /></span><div><strong>{highRiskCount}</strong><span>High priority</span></div></div>
          <div className="summary-card"><span className="summary-icon green"><CheckCircle2 size={20} /></span><div><strong>{reports.filter((report) => report.status === "Resolved").length}</strong><span>Resolved</span></div></div>
        </div>

        <div className="filter-bar">
          <label className="search-field">
            <span className="sr-only">Search reports</span>
            <Search size={18} aria-hidden="true" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search location or risk type" />
          </label>
          <label>
            <span className="sr-only">Filter by district</span>
            <select value={district} onChange={(event) => setDistrict(event.target.value)}>
              {districts.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            <span className="sr-only">Filter by status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option>All statuses</option>
              {statusOrder.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>

        <div className="report-list" aria-live="polite">
          {filteredReports.length === 0 ? (
            <div className="empty-state"><Search size={30} /><h3>No matching reports</h3><p>Try clearing a filter or searching for another location.</p></div>
          ) : filteredReports.map((report) => (
            <article className="report-card" key={report.id}>
              <div className={`severity-rail ${report.severity.toLowerCase()}`} />
              <div className="report-main">
                <div className="report-title-row">
                  <div>
                    <span className="report-location"><MapPin size={16} /> {report.location}, {report.district}</span>
                    <h3>{report.category}</h3>
                  </div>
                  <span className={`severity-badge ${report.severity.toLowerCase()}`}>{report.severity} risk</span>
                </div>
                <p>{report.description}</p>
                <div className="report-meta">
                  <span>{new Intl.DateTimeFormat("en-LK", { day: "numeric", month: "short", year: "numeric" }).format(new Date(report.createdAt))}</span>
                  {report.isSample ? <span className="sample-tag">Sample data</span> : <span className="sample-tag user-tag">Your report</span>}
                </div>
              </div>
              <div className="report-action">
                <span className={`status-pill ${report.status.toLowerCase().replaceAll(" ", "-")}`}>{report.status}</span>
                <button type="button" onClick={() => advanceStatus(report.id)}>Update status <ArrowRight size={15} /></button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="prevention-section section" id="prevention">
        <div className="section-heading split-heading light-heading">
          <div><p className="eyebrow">Feature 03</p><h2>Your five-minute weekly check</h2></div>
          <p>Tick each completed action to calculate a household prevention score and reveal the next best step.</p>
        </div>
        <PreventionChecklist />
      </section>

      <section className="impact-section section">
        <div className="impact-card">
          <div className="impact-icon"><ClipboardCheck size={30} /></div>
          <div><p className="eyebrow">Prototype impact</p><h2>From "someone should fix that" to a visible next action.</h2></div>
          <a className="button button-light" href="#report">Add a report <ArrowRight size={18} /></a>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#home"><span className="brand-mark"><ShieldCheck size={20} /></span>DengueGuard <strong>LK</strong></a>
        <p>SE3090 Mini Hackathon · Individual make-up submission · 2026</p>
        <p className="footer-note">Demo reports are illustrative. For official guidance, visit the National Dengue Control Unit.</p>
      </footer>

      {savedNotice ? (
        <div className="toast" role="status"><CheckCircle2 size={19} /><span><strong>Report saved.</strong> It is now visible in the dashboard.</span></div>
      ) : null}
    </main>
  );
}
