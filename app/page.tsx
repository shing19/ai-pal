// page.tsx
"use client"

import Context from "./components/Context";
import { PalProvider } from './components/PalContext';

export default function Home() {
  return (
    <PalProvider> {/* 使用PalProvider包裹整个应用或部分需要共享Context的组件 */}
      <main className="overflow-hidden h-screen w-screen">
        <div className="h-screen flex flex-row">
          <div className="flex-1"></div>
            <div className="flex-1 bg-yellow-300">
              <Context /> {/* 这里的Context组件现在可以通过useContext(PalContext)访问和更新sharedValue了 */}
            </div>
          <div className="flex-grow bg-blue-300">
          </div>
        </div>
      </main>
    </PalProvider>
  );
}