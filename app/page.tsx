import Link from "next/link";

export default function Home() {
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

          <div className="mt-12 p-6 bg-white rounded-lg shadow text-center">
            <p className="text-gray-600">
              <strong>테스트 사용자 ID:</strong> e38477b7-1220-4edf-ba33-c1e87608eaf4
            </p>
            <p className="text-sm text-gray-500 mt-2">
              위 ID를 복사하여 사용자 페이지에서 테스트하세요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
