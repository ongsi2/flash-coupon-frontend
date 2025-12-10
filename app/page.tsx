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
        </motion.div>
      </div>
    </div>
  );
}
