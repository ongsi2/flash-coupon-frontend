'use client';

import { useQuery } from '@tanstack/react-query';
import { couponAPI } from '@/lib/api';
import type { Coupon } from '@/lib/types';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Plus, Home, Database, TrendingUp, Users, Clock, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                관리자 대시보드
              </h1>
              <p className="text-gray-600">쿠폰 관리 및 통계 조회</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSyncRedis}
                disabled={isSyncing}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <Database className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? '동기화 중...' : 'Redis 재동기화'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 rounded-xl hover:bg-gray-50 shadow-md border border-gray-200 transition-all font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                새로고침
              </motion.button>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/admin/coupons/new"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30 transition-all font-medium"
                >
                  <Plus className="w-4 h-4" />
                  새 쿠폰 만들기
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 rounded-xl hover:bg-gray-50 shadow-md border border-gray-200 transition-all font-medium"
                >
                  <Home className="w-4 h-4" />
                  홈으로
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-gray-100"
          >
            <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-lg">로딩 중...</p>
          </motion.div>
        ) : coupons.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-gray-100"
          >
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-6">등록된 쿠폰이 없습니다.</p>
            <Link
              href="/admin/coupons/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30 transition-all font-medium"
            >
              <Plus className="w-5 h-5" />
              첫 번째 쿠폰 만들기
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      쿠폰명
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      할인
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      전체
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      발급
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      사용
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      남음
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      만료
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      기간
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      상태
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {coupons.map((coupon: Coupon) => {
                    const now = new Date();
                    const start = new Date(coupon.startAt);
                    const end = new Date(coupon.endAt);
                    const isActive = now >= start && now <= end;
                    const isUpcoming = now < start;
                    const isExpired = now > end;
                    const isSoldOut =
                      (coupon.stats?.remainingCount ?? 0) === 0;

                    return (
                      <tr key={coupon.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {coupon.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {coupon.type === 'FCFS' ? '선착순' : coupon.type}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-blue-600">
                            {coupon.discountValue}
                            {coupon.discountType === 'AMOUNT' ? '원' : '%'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-gray-900 font-medium">
                            {coupon.totalQuantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-green-600 font-medium">
                            {coupon.stats?.issuedCount ?? 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-purple-600 font-medium">
                            {coupon.stats?.usedCount ?? 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`font-bold ${
                              isSoldOut ? 'text-red-600' : 'text-blue-600'
                            }`}
                          >
                            {coupon.stats?.remainingCount ?? 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-orange-600 font-medium">
                            {coupon.stats?.expiredCount ?? 0}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-gray-600 space-y-1">
                            <p>{formatDate(coupon.startAt)}</p>
                            <p>{formatDate(coupon.endAt)}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                              isSoldOut
                                ? 'bg-red-100 text-red-800'
                                : isExpired
                                ? 'bg-gray-100 text-gray-800'
                                : isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {isSoldOut
                              ? '품절'
                              : isExpired
                              ? '종료'
                              : isActive
                              ? '진행중'
                              : '대기중'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {coupons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 grid md:grid-cols-3 gap-6"
          >
            <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full -mr-12 -mt-12" />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-medium">총 쿠폰 수</p>
                  <p className="text-4xl font-bold text-gray-900">{coupons.length}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full -mr-12 -mt-12" />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-medium">총 발급 수</p>
                  <p className="text-4xl font-bold text-emerald-600">
                    {coupons.reduce(
                      (sum, c) => sum + (c.stats?.issuedCount ?? 0),
                      0
                    )}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/30">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -mr-12 -mt-12" />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-medium">총 사용 수</p>
                  <p className="text-4xl font-bold text-purple-600">
                    {coupons.reduce((sum, c) => sum + (c.stats?.usedCount ?? 0), 0)}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg shadow-purple-500/30">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
