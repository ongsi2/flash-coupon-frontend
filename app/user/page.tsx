'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { couponAPI } from '@/lib/api';
import type { Coupon, IssuedCoupon } from '@/lib/types';
import Link from 'next/link';

export default function UserPage() {
  const [userId, setUserId] = useState('e38477b7-1220-4edf-ba33-c1e87608eaf4');
  const [statusFilter, setStatusFilter] = useState<'ISSUED' | 'USED' | 'EXPIRED' | undefined>();
  const queryClient = useQueryClient();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">사용자 쿠폰 페이지</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            홈으로
          </Link>
        </div>

        <div className="mb-8 p-4 bg-white rounded-lg shadow">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            사용자 ID
          </label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="사용자 ID를 입력하세요"
          />
        </div>

        {/* Available Coupons */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">사용 가능한 쿠폰</h2>
          {couponsLoading ? (
            <p className="text-gray-500">로딩 중...</p>
          ) : availableCoupons.length === 0 ? (
            <p className="text-gray-500">사용 가능한 쿠폰이 없습니다.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableCoupons.map((coupon: Coupon) => (
                <div
                  key={coupon.id}
                  className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {coupon.name}
                  </h3>
                  <p className="text-3xl font-bold text-blue-600 mb-3">
                    {coupon.discountValue}
                    {coupon.discountType === 'AMOUNT' ? '원' : '%'} 할인
                  </p>
                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <p>총 수량: {coupon.totalQuantity}개</p>
                    <p>
                      남은 수량:{' '}
                      <span className="font-bold text-blue-600">
                        {coupon.stats?.remainingCount ?? 0}개
                      </span>
                    </p>
                    <p>발급: {coupon.stats?.issuedCount ?? 0}개</p>
                    <p className="text-xs">
                      기간: {formatDate(coupon.startAt)} ~{' '}
                      {formatDate(coupon.endAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleIssueCoupon(coupon.id)}
                    disabled={
                      !isCouponAvailable(coupon) ||
                      issueMutation.isPending
                    }
                    className={`w-full py-2 px-4 rounded-lg font-medium ${
                      isCouponAvailable(coupon)
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {issueMutation.isPending
                      ? '발급 중...'
                      : isCouponAvailable(coupon)
                      ? '발급받기'
                      : '발급 불가'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Coupons */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">내 쿠폰</h2>
            <select
              value={statusFilter || ''}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as 'ISSUED' | 'USED' | 'EXPIRED' | undefined
                )
              }
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">전체</option>
              <option value="ISSUED">사용 가능</option>
              <option value="USED">사용 완료</option>
              <option value="EXPIRED">만료</option>
            </select>
          </div>

          {myCouponsLoading ? (
            <p className="text-gray-500">로딩 중...</p>
          ) : !myCouponsData || myCouponsData.data.length === 0 ? (
            <p className="text-gray-500">보유한 쿠폰이 없습니다.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myCouponsData.data.map((coupon: IssuedCoupon) => (
                <div
                  key={coupon.id}
                  className={`p-6 rounded-lg shadow ${
                    coupon.status === 'ISSUED' && !coupon.isExpired
                      ? 'bg-white border-2 border-blue-500'
                      : 'bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {coupon.couponName}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        coupon.status === 'ISSUED' && !coupon.isExpired
                          ? 'bg-green-100 text-green-800'
                          : coupon.status === 'USED'
                          ? 'bg-gray-200 text-gray-600'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {coupon.status === 'ISSUED' && !coupon.isExpired
                        ? '사용 가능'
                        : coupon.status === 'USED'
                        ? '사용 완료'
                        : '만료'}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 mb-3">
                    {coupon.discountValue}
                    {coupon.discountType === 'AMOUNT' ? '원' : '%'} 할인
                  </p>
                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <p>발급일: {formatDate(coupon.issuedAt)}</p>
                    {coupon.usedAt && <p>사용일: {formatDate(coupon.usedAt)}</p>}
                    <p>만료일: {formatDate(coupon.expiresAt)}</p>
                  </div>
                  {coupon.status === 'ISSUED' && !coupon.isExpired && (
                    <button
                      onClick={() => handleUseCoupon(coupon.id)}
                      disabled={useMutation_.isPending}
                      className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      {useMutation_.isPending ? '처리 중...' : '사용하기'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
