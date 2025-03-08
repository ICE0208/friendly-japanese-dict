import { useState, useEffect } from "react";

interface SearchFormProps {
  initialValue: string;
  onSearch: (value: string) => void;
  suggestions: Array<{ key: string; item: string }>;
  showSuggestions: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSuggestionClick: (suggestion: { key: string; item: string }) => void;
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
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onInputChange(e);
  };

  const handleSearch = () => {
    onSearch(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex gap-2 mb-6 relative">
      <div className="flex-1 relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="일본어 단어를 입력하세요"
          className="w-full p-2 border border-gray-300 rounded"
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.key}-${index}`}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-900 font-medium"
                onClick={() => onSuggestionClick(suggestion)}
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
  );
};

export default SearchForm;
