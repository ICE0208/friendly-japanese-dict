// hooks/useTextMask.ts
import { useState, useEffect } from "react";

interface Position {
  x: number;
  y: number;
}

const OFFSET = {
  x: 0,
  y: 10,
};

function useGlobalDraggedText() {
  const [draggedText, setDraggedText] = useState<string>("");
  const [position, setPosition] = useState<Position>({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleSelection = (event: MouseEvent): void => {
      // 간헐적으로 선택된 문자열이 초기화되지 않고 선택되는 문제가 있어서 타임아웃을 추가함
      setTimeout(() => {
        const selection = window.getSelection();
        const selectedText = selection?.toString().trim() || "";
        setPosition({ x: event.pageX + OFFSET.x, y: event.pageY + OFFSET.y });
        setDraggedText(selectedText);
      }, 0);
    };

    document.addEventListener("mouseup", handleSelection);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener("mouseup", handleSelection);
    };
  }, []);

  return { draggedText, position };
}

export default useGlobalDraggedText;
