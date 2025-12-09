export interface Coupon {
  id: string;
  name: string;
  type: 'FCFS' | 'LOTTERY' | 'CODE';
  discountType: 'AMOUNT' | 'RATE';
  discountValue: number;
  totalQuantity: number;
  startAt: string;
  endAt: string;
  stats?: CouponStats;
}

export interface CouponStats {
  issuedCount: number;
  usedCount: number;
  remainingCount: number;
  expiredCount: number;
}

export interface IssuedCoupon {
  id: string;
  couponId: string;
  couponName: string;
  discountType: string;
  discountValue: number;
  status: 'ISSUED' | 'USED' | 'EXPIRED';
  issuedAt: string;
  usedAt: string | null;
  expiresAt: string;
  isExpired: boolean;
}

export interface CreateCouponDto {
  name: string;
  type: 'FCFS' | 'LOTTERY' | 'CODE';
  discountType: 'AMOUNT' | 'RATE';
  discountValue: number;
  totalQuantity: number;
  startAt: string;
  endAt: string;
}

export interface IssueResult {
  couponId: string;
  userId: string;
  status: 'SUCCESS' | 'DUPLICATED' | 'SOLD_OUT' | 'EXPIRED' | 'NOT_STARTED';
  remaining: number | null;
}

export interface MyCouponsResponse {
  data: IssuedCoupon[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  name: string;
}
