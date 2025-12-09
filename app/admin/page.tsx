'use client';

import { useQuery } from '@tanstack/react-query';
import { couponAPI } from '@/lib/api';
import type { Coupon } from '@/lib/types';
import Link from 'next/link';
import { useState } from 'react';

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
          <div className="flex gap-3">
            <button
              onClick={handleSyncRedis}
              disabled={isSyncing}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSyncing ? '⏳ 동기화 중...' : '🔄 Redis 재동기화'}
            </button>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              🔄 새로고침
            </button>
            <Link
              href="/admin/coupons/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + 새 쿠폰 만들기
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              홈으로
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">로딩 중...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">등록된 쿠폰이 없습니다.</p>
            <Link
              href="/admin/coupons/new"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              첫 번째 쿠폰 만들기
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      쿠폰명
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      할인
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      전체
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      발급
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      사용
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      남음
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      만료
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      기간
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
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
          </div>
        )}

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-1">총 쿠폰 수</p>
            <p className="text-3xl font-bold text-gray-900">{coupons.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-1">총 발급 수</p>
            <p className="text-3xl font-bold text-green-600">
              {coupons.reduce(
                (sum, c) => sum + (c.stats?.issuedCount ?? 0),
                0
              )}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-1">총 사용 수</p>
            <p className="text-3xl font-bold text-purple-600">
              {coupons.reduce((sum, c) => sum + (c.stats?.usedCount ?? 0), 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
