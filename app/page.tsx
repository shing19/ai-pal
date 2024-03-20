// page.tsx
"use client"

import PromptContext from "./components/PromptContext";
import { PalProvider } from './components/Context/PalContext';
import ChatThreads from "./components/ChatThreads";

export default function Home() {
  return (
    <PalProvider> {/* 使用PalProvider包裹整个应用或部分需要共享Context的组件 */}
      <main className="overflow-hidden h-screen w-screen">
        {/* 3:3:4 宽度占比 */}
        <div
          className="h-screen flex flex-row gap-2"
          style={{
            '--col1': 'calc(18 / (18 + 34 + 48) * 100%)',
            '--col2': 'calc(34 / (18 + 34 + 48) * 100%)',
            '--col3': 'calc(48 / (18 + 34 + 48) * 100%)'
          } as React.CSSProperties}
        >
          <div className="flex-none bg-green-300 p-2" style={{ width: 'var(--col1)' }}>
            <p>project list</p>
          </div>
          <div className="flex-none bg-blue-300 p-2" style={{ width: 'var(--col2)' }}>
            <PromptContext />
          </div>
          <div className="flex-grow bg-gray-300 p-2 overflow-y-auto" style={{ width: 'var(--col3)' }}>
            <ChatThreads />
          </div>
        </div>
      </main>
    </PalProvider>
  );
}