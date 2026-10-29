'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AcademicBranch, AcquisitionChannel, DashboardStats, Registration } from '@/types';
import GrowthCopilot from '@/components/GrowthCopilot';

type DashboardTab = 'overview' | 'registrations' | 'referrals' | 'ambassadors' | 'budget' | 'settings';

export default function OrganizerDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [includeDemo, setIncludeDemo] = useState(false);
  const [excludeTest, setExcludeTest] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBranch, setFilterBranch] = useState<string>('ALL');
  const [filterChannel, setFilterChannel] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [blitzModalOpen, setBlitzModalOpen] = useState(false);
  const [blitzSuccessNotice, setBlitzSuccessNotice] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [resettingTest, setResettingTest] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchStats = async (demo: boolean, noTest: boolean) => {
    try {
      const res = await fetch(`/api/stats?demo=${demo}&excludeTest=${noTest}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(includeDemo, excludeTest);
  }, [includeDemo, excludeTest]);

  const handleToggleDemoMode = () => {
    const nextMode = !includeDemo;
    setIncludeDemo(nextMode);
    fetchStats(nextMode, excludeTest);
  };

  const handleToggleExcludeTest = () => {
    const nextExclude = !excludeTest;
    setExcludeTest(nextExclude);
    fetchStats(includeDemo, nextExclude);
  };

  const handleExportCsv = () => {
    window.location.href = `/api/export-csv?demo=${includeDemo}&excludeTest=${excludeTest}`;
  };

  const handleTriggerBlitz = () => {
    setBlitzModalOpen(false);
    setBlitzSuccessNotice(true);
    setTimeout(() => setBlitzSuccessNotice(false), 4000);
  };

  const handleCopyLink = (code: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://campusgrowth.nxtwave.io';
    const link = `${origin}/?ref=${code}`;
    navigator.clipboard.writeText(link);
    showToast(`Copied referral link: ${link}`);
  };

  const handleResetTestRegistrations = async () => {
    if (!confirm('Safely remove detected test records? All genuine student registrations will remain preserved.')) {
      return;
    }
    setResettingTest(true);
    try {
      const res = await fetch('/api/test-data/reset', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || 'Test records purged successfully.');
        fetchStats(includeDemo, excludeTest);
      } else {
        showToast(data.error || 'Failed to reset test records.');
      }
    } catch (err) {
      console.error('Reset test records error:', err);
      showToast('Network error while resetting test records.');
    } finally {
      setResettingTest(false);
    }
  };

  // Filter registrations for tables
  const registrationsList = stats?.recentRegistrations || [];
  const filteredRegistrations = registrationsList.filter((r) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        r.name.toLowerCase().includes(q) ||
        r.college.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.branchLabel && r.branchLabel.toLowerCase().includes(q)) ||
        r.projectTitle.toLowerCase().includes(q) ||
        r.ticketNumber.toLowerCase().includes(q);
      if (!matchSearch) return false;
    }

    if (filterBranch !== 'ALL' && r.branch !== filterBranch) {
      return false;
    }

    if (filterChannel !== 'ALL' && r.channel !== filterChannel) {
      return false;
    }

    if (filterType === 'GENUINE' && (r.isDemo || r.isTest)) {
      return false;
    }
    if (filterType === 'TEST' && !r.isTest) {
      return false;
    }
    if (filterType === 'DEMO' && !r.isDemo) {
      return false;
    }

    return true;
  });

  // Calculate velocity totals dynamically from actual data
  const velocityData = stats?.velocity || [];
  const velocityDirectTotal = velocityData.reduce((acc, v) => acc + v.directRegs, 0);
  const velocityReferralTotal = velocityData.reduce((acc, v) => acc + v.referralRegs, 0);
  const maxVelocityBar = Math.max(1, ...velocityData.map((v) => Math.max(v.directRegs, v.referralRegs)));

  return (
    <div className="bg-background min-h-screen font-body-md text-on-surface antialiased flex">
      {/* LEFT FIXED SIDEBAR */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-surface-container-high/80 z-50 flex flex-col pt-space-lg pb-space-lg hidden md:flex">
        {/* Brand */}
        <div className="px-space-lg mb-space-lg flex items-center gap-space-sm">
          <Link href="/" className="flex items-center gap-2">
            <img
              alt="Campus Growth Engine Logo"
              className="h-7 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9AfHNEPzs5GRVdSuvZpRdxWCo5NP3dXDxCydhH_q2yRgj-EnmWhqnJr9piP1ECr_p1MBAwi1OU9-ETMH7iFz8Bpgy1Jjr57l6Mb60-sVBlmE0VmRUMaZu9qPUMH0i3x2Gpf5SoU2pmrQKjqSmX4DJz0DsK48Wy7W-3vW1cvmg5L8in2m63amOADaPOWUhoGFr9jMvwc4nYgEtOnFUusxF_60CTJ_xRjOmtU0Eez5g"
            />
            <span className="font-label-md text-label-md font-bold text-on-surface tracking-tight">
              Campus Console
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-space-md flex flex-col gap-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-space-sm px-3 py-2 text-left transition-colors font-semibold rounded-lg ${
              activeTab === 'overview'
                ? 'bg-primary-container text-on-primary-container'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">analytics</span>
            <span>Organizer Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('registrations')}
            className={`flex items-center gap-space-sm px-3 py-2 text-left rounded-lg transition-colors font-label-md text-label-md ${
              activeTab === 'registrations'
                ? 'bg-primary-container text-on-primary-container font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
            <span>Registrations ({stats?.uniqueRegistrations || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('referrals')}
            className={`flex items-center gap-space-sm px-3 py-2 text-left rounded-lg transition-colors font-label-md text-label-md ${
              activeTab === 'referrals'
                ? 'bg-primary-container text-on-primary-container font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">monitoring</span>
            <span>Referral Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('ambassadors')}
            className={`flex items-center gap-space-sm px-3 py-2 text-left rounded-lg transition-colors font-label-md text-label-md ${
              activeTab === 'ambassadors'
                ? 'bg-primary-container text-on-primary-container font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">groups</span>
            <span>Cohort Ambassadors</span>
          </button>

          <button
            onClick={() => setActiveTab('budget')}
            className={`flex items-center gap-space-sm px-3 py-2 text-left rounded-lg transition-colors font-label-md text-label-md ${
              activeTab === 'budget'
                ? 'bg-primary-container text-on-primary-container font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
            <span>Campaign Budget</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-space-sm px-3 py-2 text-left rounded-lg transition-colors font-label-md text-label-md ${
              activeTab === 'settings'
                ? 'bg-primary-container text-on-primary-container font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span>Settings</span>
          </button>

          <div className="pt-4 mt-2 border-t border-surface-container-high">
            <span className="px-3 text-badge-caption text-on-surface-variant uppercase font-bold tracking-wider">
              Student Screens
            </span>
            <div className="flex flex-col gap-1 mt-1">
              <Link
                href="/"
                className="flex items-center gap-space-sm px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors font-label-md text-label-md"
              >
                <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                <span>Project Matcher</span>
              </Link>

              <Link
                href="/blueprint"
                className="flex items-center gap-space-sm px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors font-label-md text-label-md"
              >
                <span className="material-symbols-outlined text-[20px]">architecture</span>
                <span>Student Blueprint</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* User Card */}
        <div className="px-space-lg pt-space-md border-t border-surface-container-high">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm font-semibold text-on-surface truncate">
                Ambassador Lead
              </span>
              <span className="font-badge-caption text-badge-caption text-on-surface-variant truncate">
                campus@nxtwave.tech
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONSOLE AREA */}
      <div className="flex-1 md:pl-64 w-full">
        {/* TOP HEADER */}
        <header className="fixed top-0 left-0 md:left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md border-b border-surface-container-high/80 z-40 px-gutter flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-badge-caption text-badge-caption uppercase font-bold tracking-wider">
              Live Cohort Ops
            </span>
            <span className="hidden sm:inline-flex text-label-sm text-on-surface-variant">
              • Challenge Goal: 500 Unique Registrations
            </span>
          </div>

          <div className="flex items-center gap-space-md">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[16px] text-primary">alarm</span>
              <span>Session: Sat, 6:00 PM IST (60 Mins)</span>
            </div>

            <Link
              href="/"
              className="hidden lg:inline-flex font-label-md text-label-md text-primary font-bold hover:underline"
            >
              Test Matcher &rarr;
            </Link>

            <a
              className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
              href="https://nxtwave.tech"
              target="_blank"
              rel="noopener noreferrer"
            >
              NxtWave Community
            </a>

            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </header>

        {/* MAIN BODY */}
        <main className="relative pt-16 bg-surface w-full min-h-[calc(100vh-4rem)]">
          <div className="flex flex-col w-full">
            {/* DEMO DATA NOTIFICATION SCRIM BANNER (WITH REAL-TIME TOGGLE) */}
            <div className="w-full bg-secondary-container/30 border-b border-secondary-container/40 px-gutter py-2.5 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-secondary text-[18px]">
                  {includeDemo ? 'info' : 'verified'}
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                  {includeDemo ? (
                    <>
                      <span className="font-semibold text-secondary">Demo Data Active (Simulated):</span> Visualized records and referral metrics include baseline illustrative figures for campaign simulation.
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-primary">Live Genuine Mode:</span> Showing strictly genuine verified student registrations recorded in the database ({stats?.uniqueRegistrations || 0} active records).
                      {stats?.testRegistrationsCount && stats.testRegistrationsCount > 0 ? (
                        <span className="ml-2 font-normal text-amber-700">
                          ({stats.testRegistrationsCount} test records {excludeTest ? 'excluded' : 'identified'})
                        </span>
                      ) : null}
                    </>
                  )}
                </p>
              </div>

              {/* Action buttons on scrim */}
              <div className="flex items-center gap-2">
                {!includeDemo && stats?.testRegistrationsCount && stats.testRegistrationsCount > 0 ? (
                  <button
                    onClick={handleToggleExcludeTest}
                    className="flex items-center gap-1 bg-surface-container-lowest px-2.5 py-1 rounded-md text-label-sm font-semibold shadow-sm border border-surface-container-high/60 transition-all text-on-surface-variant hover:text-on-surface cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-amber-600">filter_alt</span>
                    <span>{excludeTest ? 'Include Test Records' : 'Exclude Test Records'}</span>
                  </button>
                ) : null}

                <button
                  onClick={handleToggleDemoMode}
                  className="flex items-center gap-space-xs text-on-surface-variant hover:text-on-surface cursor-pointer bg-surface-container-lowest px-2.5 py-1 rounded-md text-label-sm font-semibold shadow-sm border border-surface-container-high/60 transition-all"
                  title="Toggle between Simulated Demo data and Live Genuine registrations"
                >
                  <span className="font-label-sm text-label-sm">
                    {includeDemo ? 'Switch to Genuine Only' : 'Switch to Demo Baseline'}
                  </span>
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                </button>
              </div>
            </div>

            {/* Notification alert on blitz dispatch */}
            {blitzSuccessNotice && (
              <div className="mx-gutter mt-3 p-3 rounded-lg bg-primary/10 border border-primary/30 text-on-surface flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">send</span>
                  <span className="font-label-md text-label-md font-semibold text-primary">
                    Campaign Blitz notification dispatched to all campus ambassadors via WhatsApp!
                  </span>
                </div>
                <button onClick={() => setBlitzSuccessNotice(false)} className="text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            )}

            {/* General Toast notification */}
            {toastMessage && (
              <div className="mx-gutter mt-3 p-3 rounded-lg bg-surface-container-lowest border border-primary/40 text-on-surface shadow-md flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                  <span className="font-label-md text-label-md font-semibold text-on-surface">
                    {toastMessage}
                  </span>
                </div>
                <button onClick={() => setToastMessage(null)} className="text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            )}

            <div className="p-gutter flex flex-col gap-space-lg max-w-[1440px] mx-auto w-full">
              {/* BREADCRUMB & TOP BAR OPERATIONS */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                    <Link href="/" className="hover:text-primary transition-colors cursor-pointer">
                      Campus Growth Engine
                    </Link>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="hover:text-primary transition-colors cursor-pointer">Campaigns</span>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="text-on-surface font-semibold">AI in 60 Mins (Oct Cohort)</span>
                  </div>

                  <div className="flex items-center gap-space-sm">
                    <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">
                      Campaign Operations Console
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-badge-caption text-badge-caption uppercase font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      Live Sprint
                    </span>
                  </div>
                </div>

                {/* Action Cluster */}
                <div className="flex items-center flex-wrap gap-space-sm">
                  <div className="flex items-center bg-surface-container-lowest shadow-sm rounded-lg px-3 py-2 gap-2 text-on-surface-variant border border-surface-container-high/60">
                    <span className="material-symbols-outlined text-[18px] text-primary">calendar_today</span>
                    <span className="font-label-sm text-label-sm font-semibold text-on-surface">
                      Last 7 Days (Oct 18 - Oct 25)
                    </span>
                  </div>

                  <button
                    onClick={handleExportCsv}
                    className="flex items-center gap-1.5 bg-surface-container-lowest hover:bg-surface-container-low transition-colors shadow-sm px-3.5 py-2 rounded-lg font-label-md text-label-md text-on-surface font-semibold border border-surface-container-high/60 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">download</span>
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={() => setBlitzModalOpen(true)}
                    className="flex items-center gap-1.5 bg-primary hover:bg-primary-container text-on-primary transition-colors shadow-sm px-4 py-2 rounded-lg font-label-md text-label-md font-semibold cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px]">add_circle</span>
                    <span>Create Campaign Blitz</span>
                  </button>
                </div>
              </div>

              {/* SECONDARY TAB NAVIGATION */}
              <div className="flex items-center gap-space-md border-b-2 border-surface-container-high/40 pb-px overflow-x-auto">
                {[
                  { id: 'overview' as DashboardTab, label: 'Overview & Trajectory', icon: 'overview' },
                  { id: 'registrations' as DashboardTab, label: `Registrations (${stats?.uniqueRegistrations || 0})`, icon: 'how_to_reg' },
                  { id: 'referrals' as DashboardTab, label: 'Referral Analytics', icon: 'share' },
                  { id: 'ambassadors' as DashboardTab, label: `Ambassadors (${stats?.ambassadors.length || 14})`, icon: 'badge' },
                  { id: 'budget' as DashboardTab, label: 'Campaign Budget', icon: 'account_balance_wallet' },
                  { id: 'settings' as DashboardTab, label: 'Settings', icon: 'settings' },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`pb-2.5 px-1 font-label-md text-label-md flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                        isActive
                          ? 'font-bold text-primary border-b-2 border-primary'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB CONTENT PANELS */}

              {/* ----------------------------------------------------------- */}
              {/* PANEL 1: OVERVIEW & TRAJECTORY */}
              {/* ----------------------------------------------------------- */}
              {activeTab === 'overview' && (
                <div className="flex flex-col gap-space-lg">
                  {/* KPI METRIC CARDS (5 COLUMNS) - WITH OVERFLOW & TRUNCATION GUARDS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
                    {/* Card 1: Unique Registrations */}
                    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-surface-container-high/60 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-badge-caption text-badge-caption text-on-surface-variant uppercase font-bold tracking-wider truncate">
                          Unique Regs
                        </span>
                        <span className="material-symbols-outlined text-primary text-[20px] shrink-0">group_add</span>
                      </div>
                      <div className="flex items-baseline gap-2 min-w-0">
                        <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                          {stats?.uniqueRegistrations ?? 0}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
                          / {stats?.target || 500} Target
                        </span>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-badge-caption text-badge-caption text-primary font-bold truncate">
                            {stats?.percentageAchieved || 0}% Achieved
                          </span>
                          <span className="font-badge-caption text-badge-caption text-on-surface-variant shrink-0">
                            {includeDemo ? '(Demo)' : '(Genuine)'}
                          </span>
                        </div>
                        <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, stats?.percentageAchieved || 0)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Regs Today */}
                    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative group hover:shadow-md transition-shadow border border-surface-container-high/60 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-badge-caption text-badge-caption text-on-surface-variant uppercase font-bold tracking-wider truncate">
                          Regs Today
                        </span>
                        <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">today</span>
                      </div>
                      <div className="flex items-baseline gap-2 min-w-0">
                        <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                          {stats?.regsToday ?? 0}
                        </span>
                        <span
                          className="font-label-sm text-label-sm text-primary font-semibold flex items-center min-w-0 truncate"
                          title={stats?.regsTodayGrowth || '+18%'}
                        >
                          <span className="material-symbols-outlined text-[16px] shrink-0">trending_up</span>
                          <span className="truncate">{stats?.regsTodayGrowth || '+18%'}</span>
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-on-surface-variant min-w-0">
                        <span className="font-body-sm text-body-sm truncate">
                          {includeDemo ? 'vs 41 yesterday' : `${stats?.regsToday || 0} in last 24h`}
                        </span>
                        <span className="font-badge-caption text-badge-caption text-on-surface-variant shrink-0">
                          {includeDemo ? '(Demo)' : '(Live)'}
                        </span>
                      </div>
                    </div>

                    {/* Card 3: Days Remaining */}
                    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative group hover:shadow-md transition-shadow border border-surface-container-high/60 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-badge-caption text-badge-caption text-on-surface-variant uppercase font-bold tracking-wider truncate">
                          Remaining
                        </span>
                        <span className="material-symbols-outlined text-outline text-[20px] shrink-0">timer</span>
                      </div>
                      <div className="flex items-baseline gap-2 min-w-0">
                        <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                          {stats?.regsRemaining ?? 500}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant truncate">to go</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-on-surface-variant">
                        <span className="font-body-sm text-body-sm truncate">5 days remaining</span>
                        <span className="font-badge-caption text-badge-caption text-on-surface-variant shrink-0">
                          Sat 6 PM IST
                        </span>
                      </div>
                    </div>

                    {/* Card 4: Campaign Budget */}
                    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative group hover:shadow-md transition-shadow border border-surface-container-high/60 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-badge-caption text-badge-caption text-on-surface-variant uppercase font-bold tracking-wider truncate">
                          Budget Spent
                        </span>
                        <span className="material-symbols-outlined text-primary text-[20px] shrink-0">payments</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-1.5 min-w-0">
                          <span className="font-headline-lg text-headline-lg font-bold text-on-surface truncate">
                            {typeof stats?.budgetSpent === 'number'
                              ? `₹${stats.budgetSpent.toLocaleString('en-IN')}`
                              : stats?.budgetSpent || 'Spend unrecorded'}
                          </span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0">/ ₹2,000</span>
                        </div>
                        <p
                          className="font-body-sm text-body-sm text-primary font-semibold mt-0.5 truncate"
                          title={String(stats?.costPerRegistration || 'Spend unrecorded')}
                        >
                          {stats?.costPerRegistration || 'Spend unrecorded'}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center justify-between min-w-0">
                        <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                          {typeof stats?.budgetBurnPercentage === 'number'
                            ? `${stats.budgetBurnPercentage}% burn`
                            : stats?.budgetBurnPercentage || '0% burn'}
                        </span>
                        <span className="font-badge-caption text-badge-caption text-on-surface-variant shrink-0">
                          {includeDemo ? '(Demo)' : '(Genuine)'}
                        </span>
                      </div>
                    </div>

                    {/* Card 5: Referral Rate */}
                    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative group hover:shadow-md transition-shadow border border-surface-container-high/60 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-badge-caption text-badge-caption text-on-surface-variant uppercase font-bold tracking-wider truncate">
                          Referral Rate
                        </span>
                        <span className="material-symbols-outlined text-primary text-[20px] shrink-0">hub</span>
                      </div>
                      <div className="min-w-0">
                        <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                          {typeof stats?.referralRate === 'number' ? `${stats.referralRate}%` : stats?.referralRate || '0%'}
                        </span>
                        <p className="font-body-sm text-body-sm text-on-surface-variant font-medium truncate">
                          {stats?.viralLinksCount || 0} student viral links
                        </p>
                      </div>
                      <div className="mt-3 flex items-center justify-between min-w-0">
                        <span
                          className="px-2 py-0.5 rounded bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm font-semibold truncate"
                          title={stats?.viralKFactor || 'Not enough data'}
                        >
                          {stats?.viralKFactor || 'Not enough data'}
                        </span>
                        <span className="font-badge-caption text-badge-caption text-on-surface-variant shrink-0">
                          {includeDemo ? '(Demo)' : '(Genuine)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CAMPUS GROWTH COPILOT — DATA-DRIVEN NEXT-BEST-ACTION ENGINE */}
                  {stats && (
                    <GrowthCopilot
                      stats={stats}
                      isDemoMode={includeDemo}
                      onOpenBlitz={() => setBlitzModalOpen(true)}
                      onNotify={showToast}
                    />
                  )}

                  {/* ANALYTICS & BREAKDOWN SECTION (2-COLUMN GRID) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
                    {/* Left Chart: 7-Day Trend (7 Cols) - DYNAMIC VELOCITY SVG */}
                    <div className="lg:col-span-7 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-surface-container-high/60">
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <div className="flex flex-col">
                          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                            Registration Velocity (Last 7 Days)
                          </h2>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            Daily direct enrollment vs. student referral link conversions
                          </span>
                        </div>
                        <div className="flex items-center gap-space-md">
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-primary"></span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                              Direct ({velocityDirectTotal})
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-secondary-container"></span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                              Referrals ({velocityReferralTotal})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* DYNAMIC SVG CHART DERIVED ENTIRELY FROM STATS.VELOCITY */}
                      <div className="w-full h-64 flex flex-col justify-end pt-4">
                        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 600 200">
                          {/* Grid Lines */}
                          <line stroke="#E2E8F0" strokeDasharray="3 3" x1="0" x2="600" y1="40" y2="40"></line>
                          <line stroke="#E2E8F0" strokeDasharray="3 3" x1="0" x2="600" y1="90" y2="90"></line>
                          <line stroke="#E2E8F0" strokeDasharray="3 3" x1="0" x2="600" y1="140" y2="140"></line>
                          <line stroke="#CBD5E1" x1="0" x2="600" y1="180" y2="180"></line>

                          {/* Dynamic Bars for each of 7 days */}
                          {velocityData.map((v, i) => {
                            const xBase = 35 + i * 80;
                            const directHeight = Math.max(
                              v.directRegs > 0 ? 6 : 0,
                              Math.round((v.directRegs / maxVelocityBar) * 110)
                            );
                            const directY = 180 - directHeight;

                            const referralHeight = Math.max(
                              v.referralRegs > 0 ? 6 : 0,
                              Math.round((v.referralRegs / maxVelocityBar) * 110)
                            );
                            const referralY = 180 - referralHeight;

                            return (
                              <g key={v.dayNumber}>
                                {/* Direct Bar */}
                                <rect
                                  fill="#006948"
                                  height={directHeight}
                                  rx="3"
                                  width="22"
                                  x={xBase}
                                  y={directY}
                                >
                                  <title>{`Day ${v.dayNumber} Direct: ${v.directRegs}`}</title>
                                </rect>

                                {/* Referral Bar */}
                                <rect
                                  fill="#86f2e4"
                                  height={referralHeight}
                                  rx="3"
                                  width="22"
                                  x={xBase + 26}
                                  y={referralY}
                                >
                                  <title>{`Day ${v.dayNumber} Referral: ${v.referralRegs}`}</title>
                                </rect>
                              </g>
                            );
                          })}

                          {/* Trend Polyline connecting day midpoints */}
                          {velocityData.length > 0 && (
                            <>
                              <polyline
                                fill="none"
                                points={velocityData
                                  .map((v, i) => {
                                    const cx = 35 + i * 80 + 24;
                                    const sum = v.directRegs + v.referralRegs;
                                    const y = 180 - Math.min(140, Math.round((sum / (maxVelocityBar * 1.5)) * 120));
                                    return `${cx},${Math.max(30, y)}`;
                                  })
                                  .join(' ')}
                                stroke="#006a61"
                                strokeLinecap="round"
                                strokeWidth="2.5"
                              ></polyline>
                              {velocityData.length >= 7 && (
                                <circle
                                  cx={35 + 6 * 80 + 24}
                                  cy={Math.max(
                                    30,
                                    180 -
                                      Math.min(
                                        140,
                                        Math.round(
                                          ((velocityData[6].directRegs + velocityData[6].referralRegs) /
                                            (maxVelocityBar * 1.5)) *
                                            120
                                        )
                                      )
                                  )}
                                  fill="#006a61"
                                  r="4"
                                ></circle>
                              )}
                            </>
                          )}
                        </svg>

                        <div className="flex justify-between items-center text-on-surface-variant font-label-sm text-label-sm pt-2">
                          {velocityData.map((v, i) => (
                            <span
                              key={v.dayNumber}
                              className={`w-20 text-center truncate ${
                                i === velocityData.length - 1 ? 'font-bold text-on-surface' : ''
                              }`}
                            >
                              {v.dateLabel}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Breakdown: Acquisition Sources (5 Cols) */}
                    <div className="lg:col-span-5 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-surface-container-high/60">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                            Acquisition Sources
                          </h2>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            Channel volume &amp; conversion effectiveness
                          </span>
                        </div>
                        <span className="font-badge-caption text-badge-caption bg-surface-container text-on-surface-variant px-2 py-0.5 rounded uppercase font-bold">
                          {includeDemo ? '(Demo Data)' : '(Live)'}
                        </span>
                      </div>

                      <div className="flex flex-col gap-space-md my-auto pt-2">
                        {stats?.channels.map((ch) => (
                          <div key={ch.id} className="flex flex-col gap-1">
                            <div className="flex items-center justify-between font-label-md text-label-md">
                              <span className="font-bold text-on-surface flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[18px] text-primary">{ch.icon}</span>
                                {ch.name}
                              </span>
                              <span className="text-on-surface-variant font-semibold">
                                {ch.regs} regs ({ch.percentage}%)
                              </span>
                            </div>
                            <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden flex">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  ch.id === 'whatsapp'
                                    ? 'bg-primary'
                                    : ch.id === 'ambassador'
                                    ? 'bg-secondary-container'
                                    : ch.id === 'social'
                                    ? 'bg-primary-container'
                                    : 'bg-surface-container-highest'
                                }`}
                                style={{ width: `${ch.percentage}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between items-center text-on-surface-variant font-label-sm text-label-sm">
                              <span>Conversion: {ch.conversionRate}</span>
                              <span
                                className={
                                  ch.highlightType === 'warning'
                                    ? 'text-error font-semibold'
                                    : ch.highlightType === 'primary'
                                    ? 'text-primary font-semibold'
                                    : 'text-on-surface-variant'
                                }
                              >
                                {ch.highlightText}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => setActiveTab('referrals')}
                        className="w-full mt-3 py-2 bg-surface-container-low hover:bg-surface-container font-label-md text-label-md text-on-surface font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Inspect Channel Deep Dives</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>

                  {/* LOWER GRID SECTION: AMBASSADOR LEADERBOARD & DEPT DISTRIBUTION */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
                    {/* Ambassador Leaderboard (7 Cols) */}
                    <div className="lg:col-span-7 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-surface-container-high/60">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                            Ambassador Leaderboard
                          </h2>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Top student advocates driving confirmed workshop RSVPs
                          </p>
                        </div>
                        <span className="font-badge-caption text-badge-caption bg-surface-container text-on-surface-variant px-2 py-0.5 rounded uppercase font-bold">
                          {includeDemo ? '(Demo Data)' : '(Verified)'}
                        </span>
                      </div>

                      <div className="overflow-x-auto w-full">
                        <table className="w-full text-left font-body-sm text-body-sm">
                          <thead>
                            <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm border-b border-surface-container-high/60">
                              <th className="py-2.5 px-3 rounded-l-lg">Rank</th>
                              <th className="py-2.5 px-3">Ambassador</th>
                              <th className="py-2.5 px-3">College &amp; Branch</th>
                              <th className="py-2.5 px-3 text-right">Shares</th>
                              <th className="py-2.5 px-3 text-right rounded-r-lg">Verified Regs</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-surface-container-high/30">
                            {stats?.ambassadors.slice(0, 4).map((rep) => (
                              <tr key={rep.id} className="hover:bg-surface-container-low/40 transition-colors">
                                <td className="py-3 px-3">
                                  <span
                                    className={`w-6 h-6 rounded-full font-bold flex items-center justify-center font-label-sm text-label-sm ${
                                      rep.rank === 1
                                        ? 'bg-primary/10 text-primary'
                                        : rep.rank === 2
                                        ? 'bg-secondary/10 text-secondary'
                                        : 'bg-surface-container-high text-on-surface-variant'
                                    }`}
                                  >
                                    #{rep.rank}
                                  </span>
                                </td>
                                <td className="py-3 px-3">
                                  <div className="flex items-center gap-2">
                                    <img
                                      className="w-8 h-8 rounded-full object-cover shrink-0"
                                      src={rep.avatarUrl}
                                      alt={rep.name}
                                    />
                                    <div>
                                      <span className="font-label-md text-label-md font-bold text-on-surface block">
                                        {rep.name}
                                      </span>
                                      <span
                                        className={`font-badge-caption text-badge-caption ${
                                          rep.rank === 1
                                            ? 'text-primary'
                                            : rep.rank === 2
                                            ? 'text-secondary'
                                            : 'text-on-surface-variant'
                                        }`}
                                      >
                                        Badge: {rep.badge}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-3">
                                  <span className="font-medium text-on-surface block">{rep.college}</span>
                                  <span className="text-on-surface-variant text-label-sm">
                                    {rep.branch} ({rep.year})
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-right font-semibold text-on-surface">{rep.shares}</td>
                                <td className="py-3 px-3 text-right">
                                  <span
                                    className={`px-2 py-0.5 rounded-full font-bold font-label-sm text-label-sm ${
                                      rep.rank === 1
                                        ? 'bg-primary/10 text-primary'
                                        : rep.rank === 2
                                        ? 'bg-secondary-container text-on-secondary-container'
                                        : 'bg-surface-container text-on-surface'
                                    }`}
                                  >
                                    {rep.verifiedRegs} regs
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="pt-3 border-t border-surface-container-high/40 flex items-center justify-between text-on-surface-variant">
                        <span className="font-label-sm text-label-sm">
                          {stats?.ambassadors.length || 14} ambassadors actively tracking links
                        </span>
                        <button
                          onClick={() => setActiveTab('ambassadors')}
                          className="font-label-md text-label-md text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Manage Full Ambassador Roster</span>
                          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        </button>
                      </div>
                    </div>

                    {/* Department & Branch Distribution (5 Cols) */}
                    <div
                      id="departments-section"
                      className="lg:col-span-5 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-surface-container-high/60"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                            Department Penetration
                          </h2>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Cohort composition by academic branch
                          </p>
                        </div>
                        <span className="font-badge-caption text-badge-caption bg-surface-container text-on-surface-variant px-2 py-0.5 rounded uppercase font-bold">
                          {includeDemo ? '(Demo Data)' : '(Verified)'}
                        </span>
                      </div>

                      <div className="flex flex-col gap-3 my-auto">
                        {stats?.departments.map((dept) => (
                          <div key={dept.branchKey}>
                            <div className="flex justify-between items-center font-label-sm text-label-sm mb-1">
                              <span className="font-bold text-on-surface">{dept.name}</span>
                              <span
                                className={`font-semibold ${
                                  dept.tag === 'Low' || dept.tag === 'Awaiting RSVPs' ? 'text-amber-700' : 'text-on-surface'
                                }`}
                              >
                                {dept.percentage}% ({dept.studentsCount} students)
                                {dept.tag ? ` — ${dept.tag}` : ''}
                              </span>
                            </div>
                            <div className="w-full bg-surface-container-low h-2.5 rounded-full overflow-hidden">
                              <div
                                className={`${dept.colorClass} h-full rounded-full transition-all duration-500`}
                                style={{ width: `${dept.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-surface-container-low/70 p-3 rounded-lg flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm mt-3">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-primary">school</span>
                          <span>Targeting engineering campus cohorts</span>
                        </div>
                        <span className="font-label-sm text-label-sm font-semibold text-primary">
                          Real-Time Sync
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RECENT REGISTRATION ACTIVITY LOG */}
                  <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md mb-space-lg border border-surface-container-high/60">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                      <div>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                          Recent Registration Feed
                        </h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Live audit log of student check-ins and chosen workshop build targets
                        </p>
                      </div>

                      <div className="flex items-center gap-space-sm">
                        <div className="flex items-center bg-surface-container-low rounded-lg px-3 py-1.5 text-on-surface-variant gap-2 text-label-sm font-label-sm border border-surface-container-high/60">
                          <span className="material-symbols-outlined text-[16px]">search</span>
                          <input
                            className="bg-transparent border-none outline-none text-on-surface placeholder:text-on-surface-variant w-44 font-body-sm"
                            placeholder="Search student or college..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <button
                          onClick={() => setActiveTab('registrations')}
                          className="px-3 py-1.5 rounded-lg bg-surface-container font-label-sm text-label-sm font-semibold hover:bg-surface-container-high transition-colors"
                        >
                          View All ({filteredRegistrations.length})
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left font-body-sm text-body-sm">
                        <thead>
                          <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm border-b border-surface-container-high/60">
                            <th className="py-2.5 px-3 rounded-l-lg">Student Name</th>
                            <th className="py-2.5 px-3">Institution &amp; Branch</th>
                            <th className="py-2.5 px-3">Selected Project Blueprint</th>
                            <th className="py-2.5 px-3">Acquisition Channel</th>
                            <th className="py-2.5 px-3">Type</th>
                            <th className="py-2.5 px-3 text-right rounded-r-lg">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container-high/30">
                          {filteredRegistrations.slice(0, 8).map((row) => {
                            const initials = row.name
                              ? row.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .substring(0, 2)
                                  .toUpperCase()
                              : 'ST';
                            return (
                              <tr key={row.id} className="hover:bg-surface-container-low/40 transition-colors">
                                <td className="py-3 px-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-[12px]">
                                      {initials}
                                    </div>
                                    <div>
                                      <span className="font-label-md text-label-md font-semibold text-on-surface block">
                                        {row.name}
                                      </span>
                                      <span className="font-badge-caption text-badge-caption text-on-surface-variant">
                                        {row.ticketNumber}
                                      </span>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-3 px-3">
                                  <span className="font-medium text-on-surface block">{row.college}</span>
                                  <span className="text-on-surface-variant font-label-sm text-label-sm">
                                    {row.branchLabel || row.branch}
                                  </span>
                                </td>

                                <td className="py-3 px-3">
                                  <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold inline-flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px] text-primary">
                                      description
                                    </span>
                                    <span className="truncate max-w-[200px]">{row.projectTitle}</span>
                                  </span>
                                </td>

                                <td className="py-3 px-3">
                                  <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px] text-secondary">
                                      {row.channel === 'whatsapp'
                                        ? 'chat'
                                        : row.channel === 'ambassador'
                                        ? 'badge'
                                        : row.channel === 'social'
                                        ? 'photo_camera'
                                        : 'link'}
                                    </span>
                                    <span>{row.channelLabel || row.channel}</span>
                                  </span>
                                </td>

                                <td className="py-3 px-3">
                                  {row.isDemo ? (
                                    <span className="px-2 py-0.5 rounded text-badge-caption bg-secondary-container/50 text-on-secondary-container font-bold">
                                      DEMO
                                    </span>
                                  ) : row.isTest ? (
                                    <span className="px-2 py-0.5 rounded text-badge-caption bg-amber-500/10 text-amber-700 font-bold border border-amber-500/20">
                                      TEST
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded text-badge-caption bg-primary/10 text-primary font-bold">
                                      GENUINE
                                    </span>
                                  )}
                                </td>

                                <td className="py-3 px-3 text-right font-medium text-on-surface-variant whitespace-nowrap">
                                  {new Date(row.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* PANEL 2: REGISTRATIONS TABLE */}
              {/* ----------------------------------------------------------- */}
              {activeTab === 'registrations' && (
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md border border-surface-container-high/60">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                        Registrations Directory
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Detailed student roster and project selections ({filteredRegistrations.length} records shown)
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={handleExportCsv}
                        className="flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container font-label-md text-label-md text-on-surface font-semibold px-3 py-1.5 rounded-lg border border-surface-container-high transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm bg-surface-container-low p-3 rounded-xl border border-surface-container-high/60">
                    <div className="flex items-center bg-surface-container-lowest rounded-lg px-3 py-2 text-on-surface-variant gap-2 text-label-sm font-label-sm border border-surface-container-high/60">
                      <span className="material-symbols-outlined text-[16px]">search</span>
                      <input
                        className="bg-transparent border-none outline-none text-on-surface placeholder:text-on-surface-variant w-full font-body-sm"
                        placeholder="Search student, email, college..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div>
                      <select
                        value={filterBranch}
                        onChange={(e) => setFilterBranch(e.target.value)}
                        className="w-full bg-surface-container-lowest text-on-surface font-label-sm text-label-sm rounded-lg px-3 py-2 border border-surface-container-high/60 outline-none"
                      >
                        <option value="ALL">All Academic Branches</option>
                        <option value="CSE">CSE</option>
                        <option value="IT">IT</option>
                        <option value="AIML">AIML</option>
                        <option value="ECE">ECE</option>
                        <option value="OTHER">Mechanical, Civil &amp; Other</option>
                      </select>
                    </div>

                    <div>
                      <select
                        value={filterChannel}
                        onChange={(e) => setFilterChannel(e.target.value)}
                        className="w-full bg-surface-container-lowest text-on-surface font-label-sm text-label-sm rounded-lg px-3 py-2 border border-surface-container-high/60 outline-none"
                      >
                        <option value="ALL">All Channels</option>
                        <option value="whatsapp">WhatsApp Study Groups</option>
                        <option value="ambassador">Campus Ambassadors</option>
                        <option value="social">Social Media</option>
                        <option value="direct">Direct</option>
                        <option value="peer">Peer Referrals</option>
                      </select>
                    </div>

                    <div>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full bg-surface-container-lowest text-on-surface font-label-sm text-label-sm rounded-lg px-3 py-2 border border-surface-container-high/60 outline-none"
                      >
                        <option value="ALL">All Records</option>
                        <option value="GENUINE">Verified Genuine Only</option>
                        <option value="TEST">Test Registrations Only</option>
                        <option value="DEMO">Demo Baseline Only</option>
                      </select>
                    </div>
                  </div>

                  {/* Registrations Full Table */}
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left font-body-sm text-body-sm">
                      <thead>
                        <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm border-b border-surface-container-high/60">
                          <th className="py-2.5 px-3 rounded-l-lg">Ticket</th>
                          <th className="py-2.5 px-3">Student &amp; Email</th>
                          <th className="py-2.5 px-3">Institution &amp; Branch</th>
                          <th className="py-2.5 px-3">Project Blueprint</th>
                          <th className="py-2.5 px-3">Referral Code</th>
                          <th className="py-2.5 px-3">Channel</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right rounded-r-lg">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container-high/30">
                        {filteredRegistrations.length > 0 ? (
                          filteredRegistrations.map((r) => (
                            <tr key={r.id} className="hover:bg-surface-container-low/40 transition-colors">
                              <td className="py-3 px-3 font-mono font-bold text-primary text-[13px]">
                                {r.ticketNumber}
                              </td>

                              <td className="py-3 px-3">
                                <span className="font-label-md text-label-md font-bold text-on-surface block">
                                  {r.name}
                                </span>
                                <span className="text-on-surface-variant text-[12px]">{r.email}</span>
                              </td>

                              <td className="py-3 px-3">
                                <span className="font-medium text-on-surface block truncate max-w-[200px]">
                                  {r.college}
                                </span>
                                <span className="text-on-surface-variant text-label-sm">
                                  {r.branchLabel || r.branch}
                                </span>
                              </td>

                              <td className="py-3 px-3">
                                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold inline-flex items-center gap-1 max-w-[220px] truncate">
                                  <span className="material-symbols-outlined text-[14px] text-primary">description</span>
                                  <span className="truncate">{r.projectTitle}</span>
                                </span>
                              </td>

                              <td className="py-3 px-3 font-mono text-[12px] text-on-surface font-semibold">
                                {r.referralCode}
                              </td>

                              <td className="py-3 px-3 text-label-sm text-on-surface-variant">
                                <span>{r.channelLabel || r.channel}</span>
                              </td>

                              <td className="py-3 px-3">
                                {r.isDemo ? (
                                  <span className="px-2 py-0.5 rounded text-badge-caption bg-secondary-container/50 text-on-secondary-container font-bold">
                                    SIMULATED
                                  </span>
                                ) : r.isTest ? (
                                  <span className="px-2 py-0.5 rounded text-badge-caption bg-amber-500/10 text-amber-700 font-bold border border-amber-500/20">
                                    TEST
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-badge-caption bg-primary/10 text-primary font-bold">
                                    GENUINE
                                  </span>
                                )}
                              </td>

                              <td className="py-3 px-3 text-right font-medium text-on-surface-variant whitespace-nowrap text-[12px]">
                                {new Date(r.createdAt).toLocaleDateString([], {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={8} className="py-12 text-center text-on-surface-variant font-label-md">
                              No registrations match your search and filter criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* PANEL 3: REFERRAL ANALYTICS */}
              {/* ----------------------------------------------------------- */}
              {activeTab === 'referrals' && (
                <div className="flex flex-col gap-space-lg">
                  {/* Referral Metric Cards (4 Columns) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container-high/60">
                      <span className="font-badge-caption text-badge-caption text-on-surface-variant uppercase font-bold tracking-wider">
                        Referral Volume
                      </span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                          {stats?.viralLinksCount || 0}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Confirmed</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-primary font-semibold mt-1">
                        {stats?.referralRate || 0}% of total cohort
                      </p>
                    </div>

                    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container-high/60">
                      <span className="font-badge-caption text-badge-caption text-on-surface-variant uppercase font-bold tracking-wider">
                        Viral K-Factor
                      </span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                          {stats?.viralKFactor || 'Not enough data'}
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        Referral invites per direct signup
                      </p>
                    </div>

                    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container-high/60">
                      <span className="font-badge-caption text-badge-caption text-on-surface-variant uppercase font-bold tracking-wider">
                        Active Campus Reps
                      </span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                          {stats?.ambassadors.length || 14}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Leaders</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-secondary font-semibold mt-1">
                        Across 4 Partner Colleges
                      </p>
                    </div>

                    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container-high/60">
                      <span className="font-badge-caption text-badge-caption text-on-surface-variant uppercase font-bold tracking-wider">
                        Top Channel Yield
                      </span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                          WhatsApp
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-primary font-semibold mt-1">
                        Peer Study Circles
                      </p>
                    </div>
                  </div>

                  {/* Channel Attribution Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
                    {/* Left: Detailed Attribution Table (7 Cols) */}
                    <div className="lg:col-span-7 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-surface-container-high/60">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                            Acquisition Channel Attribution
                          </h2>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Breakdown of confirmed student registrations by discovery channel
                          </p>
                        </div>
                      </div>

                      <div className="overflow-x-auto w-full">
                        <table className="w-full text-left font-body-sm text-body-sm">
                          <thead>
                            <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm border-b border-surface-container-high/60">
                              <th className="py-2.5 px-3 rounded-l-lg">Channel Name</th>
                              <th className="py-2.5 px-3">Confirmed Regs</th>
                              <th className="py-2.5 px-3">Share %</th>
                              <th className="py-2.5 px-3 rounded-r-lg">Yield Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-surface-container-high/30">
                            {stats?.channels.map((ch) => (
                              <tr key={ch.id} className="hover:bg-surface-container-low/40 transition-colors">
                                <td className="py-3 px-3">
                                  <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[20px] text-primary">{ch.icon}</span>
                                    <span className="font-label-md text-label-md font-bold text-on-surface">
                                      {ch.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-3 font-semibold text-on-surface">{ch.regs}</td>
                                <td className="py-3 px-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 bg-surface-container-low h-2 rounded-full overflow-hidden">
                                      <div
                                        className="bg-primary h-full rounded-full"
                                        style={{ width: `${ch.percentage}%` }}
                                      ></div>
                                    </div>
                                    <span className="font-label-sm text-label-sm">{ch.percentage}%</span>
                                  </div>
                                </td>
                                <td className="py-3 px-3">
                                  <span
                                    className={`px-2 py-0.5 rounded text-badge-caption font-bold ${
                                      ch.highlightType === 'primary'
                                        ? 'bg-primary/10 text-primary'
                                        : ch.highlightType === 'warning'
                                        ? 'bg-error/10 text-error'
                                        : 'bg-surface-container text-on-surface-variant'
                                    }`}
                                  >
                                    {ch.highlightText}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Right: Peer Squad Multiplier (5 Cols) */}
                    <div className="lg:col-span-5 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-surface-container-high/60 flex flex-col justify-between">
                      <div>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                          Peer Study Squad Multipliers
                        </h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                          Top individual students who referred 3+ peers from their department
                        </p>

                        <div className="space-y-3">
                          <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center font-label-sm">
                                AS
                              </span>
                              <div>
                                <span className="font-label-md text-label-md font-bold text-on-surface block">
                                  Aarav Sharma
                                </span>
                                <span className="text-on-surface-variant text-[12px]">VTU • CSE 3rd Year</span>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold font-label-sm">
                              3 Referrals
                            </span>
                          </div>

                          <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-8 h-8 rounded-full bg-secondary/10 text-secondary font-bold flex items-center justify-center font-label-sm">
                                RK
                              </span>
                              <div>
                                <span className="font-label-md text-label-md font-bold text-on-surface block">
                                  Ravi Kumar
                                </span>
                                <span className="text-on-surface-variant text-[12px]">RVCE • CSE 2nd Year</span>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-bold font-label-sm">
                              2 Referrals
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-surface-container-high/60">
                        <button
                          onClick={() => {
                            const origin = typeof window !== 'undefined' ? window.location.origin : '';
                            navigator.clipboard.writeText(
                              `Join me this Saturday for NxtWave's AI Workshop! Register here: ${origin}/?ref=STUDY-SQUAD`
                            );
                            showToast('Copied WhatsApp Study Squad template to clipboard!');
                          }}
                          className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                        >
                          <span className="material-symbols-outlined text-[18px]">content_copy</span>
                          <span>Copy WhatsApp Study Squad Template</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* PANEL 4: AMBASSADORS */}
              {/* ----------------------------------------------------------- */}
              {activeTab === 'ambassadors' && (
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-surface-container-high/60 flex flex-col gap-space-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                        Campus Ambassador Roster
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {stats?.ambassadors.length || 14} verified student ambassadors driving peer registration blitzes
                      </p>
                    </div>

                    <button
                      onClick={() => setBlitzModalOpen(true)}
                      className="flex items-center gap-1.5 bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold px-4 py-2 rounded-lg transition-all shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">electric_bolt</span>
                      <span>Dispatch Ambassador Blitz</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left font-body-sm text-body-sm">
                      <thead>
                        <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm border-b border-surface-container-high/60">
                          <th className="py-2.5 px-3 rounded-l-lg">Rank</th>
                          <th className="py-2.5 px-3">Ambassador</th>
                          <th className="py-2.5 px-3">Institution &amp; Branch</th>
                          <th className="py-2.5 px-3">Badge Tier</th>
                          <th className="py-2.5 px-3">Referral Code</th>
                          <th className="py-2.5 px-3 text-right">Shares</th>
                          <th className="py-2.5 px-3 text-right">Verified Regs</th>
                          <th className="py-2.5 px-3 text-right rounded-r-lg">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container-high/30">
                        {stats?.ambassadors.map((rep) => (
                          <tr key={rep.id} className="hover:bg-surface-container-low/40 transition-colors">
                            <td className="py-3 px-3">
                              <span
                                className={`w-6 h-6 rounded-full font-bold flex items-center justify-center font-label-sm text-label-sm ${
                                  rep.rank === 1
                                    ? 'bg-primary/10 text-primary'
                                    : rep.rank === 2
                                    ? 'bg-secondary/10 text-secondary'
                                    : 'bg-surface-container-high text-on-surface-variant'
                                }`}
                              >
                                #{rep.rank}
                              </span>
                            </td>

                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <img
                                  className="w-8 h-8 rounded-full object-cover shrink-0"
                                  src={rep.avatarUrl}
                                  alt={rep.name}
                                />
                                <div>
                                  <span className="font-label-md text-label-md font-bold text-on-surface block">
                                    {rep.name}
                                  </span>
                                  <span className="text-[12px] text-on-surface-variant">{rep.year}</span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-3">
                              <span className="font-medium text-on-surface block">{rep.college}</span>
                              <span className="text-on-surface-variant text-label-sm">{rep.branch}</span>
                            </td>

                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded text-badge-caption bg-surface-container-high text-on-surface font-semibold">
                                {rep.badge}
                              </span>
                            </td>

                            <td className="py-3 px-3 font-mono text-label-sm text-on-surface font-bold">
                              {rep.code}
                            </td>

                            <td className="py-3 px-3 text-right font-semibold text-on-surface">{rep.shares}</td>

                            <td className="py-3 px-3 text-right">
                              <span
                                className={`px-2 py-0.5 rounded-full font-bold font-label-sm text-label-sm ${
                                  rep.rank === 1
                                    ? 'bg-primary/10 text-primary'
                                    : rep.rank === 2
                                    ? 'bg-secondary-container text-on-secondary-container'
                                    : 'bg-surface-container text-on-surface'
                                }`}
                              >
                                {rep.verifiedRegs} regs
                              </span>
                            </td>

                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => handleCopyLink(rep.code)}
                                className="px-2.5 py-1 rounded bg-surface-container-low hover:bg-surface-container text-primary font-label-sm text-label-sm font-semibold transition-colors cursor-pointer border border-surface-container-high"
                              >
                                Copy Link
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* PANEL 5: CAMPAIGN BUDGET */}
              {/* ----------------------------------------------------------- */}
              {activeTab === 'budget' && (
                <div className="flex flex-col gap-space-lg">
                  {/* Planned vs Actual Spend Overview Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container-high/60">
                      <span className="font-badge-caption text-badge-caption text-on-surface-variant uppercase font-bold tracking-wider">
                        Planned Budget
                      </span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                          ₹2,000
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">INR Allocated</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-primary font-semibold mt-1">
                        ₹4.00 per registration target
                      </p>
                    </div>

                    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container-high/60">
                      <span className="font-badge-caption text-badge-caption text-on-surface-variant uppercase font-bold tracking-wider">
                        Recorded Actual Spend
                      </span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                          {includeDemo ? '₹1,240' : '₹0'}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">INR Spent</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        {includeDemo ? 'Simulated expense baseline' : 'Spend unrecorded / In development'}
                      </p>
                    </div>

                    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container-high/60">
                      <span className="font-badge-caption text-badge-caption text-on-surface-variant uppercase font-bold tracking-wider">
                        Budget Burn %
                      </span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                          {includeDemo ? '62.0%' : '0%'}
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        {includeDemo ? '₹760 balance remaining' : '₹2,000 intact (Uncommitted)'}
                      </p>
                    </div>

                    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container-high/60">
                      <span className="font-badge-caption text-badge-caption text-on-surface-variant uppercase font-bold tracking-wider">
                        Cost Per Registration (CAC)
                      </span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                          {includeDemo ? '₹3.63' : 'Not enough data'}
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-primary font-semibold mt-1">
                        Target benchmark: &lt; ₹4.00
                      </p>
                    </div>
                  </div>

                  {/* Planned Allocation vs Actual Table */}
                  <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-surface-container-high/60">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight mb-1">
                      Campaign Budget Allocation Breakdown
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                      Carefully allocated across high-leverage peer advocacy channels
                    </p>

                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left font-body-sm text-body-sm">
                        <thead>
                          <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm border-b border-surface-container-high/60">
                            <th className="py-2.5 px-3 rounded-l-lg">Expense Category</th>
                            <th className="py-2.5 px-3">Planned Allocation</th>
                            <th className="py-2.5 px-3">Actual Spent</th>
                            <th className="py-2.5 px-3">Variance</th>
                            <th className="py-2.5 px-3 rounded-r-lg">Purpose</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container-high/30">
                          <tr className="hover:bg-surface-container-low/40">
                            <td className="py-3 px-3 font-bold text-on-surface">
                              Ambassador Milestone Rewards
                            </td>
                            <td className="py-3 px-3 font-semibold">₹800</td>
                            <td className="py-3 px-3">{includeDemo ? '₹620' : '₹0'}</td>
                            <td className="py-3 px-3 text-primary font-semibold">
                              {includeDemo ? '₹180 remaining' : '₹800 remaining'}
                            </td>
                            <td className="py-3 px-3 text-on-surface-variant text-[12px]">
                              Tiered vouchers for ambassadors exceeding 25 verified RSVPs
                            </td>
                          </tr>

                          <tr className="hover:bg-surface-container-low/40">
                            <td className="py-3 px-3 font-bold text-on-surface">
                              High-Performing Channel Boost
                            </td>
                            <td className="py-3 px-3 font-semibold">₹500</td>
                            <td className="py-3 px-3">{includeDemo ? '₹340' : '₹0'}</td>
                            <td className="py-3 px-3 text-primary font-semibold">
                              {includeDemo ? '₹160 remaining' : '₹500 remaining'}
                            </td>
                            <td className="py-3 px-3 text-on-surface-variant text-[12px]">
                              Targeted sponsored outreach in regional WhatsApp college networks
                            </td>
                          </tr>

                          <tr className="hover:bg-surface-container-low/40">
                            <td className="py-3 px-3 font-bold text-on-surface">
                              Community &amp; Quiz Rewards
                            </td>
                            <td className="py-3 px-3 font-semibold">₹300</td>
                            <td className="py-3 px-3">{includeDemo ? '₹180' : '₹0'}</td>
                            <td className="py-3 px-3 text-primary font-semibold">
                              {includeDemo ? '₹120 remaining' : '₹300 remaining'}
                            </td>
                            <td className="py-3 px-3 text-on-surface-variant text-[12px]">
                              Live session interactive quiz incentives and certificate badges
                            </td>
                          </tr>

                          <tr className="hover:bg-surface-container-low/40">
                            <td className="py-3 px-3 font-bold text-on-surface">
                              Operational &amp; Contingency Buffer
                            </td>
                            <td className="py-3 px-3 font-semibold">₹400</td>
                            <td className="py-3 px-3">{includeDemo ? '₹100' : '₹0'}</td>
                            <td className="py-3 px-3 text-primary font-semibold">
                              {includeDemo ? '₹300 remaining' : '₹400 remaining'}
                            </td>
                            <td className="py-3 px-3 text-on-surface-variant text-[12px]">
                              Reserved for surge infrastructure and last-mile cohort messaging
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* PANEL 6: SETTINGS */}
              {/* ----------------------------------------------------------- */}
              {activeTab === 'settings' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
                  {/* Setting Card 1: Data Mode */}
                  <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-surface-container-high/60 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                          Dashboard Data Environment
                        </h2>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                        Switch between live verified database records and simulated prototype metrics.
                      </p>

                      <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between">
                        <div>
                          <span className="font-label-md text-label-md font-bold text-on-surface block">
                            {includeDemo ? 'Simulated Demo Mode' : 'Live Genuine Mode'}
                          </span>
                          <span className="text-[12px] text-on-surface-variant">
                            {includeDemo
                              ? 'Displaying 342 illustrative benchmark records'
                              : `Displaying ${stats?.uniqueRegistrations || 0} genuine verified registrations`}
                          </span>
                        </div>

                        <button
                          onClick={handleToggleDemoMode}
                          className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm font-semibold hover:bg-primary-container transition-all cursor-pointer shadow-sm"
                        >
                          {includeDemo ? 'Switch to Genuine' : 'Enable Demo Mode'}
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-surface-container-high text-[12px] text-on-surface-variant">
                      Tip: Genuine mode is the default and should be used for auditing authentic campaign conversions.
                    </div>
                  </div>

                  {/* Setting Card 2: Test Data Management */}
                  <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-surface-container-high/60 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-amber-600 text-[22px]">security</span>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                          Test Registrations Filter &amp; Purge
                        </h2>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                        Identify and safely manage test submissions created during development or QA audits.
                      </p>

                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between">
                          <div>
                            <span className="font-label-md text-label-md font-bold text-on-surface block">
                              Exclude Test Records
                            </span>
                            <span className="text-[12px] text-on-surface-variant">
                              {stats?.testRegistrationsCount || 0} test records identified in genuine database
                            </span>
                          </div>

                          <button
                            onClick={handleToggleExcludeTest}
                            className={`px-3 py-1.5 rounded-lg font-label-sm font-semibold transition-all cursor-pointer border ${
                              excludeTest
                                ? 'bg-primary text-on-primary border-primary'
                                : 'bg-surface-container text-on-surface border-surface-container-high'
                            }`}
                          >
                            {excludeTest ? 'Excluded (Active)' : 'Included'}
                          </button>
                        </div>

                        <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between">
                          <div>
                            <span className="font-label-md text-label-md font-bold text-on-surface block">
                              Safely Purge Test Records
                            </span>
                            <span className="text-[12px] text-on-surface-variant">
                              Deletes test identities without affecting genuine students
                            </span>
                          </div>

                          <button
                            onClick={handleResetTestRegistrations}
                            disabled={resettingTest || (stats?.testRegistrationsCount || 0) === 0}
                            className="px-3 py-1.5 rounded-lg bg-error/10 text-error hover:bg-error/20 font-label-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            {resettingTest ? 'Purging...' : 'Purge Test Data'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-surface-container-high text-[12px] text-on-surface-variant">
                      Safety Guarantee: This action will never remove genuine student registrations.
                    </div>
                  </div>

                  {/* Setting Card 3: Campaign Configuration */}
                  <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-surface-container-high/60">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-primary text-[22px]">calendar_month</span>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        Cohort Parameters
                      </h2>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                      Active workshop dates, schedule specifications, and cohort target quotas.
                    </p>

                    <div className="space-y-2 text-label-sm">
                      <div className="flex justify-between py-1.5 border-b border-surface-container-high/40">
                        <span className="text-on-surface-variant">Cohort Challenge:</span>
                        <span className="font-bold text-on-surface">AI in 60 Mins (Oct Masterclass)</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-surface-container-high/40">
                        <span className="text-on-surface-variant">Target Milestone:</span>
                        <span className="font-bold text-primary">500 Confirmed Registrations</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-surface-container-high/40">
                        <span className="text-on-surface-variant">Session Schedule:</span>
                        <span className="font-bold text-on-surface">Saturday, 6:00 PM IST (60 Mins)</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-on-surface-variant">Admissions Status:</span>
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                          OPEN / LIVE
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Setting Card 4: Data Infrastructure */}
                  <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-surface-container-high/60 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-primary text-[22px]">database</span>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                          Data Infrastructure &amp; Export
                        </h2>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                        Database connection health and CSV reporting exports.
                      </p>

                      <div className="space-y-2 text-label-sm">
                        <div className="flex justify-between py-1.5 border-b border-surface-container-high/40">
                          <span className="text-on-surface-variant">Storage Architecture:</span>
                          <span className="font-semibold text-on-surface">Dual Engine (Supabase / JSON Fallback)</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-surface-container-high/40">
                          <span className="text-on-surface-variant">Real-Time Sync:</span>
                          <span className="font-bold text-primary">Active</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-surface-container-high">
                      <button
                        onClick={handleExportCsv}
                        className="w-full py-2 bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer border border-surface-container-high"
                      >
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        <span>Download Full Cohort CSV Export</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* CAMPAIGN BLITZ MODAL */}
      {blitzModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-space-lg shadow-2xl border border-surface-container-high flex flex-col gap-space-md animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">electric_bolt</span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  Create Campaign Blitz
                </h3>
              </div>
              <button
                onClick={() => setBlitzModalOpen(false)}
                className="p-1 rounded-md text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Dispatch high-converting WhatsApp message copy and peer referral challenge nudges to student ambassadors and club leads.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block font-label-sm text-label-sm font-bold text-on-surface mb-1">
                  Target Channel &amp; Department
                </label>
                <select className="w-full h-10 px-3 bg-surface-container-low text-on-surface font-label-sm rounded-lg border border-surface-container-high">
                  <option>ECE &amp; IT Underperforming Cohorts (6 Inactive Ambassadors)</option>
                  <option>All 14 Campus Ambassadors</option>
                  <option>WhatsApp Engineering Study Communities</option>
                  <option>Placement Preparation Circles</option>
                </select>
              </div>

              <div>
                <label className="block font-label-sm text-label-sm font-bold text-on-surface mb-1">
                  Incentive Perk / Nudge Message
                </label>
                <textarea
                  rows={3}
                  className="w-full p-2.5 bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg border border-surface-container-high resize-none"
                  defaultValue="Hey team! 5 days remaining for Saturday's AI masterclass. Share your branch-specific project blueprint with 3 classmates to unlock the VIP AI developer pack!"
                />
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between text-label-sm">
                <span className="text-on-surface-variant">Estimated Outreach Lift:</span>
                <span className="font-bold text-primary">+45 to +60 Registrations</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-high">
              <button
                onClick={() => setBlitzModalOpen(false)}
                className="px-4 py-2 rounded-lg text-on-surface font-label-md hover:bg-surface-container transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleTriggerBlitz}
                className="px-5 py-2 rounded-lg bg-primary text-on-primary font-label-md font-bold hover:bg-primary-container transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                Dispatch Blitz Nudge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
