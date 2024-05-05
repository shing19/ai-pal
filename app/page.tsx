// page.tsx
"use client"

import PromptContext from "./components/PromptContext";
import { PalProvider } from './components/Context/PalContext';
import ChatThreads from "./components/ChatThreads";
import NavBar from "./components/NavBar";
import { Separator } from "@/components/ui/separator"

export default function Home() {
  return (
    <PalProvider> {/* 使用PalProvider包裹整个应用或部分需要共享Context的组件 */}
      <main className="overflow-hidden h-screen w-screen" style={{ backgroundColor: 'hsl(var(--muted))' }}>
        {/* 3:3:4 宽度占比 */}
        <div
          className="h-screen flex flex-row gap-2"
          style={{
            '--col1': 'calc(18 / (18 + 34 + 48) * 100%)',
            '--col2': 'calc(82 / (18 + 34 + 48) * 100%)'
          } as React.CSSProperties}
        >
          <div className="flex-none p-2" style={{ width: 'var(--col1)' }}>
            <NavBar />
          </div>
          <div className="m-1 rounded-lg flex w-full" style={{
            width: 'var(--col2)',
            backgroundColor: 'hsl(var(--background))',
            '--col3': 'calc(34 / (34 + 48) * 100%)',
            '--col4': 'calc(48 / (34 + 48) * 100%)'
          } as React.CSSProperties}
          >
            <div className="flex-none p-2" style={{ width: 'var(--col3)' }}>
              <PromptContext />
            </div>
            <Separator orientation="vertical" />
            <div className="flex-grow p-2 overflow-y-auto" style={{ width: 'var(--col4)' }}>
              <ChatThreads />
            </div>
          </div>
        </div>
      </main>
    </PalProvider>
  );
}