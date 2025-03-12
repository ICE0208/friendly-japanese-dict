import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // 요청 URL에서 번역할 텍스트 추출
    const searchParams = request.nextUrl.searchParams;
    const text = searchParams.get("text");

    // 텍스트가 없는 경우 에러 반환
    if (!text) {
      return NextResponse.json(
        { error: "번역할 텍스트가 필요합니다." },
        { status: 400 }
      );
    }

    // Papago API 호출
    const response = await fetch(
      `https://papago.naver.com/apis/dictionary/search?source=ja&target=ko&text=${encodeURIComponent(
        text
      )}&locale=ko`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-apigw-partnerid": "papago",
        },
      }
    );

    // 응답 상태 확인
    if (!response.ok) {
      throw new Error("번역 요청이 실패했습니다.");
    }

    // 응답 데이터 파싱
    const data = await response.json();

    // 성공 응답 반환
    return NextResponse.json(data);
  } catch (error) {
    console.error("번역 오류:", error);
    return NextResponse.json(
      { error: "번역에 실패했습니다." },
      { status: 500 }
    );
  }
}
