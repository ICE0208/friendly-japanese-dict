"use client";

import { useState } from "react";
import { jisho } from "../lib/jisho";

interface KanjiResult {
  found: boolean;
  strokeOrderGifUri?: string;
  meaning?: string;
  kunyomi?: string[];
  onyomi?: string[];
  dictionaryLink: string;
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

interface DictionaryResult {
  meanings: string[];
  dictionaryLink: string;
}

export default function JapaneseSearch() {
  const [searchWord, setSearchWord] = useState("");
  const [searchResults, setSearchResults] = useState<JishoResult | null>(null);
  const [kanjiResults, setKanjiResults] = useState<{
    [key: string]: KanjiResult;
  }>({});
  const [dictionaryResult, setDictionaryResult] =
    useState<DictionaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchedWord, setSearchedWord] = useState("");

  const handleSearch = async () => {
    if (!searchWord.trim()) return;

    setLoading(true);
    setSearchedWord(searchWord);

    try {
      // Search using Jisho
      const wordResult = await jisho.searchForPhrase(searchWord);
      setSearchResults(wordResult);

      // Search using Daum dictionary
      const daumResponse = await fetch(
        `/api/daum-dict?query=${encodeURIComponent(searchWord)}`
      );
      const daumResult = await daumResponse.json();
      setDictionaryResult(daumResult);

      // For each kanji in the search word, get its details
      const kanjiDetails: { [key: string]: KanjiResult } = {};
      for (const char of searchWord) {
        if (/[\u4e00-\u9faf]/.test(char)) {
          const result = await jisho.searchForKanji(char);
          kanjiDetails[char] = {
            ...result,
            dictionaryLink: `https://dic.daum.net/search.do?q=${encodeURIComponent(
              char
            )}&dic=jp`,
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="일본어 단어를 입력하세요"
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "검색 중..." : "검색"}
        </button>
      </div>

      <div className="flex flex-col lg:flex lg:flex-row lg:gap-6">
        <div className="lg:w-1/2">
          {searchResults && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Jisho 검색 결과:</h2>
              {searchResults.data?.[0]?.japanese?.map(
                (item: JapaneseWord, index: number) => (
                  <div
                    key={index}
                    className="mb-2"
                  >
                    <button
                      onClick={() => {
                        if (item.word) {
                          const word = item.word;
                          setSearchWord(word);
                          setLoading(true);
                          setSearchedWord(word);

                          jisho
                            .searchForPhrase(word)
                            .then((wordResult) => {
                              setSearchResults(wordResult);

                              const kanjiDetails: {
                                [key: string]: KanjiResult;
                              } = {};
                              for (const char of word) {
                                if (/[\u4e00-\u9faf]/.test(char)) {
                                  jisho.searchForKanji(char).then((result) => {
                                    kanjiDetails[char] = {
                                      ...result,
                                      dictionaryLink: `https://dic.daum.net/search.do?q=${encodeURIComponent(
                                        char
                                      )}&dic=jp`,
                                    };
                                    setKanjiResults({ ...kanjiDetails });
                                  });
                                }
                              }
                            })
                            .catch((error) => {
                              console.error("Error searching:", error);
                            })
                            .finally(() => {
                              setLoading(false);
                            });
                        }
                      }}
                      className="px-2 py-1 rounded-md transition-colors hover:bg-gray-100 group font-medium"
                    >
                      {item.word && (
                        <span className="mr-2 group-hover:text-gray-900">
                          {item.word}
                        </span>
                      )}
                      {item.reading && (
                        <span className="text-gray-600 group-hover:text-gray-600">
                          ({item.reading})
                        </span>
                      )}
                    </button>
                  </div>
                )
              )}
            </div>
          )}

          {Object.keys(kanjiResults).length > 0 && (
            <div className="mb-6 hidden lg:block">
              <h2 className="text-xl font-bold mb-4">한자 쓰는 방법:</h2>
              <div className="grid grid-cols-1 gap-4">
                {Object.entries(kanjiResults).map(([kanji, result]) => (
                  <div
                    key={kanji}
                    className="border rounded p-4"
                  >
                    <h3 className="text-2xl font-bold mb-2">{kanji}</h3>
                    {result.found ? (
                      <>
                        {result.strokeOrderGifUri && (
                          <div className="mb-2">
                            <p className="font-bold mb-1">획순:</p>
                            <img
                              src={result.strokeOrderGifUri}
                              alt={`${kanji}의 획순`}
                              className="border"
                            />
                          </div>
                        )}
                        <p className="mb-1">
                          <strong>훈독:</strong> {result.kunyomi?.join(", ")}
                        </p>
                        <p>
                          <strong>음독:</strong> {result.onyomi?.join(", ")}
                        </p>
                      </>
                    ) : (
                      <p>상세 정보를 찾을 수 없습니다.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:w-1/2">
          {searchedWord && dictionaryResult && (
            <div className="mb-6 bg-white p-4 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-3">다음 사전 결과:</h3>
              {dictionaryResult.meanings.length > 0 ? (
                <div className="space-y-2">
                  {dictionaryResult.meanings.map((meaning, index) => (
                    <p
                      key={index}
                      className="text-gray-800"
                    >
                      {meaning}
                    </p>
                  ))}
                  <a
                    href={dictionaryResult.dictionaryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
                  >
                    다음 사전에서 더 보기
                  </a>
                </div>
              ) : (
                <p className="text-gray-600">검색 결과가 없습니다.</p>
              )}
            </div>
          )}
        </div>

        {Object.keys(kanjiResults).length > 0 && (
          <div className="mb-6 lg:hidden">
            <h2 className="text-xl font-bold mb-4">한자 쓰는 방법:</h2>
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(kanjiResults).map(([kanji, result]) => (
                <div
                  key={kanji}
                  className="border rounded p-4"
                >
                  <h3 className="text-2xl font-bold mb-2">{kanji}</h3>
                  {result.found ? (
                    <>
                      {result.strokeOrderGifUri && (
                        <div className="mb-2">
                          <p className="font-bold mb-1">획순:</p>
                          <img
                            src={result.strokeOrderGifUri}
                            alt={`${kanji}의 획순`}
                            className="border"
                          />
                        </div>
                      )}
                      <p className="mb-1">
                        <strong>훈독:</strong> {result.kunyomi?.join(", ")}
                      </p>
                      <p>
                        <strong>음독:</strong> {result.onyomi?.join(", ")}
                      </p>
                    </>
                  ) : (
                    <p>상세 정보를 찾을 수 없습니다.</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
