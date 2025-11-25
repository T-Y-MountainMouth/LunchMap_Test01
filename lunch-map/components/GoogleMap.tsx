'use client';

import { useState, useCallback } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const center = {
  lat: 35.6812,
  lng: 139.7671
};

// 店舗登録フォームのデータ型
interface StoreFormData {
  storeName: string;
  review: string;
  rating: number;
}

// フォームデータの初期値
const initialFormData: StoreFormData = {
  storeName: '',
  review: '',
  rating: 3,
};

// モーダルコンポーネント
interface StoreRegistrationModalProps {
  isOpen: boolean;
  formData: StoreFormData;
  onFormChange: (data: StoreFormData) => void;
  onSubmit: () => void;
  onClose: () => void;
}

function StoreRegistrationModal({
  isOpen,
  formData,
  onFormChange,
  onSubmit,
  onClose,
}: StoreRegistrationModalProps) {
  if (!isOpen) return null;

  // 星評価のレンダリング
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isFilled = starValue <= formData.rating;
      return (
        <button
          key={starValue}
          type="button"
          onClick={() => onFormChange({ ...formData, rating: starValue })}
          className={`text-3xl transition-all duration-200 hover:scale-110 ${
            isFilled
              ? 'text-amber-400 drop-shadow-sm'
              : 'text-gray-300 hover:text-amber-200'
          }`}
        >
          ★
        </button>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* オーバーレイ（ブラー効果付き） */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* モーダル本体 */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        {/* ヘッダー（グラデーション） */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">🍽️</span>
              新しいお店を登録
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* 店舗名入力 */}
          <div>
            <label
              htmlFor="storeName"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              🏪 店舗名
            </label>
            <input
              type="text"
              id="storeName"
              value={formData.storeName}
              onChange={(e) =>
                onFormChange({ ...formData, storeName: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200 text-gray-800 placeholder-gray-400"
              placeholder="お店の名前を入力してください"
            />
          </div>

          {/* レビュー入力 */}
          <div>
            <label
              htmlFor="review"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              ✏️ レビュー・コメント
            </label>
            <textarea
              id="review"
              value={formData.review}
              onChange={(e) =>
                onFormChange({ ...formData, review: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200 resize-none text-gray-800 placeholder-gray-400"
              placeholder="おすすめポイントや感想を書いてください"
            />
          </div>

          {/* 星評価 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              ⭐ 評価
            </label>
            <div className="flex items-center justify-center gap-2 py-2">
              {renderStars()}
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              {formData.rating === 1 && 'もう行かないかも...'}
              {formData.rating === 2 && 'まあまあかな'}
              {formData.rating === 3 && '普通においしい！'}
              {formData.rating === 4 && 'かなりおすすめ！'}
              {formData.rating === 5 && '最高！絶対また行く！'}
            </p>
          </div>

          {/* ボタン */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-3 text-gray-600 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 active:scale-95"
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="flex-1 px-5 py-3 text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200 shadow-lg shadow-orange-500/30 active:scale-95"
            >
              登録する 🎉
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Map() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  
  // モーダルの表示状態
  const [isModalOpen, setIsModalOpen] = useState(false);
  // タップした位置
  const [tappedPosition, setTappedPosition] = useState<{ lat: number; lng: number } | null>(null);
  // フォームデータ
  const [formData, setFormData] = useState<StoreFormData>(initialFormData);

  // 地図クリック時のハンドラ
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setTappedPosition({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
      setFormData(initialFormData);
      setIsModalOpen(true);
    }
  }, []);

  // モーダルを閉じる
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTappedPosition(null);
  }, []);

  // 登録ボタンクリック（仮動作）
  const handleSubmit = useCallback(() => {
    // 今回はUI表示のみ。データ保存は今後実装予定
    console.log('登録データ:', {
      position: tappedPosition,
      ...formData,
    });
    alert(`店舗「${formData.storeName || '(未入力)'}」を登録しました（仮）`);
    handleCloseModal();
  }, [formData, tappedPosition, handleCloseModal]);

  // 開発モードのクリックハンドラ（APIキーなしの場合）
  const handleDevModeClick = useCallback(() => {
    // 開発モードではダミーの座標を使用
    setTappedPosition({
      lat: center.lat + (Math.random() - 0.5) * 0.01,
      lng: center.lng + (Math.random() - 0.5) * 0.01,
    });
    setFormData(initialFormData);
    setIsModalOpen(true);
  }, []);

  // 開発モード: APIキーが設定されていない場合はプレースホルダーを表示
  if (!apiKey || apiKey === '') {
    return (
      <>
        <div 
          style={containerStyle}
          className="flex items-center justify-center bg-gray-100 cursor-pointer"
          onClick={handleDevModeClick}
        >
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">開発モード</h2>
            <p className="text-gray-600 mb-4">
              Google Maps APIキーが設定されていません。
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>地図表示位置:</strong><br />
                緯度: {center.lat}<br />
                経度: {center.lng}<br />
                ズーム: 14
              </p>
            </div>
            <p className="text-sm text-gray-500">
              APIキーを設定するには、<code className="bg-gray-100 px-2 py-1 rounded">.env.local</code>ファイルに<br />
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>を追加してください。
            </p>
            <p className="text-xs text-gray-500 mt-4">
              ※ 画面をクリックすると店舗登録モーダルを表示します
            </p>
          </div>
        </div>
        <StoreRegistrationModal
          isOpen={isModalOpen}
          formData={formData}
          onFormChange={setFormData}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
        />
      </>
    );
  }

  return (
    <>
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
          onClick={handleMapClick}
        >
        </GoogleMap>
      </LoadScript>
      <StoreRegistrationModal
        isOpen={isModalOpen}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleSubmit}
        onClose={handleCloseModal}
      />
    </>
  );
}
