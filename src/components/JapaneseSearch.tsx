"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { jisho } from "../lib/jisho";
import {
  KanjiResult,
  JishoResult,
  DictionaryResult,
  SuggestionItem,
  ExampleSearchResult,
} from "../types/japanese";
import SearchForm from "./SearchForm";
import RelatedSearchResults from "./RelatedSearchResults";
import DictionaryResults from "./DictionaryResults";
import ExampleResults from "./ExampleResults";
import KanjiResults from "./KanjiResults";
import DragSearchWrapper from "./DragSearchWrapper";
import { debounce } from "lodash";

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

  const handleInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);

      if (value.length > 0) {
        try {
          const response = await fetch(
            `/api/naver-suggest?query=${encodeURIComponent(value)}`
          );
          const data = (await response.json()) as {
            suggestions: SuggestionItem[];
          };
          if (data && data.suggestions) {
            setSuggestions(data.suggestions);
            setShowSuggestions(data.suggestions.length > 0);
          } else {
            console.error("Invalid suggestions data format:", data);
            setSuggestions([]);
            setShowSuggestions(false);
          }
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    },
    [setInputValue, setSuggestions, setShowSuggestions]
  );

  const debouncedHandleInputChange = useMemo(
    () => debounce(handleInputChange, 250),
    [handleInputChange]
  );

  const handleSearch = () => {
    if (inputValue.trim()) {
      router.push(`?q=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  const handleSuggestionClick = (suggestion: SuggestionItem) => {
    const getFirstWord = (text: string) => {
      const dotIndex = text.indexOf("∙");
      const pipeIndex = text.indexOf("|");
      const firstDelimiter = Math.min(
        dotIndex === -1 ? Infinity : dotIndex,
        pipeIndex === -1 ? Infinity : pipeIndex
      );
      return text.slice(0, firstDelimiter);
    };

    const query = getFirstWord(suggestion.word) || suggestion.reading;
    router.push(`?q=${encodeURIComponent(query)}`);
    setInputValue(query);
    setShowSuggestions(false);
  };

  const handleWordClick = (word: string) => {
    router.push(`?q=${encodeURIComponent(word)}`);
    setInputValue(word);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <SearchForm
        initialValue={query}
        onSearch={handleSearch}
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        onInputChange={debouncedHandleInputChange}
        onSuggestionClick={handleSuggestionClick}
        loading={loading}
      />

      <DragSearchWrapper>
        <div className="flex flex-col lg:flex lg:flex-row lg:gap-12">
          <div className="lg:w-1/2">
            {query && dictionaryResult && (
              <DictionaryResults
                dictionaryResult={dictionaryResult}
                onWordClick={handleWordClick}
              />
            )}
            {query && exampleResults && exampleResults.results.length > 0 && (
              <ExampleResults exampleResults={exampleResults} />
            )}
            {searchResults && (
              <RelatedSearchResults
                searchResults={searchResults}
                onWordClick={handleWordClick}
                inputValue={inputValue}
              />
            )}
          </div>

          <div className="lg:w-1/2">
            {Object.keys(kanjiResults).length > 0 && (
              <KanjiResults kanjiResults={kanjiResults} />
            )}
          </div>
        </div>
      </DragSearchWrapper>
    </div>
  );
}
