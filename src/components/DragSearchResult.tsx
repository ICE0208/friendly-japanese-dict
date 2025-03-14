import { SimpleSearchApiResponse } from "@/types/simple-search-api";
import { Fragment } from "react";

interface DragSearchResultProps {
  position: {
    leftTop: {
      x: number;
      y: number;
    };
    rightTop: {
      x: number;
      y: number;
    };
    bottomLeft: {
      x: number;
      y: number;
    };
    bottomRight: {
      x: number;
      y: number;
    };
  };
  resultData: SimpleSearchApiResponse;
}

export default function DragSearchResult({
  position: { leftTop, rightTop, bottomLeft, bottomRight },
  resultData,
}: DragSearchResultProps) {
  const isRightSide = leftTop.x > window.innerWidth / 2;

  return (
    <div
      className="absolute w-5/12 max-w-90"
      style={{
        left: isRightSide ? "auto" : `${leftTop.x}px`,
        right: isRightSide
          ? `${document.documentElement.clientWidth - rightTop.x}px`
          : "auto",
        top: `${Math.max(bottomLeft.y, bottomRight.y)}px`,
      }}
    >
      <div className="bg-white border-black rounded-sm shadow-2xl text-black p-5 mb-16 w-full">
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
