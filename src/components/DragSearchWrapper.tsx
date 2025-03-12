import useGlobalDraggedText from "@/hooks/useGlobalDraggedText";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import DragSearchResult from "./DragSearchResult";
import { SimpleSearchApiResponse } from "@/types/simple-search-api";

export default function DragSearchWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const { draggedText, position } = useGlobalDraggedText();
  const [dragSearchResult, setDragSearchResult] =
    useState<SimpleSearchApiResponse | null>(null);

  const fetchDragSearchAPI = useCallback(async (text: string) => {
    try {
      const response = await fetch(`/api/simple-search?text=${text}`);
      if (response.ok) {
        const data = await response.json();
        setDragSearchResult(data);
      } else {
        throw new Error("response is not ok :(");
      }
    } catch (error) {
      console.error("요청오류: ", error);
    }
  }, []);

  useEffect(() => {
    setDragSearchResult(null);
    if (draggedText) {
      fetchDragSearchAPI(draggedText);
    }
  }, [draggedText, fetchDragSearchAPI]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // 서버에서는 아무것도 렌더링하지 않음

  return (
    <>
      {children}
      {draggedText &&
        dragSearchResult?.items &&
        createPortal(
          <DragSearchResult
            position={position}
            resultData={dragSearchResult}
          />,
          document.body // 부모 영향 안 받도록 body에 추가
        )}
    </>
  );
}
