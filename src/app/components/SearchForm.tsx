import React, { useState, useEffect, useRef } from "react";
import { SuggestionItem } from "../types/japanese";

interface SearchFormProps {
  initialValue: string;
  onSearch: (value: string) => void;
  suggestions: Array<SuggestionItem>;
  showSuggestions: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSuggestionClick: (suggestion: SuggestionItem) => void;
  loading: boolean;
}

const SearchForm = ({
  initialValue,
  onSearch,
  suggestions,
  showSuggestions,
  onInputChange,
  onSuggestionClick,
  loading,
}: SearchFormProps) => {
  const [inputValue, setInputValue] = useState(initialValue || "");
  const [localShowSuggestions, setLocalShowSuggestions] =
    useState(showSuggestions);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(initialValue || "");
  }, [initialValue]);

  useEffect(() => {
    setLocalShowSuggestions(showSuggestions);
  }, [showSuggestions]);

  // 외부 클릭 감지를 위한 이벤트 리스너 추가
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setLocalShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onInputChange(e);
    setLocalShowSuggestions(true);
  };

  // 입력칸 클릭 시 연관 검색어 표시 및 API 요청
  const handleInputClick = () => {
    if (inputValue.trim() && !localShowSuggestions) {
      // 입력값이 있고 현재 연관 검색어가 표시되지 않은 상태일 때만
      const fakeEvent = {
        target: { value: inputValue },
      } as React.ChangeEvent<HTMLInputElement>;

      onInputChange(fakeEvent); // API 요청을 다시 트리거
      setLocalShowSuggestions(true);
    }
  };

  const handleSearch = () => {
    onSearch(inputValue);
    setLocalShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div
      className="flex flex-col md:flex-row gap-2 mb-6"
      ref={formRef}
    >
      <div className="relative flex-grow">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onKeyPress={handleKeyPress}
          placeholder="일본어 단어를 입력하세요"
          className="w-full p-2 border border-gray-300 rounded"
        />
        {localShowSuggestions && showSuggestions && suggestions.length > 0 && (
          <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${index}`}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-900 font-medium"
                onClick={() => {
                  onSuggestionClick(suggestion);
                  setLocalShowSuggestions(false);
                }}
              >
                {suggestion.word} ({suggestion.reading}) - {suggestion.meaning}
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
  );
};

export default SearchForm;
