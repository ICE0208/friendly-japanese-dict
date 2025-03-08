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
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(initialValue || "");
  }, [initialValue]);

  useEffect(() => {
    setLocalShowSuggestions(showSuggestions);
  }, [showSuggestions]);

  useEffect(() => {
    if (localShowSuggestions) {
      setSelectedIndex(-1);
    }
  }, [localShowSuggestions]);

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
    setSelectedIndex(-1);
  };

  const handleInputClick = () => {
    if (inputValue.trim() && !localShowSuggestions) {
      const fakeEvent = {
        target: { value: inputValue },
      } as React.ChangeEvent<HTMLInputElement>;

      onInputChange(fakeEvent);
      setLocalShowSuggestions(true);
    }
  };

  const handleSearch = () => {
    onSearch(inputValue);
    setLocalShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (localShowSuggestions && showSuggestions && suggestions.length > 0) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0) {
            onSuggestionClick(suggestions[selectedIndex]);
            setLocalShowSuggestions(false);
          } else {
            handleSearch();
          }
          break;
        case "Escape":
          setLocalShowSuggestions(false);
          break;
      }
    } else if (e.key === "Enter") {
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
          onKeyDown={handleKeyDown}
          placeholder="일본어 단어를 입력하세요"
          className="w-full p-2 border border-gray-300 rounded"
        />
        {localShowSuggestions && showSuggestions && suggestions.length > 0 && (
          <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${index}`}
                className={`w-full px-4 py-2 text-left focus:outline-none ${
                  selectedIndex === index
                    ? "bg-gray-200 text-gray-900 font-semibold"
                    : "bg-white hover:bg-gray-100 text-gray-900 font-medium"
                }`}
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
