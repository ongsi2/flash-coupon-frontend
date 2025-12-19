'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { couponAPI } from '@/lib/api';
import type { Coupon, IssuedCoupon, User } from '@/lib/types';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, LogOut, User as UserIcon, Tag, Clock, CheckCircle, XCircle, Ticket, Zap, Filter } from 'lucide-react';

export default function UserPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userId, setUserId] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ISSUED' | 'USED' | 'EXPIRED' | undefined>();
  const queryClient = useQueryClient();

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setUserId(user.id);
    }
  }, []);

  const { data: availableCoupons = [], isLoading: couponsLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: () => couponAPI.getCoupons(),
    refetchInterval: 5000,
  });

  const { data: myCouponsData, isLoading: myCouponsLoading } = useQuery({
    queryKey: ['myCoupons', userId, statusFilter],
    queryFn: () => couponAPI.getMyCoupons(userId, { status: statusFilter }),
    enabled: !!userId,
    refetchInterval: 5000,
  });

  const issueMutation = useMutation({
    mutationFn: ({ couponId, userId }: { couponId: string; userId: string }) =>
      couponAPI.issueCoupon(couponId, userId),
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        alert('쿠폰이 성공적으로 발급되었습니다!');
      } else if (data.status === 'DUPLICATED') {
        alert('이미 발급받은 쿠폰입니다.');
      } else if (data.status === 'SOLD_OUT') {
        alert('쿠폰이 모두 소진되었습니다.');
      } else if (data.status === 'EXPIRED') {
        alert('쿠폰 발급 기간이 종료되었습니다.');
      } else if (data.status === 'NOT_STARTED') {
        alert('쿠폰 발급이 아직 시작되지 않았습니다.');
      }
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      queryClient.invalidateQueries({ queryKey: ['myCoupons'] });
    },
    onError: () => {
      alert('쿠폰 발급 중 오류가 발생했습니다.');
    },
  });

  const useMutation_ = useMutation({
    mutationFn: ({ issuedCouponId, userId }: { issuedCouponId: string; userId: string }) =>
      couponAPI.useCoupon(issuedCouponId, userId),
    onSuccess: () => {
      alert('쿠폰이 사용 처리되었습니다!');
      queryClient.invalidateQueries({ queryKey: ['myCoupons'] });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || '쿠폰 사용 중 오류가 발생했습니다.');
    },
  });

  const handleIssueCoupon = (couponId: string) => {
    if (!userId.trim()) {
      alert('사용자 ID를 입력해주세요.');
      return;
    }
    issueMutation.mutate({ couponId, userId });
  };

  const handleUseCoupon = (issuedCouponId: string) => {
    if (confirm('쿠폰을 사용하시겠습니까?')) {
      useMutation_.mutate({ issuedCouponId, userId });
    }
  };

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
      setUserId('');
      router.push('/');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  const isCouponAvailable = (coupon: Coupon) => {
    const now = new Date();
    const start = new Date(coupon.startAt);
    const end = new Date(coupon.endAt);
    return now >= start && now <= end && (coupon.stats?.remainingCount ?? 0) > 0;
  };

  // Not logged in
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-4 arcade-card p-8 border-2 border-[var(--neon-pink)]"
          style={{ boxShadow: '0 0 40px rgba(255, 0, 128, 0.2)' }}
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 border-2 border-[var(--neon-pink)]"
                 style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
              <UserIcon className="w-8 h-8 text-[var(--neon-pink)]" />
            </div>
            <h2 className="font-arcade text-2xl neon-pink mb-4">ACCESS_DENIED</h2>
            <p className="text-[var(--text-secondary)] mb-8">
              쿠폰을 발급받으려면 먼저 회원가입을 해주세요.
            </p>
            <div className="space-y-3">
              <Link href="/register" className="block">
                <button className="w-full arcade-btn arcade-btn-filled">
                  <span className="flex items-center justify-center gap-2">
                    <UserIcon className="w-5 h-5" />
                    REGISTER
                  </span>
                </button>
              </Link>
              <Link href="/" className="block">
                <button className="w-full arcade-btn arcade-btn-cyan">
                  <span className="flex items-center justify-center gap-2">
                    <Home className="w-5 h-5" />
                    HOME
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

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
                <div className="w-2 h-2 bg-[var(--neon-cyan)] rounded-full animate-pulse"
                     style={{ boxShadow: '0 0 10px var(--neon-cyan)' }} />
                <span className="text-[var(--text-muted)] text-sm font-arcade uppercase tracking-widest">
                  User Portal
                </span>
              </div>
              <h1 className="font-arcade text-4xl md:text-5xl"
                  style={{
                    color: 'var(--neon-cyan)',
                    textShadow: '0 0 10px var(--neon-cyan), 0 0 20px var(--neon-cyan)',
                  }}>
                COUPON_HUB
              </h1>
            </div>

            <div className="flex flex-wrap gap-3">
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
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="arcade-btn arcade-btn-pink"
              >
                <span className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  LOGOUT
                </span>
              </motion.button>
            </div>
          </div>

          {/* User Info */}
          <div className="arcade-card p-6 border border-[var(--neon-green)]"
               style={{ boxShadow: '0 0 20px rgba(0, 255, 136, 0.1)' }}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 border border-[var(--neon-green)]"
                     style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
                  <UserIcon className="w-6 h-6 text-[var(--neon-green)]" />
                </div>
                <div>
                  <p className="text-[var(--text-muted)] text-sm font-arcade">PLAYER_NAME</p>
                  <p className="text-xl font-bold neon-green">{currentUser.name}</p>
                  <p className="text-[var(--text-muted)] text-sm">{currentUser.email}</p>
                </div>
              </div>
              <div className="arcade-card p-3 border border-[var(--border-glow)]">
                <p className="text-[var(--text-muted)] text-xs font-arcade mb-1">PLAYER_ID</p>
                <p className="text-[var(--neon-cyan)] text-sm font-mono">{currentUser.id}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Available Coupons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Tag className="w-6 h-6 text-[var(--neon-cyan)]" />
            <h2 className="font-arcade text-2xl text-[var(--neon-cyan)]">AVAILABLE_COUPONS</h2>
          </div>

          {couponsLoading ? (
            <div className="arcade-card p-12 border border-[var(--border-glow)] text-center">
              <Zap className="w-12 h-12 text-[var(--neon-cyan)] animate-pulse mx-auto mb-4" />
              <p className="font-arcade text-[var(--neon-cyan)]">LOADING...</p>
            </div>
          ) : availableCoupons.length === 0 ? (
            <div className="arcade-card p-12 border border-[var(--border-glow)] text-center">
              <XCircle className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
              <p className="text-[var(--text-secondary)]">사용 가능한 쿠폰이 없습니다</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCoupons.map((coupon: Coupon, index: number) => {
                const available = isCouponAvailable(coupon);
                return (
                  <motion.div
                    key={coupon.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`arcade-card p-6 border ${available ? 'border-[var(--neon-cyan)]' : 'border-[var(--border-glow)]'}`}
                    style={available ? { boxShadow: '0 0 20px rgba(0, 255, 255, 0.1)' } : {}}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-arcade text-lg text-[var(--text-primary)]">{coupon.name}</h3>
                      <Ticket className="w-5 h-5 text-[var(--neon-cyan)]" />
                    </div>

                    <p className="font-arcade text-3xl neon-cyan mb-4">
                      {coupon.discountValue}
                      <span className="text-lg">{coupon.discountType === 'AMOUNT' ? '원' : '%'}</span>
                    </p>

                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">TOTAL</span>
                        <span className="text-[var(--text-secondary)]">{coupon.totalQuantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">REMAINING</span>
                        <span className="neon-cyan font-bold">{coupon.stats?.remainingCount ?? 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">ISSUED</span>
                        <span className="neon-green">{coupon.stats?.issuedCount ?? 0}</span>
                      </div>
                      <div className="pt-2 border-t border-[var(--border-dim)]">
                        <div className="flex items-start gap-2 text-xs text-[var(--text-muted)]">
                          <Clock className="w-3 h-3 mt-0.5" />
                          <div>
                            <div>{formatDate(coupon.startAt)}</div>
                            <div>~ {formatDate(coupon.endAt)}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={available ? { scale: 1.02 } : {}}
                      whileTap={available ? { scale: 0.98 } : {}}
                      onClick={() => handleIssueCoupon(coupon.id)}
                      disabled={!available || issueMutation.isPending}
                      className={`w-full ${available ? 'arcade-btn arcade-btn-filled' : 'arcade-btn border-[var(--text-muted)] text-[var(--text-muted)] cursor-not-allowed'}`}
                    >
                      {issueMutation.isPending ? 'ISSUING...' : available ? 'GET COUPON' : 'UNAVAILABLE'}
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* My Coupons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Ticket className="w-6 h-6 text-[var(--neon-magenta)]" />
              <h2 className="font-arcade text-2xl text-[var(--neon-magenta)]">MY_COUPONS</h2>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[var(--text-muted)]" />
              <select
                value={statusFilter || ''}
                onChange={(e) => setStatusFilter(e.target.value as 'ISSUED' | 'USED' | 'EXPIRED' | undefined || undefined)}
                className="arcade-select"
              >
                <option value="">ALL</option>
                <option value="ISSUED">AVAILABLE</option>
                <option value="USED">USED</option>
                <option value="EXPIRED">EXPIRED</option>
              </select>
            </div>
          </div>

          {myCouponsLoading ? (
            <div className="arcade-card p-12 border border-[var(--border-glow)] text-center">
              <Zap className="w-12 h-12 text-[var(--neon-magenta)] animate-pulse mx-auto mb-4" />
              <p className="font-arcade text-[var(--neon-magenta)]">LOADING...</p>
            </div>
          ) : !myCouponsData || myCouponsData.data.length === 0 ? (
            <div className="arcade-card p-12 border border-[var(--border-glow)] text-center">
              <XCircle className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
              <p className="text-[var(--text-secondary)]">보유한 쿠폰이 없습니다</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCouponsData.data.map((coupon: IssuedCoupon, index: number) => {
                const isUsable = coupon.status === 'ISSUED' && !coupon.isExpired;
                return (
                  <motion.div
                    key={coupon.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`arcade-card p-6 border-2 ${
                      isUsable
                        ? 'border-[var(--neon-green)]'
                        : 'border-[var(--border-glow)]'
                    }`}
                    style={isUsable ? { boxShadow: '0 0 20px rgba(0, 255, 136, 0.2)' } : {}}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-arcade text-lg text-[var(--text-primary)]">{coupon.couponName}</h3>
                      <span className={`px-2 py-1 text-xs font-arcade rounded ${
                        isUsable ? 'badge-active' : coupon.status === 'USED' ? 'badge-expired' : 'badge-soldout'
                      }`}>
                        {isUsable ? 'READY' : coupon.status === 'USED' ? 'USED' : 'EXPIRED'}
                      </span>
                    </div>

                    <p className="font-arcade text-3xl neon-magenta mb-4">
                      {coupon.discountValue}
                      <span className="text-lg">{coupon.discountType === 'AMOUNT' ? '원' : '%'}</span>
                    </p>

                    <div className="space-y-2 mb-6 arcade-card p-3 border border-[var(--border-dim)]">
                      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <Clock className="w-4 h-4 text-[var(--text-muted)]" />
                        <span>발급: {formatDate(coupon.issuedAt)}</span>
                      </div>
                      {coupon.usedAt && (
                        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                          <CheckCircle className="w-4 h-4 text-[var(--neon-green)]" />
                          <span>사용: {formatDate(coupon.usedAt)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <XCircle className="w-4 h-4 text-[var(--neon-orange)]" />
                        <span>만료: {formatDate(coupon.expiresAt)}</span>
                      </div>
                    </div>

                    {isUsable && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleUseCoupon(coupon.id)}
                        disabled={useMutation_.isPending}
                        className="w-full arcade-btn arcade-btn-green"
                      >
                        {useMutation_.isPending ? 'PROCESSING...' : 'USE COUPON'}
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-[var(--text-muted)] text-xs font-arcade">
            AUTO_REFRESH: 5s // USER_PORTAL v1.0
          </p>
        </motion.div>
      </div>
    </div>
  );
}
