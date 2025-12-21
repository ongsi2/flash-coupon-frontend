'use client';

import Link from "next/link";
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Activity, Zap, Database, Lock, FileText } from 'lucide-react';
import type { User as UserType } from '@/lib/types';

// Fixed particle positions to avoid hydration mismatch
const PARTICLES = [
  { left: 5, top: 10, duration: 12, delay: 0 },
  { left: 15, top: 80, duration: 15, delay: 2 },
  { left: 25, top: 30, duration: 18, delay: 4 },
  { left: 35, top: 60, duration: 11, delay: 1 },
  { left: 45, top: 20, duration: 14, delay: 3 },
  { left: 55, top: 90, duration: 16, delay: 5 },
  { left: 65, top: 40, duration: 13, delay: 6 },
  { left: 75, top: 70, duration: 17, delay: 7 },
  { left: 85, top: 15, duration: 19, delay: 8 },
  { left: 95, top: 55, duration: 12, delay: 9 },
  { left: 10, top: 45, duration: 14, delay: 1.5 },
  { left: 20, top: 75, duration: 16, delay: 3.5 },
  { left: 30, top: 25, duration: 11, delay: 5.5 },
  { left: 40, top: 85, duration: 18, delay: 7.5 },
  { left: 50, top: 35, duration: 15, delay: 0.5 },
  { left: 60, top: 65, duration: 13, delay: 2.5 },
  { left: 70, top: 5, duration: 17, delay: 4.5 },
  { left: 80, top: 95, duration: 12, delay: 6.5 },
  { left: 90, top: 50, duration: 14, delay: 8.5 },
  { left: 3, top: 33, duration: 16, delay: 9.5 },
];

export default function Home() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    // Random glitch effect
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 5000);

    return () => clearInterval(glitchInterval);
  }, []);

  const apiDocsUrl = `${(process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '')}/api/docs`;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[var(--neon-cyan)]"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              boxShadow: '0 0 10px var(--neon-cyan)',
            }}
            animate={{
              y: [0, -1000],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            {/* System status indicator */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-2 h-2 bg-[var(--neon-green)] rounded-full animate-pulse"
                   style={{ boxShadow: '0 0 10px var(--neon-green)' }} />
              <span className="text-[var(--text-muted)] text-sm font-arcade uppercase tracking-widest">
                System Online
              </span>
              <div className="w-2 h-2 bg-[var(--neon-green)] rounded-full animate-pulse"
                   style={{ boxShadow: '0 0 10px var(--neon-green)' }} />
            </div>

            {/* Main title with glitch effect */}
            <h1
              className={`font-arcade text-6xl md:text-8xl font-black mb-4 tracking-tight ${glitchActive ? 'glitch' : ''}`}
              data-text="FLASH COUPON"
              style={{
                color: 'var(--neon-cyan)',
                textShadow: `
                  0 0 10px var(--neon-cyan),
                  0 0 20px var(--neon-cyan),
                  0 0 40px var(--neon-cyan),
                  0 0 80px var(--neon-magenta)
                `,
              }}
            >
              FLASH COUPON
            </h1>

            <p className="text-[var(--text-secondary)] text-lg md:text-xl tracking-wide">
              <span className="neon-magenta">[</span>
              선착순 쿠폰 발급 시스템
              <span className="neon-magenta">]</span>
            </p>
            <p className="text-[var(--text-muted)] text-sm mt-2">
              Redis Lua Script // Atomic Operations // High Concurrency
            </p>
          </motion.div>

          {/* User status bar */}
          {currentUser && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-10 arcade-card p-4 border border-[var(--neon-green)]"
              style={{ boxShadow: '0 0 20px rgba(0, 255, 136, 0.2)' }}
            >
              <div className="flex items-center justify-center gap-4">
                <User className="w-5 h-5 text-[var(--neon-green)]" />
                <span className="text-[var(--text-secondary)]">PLAYER:</span>
                <span className="neon-green font-arcade font-bold">{currentUser.name}</span>
                <span className="text-[var(--text-muted)]">//</span>
                <span className="text-[var(--text-muted)] text-sm">{currentUser.email}</span>
              </div>
            </motion.div>
          )}

          {/* Main navigation grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* User Page */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <Link href="/user" className="block">
                <div className="arcade-card p-8 border border-[var(--neon-cyan)] hover:border-[var(--neon-cyan)] transition-all group"
                     style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.1)' }}>
                  <div className="flex items-start gap-4">
                    <div className="p-3 border border-[var(--neon-cyan)] group-hover:bg-[var(--neon-cyan)] group-hover:bg-opacity-10 transition-all"
                         style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
                      <User className="w-8 h-8 text-[var(--neon-cyan)]" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-arcade text-2xl text-[var(--neon-cyan)] mb-2 group-hover:tracking-wider transition-all">
                        USER_PORTAL
                      </h2>
                      <p className="text-[var(--text-secondary)] text-sm">
                        쿠폰 발급받기 // 내 쿠폰 조회 // 쿠폰 사용
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-[var(--text-muted)] text-xs">
                        <span className="px-2 py-1 border border-[var(--border-glow)]">ISSUE</span>
                        <span className="px-2 py-1 border border-[var(--border-glow)]">VIEW</span>
                        <span className="px-2 py-1 border border-[var(--border-glow)]">USE</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Admin Page */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <Link href="/admin" className="block">
                <div className="arcade-card p-8 border border-[var(--neon-magenta)] hover:border-[var(--neon-magenta)] transition-all group"
                     style={{ boxShadow: '0 0 20px rgba(255, 0, 255, 0.1)' }}>
                  <div className="flex items-start gap-4">
                    <div className="p-3 border border-[var(--neon-magenta)] group-hover:bg-[var(--neon-magenta)] group-hover:bg-opacity-10 transition-all"
                         style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
                      <Shield className="w-8 h-8 text-[var(--neon-magenta)]" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-arcade text-2xl text-[var(--neon-magenta)] mb-2 group-hover:tracking-wider transition-all">
                        ADMIN_CONSOLE
                      </h2>
                      <p className="text-[var(--text-secondary)] text-sm">
                        쿠폰 관리 // 통계 조회 // 쿠폰 생성
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-[var(--text-muted)] text-xs">
                        <span className="px-2 py-1 border border-[var(--border-glow)]">MANAGE</span>
                        <span className="px-2 py-1 border border-[var(--border-glow)]">STATS</span>
                        <span className="px-2 py-1 border border-[var(--border-glow)]">CREATE</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Realtime Page */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <Link href="/realtime" className="block">
                <div className="arcade-card p-8 border border-[var(--neon-green)] hover:border-[var(--neon-green)] transition-all group"
                     style={{ boxShadow: '0 0 20px rgba(0, 255, 136, 0.1)' }}>
                  <div className="flex items-start gap-4">
                    <div className="p-3 border border-[var(--neon-green)] group-hover:bg-[var(--neon-green)] group-hover:bg-opacity-10 transition-all relative"
                         style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
                      <Activity className="w-8 h-8 text-[var(--neon-green)]" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--neon-green)] rounded-full animate-ping" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-arcade text-2xl text-[var(--neon-green)] mb-2 group-hover:tracking-wider transition-all">
                        LIVE_MONITOR
                      </h2>
                      <p className="text-[var(--text-secondary)] text-sm">
                        실시간 발급 현황 모니터링
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-[var(--neon-green)] rounded-full animate-pulse" />
                        <span className="text-[var(--neon-green)] text-xs font-arcade">STREAMING</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Features Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="arcade-card p-8 border border-[var(--neon-orange)] h-full"
                   style={{ boxShadow: '0 0 20px rgba(255, 102, 0, 0.1)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="w-6 h-6 text-[var(--neon-orange)]" />
                  <h2 className="font-arcade text-xl text-[var(--neon-orange)]">
                    CORE_FEATURES
                  </h2>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-[var(--text-secondary)]">
                    <Database className="w-4 h-4 text-[var(--neon-cyan)]" />
                    <span className="text-sm">Redis Lua Script 원자적 발급</span>
                  </li>
                  <li className="flex items-center gap-3 text-[var(--text-secondary)]">
                    <Lock className="w-4 h-4 text-[var(--neon-magenta)]" />
                    <span className="text-sm">중복 발급 완벽 차단</span>
                  </li>
                  <li className="flex items-center gap-3 text-[var(--text-secondary)]">
                    <Activity className="w-4 h-4 text-[var(--neon-green)]" />
                    <span className="text-sm">실시간 재고 추적</span>
                  </li>
                  <li className="flex items-center gap-3 text-[var(--text-secondary)]">
                    <FileText className="w-4 h-4 text-[var(--neon-orange)]" />
                    <span className="text-sm">발급/사용 내역 영속화</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* API Docs Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <div className="arcade-card p-6 border border-[var(--border-glow)]">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <FileText className="w-6 h-6 text-[var(--text-muted)]" />
                  <div>
                    <p className="font-arcade text-[var(--text-primary)]">SWAGGER_API_DOCS</p>
                    <p className="text-[var(--text-muted)] text-sm">API 스펙과 예제 확인 (서버 실행 필요)</p>
                  </div>
                </div>
                <Link
                  href={apiDocsUrl}
                  target="_blank"
                  className="arcade-btn arcade-btn-cyan text-sm"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    OPEN DOCS
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Register CTA */}
          {!currentUser && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center"
            >
              <div className="arcade-card p-8 border-2 border-[var(--neon-pink)]"
                   style={{ boxShadow: '0 0 40px rgba(255, 0, 128, 0.2)' }}>
                <p className="text-[var(--text-secondary)] text-lg mb-6">
                  <span className="neon-pink">&gt;</span> 쿠폰을 발급받으려면 먼저 회원가입이 필요합니다 <span className="typing-cursor" />
                </p>
                <Link
                  href="/register"
                  className="arcade-btn arcade-btn-filled inline-flex items-center gap-3"
                >
                  <User className="w-5 h-5" />
                  REGISTER NOW
                </Link>
              </div>
            </motion.div>
          )}

          {/* Architecture Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16"
          >
            <div className="text-center mb-8">
              <h2 className="font-arcade text-2xl neon-cyan mb-2">SYSTEM_ARCHITECTURE</h2>
              <p className="text-[var(--text-muted)] text-sm">
                초당 발급을 지탱하는 핵심 설계
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Step 1 */}
              <div className="arcade-card p-6 border border-[var(--neon-cyan)]">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-arcade text-2xl neon-cyan">01</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-[var(--neon-cyan)] to-transparent" />
                </div>
                <h3 className="font-arcade text-[var(--neon-cyan)] mb-2">ATOMIC_ISSUE</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  Redis Lua Script로 중복체크 → 재고확인 → 감소를 원자적으로 처리
                </p>
              </div>

              {/* Step 2 */}
              <div className="arcade-card p-6 border border-[var(--neon-green)]">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-arcade text-2xl neon-green">02</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-[var(--neon-green)] to-transparent" />
                </div>
                <h3 className="font-arcade text-[var(--neon-green)] mb-2">SAFETY_NET</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  DB Unique 제약으로 2차 중복 차단, 발급 내역 영속화
                </p>
              </div>

              {/* Step 3 */}
              <div className="arcade-card p-6 border border-[var(--neon-orange)]">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-arcade text-2xl neon-orange">03</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-[var(--neon-orange)] to-transparent" />
                </div>
                <h3 className="font-arcade text-[var(--neon-orange)] mb-2">SYNC_HEALTH</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  Redis-DB 동기화, 실시간 대시보드 모니터링
                </p>
              </div>
            </div>

            {/* Data Flow */}
            <div className="mt-8 arcade-card p-6 border border-[var(--border-glow)]">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-5 h-5 text-[var(--neon-cyan)]" />
                <span className="font-arcade text-[var(--neon-cyan)]">DATA_FLOW</span>
              </div>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="arcade-card p-4 border border-[var(--border-glow)] mb-2">
                    <p className="font-arcade text-[var(--neon-cyan)] text-sm">REQUEST</p>
                  </div>
                  <p className="text-[var(--text-muted)] text-xs">Frontend → API</p>
                </div>
                <div className="text-center">
                  <div className="arcade-card p-4 border border-[var(--border-glow)] mb-2">
                    <p className="font-arcade text-[var(--neon-magenta)] text-sm">REDIS</p>
                  </div>
                  <p className="text-[var(--text-muted)] text-xs">Lua Atomic Op</p>
                </div>
                <div className="text-center">
                  <div className="arcade-card p-4 border border-[var(--border-glow)] mb-2">
                    <p className="font-arcade text-[var(--neon-green)] text-sm">DATABASE</p>
                  </div>
                  <p className="text-[var(--text-muted)] text-xs">Persist & Verify</p>
                </div>
                <div className="text-center">
                  <div className="arcade-card p-4 border border-[var(--border-glow)] mb-2">
                    <p className="font-arcade text-[var(--neon-orange)] text-sm">MONITOR</p>
                  </div>
                  <p className="text-[var(--text-muted)] text-xs">Realtime Stats</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 text-center"
          >
            <p className="text-[var(--text-muted)] text-xs font-arcade">
              FLASH COUPON SYSTEM v1.0 // POWERED BY REDIS + POSTGRESQL
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
