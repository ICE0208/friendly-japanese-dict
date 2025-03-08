import React from "react";
import Card from "./Card";
import SourceLink from "./SourceLink";
import { DictionaryResult } from "../types/japanese";

interface DictionaryResultsProps {
  dictionaryResult: DictionaryResult;
}

const DictionaryResults = ({ dictionaryResult }: DictionaryResultsProps) => {
  if (!dictionaryResult) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold mb-3">뜻</h3>
      <div className="space-y-4">
        <Card>
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
            </div>
          ) : (
            <p className="text-gray-600">검색 결과가 없습니다.</p>
          )}
        </Card>
      </div>
      <SourceLink
        href={dictionaryResult.dictionaryLink}
        source="다음 사전"
      />
    </div>
  );
};

export default DictionaryResults;
