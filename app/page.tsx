'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { AcademicBranch, CodingLevel, ProjectInterest } from '@/types';
import { getRecommendedBlueprint } from '@/lib/blueprints';
import confetti from 'canvas-confetti';

function ProjectMatcherContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Matcher state
  const [selectedBranch, setSelectedBranch] = useState<AcademicBranch>('CSE');
  const [selectedInterest, setSelectedInterest] = useState<ProjectInterest>('Resume & Career Tools');
  const [selectedLevel, setSelectedLevel] = useState<CodingLevel>('Beginner');
  const [isFinding, setIsFinding] = useState(false);

  // Form state pre-populated with demo defaults for frictionless 1-click evaluation
  const [name, setName] = useState('Aarav Sharma');
  const [email, setEmail] = useState('aarav.sharma@vtu.ac.in');
  const [college, setCollege] = useState('Visvesvaraya Technological University');
  const [branchSelect, setBranchSelect] = useState('CSE');
  const [referralCode, setReferralCode] = useState('CAMPUS-AI-829');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [duplicateExisting, setDuplicateExisting] = useState<any | null>(null);

  // Auto-capture referral code from URL query params (e.g. ?ref=CAMPUS-AI-829 or ?ref=AARAV-CSE-2025)
  useEffect(() => {
    const refFromUrl = searchParams.get('ref');
    if (refFromUrl) {
      setReferralCode(refFromUrl.toUpperCase());
    }
  }, [searchParams]);

  // Sync branch selection between matcher and dropdown
  const handleBranchChange = (branch: AcademicBranch) => {
    setSelectedBranch(branch);
    setBranchSelect(branch);
  };

  const currentBlueprint = getRecommendedBlueprint(selectedBranch, selectedInterest, selectedLevel);

  const handleFindProject = () => {
    setIsFinding(true);
    setTimeout(() => {
      setIsFinding(false);
      // Smooth scroll to recommendation preview
      const recElem = document.getElementById('blueprint-preview');
      if (recElem) {
        recElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 350);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setDuplicateExisting(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid college or personal email address.');
      return;
    }
    if (!college.trim()) {
      setErrorMessage('Please enter your college / university name.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          college: college.trim(),
          branch: branchSelect,
          interest: selectedInterest,
          codingLevel: selectedLevel,
          referralCode: referralCode.trim() || null,
        }),
      });

      const data = await response.json();

      if (response.status === 409) {
        // Duplicate registration
        setErrorMessage(data.error || 'This email is already registered.');
        setDuplicateExisting(data.registration);
        setIsSubmitting(false);
        return;
      }

      if (!response.ok) {
        setErrorMessage(data.error || 'Failed to submit registration. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Celebratory confetti on genuine registration!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#006948', '#86f2e4', '#00855d', '#85f8c4'],
        });
      } catch (err) {
        // ignore if canvas-confetti is not loaded
      }

      // Redirect to Screen 2: Registration Success & Blueprint
      setTimeout(() => {
        router.push(`/blueprint?id=${data.registration.id}`);
      }, 700);
    } catch (err: any) {
      console.error('Registration submission error:', err);
      setErrorMessage('Network error occurred. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="w-full pt-16 bg-surface min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col w-full">
          {/* Subtle Ambient Glow */}
          <div className="relative w-full overflow-hidden">
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-48 -right-32 w-[30rem] h-[30rem] bg-secondary-container/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-[1200px] mx-auto px-gutter py-space-xl relative z-10">
              {/* HERO SECTION */}
              <section className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-space-md">
                {/* Live Status Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container text-primary font-badge-caption text-badge-caption uppercase tracking-wider shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span>NxtWave Free Online Masterclass • 60 Mins Hands-on</span>
                </div>

                {/* Headline */}
                <h1 className="font-display-xl text-display-xl tracking-tight text-on-surface font-extrabold max-w-2xl">
                  Your First AI Project Starts Here.
                </h1>

                {/* Subtitle */}
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                  Discover a project idea that matches your interests, then join a free 60-minute workshop to build and deploy it live.
                </p>

                {/* Trust / Experience Badge */}
                <div className="inline-flex flex-wrap items-center justify-center gap-space-sm px-4 py-2 rounded-xl bg-surface-container-low text-on-surface shadow-sm text-center">
                  <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
                  <span className="font-label-md text-label-md font-semibold">
                    Zero prior AI experience required • Interactive live coding • Free Certificate
                  </span>
                </div>
              </section>

              {/* MAIN MATCHER & RECOMMENDATION GRID */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mt-space-xl items-start">
                {/* LEFT COLUMN: Interactive 3-Step Matcher Form */}
                <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-space-lg shadow-md flex flex-col space-y-space-lg border border-surface-container-high/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="w-8 h-8 rounded-lg bg-surface-container-high text-primary flex items-center justify-center font-label-md font-bold">
                        1
                      </span>
                      <div>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                          Personalized Matcher
                        </h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Step-by-step project engine</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold">
                      Adaptive
                    </span>
                  </div>

                  {/* Step 1: Branch Selection */}
                  <div className="space-y-space-sm">
                    <label className="block font-label-md text-label-md text-on-surface font-bold">
                      1. Select your Academic Branch
                    </label>
                    <div className="flex flex-wrap gap-2" id="branch-pills">
                      {(
                        [
                          { key: 'CSE', label: 'CSE' },
                          { key: 'IT', label: 'IT' },
                          { key: 'AIML', label: 'AI / ML' },
                          { key: 'ECE', label: 'ECE' },
                          { key: 'OTHER', label: 'Other' },
                        ] as const
                      ).map((item) => {
                        const isSelected = selectedBranch === item.key;
                        return (
                          <button
                            key={item.key}
                            onClick={() => handleBranchChange(item.key)}
                            type="button"
                            className={`px-3.5 py-2 rounded-lg font-label-sm text-label-sm font-semibold transition-all shadow-sm ${
                              isSelected
                                ? 'bg-primary text-on-primary ring-2 ring-primary/30'
                                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Interest Area */}
                  <div className="space-y-space-sm">
                    <label className="block font-label-md text-label-md text-on-surface font-bold">
                      2. What do you want to build?
                    </label>
                    <div className="grid grid-cols-2 gap-2" id="interest-pills">
                      {(
                        [
                          { key: 'Chatbot', label: 'Smart Chatbot', icon: 'chat_bubble' },
                          { key: 'Resume & Career Tools', label: 'Resume & Career Tools', icon: 'article' },
                          { key: 'Study Assistant', label: 'Study Assistant', icon: 'school' },
                          { key: 'Data Dashboard', label: 'Data Dashboard', icon: 'query_stats' },
                        ] as const
                      ).map((item) => {
                        const isSelected = selectedInterest === item.key;
                        return (
                          <button
                            key={item.key}
                            onClick={() => setSelectedInterest(item.key)}
                            type="button"
                            className={`text-left p-3 rounded-lg font-label-sm text-label-sm font-semibold transition-all shadow-sm flex flex-col gap-1 ${
                              isSelected
                                ? 'bg-primary text-on-primary ring-2 ring-primary/30'
                                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                            }`}
                          >
                            <span
                              className={`material-symbols-outlined text-[18px] ${
                                isSelected ? 'text-on-primary' : 'text-primary'
                              }`}
                            >
                              {item.icon}
                            </span>
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 3: Coding Level */}
                  <div className="space-y-space-sm">
                    <label className="block font-label-md text-label-md text-on-surface font-bold">
                      3. Current Coding Experience
                    </label>
                    <div className="grid grid-cols-3 gap-2" id="level-pills">
                      {(
                        [
                          { key: 'Beginner', label: 'Beginner' },
                          { key: 'Basic', label: 'Basic C/Java' },
                          { key: 'Intermediate', label: 'Intermediate' },
                        ] as const
                      ).map((item) => {
                        const isSelected = selectedLevel === item.key;
                        return (
                          <button
                            key={item.key}
                            onClick={() => setSelectedLevel(item.key)}
                            type="button"
                            className={`py-2.5 px-2 text-center rounded-lg font-label-sm text-label-sm font-semibold transition-all shadow-sm ${
                              isSelected
                                ? 'bg-primary text-on-primary ring-2 ring-primary/30'
                                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <button
                      onClick={handleFindProject}
                      disabled={isFinding}
                      className="w-full flex items-center justify-center gap-space-sm py-3 px-space-lg rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold shadow-md hover:bg-primary-container transition-all active:scale-[0.985] cursor-pointer"
                      id="find-project-btn"
                      type="button"
                    >
                      <span className={`material-symbols-outlined text-[20px] ${isFinding ? 'animate-spin' : ''}`}>
                        {isFinding ? 'sync' : 'auto_awesome'}
                      </span>
                      <span>{isFinding ? 'Matching Blueprint...' : 'Find My Project'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm px-1">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary"></span> Instant match based on branch
                    </span>
                    <span>Takes ~30 seconds</span>
                  </div>
                </div>

                {/* RIGHT COLUMN: Revealed Blueprint Recommendation Card */}
                <div id="blueprint-preview" className="lg:col-span-7 flex flex-col space-y-space-md">
                  <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-md relative overflow-hidden border border-surface-container-high/60 transition-all">
                    {/* Accent Top Marker */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-primary-container to-secondary"></div>

                    {/* Top Header Category & Match Score */}
                    <div className="flex flex-wrap items-center justify-between gap-space-sm pt-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary font-badge-caption text-badge-caption uppercase tracking-wider font-bold">
                        <span className="material-symbols-outlined text-[14px]">psychology</span>
                        <span>{currentBlueprint.category}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low font-label-sm text-label-sm text-on-surface font-semibold">
                        <span className="material-symbols-outlined text-[16px] text-primary">speed</span>
                        <span>
                          60 Mins Feasibility: <strong>{currentBlueprint.feasibility}</strong> (Estimated)
                        </span>
                      </div>
                    </div>

                    {/* Title & Short Description */}
                    <div className="mt-space-md space-y-1">
                      <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                        {currentBlueprint.title}
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        {currentBlueprint.desc}
                      </p>
                    </div>

                    {/* Tech Stack Tags */}
                    <div className="mt-space-md flex flex-wrap items-center gap-2">
                      {currentBlueprint.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-surface-container font-label-sm text-label-sm text-on-surface font-semibold flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[14px] text-primary">
                            {i === 0 ? 'terminal' : i === 1 ? 'bolt' : 'palette'}
                          </span>
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Implementation Roadmap Visual */}
                    <div className="mt-space-lg space-y-space-sm">
                      <div className="font-label-md text-label-md text-on-surface font-bold flex items-center justify-between">
                        <span>3-Phase Workshop Sprint Architecture</span>
                        <span className="text-on-surface-variant font-label-sm font-normal">Included in Live Session</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
                        {currentBlueprint.milestones.map((m) => (
                          <div key={m.milestoneNumber} className="bg-surface-container-low p-3.5 rounded-lg space-y-1 shadow-sm">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-badge-caption text-badge-caption flex items-center justify-center font-bold">
                                {m.milestoneNumber}
                              </span>
                              <span className="font-label-sm text-label-sm font-bold text-on-surface truncate">
                                {m.title}
                              </span>
                            </div>
                            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">
                              {m.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Value Highlight Banner */}
                    <div className="mt-space-lg bg-surface-container-low rounded-xl p-space-md flex items-start gap-space-md shadow-sm">
                      <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[22px]">workspace_premium</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-label-md text-label-md font-bold text-on-surface">
                          Why this is high-impact for your portfolio
                        </h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                          {currentBlueprint.portfolioImpact}
                        </p>
                      </div>
                    </div>

                    {/* Disclaimer Note */}
                    <p className="mt-space-md text-on-surface-variant font-body-sm text-body-sm italic">
                      Note: This blueprint is an illustrative project recommendation tailored to your background, not a guarantee of the exact code built in the 60-minute live workshop.
                    </p>
                  </div>

                  {/* Quick Metrics Bar */}
                  <div className="grid grid-cols-3 gap-space-md">
                    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm text-center border border-surface-container-high/40">
                      <div className="font-headline-md text-headline-md font-bold text-primary">12,400+</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">Past Masterclass Learners</div>
                    </div>
                    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm text-center border border-surface-container-high/40">
                      <div className="font-headline-md text-headline-md font-bold text-primary">4.9/5</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">Past Participant Rating</div>
                    </div>
                    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm text-center border border-surface-container-high/40">
                      <div className="font-headline-md text-headline-md font-bold text-primary">100% Free</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">Sponsored Workshop</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* REGISTRATION SECTION: Anchor Form Card */}
              <section
                className="mt-space-xl bg-surface-container-lowest rounded-2xl p-space-lg md:p-space-xl shadow-lg relative overflow-hidden border border-surface-container-high/60"
                id="registration-dock"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
                  {/* Registration Left Description */}
                  <div className="lg:col-span-5 space-y-space-md">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-primary font-badge-caption text-badge-caption uppercase font-bold tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      <span>Seats Filling Rapidly</span>
                    </div>

                    <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface leading-tight">
                      Save My Blueprint &amp; Register for the Workshop
                    </h3>

                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Lock in your personalized AI roadmap, download project boilerplate starter code, and receive direct live session access for this Saturday's cohort.
                    </p>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface font-semibold">
                          100% Free Workshop hosted by NxtWave Senior Engineers
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface font-semibold">
                          Live Q&amp;A and real-time debugging assistance
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface font-semibold">
                          Verifiable Certificate of Participation included
                        </span>
                      </div>
                    </div>

                    {/* Referral Indicator Banner */}
                    <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="material-symbols-outlined text-primary text-[20px] shrink-0">share</span>
                        <div className="min-w-0">
                          <div className="font-label-sm text-label-sm font-bold text-on-surface truncate">
                            {referralCode ? 'Referral Code Applied' : 'Campus Ambassador Code'}
                          </div>
                          <div className="font-body-sm text-body-sm text-on-surface-variant font-mono truncate">
                            {referralCode || 'CAMPUS-AI-829'}
                          </div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-surface-container text-primary font-badge-caption text-badge-caption uppercase font-bold shrink-0">
                        {referralCode ? 'Link Applied' : 'Friend Referral Applied'}
                      </span>
                    </div>
                  </div>

                  {/* Registration Right Inputs Form */}
                  <div className="lg:col-span-7 bg-surface rounded-xl p-space-lg shadow-sm border border-surface-container-high/40">
                    <form className="space-y-space-md" onSubmit={handleRegisterSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                        {/* Full Name */}
                        <div className="space-y-1">
                          <label className="block font-label-sm text-label-sm font-bold text-on-surface" htmlFor="reg-name">
                            Full Name <span className="text-error">*</span>
                          </label>
                          <div className="relative">
                            <input
                              className="w-full h-11 px-3.5 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-outline-variant"
                              id="reg-name"
                              placeholder="e.g. Aarav Sharma"
                              required
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                            {name.trim().length > 2 && (
                              <span className="absolute right-3 top-3 material-symbols-outlined text-primary text-[18px]">
                                check_circle
                              </span>
                            )}
                          </div>
                        </div>

                        {/* College Email Address */}
                        <div className="space-y-1">
                          <label className="block font-label-sm text-label-sm font-bold text-on-surface" htmlFor="reg-email">
                            College Email Address <span className="text-error">*</span>
                          </label>
                          <div className="relative">
                            <input
                              className="w-full h-11 px-3.5 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-outline-variant"
                              id="reg-email"
                              placeholder="student@college.edu"
                              required
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                            {email.includes('@') && email.includes('.') && (
                              <span className="absolute right-3 top-3 material-symbols-outlined text-primary text-[18px]">
                                verified
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* College Name */}
                      <div className="space-y-1">
                        <label className="block font-label-sm text-label-sm font-bold text-on-surface" htmlFor="reg-college">
                          College / University Name <span className="text-error">*</span>
                        </label>
                        <div className="relative">
                          <input
                            className="w-full h-11 px-3.5 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-outline-variant"
                            id="reg-college"
                            placeholder="e.g. Visvesvaraya Technological University"
                            required
                            type="text"
                            value={college}
                            onChange={(e) => setCollege(e.target.value)}
                          />
                          <span className="absolute right-3 top-3 material-symbols-outlined text-on-surface-variant text-[18px]">
                            apartment
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                        {/* Academic Branch */}
                        <div className="space-y-1">
                          <label className="block font-label-sm text-label-sm font-bold text-on-surface" htmlFor="reg-branch">
                            Academic Branch <span className="text-error">*</span>
                          </label>
                          <div className="relative">
                            <select
                              className="w-full h-11 px-3.5 pr-10 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer"
                              id="reg-branch"
                              value={branchSelect}
                              onChange={(e) => {
                                setBranchSelect(e.target.value);
                                setSelectedBranch(e.target.value as AcademicBranch);
                              }}
                            >
                              <option value="CSE">Computer Science &amp; Engineering</option>
                              <option value="IT">Information Technology</option>
                              <option value="AIML">Artificial Intelligence &amp; Data Science</option>
                              <option value="ECE">Electronics &amp; Communication</option>
                              <option value="OTHER">Mechanical / Civil / Electrical / Other</option>
                            </select>
                            <span className="absolute right-3 top-3 material-symbols-outlined text-on-surface-variant text-[18px] pointer-events-none">
                              expand_more
                            </span>
                          </div>
                        </div>

                        {/* Referral Code */}
                        <div className="space-y-1">
                          <label className="block font-label-sm text-label-sm font-bold text-on-surface flex items-center justify-between" htmlFor="reg-ref">
                            <span>Referral Code (Optional)</span>
                            {referralCode && (
                              <span className="text-primary font-badge-caption uppercase text-badge-caption font-bold">
                                Verified
                              </span>
                            )}
                          </label>
                          <div className="relative">
                            <input
                              className="w-full h-11 px-3.5 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all uppercase tracking-wider font-mono placeholder:text-outline-variant"
                              id="reg-ref"
                              placeholder="e.g. CAMPUS-AI-829"
                              type="text"
                              value={referralCode}
                              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                            />
                            <span className="absolute right-3 top-3 material-symbols-outlined text-primary text-[18px]">
                              loyalty
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Error & Duplicate Alerts */}
                      {errorMessage && (
                        <div className="p-3.5 rounded-lg bg-error-container/40 border border-error/30 text-on-surface flex items-start gap-2.5 animate-in fade-in">
                          <span className="material-symbols-outlined text-error text-[20px] shrink-0 mt-0.5">
                            error
                          </span>
                          <div className="flex-1 text-body-sm text-body-sm">
                            <p className="font-semibold text-error">{errorMessage}</p>
                            {duplicateExisting && (
                              <button
                                type="button"
                                onClick={() => router.push(`/blueprint?id=${duplicateExisting.id}`)}
                                className="mt-2 text-primary font-bold underline hover:opacity-80 block text-label-sm"
                              >
                                View your saved blueprint &amp; referral link &rarr;
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Submit Button */}
                      <div className="pt-2">
                        <button
                          className="w-full h-12 flex items-center justify-center gap-space-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold shadow-md hover:bg-primary-container transition-all active:scale-[0.985] cursor-pointer disabled:opacity-70"
                          id="submit-reg-btn"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          <span className={`material-symbols-outlined text-[20px] ${isSubmitting ? 'animate-spin' : ''}`}>
                            {isSubmitting ? 'sync' : 'how_to_reg'}
                          </span>
                          <span>
                            {isSubmitting
                              ? 'Saving Registration...'
                              : 'Confirm Registration & Get Workshop Access (Free)'}
                          </span>
                        </button>
                      </div>

                      {/* Trust Reassurance */}
                      <div className="text-center font-body-sm text-body-sm text-on-surface-variant flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[16px]">lock</span>
                        <span>Your information is protected • Workshop join link sent to college email instantly</span>
                      </div>
                    </form>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function ProjectMatcherPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center">Loading...</div>}>
      <ProjectMatcherContent />
    </Suspense>
  );
}
