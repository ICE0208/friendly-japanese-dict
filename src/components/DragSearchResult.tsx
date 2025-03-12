import { SimpleSearchApiResponse } from "@/types/simple-search-api";
import { Fragment } from "react";

interface DragSearchResultProps {
  position: {
    x: number;
    y: number;
  };
  resultData: SimpleSearchApiResponse;
}

export default function DragSearchResult({
  position: { x, y },
  resultData,
}: DragSearchResultProps) {
  return (
    <div
      className="absolute"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <div className="bg-white border-black rounded-sm shadow-2xl text-black w-80 p-5 mb-16">
        <div className="space-y-4">
          {resultData.items.map((item, index) => (
            <Fragment key={index}>
              <div>
                <div className="space-x-1">
                  {/* Entry & SubEntry */}
                  <span className="font-semibold">{item.entry}</span>
                  {item.subEntry && (
                    <span className="text-sm">({item.subEntry})</span>
                  )}
                  {/* Pos */}
                  {item.pos.map((po, index) => (
                    <div key={index}>
                      <div className="text-sm opacity-70">{po.type}</div>
                      <div className="space-y-0.5 text-sm">
                        {po.meanings.map((meaning, index) => (
                          <div key={index}>{`${index + 1}. ${
                            meaning.meaning
                          }`}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {index < resultData.items.length - 1 && (
                <hr className="opacity-40" />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
