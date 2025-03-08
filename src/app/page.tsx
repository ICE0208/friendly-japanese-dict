import JapaneseSearch from "../components/JapaneseSearch";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          漢字検索
        </h1>
        <JapaneseSearch />
      </main>
    </div>
  );
}
