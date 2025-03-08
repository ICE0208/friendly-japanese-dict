"use client";

import { useState } from "react";
import { jisho } from "../lib/jisho";

interface KanjiResult {
  found: boolean;
  strokeOrderGifUri?: string;
  meaning?: string;
  kunyomi?: string[];
  onyomi?: string[];
}

interface JapaneseWord {
  word?: string;
  reading?: string;
}

interface JishoResult {
  data: Array<{
    japanese: JapaneseWord[];
  }>;
}

export default function JapaneseSearch() {
  const [searchWord, setSearchWord] = useState("");
  const [searchResults, setSearchResults] = useState<JishoResult | null>(null);
  const [kanjiResults, setKanjiResults] = useState<{
    [key: string]: KanjiResult;
  }>({});
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchWord.trim()) return;

    setLoading(true);

    try {
      // Search for the word
      const wordResult = await jisho.searchForPhrase(searchWord);
      setSearchResults(wordResult);

      // For each kanji in the search word, get its details
      const kanjiDetails: { [key: string]: KanjiResult } = {};
      for (const char of searchWord) {
        if (/[\u4e00-\u9faf]/.test(char)) {
          // Check if character is kanji
          const result = await jisho.searchForKanji(char);
          kanjiDetails[char] = {
            found: result.found,
            strokeOrderGifUri: result.strokeOrderGifUri,
            meaning: result.meaning,
            kunyomi: result.kunyomi,
            onyomi: result.onyomi,
          };
        }
      }
      setKanjiResults(kanjiDetails);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          placeholder="日本語の単語を入力してください"
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "検索中..." : "検索"}
        </button>
      </div>

      {searchResults && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">検索結果:</h2>
          {searchResults.data?.[0]?.japanese?.map(
            (item: JapaneseWord, index: number) => (
              <div
                key={index}
                className="mb-2"
              >
                {item.word && <span className="mr-2">{item.word}</span>}
                {item.reading && (
                  <span className="text-gray-600">({item.reading})</span>
                )}
              </div>
            )
          )}
        </div>
      )}

      {Object.keys(kanjiResults).length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">漢字の詳細:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(kanjiResults).map(([kanji, result]) => (
              <div
                key={kanji}
                className="border rounded p-4"
              >
                <h3 className="text-2xl font-bold mb-2">{kanji}</h3>
                {result.found ? (
                  <>
                    <p className="mb-2">
                      <strong>意味:</strong> {result.meaning}
                    </p>
                    {result.strokeOrderGifUri && (
                      <div className="mb-2">
                        <p className="font-bold mb-1">筆順:</p>
                        <img
                          src={result.strokeOrderGifUri}
                          alt={`${kanji}の筆順`}
                          className="border"
                        />
                      </div>
                    )}
                    <p className="mb-1">
                      <strong>訓読み:</strong> {result.kunyomi?.join(", ")}
                    </p>
                    <p>
                      <strong>音読み:</strong> {result.onyomi?.join(", ")}
                    </p>
                  </>
                ) : (
                  <p>詳細が見つかりませんでした。</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
