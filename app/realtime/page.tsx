'use client';

import { useQuery } from '@tanstack/react-query';
import { couponAPI } from '@/lib/api';
import type { Coupon } from '@/lib/types';
import Link from 'next/link';

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">실시간 쿠폰 발급 현황</h1>
            <p className="text-gray-600 mt-1">2초마다 자동 새로고침</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 shadow"
          >
            홈으로
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">데이터 로딩 중...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">등록된 쿠폰이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {coupons.map((coupon: Coupon) => {
              const percentage = getProgressPercentage(coupon);
              const remaining = coupon.stats?.remainingCount ?? 0;
              const issued = coupon.stats?.issuedCount ?? 0;
              const total = coupon.totalQuantity;
              const isSoldOut = percentage >= 100;
              const isActive = isCouponActive(coupon);

              return (
                <div
                  key={coupon.id}
                  className={`p-6 rounded-lg shadow-lg ${
                    isSoldOut
                      ? 'bg-gray-100 border-2 border-gray-300'
                      : 'bg-white border-2 border-blue-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {coupon.name}
                      </h2>
                      <p className="text-lg text-blue-600 font-semibold mt-1">
                        {coupon.discountValue}
                        {coupon.discountType === 'AMOUNT' ? '원' : '%'} 할인
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          isSoldOut
                            ? 'bg-red-100 text-red-800'
                            : isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {isSoldOut ? '품절' : isActive ? '진행중' : '대기중'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        발급 진행률
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {issued} / {total} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                      <div
                        className={`h-full ${getStatusColor(
                          percentage
                        )} transition-all duration-500 flex items-center justify-center text-white font-bold text-sm`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      >
                        {percentage > 10 && `${percentage}%`}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">남은 수량</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {remaining}
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">발급 완료</p>
                      <p className="text-2xl font-bold text-green-600">
                        {issued}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">사용 완료</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {coupon.stats?.usedCount ?? 0}
                      </p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">만료</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {coupon.stats?.expiredCount ?? 0}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 space-y-1">
                    <p>타입: {coupon.type === 'FCFS' ? '선착순' : coupon.type}</p>
                    <p>시작: {formatDate(coupon.startAt)}</p>
                    <p>종료: {formatDate(coupon.endAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 p-4 bg-white rounded-lg shadow text-center">
          <p className="text-sm text-gray-600">
            페이지는 2초마다 자동으로 새로고침됩니다
          </p>
          <div className="mt-2 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">실시간 업데이트 중</span>
          </div>
        </div>
      </div>
    </div>
  );
}
