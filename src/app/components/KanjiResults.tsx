import React from "react";
import Card from "./Card";
import SourceLink from "./SourceLink";
import { KanjiResult } from "../types/japanese";

interface KanjiResultsProps {
  kanjiResults: { [key: string]: KanjiResult };
}

const KanjiResults = ({ kanjiResults }: KanjiResultsProps) => {
  if (!kanjiResults || Object.keys(kanjiResults).length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-3">한자 쓰는 방법</h2>
      <div className="space-y-4">
        {Object.entries(kanjiResults).map(([kanji, result]) => (
          <Card key={kanji}>
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
          </Card>
        ))}
      </div>
      <SourceLink
        href="https://jisho.org"
        source="jisho.org"
      />
    </div>
  );
};

export default KanjiResults;
