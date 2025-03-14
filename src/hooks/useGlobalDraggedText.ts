// hooks/useGlobalDraggedText.ts
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
    // 데스크톱 환경에서 텍스트 선택 감지
    const handleMouseSelection = (event: MouseEvent): void => {
      // 간헐적으로 선택된 문자열이 초기화되지 않고 선택되는 문제가 있어서 타임아웃을 추가함
      setTimeout(() => {
        const selection = window.getSelection();
        const selectedText = selection?.toString().trim() || "";
        setPosition({ x: event.pageX + OFFSET.x, y: event.pageY + OFFSET.y });
        setDraggedText(selectedText);
      }, 0);
    };

    // 모바일 환경에서 텍스트 선택 감지
    const handleTouchSelection = (event: TouchEvent): void => {
      // 터치 이벤트가 끝난 후 선택된 텍스트 확인
      setTimeout(() => {
        const selection = window.getSelection();
        const selectedText = selection?.toString().trim() || "";

        if (selectedText) {
          // 터치 이벤트의 마지막 터치 위치 사용
          const touch = event.changedTouches[0];
          setPosition({ x: touch.pageX + OFFSET.x, y: touch.pageY + OFFSET.y });
          setDraggedText(selectedText);
        }
      }, 0);
    };

    // 이벤트 리스너 등록
    document.addEventListener("mouseup", handleMouseSelection);
    document.addEventListener("touchend", handleTouchSelection);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener("mouseup", handleMouseSelection);
      document.removeEventListener("touchend", handleTouchSelection);
    };
  }, []);

  return { draggedText, position };
}

export default useGlobalDraggedText;
