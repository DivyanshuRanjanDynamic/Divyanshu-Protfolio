import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  FiGithub, FiExternalLink, FiRefreshCw, FiCode, FiAward, FiTrendingUp,
  FiFolder, FiStar, FiGitBranch, FiUsers, FiCheckCircle
} from 'react-icons/fi';
import SectionWrapper from '../components/SectionWrapper';
import profile from '../data/profile';

// Types for API Responses
interface GitHubData {
  repos: number;
  stars: number;
  forks: number;
  followers: number;
  totalContributions: number;
  lastUpdated: string;
}

interface LeetCodeData {
  totalSolved: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  acceptanceRate: number;
  ranking: number;
  lastUpdated: string;
}

const GITHUB_USERNAME = 'DivyanshuRanjanDynamic';
const LEETCODE_USERNAME = 'Divyanshu_Ranjan_';

export default function Activity() {
  const [github, setGithub] = useState<GitHubData>({
    repos: 16,
    stars: 8,
    forks: 4,
    followers: 3,
    totalContributions: 513,
    lastUpdated: 'Just now',
  });

  const [leetcode, setLeetcode] = useState<LeetCodeData>({
    totalSolved: 224,
    totalEasy: 878,
    easySolved: 50,
    totalMedium: 1807,
    mediumSolved: 145,
    totalHard: 763,
    hardSolved: 29,
    acceptanceRate: 53.73,
    ranking: 482105,
    lastUpdated: 'Just now',
  });

  const [loading, setLoading] = useState(false);
  const [usingBackup, setUsingBackup] = useState(false);

  const fetchAllStats = useCallback(async (forceRefresh: boolean = false) => {
    setLoading(true);
    let fetchedFromBackend = false;

    // 1. Try Backend API first (/api/activity)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/activity${forceRefresh ? '?refresh=true' : ''}`);
      if (res.ok) {
        const data = await res.json();
        if (data.github) {
          setGithub(prev => ({
            ...prev,
            repos: data.github.repos ?? prev.repos,
            stars: data.github.stars ?? prev.stars,
            forks: data.github.forks ?? prev.forks,
            followers: data.github.followers ?? prev.followers,
            lastUpdated: 'Just now',
          }));
        }
        if (data.leetcode) {
          setLeetcode(prev => ({
            ...prev,
            totalSolved: data.leetcode.totalSolved ?? prev.totalSolved,
            easySolved: data.leetcode.easySolved ?? prev.easySolved,
            totalEasy: data.leetcode.totalEasy ?? prev.totalEasy,
            mediumSolved: data.leetcode.mediumSolved ?? prev.mediumSolved,
            totalMedium: data.leetcode.totalMedium ?? prev.totalMedium,
            hardSolved: data.leetcode.hardSolved ?? prev.hardSolved,
            totalHard: data.leetcode.totalHard ?? prev.totalHard,
            ranking: data.leetcode.ranking ?? prev.ranking,
            acceptanceRate: data.leetcode.acceptanceRate ?? prev.acceptanceRate,
            lastUpdated: 'Just now',
          }));
        }
        fetchedFromBackend = true;
        setUsingBackup(false);
      }
    } catch {
      // Backend offline, will use client-side fetchers
    }

    if (!fetchedFromBackend) {
      // 2. Direct GitHub REST API
      try {
        const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`);
          let totalStars = 0;
          let totalForks = 0;
          if (reposRes.ok) {
            const reposData = await reposRes.json();
            if (Array.isArray(reposData)) {
              totalStars = reposData.reduce((acc: number, r: any) => acc + (r.stargazers_count || 0), 0);
              totalForks = reposData.reduce((acc: number, r: any) => acc + (r.forks_count || 0), 0);
            }
          }
          setGithub(prev => ({
            ...prev,
            repos: userData.public_repos || prev.repos,
            followers: userData.followers || prev.followers,
            stars: totalStars || prev.stars,
            forks: totalForks || prev.forks,
            lastUpdated: 'Just now',
          }));
        }
      } catch {
        // keep current state
      }

      // 3. Direct LeetCode GraphQL / API Fallback
      try {
        const lcRes = await fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${LEETCODE_USERNAME}`);
        if (lcRes.ok) {
          const data = await lcRes.json();
          if (data && (data.totalSolved !== undefined || data.matchedUserStats)) {
            const stats = data.matchedUserStats?.acSubmissionNum || [];
            const easy = stats.find((s: any) => s.difficulty === 'Easy')?.count ?? data.easySolved ?? 50;
            const medium = stats.find((s: any) => s.difficulty === 'Medium')?.count ?? data.mediumSolved ?? 145;
            const hard = stats.find((s: any) => s.difficulty === 'Hard')?.count ?? data.hardSolved ?? 29;
            const total = data.totalSolved ?? (easy + medium + hard);

            setLeetcode(prev => ({
              ...prev,
              totalSolved: total || 224,
              easySolved: easy,
              mediumSolved: medium,
              hardSolved: hard,
              ranking: data.ranking || prev.ranking,
              acceptanceRate: data.acceptanceRate || prev.acceptanceRate,
              lastUpdated: 'Just now',
            }));
            setUsingBackup(false);
          }
        }
      } catch {
        setUsingBackup(true);
      }
    }

    setLoading(false);
  }, []);

  const handleRefresh = () => {
    fetchAllStats(true);
  };

  useEffect(() => {
    fetchAllStats(false);
  }, [fetchAllStats]);

  // Generate 52-week mock contribution cells matching real github chart styling
  const contributionWeeks = useMemo(() => {
    const weeks = [];
    for (let w = 0; w < 52; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        // Pseudo-random level 0..4 based on pattern
        const rand = (w * 7 + d * 3) % 11;
        let level = 0;
        if (rand > 8) level = 4;
        else if (rand > 6) level = 3;
        else if (rand > 4) level = 2;
        else if (rand > 2) level = 1;
        days.push(level);
      }
      weeks.push(days);
    }
    return weeks;
  }, []);

  const levelColorsDark = [
    'bg-slate-800/40',
    'bg-[#0e4429] border border-emerald-800/40',
    'bg-[#006d32]',
    'bg-[#26a641]',
    'bg-[#39d353] shadow-[0_0_10px_rgba(57,211,83,0.8)]',
  ];

  const levelColorsLight = [
    'bg-slate-200/60',
    'bg-[#9be9a8] border border-green-300',
    'bg-[#40c463]',
    'bg-[#30a14e]',
    'bg-[#216e39] shadow-[0_0_6px_rgba(33,110,57,0.4)]',
  ];

  // LeetCode donut breakdown angles
  const total = leetcode.totalSolved || 1;
  const easyPct = (leetcode.easySolved / total) * 100;
  const medPct = (leetcode.mediumSolved / total) * 100;
  const hardPct = (leetcode.hardSolved / total) * 100;

  return (
    <SectionWrapper id="activity" className="relative pb-32">
      {/* Top Header Badge */}
      <div className="text-center mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-500/30 bg-accent-500/10 text-accent-500 hud-text text-xs mb-4">
          <FiCode size={13} />
          Live Stats
        </div>
        <h2 className="section-heading text-slate-900 dark:text-slate-100 mb-3">
          GitHub & Problem Solving Activity
        </h2>
        <p className="hud-text lowercase tracking-widest text-slate-500 max-w-xl mx-auto">
          Early-stage but consistent activity across problem solving and personal projects
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-12">

        {/* ========================================================= */}
        {/* BLOCK 1: GITHUB ACTIVITY                                  */}
        {/* ========================================================= */}
        <div className="glass rounded-sm p-6 sm:p-8 border border-light-border dark:border-dark-border relative">

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200/60 dark:border-dark-border/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-md bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100">
                <FiGithub size={20} />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100">
                  GitHub Activity
                </h3>
                <p className="font-mono text-xs text-slate-500">
                  @{GITHUB_USERNAME}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <span className="hud-text text-[10px] text-slate-400">
                {github.lastUpdated}
              </span>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="btn-secondary py-1.5 px-3 text-[10px] flex items-center gap-1.5"
              >
                <FiRefreshCw size={11} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
              <a
                href={profile.meta.github}
                target="_blank"
                rel="noreferrer"
                className="btn-primary py-1.5 px-3 text-[10px] flex items-center gap-1.5"
              >
                Profile <FiExternalLink size={11} />
              </a>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="glass p-5 rounded-sm border border-light-border dark:border-dark-border">
              <div className="flex items-center justify-between text-accent-500 mb-2">
                <FiFolder size={18} />
              </div>
              <div className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
                {github.repos}
              </div>
              <div className="hud-text text-[10px] text-slate-500 mt-1">Repositories</div>
            </div>

            <div className="glass p-5 rounded-sm border border-light-border dark:border-dark-border">
              <div className="flex items-center justify-between text-amber-500 mb-2">
                <FiStar size={18} />
              </div>
              <div className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
                {github.stars}
              </div>
              <div className="hud-text text-[10px] text-slate-500 mt-1">Total Stars</div>
            </div>

            <div className="glass p-5 rounded-sm border border-light-border dark:border-dark-border">
              <div className="flex items-center justify-between text-emerald-500 mb-2">
                <FiGitBranch size={18} />
              </div>
              <div className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
                {github.forks}
              </div>
              <div className="hud-text text-[10px] text-slate-500 mt-1">Total Forks</div>
            </div>

            <div className="glass p-5 rounded-sm border border-light-border dark:border-dark-border">
              <div className="flex items-center justify-between text-cyan-500 mb-2">
                <FiUsers size={18} />
              </div>
              <div className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
                {github.followers}
              </div>
              <div className="hud-text text-[10px] text-slate-500 mt-1">Followers</div>
            </div>
          </div>

          {/* Contribution Heatmap Calendar */}
          <div className="glass p-6 rounded-sm border border-light-border dark:border-dark-border overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
                Contribution Activity
              </h4>
              <span className="hud-text text-emerald-500 dark:text-emerald-400 text-[10px]">
                [ {github.totalContributions}+ COMMITS ]
              </span>
            </div>

            {/* Months Header */}
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-2 px-1 min-w-[650px]">
              {['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map(m => (
                <span key={m}>{m}</span>
              ))}
            </div>

            {/* Heatmap Grid */}
            <div className="flex gap-1 min-w-[650px] justify-between">
              {contributionWeeks.map((week: number[], wi: number) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((level: number, di: number) => (
                    <div
                      key={di}
                      className={`w-2.5 h-2.5 rounded-[2px] transition-colors duration-200 dark:${levelColorsDark[level]} ${levelColorsLight[level]}`}
                      title={`Activity level: ${level}`}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Bottom Heatmap Legend */}
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-200/50 dark:border-dark-border/50 text-[11px] font-mono text-slate-500">
              <div className="flex items-center gap-1.5">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-slate-200 dark:bg-slate-800" />
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-[#9be9a8] dark:bg-[#0e4429]" />
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-[#40c463] dark:bg-[#006d32]" />
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-[#30a14e] dark:bg-[#26a641]" />
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-[#216e39] dark:bg-[#39d353]" />
                </div>
                <span>More</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100">{github.totalContributions}</span> contributions in the last year
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* BLOCK 2: LEETCODE PROGRESS                                 */}
        {/* ========================================================= */}
        <div className="glass rounded-sm p-6 sm:p-8 border border-light-border dark:border-dark-border relative">

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200/60 dark:border-dark-border/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-md bg-amber-500 text-white">
                <FiAward size={20} />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100">
                  LeetCode Progress
                </h3>
                <p className="font-mono text-xs text-slate-500">
                  Problem Solving Stats
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <span className="hud-text text-[10px] text-slate-400">
                {leetcode.lastUpdated}
              </span>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="btn-secondary py-1.5 px-3 text-[10px] flex items-center gap-1.5"
              >
                <FiRefreshCw size={11} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
              <a
                href={`https://leetcode.com/u/${LEETCODE_USERNAME}/`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary py-1.5 px-3 text-[10px] flex items-center gap-1.5"
              >
                Profile <FiExternalLink size={11} />
              </a>
            </div>
          </div>

          {/* Backup banner if fallback */}
          {usingBackup && (
            <div className="mb-6 p-3 rounded-sm bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Using backup data source. Some stats may be limited.
            </div>
          )}

          {/* Donut & Breakdown Row */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">

            {/* Left: Donut Chart */}
            <div className="glass p-6 rounded-sm border border-light-border dark:border-dark-border flex flex-col items-center justify-center relative">
              <div className="relative w-48 h-48 flex items-center justify-center">
                {/* SVG Donut Ring */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" className="text-slate-200 dark:text-slate-800" fill="none" />

                  {/* Easy Segment (Emerald) */}
                  <circle
                    cx="50" cy="50" r="40"
                    stroke="#10b981" strokeWidth="8"
                    strokeDasharray={`${easyPct * 2.51} 251`}
                    strokeDashoffset="0"
                    fill="none"
                    strokeLinecap="round"
                  />

                  {/* Medium Segment (Amber) */}
                  <circle
                    cx="50" cy="50" r="40"
                    stroke="#f59e0b" strokeWidth="8"
                    strokeDasharray={`${medPct * 2.51} 251`}
                    strokeDashoffset={`-${easyPct * 2.51}`}
                    fill="none"
                    strokeLinecap="round"
                  />

                  {/* Hard Segment (Rose) */}
                  <circle
                    cx="50" cy="50" r="40"
                    stroke="#ef4444" strokeWidth="8"
                    strokeDasharray={`${hardPct * 2.51} 251`}
                    strokeDashoffset={`-${(easyPct + medPct) * 2.51}`}
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Center Stats */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-serif text-4xl font-bold text-slate-900 dark:text-slate-100">
                    {leetcode.totalSolved}
                  </span>
                  <span className="hud-text text-[9px] text-slate-500">Solved</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex gap-6 mt-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Easy
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medium
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Hard
                </span>
              </div>
            </div>

            {/* Right: Problem Breakdown Progress Bars */}
            <div className="glass p-6 rounded-sm border border-light-border dark:border-dark-border flex flex-col justify-center space-y-6">
              <div>
                <h4 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
                  Problem Breakdown
                </h4>
                <p className="hud-text text-[10px] text-slate-500">Progress by difficulty</p>
              </div>

              {/* Easy Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                    <FiCheckCircle size={14} /> Easy
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-900 dark:text-slate-100">{leetcode.easySolved}</strong> / {leetcode.totalEasy}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, (leetcode.easySolved / Math.max(1, leetcode.totalEasy)) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Medium Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
                    <FiCheckCircle size={14} /> Medium
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-900 dark:text-slate-100">{leetcode.mediumSolved}</strong> / {leetcode.totalMedium}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, (leetcode.mediumSolved / Math.max(1, leetcode.totalMedium)) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Hard Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold">
                    <FiCheckCircle size={14} /> Hard
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-900 dark:text-slate-100">{leetcode.hardSolved}</strong> / {leetcode.totalHard}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, (leetcode.hardSolved / Math.max(1, leetcode.totalHard)) * 100)}%` }}
                  />
                </div>
              </div>

            </div>

          </div>

          {/* 3 Bottom Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass p-5 rounded-sm border border-light-border dark:border-dark-border flex items-center justify-between">
              <div>
                <div className="hud-text text-[10px] text-slate-500">Global Rank</div>
                <div className="font-serif text-2xl font-bold text-amber-500 mt-1">
                  #{leetcode.ranking.toLocaleString()}
                </div>
              </div>
              <FiAward className="text-amber-500/40" size={24} />
            </div>

            <div className="glass p-5 rounded-sm border border-light-border dark:border-dark-border flex items-center justify-between">
              <div>
                <div className="hud-text text-[10px] text-slate-500">Acceptance Rate</div>
                <div className="font-serif text-2xl font-bold text-emerald-500 mt-1">
                  {leetcode.acceptanceRate.toFixed(2)}%
                </div>
              </div>
              <FiTrendingUp className="text-emerald-500/40" size={24} />
            </div>

            <div className="glass p-5 rounded-sm border border-light-border dark:border-dark-border flex items-center justify-between">
              <div>
                <div className="hud-text text-[10px] text-slate-500">Total Solved</div>
                <div className="font-serif text-2xl font-bold text-cyan-500 mt-1">
                  {leetcode.totalSolved}
                </div>
              </div>
              <FiCode className="text-cyan-500/40" size={24} />
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* BOTTOM ACTION BUTTONS                                     */}
        {/* ========================================================= */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <a
            href={profile.meta.github}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary py-3 px-6 text-xs flex items-center gap-2"
          >
            <FiGithub size={16} /> View GitHub Profile <FiExternalLink size={12} />
          </a>
          <a
            href={`https://leetcode.com/u/${LEETCODE_USERNAME}/`}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary py-3 px-6 text-xs flex items-center gap-2"
          >
            <FiCode size={16} /> View LeetCode Profile <FiExternalLink size={12} />
          </a>
        </div>

      </div>
    </SectionWrapper>
  );
}
