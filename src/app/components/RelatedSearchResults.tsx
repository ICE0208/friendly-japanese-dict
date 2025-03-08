import React from "react";
import Card from "./Card";
import SourceLink from "./SourceLink";
import { JapaneseWord, JishoResult } from "../types/japanese";

interface RelatedSearchResultsProps {
  searchResults: JishoResult;
  onWordClick: (word: string) => void;
  inputValue: string;
}

const RelatedSearchResults = ({
  searchResults,
  onWordClick,
  inputValue,
}: RelatedSearchResultsProps) => {
  if (
    !searchResults ||
    !searchResults.data ||
    searchResults.data.length === 0
  ) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-3">연관 검색어</h2>
      <div className="space-y-4">
        {searchResults.data[0]?.japanese?.map(
          (item: JapaneseWord, index: number) => (
            <Card key={index}>
              <button
                onClick={() => {
                  if (item.word) {
                    onWordClick(item.word);
                  }
                }}
                className="text-lg font-medium cursor-pointer hover:text-blue-400"
              >
                {item.word && <span className="mr-2">{item.word}</span>}
                {item.reading && (
                  <span className="text-gray-400">({item.reading})</span>
                )}
              </button>

              {/* Display English meanings */}
              {searchResults.data[0]?.senses &&
                searchResults.data[0].senses.length > 0 && (
                  <div className="mt-2 border-t border-gray-700 pt-2">
                    <p className="text-gray-300">
                      <span className="font-medium">뜻: </span>
                      {(searchResults.data[0]?.senses || [])
                        .slice(0, 2)
                        .map((sense, i) => {
                          const definitions = sense.english_definitions || [];
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
                    {searchResults.data[0]?.senses?.[0]?.parts_of_speech &&
                      searchResults.data[0]?.senses[0].parts_of_speech.length >
                        0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          <span className="font-medium">품사: </span>
                          {(
                            searchResults.data[0]?.senses[0].parts_of_speech ||
                            []
                          ).join(", ")}
                        </p>
                      )}
                  </div>
                )}
            </Card>
          )
        )}
      </div>
      <SourceLink
        href={`https://jisho.org/search/${encodeURIComponent(inputValue)}`}
        source="jisho.org"
      />
    </div>
  );
};

export default RelatedSearchResults;
