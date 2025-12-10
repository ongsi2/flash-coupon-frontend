'use client';

import Link from "next/link";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Activity, Zap, Database, Lock, Calendar, FileText, Sparkles } from 'lucide-react';
import type { User as UserType } from '@/lib/types';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          className="max-w-5xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm mb-6">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">Redis 기반 고성능 쿠폰 시스템</span>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Flash Coupon
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              선착순 쿠폰 발급 시스템 - 대규모 동시성 처리를 위한 최적화된 솔루션
            </p>
          </motion.div>

          {currentUser && (
            <motion.div
              variants={itemVariants}
              className="mb-10 p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-indigo-100"
            >
              <div className="flex items-center justify-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                <p className="text-gray-700">
                  환영합니다, <strong className="text-indigo-600 font-semibold">{currentUser.name}</strong>님!
                </p>
              </div>
            </motion.div>
          )}

          <motion.div
            className="grid md:grid-cols-2 gap-6 mb-10 auto-rows-fr"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="h-full">
              <Link
                href="/user"
                className="group flex flex-col h-full relative overflow-hidden p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-200"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 mb-4 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    사용자 페이지
                  </h2>
                  <p className="text-gray-600">
                    쿠폰 발급받기, 내 쿠폰 조회, 쿠폰 사용
                  </p>
                </div>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="h-full">
              <Link
                href="/admin"
                className="group flex flex-col h-full relative overflow-hidden p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-shadow">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    관리자 대시보드
                  </h2>
                  <p className="text-gray-600">
                    쿠폰 관리, 통계 조회, 쿠폰 생성
                  </p>
                </div>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="h-full">
              <Link
                href="/realtime"
                className="group flex flex-col h-full relative overflow-hidden p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 mb-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-shadow">
                    <Activity className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    실시간 발급 현황
                  </h2>
                  <p className="text-gray-600">
                    쿠폰 발급 현황 실시간 모니터링
                  </p>
                </div>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="h-full">
              <div className="relative flex flex-col h-full overflow-hidden p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl shadow-indigo-500/30 text-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 mb-4 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">
                    주요 기능
                  </h2>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      <span className="text-sm">Redis Lua Script 원자적 발급</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm">중복 발급 방지</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">쿠폰 기간 관리</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">발급/사용 내역 저장</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {!currentUser && (
            <motion.div
              variants={itemVariants}
              className="p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 text-center"
            >
              <p className="text-gray-800 font-medium mb-6 text-lg">
                쿠폰을 발급받으려면 먼저 회원가입이 필요합니다
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300"
              >
                <User className="w-5 h-5" />
                회원가입하기
              </Link>
            </motion.div>
          )}

          {/* Architecture & Flow */}
          <motion.div
            variants={itemVariants}
            className="mt-14"
          >
            <div className="mb-6 text-center">
              <p className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm text-sm font-medium text-gray-700 border border-indigo-100">
                <Zap className="w-4 h-4 text-indigo-600" />
                아키텍처 & 흐름 한눈에 보기
              </p>
              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                초당 발급을 지탱하는 핵심 설계
              </h2>
              <p className="mt-2 text-gray-600">
                Redis 원자 처리 + DB 세이프티넷 + 헬스 모니터링으로 안정적 발급/사용을 보장합니다.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ y: -4 }}
                className="relative p-6 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
                <div className="relative flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold">
                    1
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-indigo-600">Atomic Issue</p>
                    <h3 className="text-lg font-bold text-gray-900">Redis Lua 원자 발급</h3>
                  </div>
                </div>
                <p className="relative text-gray-700 text-sm leading-relaxed">
                  중복 체크 → 재고 확인 → 감소를 한 스크립트로 처리해 레이스 컨디션을 차단하고, TTL로 발급 흔적을 관리합니다.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="relative p-6 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5" />
                <div className="relative flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-bold">
                    2
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-emerald-600">Safety Net</p>
                    <h3 className="text-lg font-bold text-gray-900">DB Unique 세이프티</h3>
                  </div>
                </div>
                <p className="relative text-gray-700 text-sm leading-relaxed">
                  `(userId, couponId)` 유니크로 2차 중복을 차단하고, 발급/사용 내역을 영속화해 통계와 추적성을 확보합니다.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="relative p-6 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5" />
                <div className="relative flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-600 font-bold">
                    3
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-amber-600">Sync & Health</p>
                    <h3 className="text-lg font-bold text-gray-900">Redis-DB 동기화/모니터링</h3>
                  </div>
                </div>
                <p className="relative text-gray-700 text-sm leading-relaxed">
                  관리자가 Redis 재고를 DB 기준으로 동기화할 수 있고, 실시간 대시보드로 발급률/재고를 모니터링합니다.
                </p>
              </motion.div>
            </div>

            <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold">
                  <Activity className="w-4 h-4" />
                  Data Flow
                </span>
                <span className="text-xs text-gray-500">클라이언트 → API → Redis → DB</span>
              </div>
              <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-800">
                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 shadow-sm">
                  <p className="font-bold text-gray-900 mb-1">1) 요청</p>
                  <p className="text-gray-600">프론트에서 발급/사용 API 호출 (React Query로 폴링/캐싱).</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100 shadow-sm">
                  <p className="font-bold text-gray-900 mb-1">2) Redis</p>
                  <p className="text-gray-600">Lua 스크립트로 중복/재고 체크·감소, 발급 흔적 TTL 기록.</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 shadow-sm">
                  <p className="font-bold text-gray-900 mb-1">3) DB</p>
                  <p className="text-gray-600">성공 건만 비동기 영속화, 유니크 제약으로 2차 보호.</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 shadow-sm">
                  <p className="font-bold text-gray-900 mb-1">4) 관측/동기화</p>
                  <p className="text-gray-600">실시간 대시보드로 수치 확인, 필요 시 Redis 재고를 DB 기준으로 재계산.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
