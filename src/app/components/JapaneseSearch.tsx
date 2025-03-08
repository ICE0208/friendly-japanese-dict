"use client";

import { useState, useEffect } from "react";
import { jisho } from "../lib/jisho";
import { useRouter, useSearchParams } from "next/navigation";

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
    senses?: Array<{
      english_definitions?: string[];
      parts_of_speech?: string[];
    }>;
  }>;
}

interface DictionaryResult {
  meanings: string[];
  dictionaryLink: string;
}

interface SuggestionItem {
  key: string;
  item: string;
}

interface ExamplePiece {
  lifted: string;
  unlifted: string;
}

interface ExampleResult {
  kanji: string;
  kana: string;
  english: string;
  pieces: ExamplePiece[];
}

interface ExampleSearchResult {
  uri: string;
  results: ExampleResult[];
}

export default function JapaneseSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [inputValue, setInputValue] = useState(query);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<JishoResult | null>(null);
  const [kanjiResults, setKanjiResults] = useState<{
    [key: string]: KanjiResult;
  }>({});
  const [dictionaryResult, setDictionaryResult] =
    useState<DictionaryResult | null>(null);
  const [exampleResults, setExampleResults] =
    useState<ExampleSearchResult | null>(null);

  useEffect(() => {
    const search = async () => {
      if (!query) return;

      setLoading(true);
      try {
        const [wordResult, daumResponse, examplesResponse] = await Promise.all([
          jisho.searchForPhrase(query),
          fetch(`/api/daum-dict?query=${encodeURIComponent(query)}`),
          jisho.searchForExamples(query),
        ]);

        setSearchResults(wordResult);
        const daumResult = await daumResponse.json();
        setDictionaryResult(daumResult);
        setExampleResults(examplesResponse);

        const kanjiDetails: { [key: string]: KanjiResult } = {};
        const kanjiPromises = [];

        for (const char of query) {
          if (/[\u4e00-\u9faf]/.test(char)) {
            kanjiPromises.push(
              jisho.searchForKanji(char).then((result) => {
                kanjiDetails[char] = {
                  ...result,
                  dictionaryLink: `https://dic.daum.net/search.do?q=${encodeURIComponent(
                    char
                  )}&dic=jp`,
                };
              })
            );
          }
        }

        await Promise.all(kanjiPromises);
        setKanjiResults(kanjiDetails);
      } catch (error) {
        console.error("Error searching:", error);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [query]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim().length > 0) {
      try {
        const response = await fetch(
          `/api/naver-suggest?query=${encodeURIComponent(value)}`
        );
        const data = await response.json();
        setSuggestions(data.suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = () => {
    if (!inputValue.trim()) return;
    router.push(`?q=${encodeURIComponent(inputValue)}`);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: SuggestionItem) => {
    router.push(`?q=${encodeURIComponent(suggestion.key)}`);
    setInputValue(suggestion.key);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex gap-2 mb-6 relative">
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder="일본어 단어를 입력하세요"
            className="w-full p-2 border border-gray-300 rounded"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.key}-${index}`}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-900 font-medium"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.item}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "검색 중..." : "검색"}
        </button>
      </div>

      <div className="flex flex-col lg:flex lg:flex-row lg:gap-12">
        <div className="lg:w-1/2">
          {searchResults && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">연관 검색어</h2>
              {searchResults.data?.[0]?.japanese?.map(
                (item: JapaneseWord, index: number) => (
                  <div
                    key={index}
                    className="mb-4"
                  >
                    <button
                      onClick={() => {
                        if (item.word) {
                          router.push(`?q=${encodeURIComponent(item.word)}`);
                          setInputValue(item.word);
                        }
                      }}
                      className="px-2 py-1 rounded-md transition-colors hover:bg-gray-100 group font-medium cursor-pointer"
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

                    {/* Display English meanings */}
                    {searchResults.data[0]?.senses &&
                      searchResults.data[0].senses.length > 0 && (
                        <div className="mt-2 ml-2 text-gray-700">
                          <p className="text-sm">
                            <span className="font-medium">뜻: </span>
                            {(searchResults.data[0]?.senses || [])
                              .slice(0, 2)
                              .map((sense, i) => {
                                const definitions =
                                  sense.english_definitions || [];
                                return (
                                  <span
                                    key={i}
                                    className="mr-2"
                                  >
                                    {i + 1}. {definitions.join(", ")}
                                    {i === 0 &&
                                      searchResults.data[0]?.senses &&
                                      searchResults.data[0].senses.length > 1 &&
                                      "; "}
                                  </span>
                                );
                              })}
                          </p>
                          {searchResults.data[0]?.senses?.[0]
                            ?.parts_of_speech &&
                            searchResults.data[0]?.senses[0].parts_of_speech
                              .length > 0 && (
                              <p className="text-xs text-gray-500 mt-1">
                                <span className="font-medium">품사: </span>
                                {(
                                  searchResults.data[0]?.senses[0]
                                    .parts_of_speech || []
                                ).join(", ")}
                              </p>
                            )}
                        </div>
                      )}
                  </div>
                )
              )}
            </div>
          )}

          <hr className="my-8 border-t border-gray-700" />

          {query && dictionaryResult && (
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">뜻</h3>
              {dictionaryResult.meanings.length > 0 ? (
                <div className="space-y-2">
                  {dictionaryResult.meanings.map((meaning, index) => (
                    <p
                      key={index}
                      className="text-gray-300"
                    >
                      {index + 1}. {meaning}
                    </p>
                  ))}
                  <a
                    href={dictionaryResult.dictionaryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-400 mt-2 inline-block underline"
                  >
                    다음 사전으로 이동
                  </a>
                </div>
              ) : (
                <p className="text-gray-600">검색 결과가 없습니다.</p>
              )}
            </div>
          )}

          {query && exampleResults && exampleResults.results.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">예문</h3>
              <div className="space-y-4">
                {exampleResults.results.slice(0, 2).map((example, index) => (
                  <div
                    key={index}
                    className="border border-gray-700 rounded-md p-4 bg-gray-900"
                  >
                    <div className="mb-3">
                      <p className="text-lg leading-relaxed">{example.kanji}</p>
                    </div>
                    <p className="text-gray-300 border-t border-gray-700 pt-2 mt-2">
                      {example.english}
                    </p>
                  </div>
                ))}
                <a
                  href={exampleResults.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-400 mt-2 inline-block underline"
                >
                  예문 더보기
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="lg:w-1/2">
          {Object.keys(kanjiResults).length > 0 && (
            <div className="mb-6">
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
    </div>
  );
}
