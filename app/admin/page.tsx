'use client';

import { useQuery } from '@tanstack/react-query';
import { couponAPI } from '@/lib/api';
import type { Coupon } from '@/lib/types';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Plus, Home, Database, TrendingUp, Users, Clock, AlertCircle, Zap } from 'lucide-react';

export default function AdminPage() {
  const { data: coupons = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: () => couponAPI.getCoupons(),
    refetchInterval: 5000,
  });

  const [isSyncing, setIsSyncing] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleSyncRedis = async () => {
    if (!confirm('PostgreSQL 데이터를 기준으로 Redis를 재동기화하시겠습니까?')) {
      return;
    }

    setIsSyncing(true);
    try {
      const result = await couponAPI.syncRedis();
      alert(`✅ ${result.message}`);
      refetch();
    } catch (error) {
      console.error('Redis sync failed:', error);
      alert('❌ Redis 재동기화 실패');
    } finally {
      setIsSyncing(false);
    }
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
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-[var(--neon-magenta)] rounded-full animate-pulse"
                     style={{ boxShadow: '0 0 10px var(--neon-magenta)' }} />
                <span className="text-[var(--text-muted)] text-sm font-arcade uppercase tracking-widest">
                  Admin Console
                </span>
              </div>
              <h1 className="font-arcade text-4xl md:text-5xl"
                  style={{
                    color: 'var(--neon-magenta)',
                    textShadow: '0 0 10px var(--neon-magenta), 0 0 20px var(--neon-magenta)',
                  }}>
                DASHBOARD
              </h1>
              <p className="text-[var(--text-secondary)] mt-2">쿠폰 관리 // 통계 조회</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSyncRedis}
                disabled={isSyncing}
                className="arcade-btn arcade-btn-orange disabled:opacity-50"
              >
                <span className="flex items-center gap-2">
                  <Database className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'SYNCING...' : 'REDIS SYNC'}
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRefresh}
                className="arcade-btn arcade-btn-cyan"
              >
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  REFRESH
                </span>
              </motion.button>

              <Link href="/admin/coupons/new">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="arcade-btn arcade-btn-green"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    NEW COUPON
                  </span>
                </motion.button>
              </Link>

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
          </div>
        </motion.div>

        {/* Stats Cards */}
        {coupons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-3 gap-6 mb-8"
          >
            <div className="arcade-card p-6 border border-[var(--neon-cyan)]"
                 style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.1)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[var(--text-muted)] text-sm font-arcade mb-2">TOTAL_COUPONS</p>
                  <p className="font-arcade text-4xl neon-cyan">{coupons.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-[var(--neon-cyan)]" />
              </div>
            </div>

            <div className="arcade-card p-6 border border-[var(--neon-green)]"
                 style={{ boxShadow: '0 0 20px rgba(0, 255, 136, 0.1)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[var(--text-muted)] text-sm font-arcade mb-2">TOTAL_ISSUED</p>
                  <p className="font-arcade text-4xl neon-green">
                    {coupons.reduce((sum, c) => sum + (c.stats?.issuedCount ?? 0), 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-[var(--neon-green)]" />
              </div>
            </div>

            <div className="arcade-card p-6 border border-[var(--neon-magenta)]"
                 style={{ boxShadow: '0 0 20px rgba(255, 0, 255, 0.1)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[var(--text-muted)] text-sm font-arcade mb-2">TOTAL_USED</p>
                  <p className="font-arcade text-4xl neon-magenta">
                    {coupons.reduce((sum, c) => sum + (c.stats?.usedCount ?? 0), 0)}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-[var(--neon-magenta)]" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="arcade-card p-16 border border-[var(--border-glow)] text-center"
          >
            <Zap className="w-16 h-16 text-[var(--neon-cyan)] animate-pulse mx-auto mb-4" />
            <p className="font-arcade text-[var(--neon-cyan)]">LOADING DATA...</p>
          </motion.div>
        ) : coupons.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="arcade-card p-16 border border-[var(--border-glow)] text-center"
          >
            <AlertCircle className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)] text-lg mb-6">등록된 쿠폰이 없습니다</p>
            <Link href="/admin/coupons/new">
              <button className="arcade-btn arcade-btn-filled">
                <span className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  CREATE FIRST COUPON
                </span>
              </button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="arcade-card border border-[var(--border-glow)] overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="arcade-table">
                <thead>
                  <tr>
                    <th>Coupon</th>
                    <th>Discount</th>
                    <th className="text-center">Total</th>
                    <th className="text-center">Issued</th>
                    <th className="text-center">Used</th>
                    <th className="text-center">Remaining</th>
                    <th className="text-center">Expired</th>
                    <th>Period</th>
                    <th className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon: Coupon, index: number) => {
                    const now = new Date();
                    const start = new Date(coupon.startAt);
                    const end = new Date(coupon.endAt);
                    const isActive = now >= start && now <= end;
                    const isUpcoming = now < start;
                    const isExpired = now > end;
                    const isSoldOut = (coupon.stats?.remainingCount ?? 0) === 0;

                    return (
                      <motion.tr
                        key={coupon.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-[rgba(0,255,255,0.02)]"
                      >
                        <td>
                          <div>
                            <p className="text-[var(--text-primary)] font-medium">{coupon.name}</p>
                            <p className="text-[var(--text-muted)] text-xs mt-1">
                              {coupon.type === 'FCFS' ? 'FIRST_COME' : coupon.type}
                            </p>
                          </div>
                        </td>
                        <td>
                          <span className="neon-cyan font-arcade">
                            {coupon.discountValue}
                            {coupon.discountType === 'AMOUNT' ? '원' : '%'}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="text-[var(--text-primary)]">{coupon.totalQuantity}</span>
                        </td>
                        <td className="text-center">
                          <span className="neon-green">{coupon.stats?.issuedCount ?? 0}</span>
                        </td>
                        <td className="text-center">
                          <span className="neon-magenta">{coupon.stats?.usedCount ?? 0}</span>
                        </td>
                        <td className="text-center">
                          <span className={isSoldOut ? 'neon-orange' : 'neon-cyan'}>
                            {coupon.stats?.remainingCount ?? 0}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="neon-orange">{coupon.stats?.expiredCount ?? 0}</span>
                        </td>
                        <td>
                          <div className="text-xs text-[var(--text-muted)] space-y-1">
                            <p>{formatDate(coupon.startAt)}</p>
                            <p>{formatDate(coupon.endAt)}</p>
                          </div>
                        </td>
                        <td className="text-center">
                          <span
                            className={`inline-block px-3 py-1.5 text-xs font-arcade rounded ${
                              isSoldOut
                                ? 'badge-soldout'
                                : isExpired
                                ? 'badge-expired'
                                : isActive
                                ? 'badge-active'
                                : 'badge-pending'
                            }`}
                          >
                            {isSoldOut
                              ? 'SOLD_OUT'
                              : isExpired
                              ? 'EXPIRED'
                              : isActive
                              ? 'ACTIVE'
                              : 'PENDING'}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-[var(--text-muted)] text-xs font-arcade">
            AUTO_REFRESH: 5s // ADMIN_CONSOLE v1.0
          </p>
        </motion.div>
      </div>
    </div>
  );
}
