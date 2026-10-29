'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { ProjectBlueprint, Registration } from '@/types';
import { getRecommendedBlueprint } from '@/lib/blueprints';
import confetti from 'canvas-confetti';

function BlueprintContent() {
  const searchParams = useSearchParams();
  const regId = searchParams.get('id');

  const [registration, setRegistration] = useState<Registration | null>(null);
  const [blueprint, setBlueprint] = useState<ProjectBlueprint>(
    getRecommendedBlueprint('CSE', 'Resume & Career Tools', 'Beginner')
  );
  const [referralCount, setReferralCount] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch registration details or fallback to default student profile
  useEffect(() => {
    async function loadData() {
      if (regId) {
        try {
          const res = await fetch(`/api/registration/${regId}`);
          if (res.ok) {
            const data = await res.json();
            setRegistration(data.registration);
            setBlueprint(data.blueprint);
            setReferralCount(data.referralStats?.totalReferred || 0);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error('Failed to load registration by id:', err);
        }
      }

      // Default fallback profile matching Stitch Screen 2
      const defaultRecord: Registration = {
        id: 'reg-demo-default',
        ticketNumber: 'NX-94218',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@vtu.ac.in',
        college: 'Visvesvaraya Technological University',
        branch: 'CSE',
        branchLabel: 'Computer Science & Engineering',
        interest: 'Resume & Career Tools',
        codingLevel: 'Beginner',
        projectId: 'resume-ats-copilot',
        projectTitle: 'Smart ATS Resume Analyzer & Interview Copilot',
        referralCode: 'AARAV-CSE-2025',
        channel: 'direct',
        channelLabel: 'Direct',
        createdAt: new Date().toISOString(),
        isDemo: true,
      };

      setRegistration(defaultRecord);
      setBlueprint(getRecommendedBlueprint('CSE', 'Resume & Career Tools', 'Beginner'));
      setReferralCount(0);
      setLoading(false);
    }

    loadData();
  }, [regId]);

  // Construct shareable link with student's referral code
  const studentRefCode = registration?.referralCode || 'AARAV-CSE-2025';
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://campusgrowth.nxtwave.io';
  const shareUrl = `${origin}/?ref=${studentRefCode}`;

  const shareText = `Hey! I just registered for NxtWave's free 60-min AI Project Workshop. I'm building "${blueprint.title}". Claim your free project blueprint and seat here: ${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    } catch (e) {}
    setTimeout(() => setCopied(false), 3000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Build Your First AI Project in 60 Mins - NxtWave`,
          text: shareText,
          url: shareUrl,
        });
      } catch (e) {}
    } else {
      handleCopy();
    }
  };

  const handleDownloadIcs = () => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//NxtWave//Campus Growth Engine//EN',
      'BEGIN:VEVENT',
      'SUMMARY:Build Your First AI Project in 60 Minutes - NxtWave Masterclass',
      `DESCRIPTION:Live workshop for building ${blueprint.title}. Join link will be sent to ${registration?.email}.`,
      'LOCATION:Online Live Stream (Link sent via Email)',
      'DTSTART:20261107T123000Z',
      'DTEND:20261107T133000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'NxtWave_AI_Workshop_Invite.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  // Student initials for avatar
  const initials = registration?.name
    ? registration.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'AS';

  const progressPercentage = Math.min(100, Math.round((referralCount / 3) * 100));

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex items-center gap-3 text-primary font-label-md">
          <span className="material-symbols-outlined animate-spin text-[28px]">sync</span>
          <span>Loading Your Blueprint...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="w-full pt-16 bg-surface min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col w-full">
          {/* CONFIRMATION HERO TOP BANNER */}
          <div className="relative w-full overflow-hidden bg-surface-container-low py-space-xl border-b border-surface-container-high/60">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-secondary-container/30 blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-primary-fixed/20 blur-2xl pointer-events-none"></div>

            <div className="max-w-[1200px] mx-auto px-gutter relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-lg">
                <div className="space-y-space-sm max-w-2xl">
                  {/* Status Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest shadow-sm text-primary font-badge-caption text-badge-caption uppercase">
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                    <span>Registration Confirmed • Ticket #{registration?.ticketNumber || 'NX-94218'}</span>
                  </div>

                  <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-extrabold">
                    Registration Confirmed! You&apos;re Set for the AI Workshop.
                  </h1>

                  <div className="flex flex-wrap items-center gap-space-sm pt-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest text-on-surface-variant font-label-md text-label-md shadow-sm">
                      <span className="material-symbols-outlined text-primary text-[18px]">calendar_month</span>
                      <span>Saturday, 6:00 PM – 7:00 PM IST (60 Mins)</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest text-on-surface-variant font-label-md text-label-md shadow-sm">
                      <span className="material-symbols-outlined text-secondary text-[18px]">mark_email_read</span>
                      <span>
                        Sent to <strong className="text-on-surface font-semibold">{registration?.email}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Calendar CTA buttons */}
                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch md:items-end gap-space-sm shrink-0">
                  <a
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md shadow-md transition-all active:scale-95"
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Build+Your+First+AI+Project+in+60+Minutes+-+NxtWave&details=Live+hands-on+coding+session+building+${encodeURIComponent(
                      blueprint.title
                    )}&dates=20261107T123000Z/20261107T133000Z`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="material-symbols-outlined text-[20px]">event_available</span>
                    <span>Add to Google Calendar</span>
                  </a>

                  <button
                    onClick={handleDownloadIcs}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md shadow-sm transition-all cursor-pointer"
                    id="addToCalSecondary"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">download</span>
                    <span>.ICS Invite</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN TWO-COLUMN CONTENT */}
          <div className="max-w-[1200px] mx-auto px-gutter py-space-xl w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
              {/* LEFT COLUMN: Blueprint & Syllabus Breakdown (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col gap-space-lg">
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-surface-container-high/60">
                  <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-high/40">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[20px]">architecture</span>
                      </div>
                      <div>
                        <p className="font-badge-caption text-badge-caption uppercase tracking-wider text-secondary">
                          Step 1 of 3 Selected
                        </p>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                          Your Personalized Project Blueprint
                        </h2>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm font-semibold">
                      Ready to Build
                    </span>
                  </div>

                  {/* Summary Box */}
                  <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-sm">
                    <div className="flex flex-wrap items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
                      <span className="inline-flex items-center gap-1 font-semibold text-on-surface">
                        <span className="material-symbols-outlined text-primary text-[16px]">school</span>
                        Branch: {registration?.branch || 'CSE'}
                      </span>
                      <span>•</span>
                      <span>Focus: {blueprint.interest}</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 rounded bg-surface-container-lowest text-primary font-bold">
                        Beginner Friendly
                      </span>
                    </div>

                    <h3 className="font-headline-md text-headline-md text-on-surface font-extrabold tracking-tight">
                      {blueprint.title}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      {blueprint.detailedDesc}
                    </p>
                  </div>

                  {/* 60-Minute Workshop Milestones */}
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface uppercase tracking-wider mb-3">
                      60-Minute Workshop Milestones
                    </h4>
                    <div className="space-y-3">
                      {blueprint.milestones.map((milestone) => (
                        <div
                          key={milestone.milestoneNumber}
                          className="flex items-start gap-space-md p-space-md rounded-lg bg-surface-container-lowest border border-surface-container-high/60 shadow-sm"
                        >
                          <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-label-sm shrink-0">
                            {milestone.milestoneNumber}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-label-md text-label-md text-on-surface font-bold">
                                {milestone.timeframe} • {milestone.title}
                              </span>
                              <span className="font-badge-caption text-badge-caption text-secondary">
                                Milestone {milestone.milestoneNumber}
                              </span>
                            </div>
                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                              {milestone.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Target Technology Stack */}
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface uppercase tracking-wider mb-2">
                      Target Technology Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {blueprint.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container font-label-md text-label-md text-on-surface font-medium"
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              i === 0
                                ? 'bg-primary'
                                : i === 1
                                ? 'bg-secondary'
                                : i === 2
                                ? 'bg-tertiary'
                                : 'bg-outline'
                            }`}
                          ></span>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-space-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm">
                    <button
                      onClick={handleDownloadPdf}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-md text-label-md transition-colors cursor-pointer"
                      id="downloadPdfBtn"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                      <span>Download Blueprint PDF</span>
                    </button>

                    <a
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-surface-container hover:bg-surface-variant text-on-surface font-label-md text-label-md transition-colors text-center"
                      href="#prep"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Pre-read materials will be emailed 2 hours before the live session.');
                      }}
                    >
                      <span className="material-symbols-outlined text-[18px]">menu_book</span>
                      <span>Workshop Pre-read Guide (10 min)</span>
                    </a>
                  </div>
                </div>

                {/* Preparation Checklist */}
                <div
                  id="prep"
                  className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex items-center justify-between gap-space-md border border-surface-container-high/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined">laptop_mac</span>
                    </div>
                    <div>
                      <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        Preparation Checklist
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Zero complex software installations needed. We will use cloud-hosted Jupyter &amp; Google Colab.
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary text-[28px] shrink-0">verified</span>
                </div>
              </div>

              {/* RIGHT COLUMN: Referral Multiplier & Sharing Engine (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col gap-space-lg">
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-surface-container-high/60">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 text-primary font-badge-caption text-badge-caption uppercase font-bold tracking-wider">
                      <span className="material-symbols-outlined text-[16px]">groups</span>
                      <span>Study Squad Multiplier</span>
                    </div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Share Blueprint With Classmates
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      Students who build in peer pairs complete their AI projects 3x faster and are 80% more likely to publish to GitHub.
                    </p>
                  </div>

                  {/* Share Card Preview Box */}
                  <div className="rounded-xl bg-surface-container-low p-space-md relative overflow-hidden shadow-inner flex flex-col gap-space-sm border border-surface-container-high/40">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-label-sm">
                          {initials}
                        </div>
                        <div>
                          <p className="font-label-md text-label-md text-on-surface font-bold leading-none">
                            {registration?.name}
                          </p>
                          <p className="font-badge-caption text-badge-caption text-on-surface-variant leading-tight">
                            {registration?.college} • {registration?.branch} &apos;26
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-badge-caption font-bold bg-primary text-on-primary">
                        NxtWave AI
                      </span>
                    </div>

                    <div className="rounded-lg bg-surface-container-lowest p-3 shadow-sm border border-surface-container-high/40">
                      <p className="font-badge-caption text-badge-caption text-secondary uppercase font-semibold">
                        My AI Sprint Blueprint
                      </p>
                      <p className="font-headline-sm text-headline-sm text-on-surface font-bold mt-0.5 truncate">
                        {blueprint.title}
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        Building this in 60 minutes this Saturday! Join my cohort to build yours for free.
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-label-sm font-label-sm text-on-surface-variant pt-1">
                      <span>Free Saturday Sprint</span>
                      <span className="text-primary font-semibold font-mono text-label-sm">{studentRefCode}</span>
                    </div>
                  </div>

                  {/* Invite Link & Copy Action */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="referralInput">
                      Your Referral Invite Link
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1 min-w-0">
                        <input
                          className="w-full px-3 py-2.5 bg-surface-container-low text-on-surface font-mono text-label-md rounded-lg outline-none select-all border border-surface-container-high/60 truncate"
                          id="referralInput"
                          readOnly
                          type="text"
                          value={shareUrl}
                        />
                      </div>
                      <button
                        onClick={handleCopy}
                        className="px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold transition-all shrink-0 active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm"
                        id="copyLinkBtn"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]" id="copyIcon">
                          {copied ? 'check' : 'content_copy'}
                        </span>
                        <span id="copyBtnText">{copied ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    {copied && (
                      <p className="font-label-sm text-label-sm text-primary transition-all animate-in fade-in" id="copyStatusNotice">
                        ✓ Link copied to clipboard! Share with your friends.
                      </p>
                    )}
                  </div>

                  {/* One-Click Social Share */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                        One-Click Share
                      </p>
                      <button
                        onClick={handleNativeShare}
                        className="text-primary font-label-sm text-label-sm font-semibold hover:underline flex items-center gap-1"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">share</span>
                        <span>More Options</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {/* WhatsApp Share */}
                      <a
                        className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] transition-colors gap-1 text-center"
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <span className="material-symbols-outlined text-[20px]">chat</span>
                        <span className="font-label-sm text-label-sm font-bold">WhatsApp</span>
                      </a>

                      {/* LinkedIn Share */}
                      <a
                        className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] transition-colors gap-1 text-center"
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <span className="material-symbols-outlined text-[20px]">feed</span>
                        <span className="font-label-sm text-label-sm font-bold">LinkedIn</span>
                      </a>

                      {/* Telegram Share */}
                      <a
                        className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-surface-container hover:bg-surface-variant text-on-surface transition-colors gap-1 text-center"
                        href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(
                          `Join me for this free AI Workshop! I'm building ${blueprint.title}`
                        )}`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <span className="material-symbols-outlined text-[20px]">send</span>
                        <span className="font-label-sm text-label-sm font-bold">Telegram</span>
                      </a>
                    </div>
                  </div>

                  {/* Study Group Progress Card */}
                  <div className="rounded-xl bg-surface-container-low p-space-md space-y-3 border border-surface-container-high/40">
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md text-on-surface font-bold">Study Group Progress</span>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-badge-caption text-badge-caption">
                        {referralCount > 0 ? 'Live Verified' : 'Real-time Tracker'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-label-sm text-label-sm">
                        <span className="text-on-surface font-semibold">{referralCount} / 3 Friends Joined</span>
                        <span className="text-secondary font-bold">{progressPercentage}% Complete</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-surface-container-high overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          id="studyProgressBar"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-surface-container-lowest text-on-surface space-y-1 border border-surface-container-high/40">
                      <div className="flex items-center gap-1.5 text-primary font-label-sm text-label-sm font-bold">
                        <span className="material-symbols-outlined text-[16px]">lock_open</span>
                        <span>Squad Bonus Perk</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Invite 3 friends to unlock the optional{' '}
                        <strong className="text-on-surface">
                          &quot;AI Prompt Engineering Cheat Sheet for Developers&quot;
                        </strong>{' '}
                        Git repo during the live session.
                      </p>
                    </div>

                    <p className="font-badge-caption text-badge-caption text-on-surface-variant italic">
                      Notice: Referral tracking is strictly for peer study group coordination. Workshop admission is 100% free with or without invitations.
                    </p>
                  </div>
                </div>

                {/* WhatsApp Community Questions */}
                <div className="rounded-xl bg-surface-container-high p-space-md flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[22px]">support_agent</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-label-md text-label-md text-on-surface font-bold">
                      Have Questions Before Saturday?
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      Drop into the NxtWave Student WhatsApp Community Channel for quick mentor answers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function BlueprintSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center">Loading...</div>}>
      <BlueprintContent />
    </Suspense>
  );
}
