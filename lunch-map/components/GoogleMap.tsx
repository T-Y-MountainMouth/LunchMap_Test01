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

// モーダルコンポーネント
interface StoreRegistrationModalProps {
  isOpen: boolean;
  position: { lat: number; lng: number } | null;
  formData: StoreFormData;
  onFormChange: (data: StoreFormData) => void;
  onSubmit: () => void;
  onClose: () => void;
}

function StoreRegistrationModal({
  isOpen,
  position,
  formData,
  onFormChange,
  onSubmit,
  onClose,
}: StoreRegistrationModalProps) {
  if (!isOpen || !position) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* オーバーレイ */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* モーダル本体 */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            店舗を登録
          </h2>
          
          {/* 座標表示 */}
          <div className="mb-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
            <p>緯度: {position.lat.toFixed(6)}</p>
            <p>経度: {position.lng.toFixed(6)}</p>
          </div>

          {/* 店舗名入力 */}
          <div className="mb-4">
            <label
              htmlFor="storeName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              店舗名
            </label>
            <input
              type="text"
              id="storeName"
              value={formData.storeName}
              onChange={(e) =>
                onFormChange({ ...formData, storeName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="店舗名を入力"
            />
          </div>

          {/* レビュー入力 */}
          <div className="mb-4">
            <label
              htmlFor="review"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              レビュー
            </label>
            <textarea
              id="review"
              value={formData.review}
              onChange={(e) =>
                onFormChange({ ...formData, review: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="レビューを入力"
            />
          </div>

          {/* 点数スライダー */}
          <div className="mb-6">
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              評価: {formData.rating} / 5
            </label>
            <input
              type="range"
              id="rating"
              min="1"
              max="5"
              step="1"
              value={formData.rating}
              onChange={(e) =>
                onFormChange({ ...formData, rating: Number(e.target.value) })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              登録
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
  const [formData, setFormData] = useState<StoreFormData>({
    storeName: '',
    review: '',
    rating: 3,
  });

  // 地図クリック時のハンドラ
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setTappedPosition({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
      setFormData({
        storeName: '',
        review: '',
        rating: 3,
      });
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
    setFormData({
      storeName: '',
      review: '',
      rating: 3,
    });
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
          position={tappedPosition}
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
        position={tappedPosition}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleSubmit}
        onClose={handleCloseModal}
      />
    </>
  );
}
