'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { couponAPI } from '@/lib/api';
import type { CreateCouponDto } from '@/lib/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, ArrowLeft, Zap, Clock, Tag, Percent, Hash } from 'lucide-react';

export default function CreateCouponPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateCouponDto>({
    name: '',
    type: 'FCFS',
    discountType: 'AMOUNT',
    discountValue: 0,
    totalQuantity: 0,
    startAt: '',
    endAt: '',
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCouponDto) => couponAPI.createCoupon(data),
    onSuccess: () => {
      alert('쿠폰이 성공적으로 생성되었습니다!');
      router.push('/admin');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || '쿠폰 생성 중 오류가 발생했습니다.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('쿠폰명을 입력해주세요.');
      return;
    }

    if (formData.discountValue <= 0) {
      alert('할인 값은 0보다 커야 합니다.');
      return;
    }

    if (formData.totalQuantity <= 0) {
      alert('총 수량은 0보다 커야 합니다.');
      return;
    }

    if (!formData.startAt || !formData.endAt) {
      alert('시작일과 종료일을 입력해주세요.');
      return;
    }

    if (new Date(formData.startAt) >= new Date(formData.endAt)) {
      alert('시작일은 종료일보다 이전이어야 합니다.');
      return;
    }

    createMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'discountValue' || name === 'totalQuantity' ? Number(value) : value,
    }));
  };

  const setQuickDate = (type: 'now' | 'tomorrow' | 'week' | 'month') => {
    const now = new Date();
    let start: Date;
    let end: Date;

    if (type === 'now') {
      start = now;
      end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else if (type === 'tomorrow') {
      start = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else if (type === 'week') {
      start = now;
      end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else {
      start = now;
      end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }

    setFormData((prev) => ({
      ...prev,
      startAt: start.toISOString().slice(0, 16),
      endAt: end.toISOString().slice(0, 16),
    }));
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-[var(--neon-green)] rounded-full animate-pulse"
                     style={{ boxShadow: '0 0 10px var(--neon-green)' }} />
                <span className="text-[var(--text-muted)] text-sm font-arcade uppercase tracking-widest">
                  Coupon Creator
                </span>
              </div>
              <h1 className="font-arcade text-3xl neon-green">NEW_COUPON</h1>
            </div>
            <Link href="/admin">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="arcade-btn arcade-btn-cyan"
              >
                <span className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  BACK
                </span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="arcade-card p-8 border border-[var(--neon-green)]"
            style={{ boxShadow: '0 0 30px rgba(0, 255, 136, 0.1)' }}
          >
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-arcade text-[var(--neon-cyan)] mb-2">
                  <Tag className="w-4 h-4" />
                  COUPON_NAME *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="arcade-input w-full"
                  placeholder="예: 100개 한정 선착순 쿠폰"
                />
              </div>

              {/* Type */}
              <div>
                <label className="flex items-center gap-2 text-sm font-arcade text-[var(--neon-cyan)] mb-2">
                  <Zap className="w-4 h-4" />
                  TYPE *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="arcade-select w-full"
                >
                  <option value="FCFS">FCFS (선착순)</option>
                  <option value="LOTTERY">LOTTERY (추첨)</option>
                  <option value="CODE">CODE (코드)</option>
                </select>
              </div>

              {/* Discount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-arcade text-[var(--neon-cyan)] mb-2">
                    <Percent className="w-4 h-4" />
                    DISCOUNT_TYPE *
                  </label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleChange}
                    required
                    className="arcade-select w-full"
                  >
                    <option value="AMOUNT">금액 할인</option>
                    <option value="RATE">비율 할인</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-arcade text-[var(--neon-cyan)] mb-2">
                    <Hash className="w-4 h-4" />
                    DISCOUNT_VALUE *
                  </label>
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                    required
                    min="1"
                    className="arcade-input w-full"
                    placeholder={formData.discountType === 'AMOUNT' ? '원' : '%'}
                  />
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="flex items-center gap-2 text-sm font-arcade text-[var(--neon-cyan)] mb-2">
                  <Hash className="w-4 h-4" />
                  TOTAL_QUANTITY *
                </label>
                <input
                  type="number"
                  name="totalQuantity"
                  value={formData.totalQuantity}
                  onChange={handleChange}
                  required
                  min="1"
                  className="arcade-input w-full"
                  placeholder="발급할 총 수량"
                />
              </div>

              {/* Quick Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-arcade text-[var(--neon-cyan)] mb-2">
                  <Clock className="w-4 h-4" />
                  QUICK_DATE
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickDate('now')}
                    className="px-3 py-2 text-sm arcade-card border border-[var(--border-glow)] text-[var(--text-secondary)] hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)] transition-all"
                  >
                    NOW ~ 1WEEK
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDate('tomorrow')}
                    className="px-3 py-2 text-sm arcade-card border border-[var(--border-glow)] text-[var(--text-secondary)] hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)] transition-all"
                  >
                    TOMORROW ~ 1WEEK
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDate('month')}
                    className="px-3 py-2 text-sm arcade-card border border-[var(--border-glow)] text-[var(--text-secondary)] hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)] transition-all"
                  >
                    NOW ~ 1MONTH
                  </button>
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-arcade text-[var(--neon-cyan)] mb-2">
                    <Clock className="w-4 h-4" />
                    START_DATE *
                  </label>
                  <input
                    type="datetime-local"
                    name="startAt"
                    value={formData.startAt}
                    onChange={handleChange}
                    required
                    className="arcade-input w-full"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-arcade text-[var(--neon-cyan)] mb-2">
                    <Clock className="w-4 h-4" />
                    END_DATE *
                  </label>
                  <input
                    type="datetime-local"
                    name="endAt"
                    value={formData.endAt}
                    onChange={handleChange}
                    required
                    className="arcade-input w-full"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="arcade-card p-4 border border-[var(--neon-magenta)]">
                <h3 className="font-arcade text-[var(--neon-magenta)] mb-3">PREVIEW</h3>
                <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <p>
                    <span className="text-[var(--text-muted)]">NAME:</span>{' '}
                    <span className="neon-cyan">{formData.name || '(입력 필요)'}</span>
                  </p>
                  <p>
                    <span className="text-[var(--text-muted)]">DISCOUNT:</span>{' '}
                    <span className="neon-green">
                      {formData.discountValue > 0
                        ? `${formData.discountValue}${formData.discountType === 'AMOUNT' ? '원' : '%'}`
                        : '(입력 필요)'}
                    </span>
                  </p>
                  <p>
                    <span className="text-[var(--text-muted)]">QUANTITY:</span>{' '}
                    <span className="neon-orange">
                      {formData.totalQuantity > 0 ? `${formData.totalQuantity}개` : '(입력 필요)'}
                    </span>
                  </p>
                  <p>
                    <span className="text-[var(--text-muted)]">PERIOD:</span>{' '}
                    {formData.startAt && formData.endAt
                      ? `${new Date(formData.startAt).toLocaleString('ko-KR')} ~ ${new Date(formData.endAt).toLocaleString('ko-KR')}`
                      : '(입력 필요)'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 arcade-btn arcade-btn-filled disabled:opacity-50"
                >
                  <span className="flex items-center justify-center gap-2">
                    {createMutation.isPending ? (
                      <>
                        <Zap className="w-5 h-5 animate-pulse" />
                        CREATING...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        CREATE COUPON
                      </>
                    )}
                  </span>
                </motion.button>
                <Link href="/admin" className="flex-shrink-0">
                  <button type="button" className="arcade-btn arcade-btn-pink h-full">
                    CANCEL
                  </button>
                </Link>
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
