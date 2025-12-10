'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { couponAPI } from '@/lib/api';
import type { Coupon, IssuedCoupon, User } from '@/lib/types';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, LogOut, User as UserIcon, Tag, Clock, CheckCircle, XCircle, Ticket, TrendingUp, Filter } from 'lucide-react';

export default function UserPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userId, setUserId] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ISSUED' | 'USED' | 'EXPIRED' | undefined>();
  const queryClient = useQueryClient();

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setUserId(user.id);
    }
  }, []);

  // Fetch available coupons
  const { data: availableCoupons = [], isLoading: couponsLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: () => couponAPI.getCoupons(),
    refetchInterval: 5000,
  });

  // Fetch my coupons
  const { data: myCouponsData, isLoading: myCouponsLoading } = useQuery({
    queryKey: ['myCoupons', userId, statusFilter],
    queryFn: () => couponAPI.getMyCoupons(userId, { status: statusFilter }),
    enabled: !!userId,
    refetchInterval: 5000,
  });

  // Issue coupon mutation
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

  // Use coupon mutation
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

  const isExpired = (expiresAt: string) => {
    return new Date() > new Date(expiresAt);
  };

  const isCouponAvailable = (coupon: Coupon) => {
    const now = new Date();
    const start = new Date(coupon.startAt);
    const end = new Date(coupon.endAt);
    return now >= start && now <= end && (coupon.stats?.remainingCount ?? 0) > 0;
  };

  // Redirect to register if no user
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 text-center border border-gray-100"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/30">
            <UserIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            로그인이 필요합니다
          </h2>
          <p className="text-gray-600 mb-8">쿠폰을 발급받으려면 먼저 회원가입을 해주세요.</p>
          <div className="space-y-3">
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 w-full py-4 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-lg shadow-indigo-500/30 transition-all"
            >
              <UserIcon className="w-5 h-5" />
              회원가입하기
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full py-4 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-all"
            >
              <Home className="w-5 h-5" />
              홈으로 돌아가기
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                사용자 쿠폰 페이지
              </h1>
              <p className="text-gray-600">쿠폰 발급 및 관리</p>
            </div>
            <div className="flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 rounded-xl hover:bg-gray-50 shadow-md border border-gray-200 transition-all font-medium"
                >
                  <Home className="w-4 h-4" />
                  홈으로
                </Link>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30 transition-all font-medium"
              >
                <LogOut className="w-4 h-4" />
                로그아웃
              </motion.button>
            </div>
          </div>

          <div className="p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/30">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">현재 로그인한 사용자</p>
                  <p className="text-xl font-bold text-gray-900">{currentUser.name}</p>
                  <p className="text-sm text-gray-600">{currentUser.email}</p>
                </div>
              </div>
              <div className="text-right bg-gray-50 px-4 py-2 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">사용자 ID</p>
                <p className="text-sm text-gray-700 font-mono font-semibold">{currentUser.id}</p>
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
            <Tag className="w-6 h-6 text-indigo-600" />
            <h2 className="text-3xl font-bold text-gray-900">사용 가능한 쿠폰</h2>
          </div>
          {couponsLoading ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-gray-100">
              <Ticket className="w-12 h-12 text-indigo-600 animate-pulse mx-auto mb-4" />
              <p className="text-gray-600">로딩 중...</p>
            </div>
          ) : availableCoupons.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-gray-100">
              <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">사용 가능한 쿠폰이 없습니다.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCoupons.map((coupon: Coupon, index: number) => (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative overflow-hidden p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full -mr-12 -mt-12" />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 flex-1">
                        {coupon.name}
                      </h3>
                      <Ticket className="w-6 h-6 text-indigo-600" />
                    </div>

                    <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                      {coupon.discountValue}
                      {coupon.discountType === 'AMOUNT' ? '원' : '%'}
                    </p>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">총 수량</span>
                        <span className="font-semibold text-gray-900">{coupon.totalQuantity}개</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">남은 수량</span>
                        <span className="font-bold text-indigo-600">
                          {coupon.stats?.remainingCount ?? 0}개
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">발급 완료</span>
                        <span className="font-semibold text-emerald-600">{coupon.stats?.issuedCount ?? 0}개</span>
                      </div>
                      <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-start gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <div>{formatDate(coupon.startAt)}</div>
                            <div>~ {formatDate(coupon.endAt)}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: isCouponAvailable(coupon) ? 1.02 : 1 }}
                      whileTap={{ scale: isCouponAvailable(coupon) ? 0.98 : 1 }}
                      onClick={() => handleIssueCoupon(coupon.id)}
                      disabled={!isCouponAvailable(coupon) || issueMutation.isPending}
                      className={`w-full py-3 px-4 rounded-xl font-semibold shadow-lg transition-all ${
                        isCouponAvailable(coupon)
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/30'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {issueMutation.isPending ? '발급 중...' : isCouponAvailable(coupon) ? '발급받기' : '발급 불가'}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
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
              <Ticket className="w-6 h-6 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900">내 쿠폰</h2>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={statusFilter || ''}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as 'ISSUED' | 'USED' | 'EXPIRED' | undefined
                  )
                }
                className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white shadow-md font-medium text-gray-700 hover:border-gray-300 transition-all"
              >
                <option value="">전체</option>
                <option value="ISSUED">사용 가능</option>
                <option value="USED">사용 완료</option>
                <option value="EXPIRED">만료</option>
              </select>
            </div>
          </div>

          {myCouponsLoading ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-gray-100">
              <Ticket className="w-12 h-12 text-purple-600 animate-pulse mx-auto mb-4" />
              <p className="text-gray-600">로딩 중...</p>
            </div>
          ) : !myCouponsData || myCouponsData.data.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-gray-100">
              <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">보유한 쿠폰이 없습니다.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCouponsData.data.map((coupon: IssuedCoupon, index: number) => (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative overflow-hidden p-6 rounded-2xl shadow-xl transition-all border-2 ${
                    coupon.status === 'ISSUED' && !coupon.isExpired
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-emerald-300'
                      : 'bg-gray-100 border-gray-300'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full -mr-12 -mt-12" />

                  <div className="relative">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900 flex-1">
                        {coupon.couponName}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl shadow-lg ${
                          coupon.status === 'ISSUED' && !coupon.isExpired
                            ? 'bg-emerald-500 text-white'
                            : coupon.status === 'USED'
                            ? 'bg-gray-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {coupon.status === 'ISSUED' && !coupon.isExpired ? (
                          <><CheckCircle className="w-3 h-3" /> 사용 가능</>
                        ) : coupon.status === 'USED' ? (
                          <><CheckCircle className="w-3 h-3" /> 사용 완료</>
                        ) : (
                          <><XCircle className="w-3 h-3" /> 만료</>
                        )}
                      </span>
                    </div>

                    <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                      {coupon.discountValue}
                      {coupon.discountType === 'AMOUNT' ? '원' : '%'}
                    </p>

                    <div className="space-y-2 mb-6 bg-white/60 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">발급:</span>
                        <span>{formatDate(coupon.issuedAt)}</span>
                      </div>
                      {coupon.usedAt && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-medium">사용:</span>
                          <span>{formatDate(coupon.usedAt)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <XCircle className="w-4 h-4" />
                        <span className="font-medium">만료:</span>
                        <span>{formatDate(coupon.expiresAt)}</span>
                      </div>
                    </div>

                    {coupon.status === 'ISSUED' && !coupon.isExpired && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleUseCoupon(coupon.id)}
                        disabled={useMutation_.isPending}
                        className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 font-semibold shadow-lg shadow-emerald-500/30 transition-all"
                      >
                        {useMutation_.isPending ? '처리 중...' : '사용하기'}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
