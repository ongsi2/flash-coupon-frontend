'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { couponAPI } from '@/lib/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Home, Zap } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await couponAPI.createUser(formData);
      localStorage.setItem('currentUser', JSON.stringify(user));
      alert('회원가입이 완료되었습니다!');
      router.push('/user');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="arcade-card p-8 border border-[var(--neon-cyan)]"
             style={{ boxShadow: '0 0 40px rgba(0, 255, 255, 0.15)' }}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 border-2 border-[var(--neon-cyan)]"
                 style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
              <User className="w-8 h-8 text-[var(--neon-cyan)]" />
            </div>
            <h1 className="font-arcade text-3xl neon-cyan mb-2">REGISTER</h1>
            <p className="text-[var(--text-secondary)]">새로운 플레이어 등록</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-arcade text-[var(--neon-cyan)] mb-2">
                EMAIL *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="arcade-input w-full"
                placeholder="player@game.com"
              />
            </div>

            <div>
              <label className="block text-sm font-arcade text-[var(--neon-cyan)] mb-2">
                NAME *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="arcade-input w-full"
                placeholder="플레이어 이름"
              />
            </div>

            {error && (
              <div className="arcade-card p-3 border border-[var(--neon-pink)]">
                <p className="text-sm neon-pink">{error}</p>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full arcade-btn arcade-btn-filled disabled:opacity-50"
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Zap className="w-5 h-5 animate-pulse" />
                    PROCESSING...
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5" />
                    CREATE ACCOUNT
                  </>
                )}
              </span>
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--neon-cyan)] transition-colors">
              <Home className="w-4 h-4" />
              <span className="text-sm font-arcade">BACK TO HOME</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
