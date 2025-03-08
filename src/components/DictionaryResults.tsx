import React from "react";
import Card from "./Card";
import SourceLink from "./SourceLink";

interface WordInfo {
  word: string;
  wordWithKanji: string;
  meanings: string[];
}

interface DictionaryResult {
  mainWord: WordInfo;
  subWords: WordInfo[];
  dictionaryLink: string;
}

interface DictionaryResultsProps {
  dictionaryResult: DictionaryResult;
  onWordClick: (word: string) => void;
}

const DictionaryResults = ({
  dictionaryResult,
  onWordClick,
}: DictionaryResultsProps) => {
  if (!dictionaryResult) {
    return null;
  }

  const { mainWord, subWords, dictionaryLink } = dictionaryResult;

  // 메인 단어와 서브 단어를 하나의 배열로 합치기
  const allWords = [mainWord, ...subWords].slice(0, 5); // 최대 5개만 표시
  const hasResults = allWords.length > 0;

  return (
    <div className="mb-6">
      {/* 뜻 섹션 (나중에 표시) */}
      {hasResults && (
        <>
          <h3 className="text-xl font-bold mb-3">단어</h3>
          <div className="space-y-4">
            {allWords.map(
              (word, wordIndex) =>
                word.meanings.length > 0 && (
                  <Card key={wordIndex}>
                    <div className="mb-2">
                      <h4 className="text-lg font-semibold flex items-center">
                        <span className="mr-2">{word.word}</span>
                        {word.wordWithKanji && (
                          <span className="text-gray-400 text-sm">
                            (
                            {word.wordWithKanji.split("·").map((part, i) => (
                              <React.Fragment key={i}>
                                <button
                                  onClick={() => onWordClick(part)}
                                  className="hover:text-blue-400 cursor-pointer"
                                >
                                  {part}
                                </button>
                                {i < word.wordWithKanji.split("·").length - 1 &&
                                  " · "}
                              </React.Fragment>
                            ))}
                            )
                          </span>
                        )}
                      </h4>
                    </div>

                    <div className="space-y-2">
                      {word.meanings.map((meaning, index) => (
                        <p
                          key={index}
                          className="text-gray-300"
                        >
                          {index + 1}. {meaning}
                        </p>
                      ))}
                    </div>
                  </Card>
                )
            )}
          </div>
        </>
      )}

      <SourceLink
        href={dictionaryLink}
        source="다음 사전"
      />
    </div>
  );
};

export default DictionaryResults;
