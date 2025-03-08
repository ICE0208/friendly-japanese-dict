import JapaneseSearch from "../components/JapaneseSearch";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          친절한 일본어 사전 🈁
        </h1>
        <Suspense
          fallback={<div className="text-center py-10">로딩 중...</div>}
        >
          <JapaneseSearch />
        </Suspense>
      </main>
    </div>
  );
}
