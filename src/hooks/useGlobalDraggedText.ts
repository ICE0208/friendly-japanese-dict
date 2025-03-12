// hooks/useTextMask.ts
import { useState, useEffect } from "react";

function useGlobalDraggedText(): string {
  const [draggedText, setDraggedText] = useState<string>("");

  useEffect(() => {
    const handleSelection = (): void => {
      const selection = window.getSelection();
      const selectedText = selection?.toString() || "";
      setDraggedText(selectedText);
    };

    document.addEventListener("mouseup", handleSelection);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener("mouseup", handleSelection);
    };
  }, []);

  return draggedText;
}

export default useGlobalDraggedText;
