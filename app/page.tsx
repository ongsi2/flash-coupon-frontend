'use client';

import Link from "next/link";
import { useState, useEffect } from 'react';
import type { User } from '@/lib/types';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-center text-gray-900 mb-4">
            Flash Coupon
          </h1>
          <p className="text-center text-gray-600 mb-12 text-lg">
            선착순 쿠폰 발급 시스템 - Redis 기반 고성능 동시성 처리
          </p>

          {currentUser && (
            <div className="mb-8 p-4 bg-white rounded-lg shadow-md text-center">
              <p className="text-sm text-gray-600">
                환영합니다, <strong className="text-blue-600">{currentUser.name}</strong>님!
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/user"
              className="block p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">👤</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                사용자 페이지
              </h2>
              <p className="text-gray-600">
                쿠폰 발급받기, 내 쿠폰 조회, 쿠폰 사용
              </p>
            </Link>

            <Link
              href="/admin"
              className="block p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">🔧</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                관리자 대시보드
              </h2>
              <p className="text-gray-600">
                쿠폰 관리, 통계 조회, 쿠폰 생성
              </p>
            </Link>

            <Link
              href="/realtime"
              className="block p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                실시간 발급 현황
              </h2>
              <p className="text-gray-600">
                쿠폰 발급 현황 실시간 모니터링
              </p>
            </Link>

            <div className="p-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg text-white">
              <div className="text-4xl mb-4">⚡</div>
              <h2 className="text-2xl font-bold mb-2">
                주요 기능
              </h2>
              <ul className="space-y-2 text-sm">
                <li>🚀 Redis Lua Script 원자적 발급</li>
                <li>🔒 중복 발급 방지</li>
                <li>📅 쿠폰 기간 관리</li>
                <li>📝 발급/사용 내역 저장</li>
              </ul>
            </div>
          </div>

          {!currentUser && (
            <div className="mt-12 p-6 bg-white rounded-lg shadow text-center">
              <p className="text-gray-800 font-medium mb-4">
                쿠폰을 발급받으려면 먼저 회원가입이 필요합니다
              </p>
              <Link
                href="/register"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                회원가입하기
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
