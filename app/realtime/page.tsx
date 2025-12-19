'use client';

import { useQuery } from '@tanstack/react-query';
import { couponAPI } from '@/lib/api';
import type { Coupon } from '@/lib/types';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, TrendingUp, Users, CheckCircle, XCircle, Clock, Zap, Activity } from 'lucide-react';

export default function RealtimePage() {
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['coupons-realtime'],
    queryFn: () => couponAPI.getCoupons(),
    refetchInterval: 2000,
  });

  const getProgressPercentage = (coupon: Coupon) => {
    const issued = coupon.stats?.issuedCount ?? 0;
    const total = coupon.totalQuantity;
    return Math.round((issued / total) * 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'var(--neon-orange)';
    if (percentage >= 80) return 'var(--neon-pink)';
    if (percentage >= 50) return 'var(--neon-yellow)';
    return 'var(--neon-green)';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  const isCouponActive = (coupon: Coupon) => {
    const now = new Date();
    return now >= new Date(coupon.startAt) && now <= new Date(coupon.endAt);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="w-3 h-3 bg-[var(--neon-green)] rounded-full animate-pulse"
                       style={{ boxShadow: '0 0 10px var(--neon-green)' }} />
                  <div className="absolute inset-0 w-3 h-3 bg-[var(--neon-green)] rounded-full animate-ping" />
                </div>
                <span className="text-[var(--text-muted)] text-sm font-arcade uppercase tracking-widest">
                  Live Monitoring
                </span>
              </div>
              <h1 className="font-arcade text-4xl md:text-5xl"
                  style={{
                    color: 'var(--neon-green)',
                    textShadow: '0 0 10px var(--neon-green), 0 0 20px var(--neon-green)',
                  }}>
                REALTIME_STATUS
              </h1>
              <p className="text-[var(--text-secondary)] mt-2">2초마다 자동 새로고침</p>
            </div>

            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="arcade-btn arcade-btn-cyan"
              >
                <span className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  HOME
                </span>
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="arcade-card p-16 border border-[var(--border-glow)] text-center"
          >
            <Activity className="w-16 h-16 text-[var(--neon-green)] animate-pulse mx-auto mb-4" />
            <p className="font-arcade text-[var(--neon-green)]">CONNECTING...</p>
          </motion.div>
        ) : coupons.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="arcade-card p-16 border border-[var(--border-glow)] text-center"
          >
            <XCircle className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)] text-lg">NO DATA AVAILABLE</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {coupons.map((coupon: Coupon, index: number) => {
              const percentage = getProgressPercentage(coupon);
              const remaining = coupon.stats?.remainingCount ?? 0;
              const issued = coupon.stats?.issuedCount ?? 0;
              const total = coupon.totalQuantity;
              const isSoldOut = percentage >= 100;
              const isActive = isCouponActive(coupon);
              const progressColor = getProgressColor(percentage);

              return (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`arcade-card p-8 border ${
                    isSoldOut
                      ? 'border-[var(--neon-orange)]'
                      : isActive
                      ? 'border-[var(--neon-green)]'
                      : 'border-[var(--border-glow)]'
                  }`}
                  style={isActive && !isSoldOut ? { boxShadow: '0 0 30px rgba(0, 255, 136, 0.15)' } : {}}
                >
                  {/* Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                      <h2 className="font-arcade text-2xl text-[var(--text-primary)] mb-2">{coupon.name}</h2>
                      <p className="font-arcade text-xl" style={{ color: 'var(--neon-cyan)' }}>
                        {coupon.discountValue}
                        {coupon.discountType === 'AMOUNT' ? '원' : '%'} DISCOUNT
                      </p>
                    </div>
                    <span className={`px-4 py-2 text-sm font-arcade rounded ${
                      isSoldOut
                        ? 'badge-soldout'
                        : isActive
                        ? 'badge-active'
                        : 'badge-pending'
                    }`}>
                      {isSoldOut ? 'SOLD_OUT' : isActive ? 'LIVE' : 'STANDBY'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[var(--text-muted)] text-sm font-arcade flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        ISSUE_PROGRESS
                      </span>
                      <span className="font-arcade text-lg" style={{ color: progressColor }}>
                        {issued} / {total} ({percentage}%)
                      </span>
                    </div>
                    <div className="neon-progress">
                      <motion.div
                        className="neon-progress-bar"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentage, 100)}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        style={{
                          background: `linear-gradient(90deg, ${progressColor}, ${progressColor})`,
                          boxShadow: `0 0 20px ${progressColor}`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="arcade-card p-4 border border-[var(--neon-cyan)]">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[var(--text-muted)] text-xs font-arcade mb-1">REMAINING</p>
                          <p className="font-arcade text-2xl neon-cyan">{remaining}</p>
                        </div>
                        <TrendingUp className="w-5 h-5 text-[var(--neon-cyan)]" />
                      </div>
                    </div>
                    <div className="arcade-card p-4 border border-[var(--neon-green)]">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[var(--text-muted)] text-xs font-arcade mb-1">ISSUED</p>
                          <p className="font-arcade text-2xl neon-green">{issued}</p>
                        </div>
                        <Users className="w-5 h-5 text-[var(--neon-green)]" />
                      </div>
                    </div>
                    <div className="arcade-card p-4 border border-[var(--neon-magenta)]">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[var(--text-muted)] text-xs font-arcade mb-1">USED</p>
                          <p className="font-arcade text-2xl neon-magenta">{coupon.stats?.usedCount ?? 0}</p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-[var(--neon-magenta)]" />
                      </div>
                    </div>
                    <div className="arcade-card p-4 border border-[var(--neon-orange)]">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[var(--text-muted)] text-xs font-arcade mb-1">EXPIRED</p>
                          <p className="font-arcade text-2xl neon-orange">{coupon.stats?.expiredCount ?? 0}</p>
                        </div>
                        <Clock className="w-5 h-5 text-[var(--neon-orange)]" />
                      </div>
                    </div>
                  </div>

                  {/* Info Footer */}
                  <div className="flex flex-wrap gap-4 text-sm text-[var(--text-muted)] arcade-card p-4 border border-[var(--border-dim)]">
                    <div className="flex items-center gap-2">
                      <span className="font-arcade">TYPE:</span>
                      <span className="text-[var(--text-secondary)]">{coupon.type === 'FCFS' ? 'FIRST_COME' : coupon.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="font-arcade">START:</span>
                      <span className="text-[var(--text-secondary)]">{formatDate(coupon.startAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="font-arcade">END:</span>
                      <span className="text-[var(--text-secondary)]">{formatDate(coupon.endAt)}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Status Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 arcade-card p-6 border border-[var(--border-glow)] text-center"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="relative">
              <div className="w-3 h-3 bg-[var(--neon-green)] rounded-full animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 bg-[var(--neon-green)] rounded-full animate-ping" />
            </div>
            <span className="font-arcade text-[var(--neon-green)]">STREAMING ACTIVE</span>
            <span className="text-[var(--text-muted)]">//</span>
            <span className="text-[var(--text-muted)] text-sm font-arcade">REFRESH_RATE: 2000ms</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
