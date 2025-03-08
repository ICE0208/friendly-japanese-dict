import React from "react";
import Card from "./Card";
import SourceLink from "./SourceLink";
import { ExampleSearchResult } from "../types/japanese";

interface ExampleResultsProps {
  exampleResults: ExampleSearchResult;
}

const ExampleResults = ({ exampleResults }: ExampleResultsProps) => {
  if (
    !exampleResults ||
    !exampleResults.results ||
    exampleResults.results.length === 0
  ) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold mb-3">예문</h3>
      <div className="space-y-4">
        {exampleResults.results.slice(0, 2).map((example, index) => (
          <Card key={index}>
            <div className="mb-3">
              <p className="text-lg leading-relaxed">{example.kanji}</p>
            </div>
            <p className="text-gray-300 border-t border-gray-700 pt-2 mt-2">
              {example.english}
            </p>
          </Card>
        ))}
      </div>
      <SourceLink
        href={exampleResults.uri}
        source="jisho.org"
      />
    </div>
  );
};

export default ExampleResults;
