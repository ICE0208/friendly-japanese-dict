// hooks/useGlobalDraggedText.ts
import { useState, useEffect } from "react";

interface Position {
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
}

const OFFSET = {
  x: 0,
  y: 10,
};

function useGlobalDraggedText() {
  const [draggedText, setDraggedText] = useState<string>("");
  const [position, setPosition] = useState<Position>({
    leftTop: { x: -1000, y: -1000 },
    rightTop: { x: -1000, y: -1000 },
    bottomLeft: { x: -1000, y: -1000 },
    bottomRight: { x: -1000, y: -1000 },
  });

  useEffect(() => {
    // 데스크톱 환경에서 텍스트 선택 감지
    const handleMouseSelection = (): void => {
      // 간헐적으로 선택된 문자열이 초기화되지 않고 선택되는 문제가 있어서 타임아웃을 추가함
      setTimeout(() => {
        const selection = window.getSelection();
        const selectedText = selection?.toString().trim() || "";

        if (selectedText) {
          setDraggedText(selectedText);
        }
      }, 0);
    };

    // 모바일 환경에서 텍스트 선택 감지
    const handleTouchSelection = (): void => {
      // 터치 이벤트가 끝난 후 선택된 텍스트 확인
      setTimeout(() => {
        const selection = window.getSelection();
        const selectedText = selection?.toString().trim() || "";

        if (selectedText) {
          setDraggedText(selectedText);
        }
      }, 0);
    };

    const handleSelectionChange = (): void => {
      setTimeout(() => {
        const selection = window.getSelection();

        if (selection?.toString() === "") {
          return;
        }

        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          setPosition({
            leftTop: {
              x: rect.left + window.scrollX + OFFSET.x,
              y: rect.top + window.scrollY + OFFSET.y,
            },
            rightTop: {
              x: rect.right + window.scrollX + OFFSET.x,
              y: rect.top + window.scrollY + OFFSET.y,
            },
            bottomLeft: {
              x: rect.left + window.scrollX + OFFSET.x,
              y: rect.bottom + window.scrollY + OFFSET.y,
            },
            bottomRight: {
              x: rect.right + window.scrollX + OFFSET.x,
              y: rect.bottom + window.scrollY + OFFSET.y,
            },
          });
        }
      }, 0);
    };

    // 이벤트 리스너 등록
    document.addEventListener("mouseup", handleMouseSelection);
    document.addEventListener("touchend", handleTouchSelection);
    document.addEventListener("selectionchange", handleSelectionChange);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener("mouseup", handleMouseSelection);
      document.removeEventListener("touchend", handleTouchSelection);
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  return { draggedText, position };
}

export default useGlobalDraggedText;
