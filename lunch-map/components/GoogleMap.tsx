'use client';

import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const center = {
  lat: 35.6812,
  lng: 139.7671
};

export default function Map() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  // 開発モード: APIキーが設定されていない場合はプレースホルダーを表示
  if (!apiKey || apiKey === '') {
    return (
      <div 
        style={containerStyle}
        className="flex items-center justify-center bg-gray-100"
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
          <p className="text-xs text-red-500 mt-2">
            現在の値: "{apiKey}"
          </p>
        </div>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
      >
      </GoogleMap>
    </LoadScript>
  );
}
