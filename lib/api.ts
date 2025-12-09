import axios from 'axios';
import type { Coupon, CreateCouponDto, IssueResult, MyCouponsResponse } from './types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const couponAPI = {
  // Admin API
  getCoupons: async (): Promise<Coupon[]> => {
    const { data } = await api.get('/api/admin/coupons');
    return data;
  },

  getCoupon: async (id: string): Promise<Coupon> => {
    const { data } = await api.get(`/api/admin/coupons/${id}`);
    return data;
  },

  createCoupon: async (dto: CreateCouponDto): Promise<Coupon> => {
    const { data } = await api.post('/api/admin/coupons', dto);
    return data;
  },

  updateCoupon: async (id: string, dto: Partial<CreateCouponDto>): Promise<Coupon> => {
    const { data } = await api.patch(`/api/admin/coupons/${id}`, dto);
    return data;
  },

  issueCoupon: async (couponId: string, userId: string): Promise<IssueResult> => {
    const { data } = await api.post(`/api/admin/coupons/${couponId}/issue`, { userId });
    return data;
  },

  // User API
  getMyCoupons: async (
    userId: string,
    params?: {
      status?: 'ISSUED' | 'USED' | 'EXPIRED';
      page?: number;
      limit?: number;
    }
  ): Promise<MyCouponsResponse> => {
    const { data } = await api.get('/api/user/coupons/my-coupons', {
      params: { userId, ...params },
    });
    return data;
  },

  useCoupon: async (issuedCouponId: string, userId: string) => {
    const { data } = await api.post(`/api/user/coupons/${issuedCouponId}/use`, { userId });
    return data;
  },
};
