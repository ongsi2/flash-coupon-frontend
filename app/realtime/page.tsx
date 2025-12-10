'use client';

import { useQuery } from '@tanstack/react-query';
import { couponAPI } from '@/lib/api';
import type { Coupon } from '@/lib/types';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, TrendingUp, Users, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';

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

  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-orange-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  const isCouponActive = (coupon: Coupon) => {
    const now = new Date();
    return now >= new Date(coupon.startAt) && now <= new Date(coupon.endAt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                실시간 쿠폰 발급 현황
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-sm">2초마다 자동 새로고침</p>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white shadow-lg border border-gray-200 transition-all font-medium"
              >
                <Home className="w-4 h-4" />
                홈으로
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100"
          >
            <Zap className="w-12 h-12 text-purple-600 animate-pulse mx-auto mb-4" />
            <p className="text-gray-600 text-lg">데이터 로딩 중...</p>
          </motion.div>
        ) : coupons.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100"
          >
            <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">등록된 쿠폰이 없습니다.</p>
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

              return (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative overflow-hidden p-8 rounded-2xl shadow-xl transition-all ${
                    isSoldOut
                      ? 'bg-gray-100/80 backdrop-blur-sm border-2 border-gray-300'
                      : 'bg-white/90 backdrop-blur-sm border-2 border-gradient-to-r from-indigo-500 to-purple-500'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-full -mr-16 -mt-16" />

                  <div className="relative">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                          {coupon.name}
                        </h2>
                        <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          {coupon.discountValue}
                          {coupon.discountType === 'AMOUNT' ? '원' : '%'} 할인
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold shadow-lg ${
                            isSoldOut
                              ? 'bg-red-500 text-white'
                              : isActive
                              ? 'bg-emerald-500 text-white'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          {isSoldOut ? (
                            <><XCircle className="w-4 h-4" /> 품절</>
                          ) : isActive ? (
                            <><Zap className="w-4 h-4" /> 진행중</>
                          ) : (
                            <><Clock className="w-4 h-4" /> 대기중</>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          발급 진행률
                        </span>
                        <span className="text-base font-bold text-gray-900">
                          {issued} / {total} <span className="text-purple-600">({percentage}%)</span>
                        </span>
                      </div>
                      <div className="relative w-full bg-gray-200 rounded-full h-10 overflow-hidden shadow-inner">
                        <motion.div
                          className={`h-full ${getStatusColor(
                            percentage
                          )} flex items-center justify-center text-white font-bold shadow-lg`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(percentage, 100)}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        >
                          {percentage > 10 && `${percentage}%`}
                        </motion.div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs text-indigo-600 mb-1 font-medium">남은 수량</p>
                            <p className="text-2xl font-bold text-indigo-700">
                              {remaining}
                            </p>
                          </div>
                          <TrendingUp className="w-5 h-5 text-indigo-500" />
                        </div>
                      </div>
                      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs text-emerald-600 mb-1 font-medium">발급 완료</p>
                            <p className="text-2xl font-bold text-emerald-700">
                              {issued}
                            </p>
                          </div>
                          <Users className="w-5 h-5 text-emerald-500" />
                        </div>
                      </div>
                      <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs text-purple-600 mb-1 font-medium">사용 완료</p>
                            <p className="text-2xl font-bold text-purple-700">
                              {coupon.stats?.usedCount ?? 0}
                            </p>
                          </div>
                          <CheckCircle className="w-5 h-5 text-purple-500" />
                        </div>
                      </div>
                      <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs text-orange-600 mb-1 font-medium">만료</p>
                            <p className="text-2xl font-bold text-orange-700">
                              {coupon.stats?.expiredCount ?? 0}
                            </p>
                          </div>
                          <Clock className="w-5 h-5 text-orange-500" />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold">타입:</span>
                        <span>{coupon.type === 'FCFS' ? '선착순' : coupon.type}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold">시작:</span>
                        <span>{formatDate(coupon.startAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold">종료:</span>
                        <span>{formatDate(coupon.endAt)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 text-center"
        >
          <p className="text-sm text-gray-700 font-medium mb-3">
            페이지는 2초마다 자동으로 새로고침됩니다
          </p>
          <div className="flex items-center justify-center space-x-3">
            <div className="relative">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
            </div>
            <span className="text-sm text-emerald-600 font-semibold">실시간 업데이트 중</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
