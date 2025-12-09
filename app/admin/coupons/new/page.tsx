'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { couponAPI } from '@/lib/api';
import type { CreateCouponDto } from '@/lib/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'discountValue' || name === 'totalQuantity'
          ? Number(value)
          : value,
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">새 쿠폰 만들기</h1>
            <Link
              href="/admin"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              취소
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  쿠폰명 *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: 100개 한정 선착순 쿠폰"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  타입 *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="FCFS">FCFS (선착순)</option>
                  <option value="LOTTERY">LOTTERY (추첨)</option>
                  <option value="CODE">CODE (코드)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    할인 타입 *
                  </label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="AMOUNT">금액 할인</option>
                    <option value="RATE">비율 할인</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    할인 값 *
                  </label>
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={
                      formData.discountType === 'AMOUNT' ? '원' : '%'
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  총 수량 *
                </label>
                <input
                  type="number"
                  name="totalQuantity"
                  value={formData.totalQuantity}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="개"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  빠른 기간 설정
                </label>
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setQuickDate('now')}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    지금 ~ 1주일
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDate('tomorrow')}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    내일 ~ 1주일
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDate('month')}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    지금 ~ 1개월
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    시작일 *
                  </label>
                  <input
                    type="datetime-local"
                    name="startAt"
                    value={formData.startAt}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    종료일 *
                  </label>
                  <input
                    type="datetime-local"
                    name="endAt"
                    value={formData.endAt}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">미리보기</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>
                    <strong>쿠폰명:</strong> {formData.name || '(입력 필요)'}
                  </p>
                  <p>
                    <strong>할인:</strong>{' '}
                    {formData.discountValue > 0
                      ? `${formData.discountValue}${
                          formData.discountType === 'AMOUNT' ? '원' : '%'
                        }`
                      : '(입력 필요)'}
                  </p>
                  <p>
                    <strong>수량:</strong>{' '}
                    {formData.totalQuantity > 0
                      ? `${formData.totalQuantity}개`
                      : '(입력 필요)'}
                  </p>
                  <p>
                    <strong>기간:</strong>{' '}
                    {formData.startAt && formData.endAt
                      ? `${new Date(formData.startAt).toLocaleString(
                          'ko-KR'
                        )} ~ ${new Date(formData.endAt).toLocaleString(
                          'ko-KR'
                        )}`
                      : '(입력 필요)'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {createMutation.isPending ? '생성 중...' : '쿠폰 생성하기'}
                </button>
                <Link
                  href="/admin"
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                >
                  취소
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
