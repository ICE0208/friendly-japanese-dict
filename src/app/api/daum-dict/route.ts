import { NextResponse } from "next/server";
import { load } from "cheerio";
import { WordInfo, DictionaryResult } from "@/app/types/japanese";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    const dictionaryLink = `https://dic.daum.net/search.do?q=${encodeURIComponent(
      query
    )}&dic=jp`;

    // 한국어 헤더 추가하여 요청
    const response = await fetch(dictionaryLink, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    });

    const html = await response.text();
    const $ = load(html);

    // 메인 단어 정보 추출
    const mainWord: WordInfo = {
      word: "",
      wordWithKanji: "",
      meanings: [],
    };

    // 메인 단어 발음 - 수정된 선택자 사용
    const mainPronunciation = $(".tit_cleansch .txt_cleansch").text().trim();
    if (mainPronunciation) {
      mainWord.word = mainPronunciation;
    }

    // 메인 단어 (한자 포함) - 수정된 선택자 사용
    const mainWordWithKanji = $(".tit_cleansch .sub_txt").text().trim();
    if (mainWordWithKanji) {
      mainWord.wordWithKanji = mainWordWithKanji;
    }

    // 메인 단어 뜻들 - 수정된 선택자 사용
    $(".search_cleanword+.list_search .txt_search").each((_, element) => {
      const meaning = $(element).text().trim();
      if (meaning) {
        mainWord.meanings.push(meaning);
      }
    });

    // 서브 단어 정보 추출
    const subWords: WordInfo[] = [];

    // 서브 단어 섹션 찾기
    $(".search_word").each((index, section) => {
      const subWord: WordInfo = {
        word: "",
        wordWithKanji: "",
        meanings: [],
      };

      // 서브 단어 발음
      const subPronunciation = $(section).find(".txt_searchword").text().trim();
      if (subPronunciation) {
        subWord.word = subPronunciation;
      }

      // 서브 단어 (한자 포함)
      const subWordWithKanji = $(section).find(".sub_txt").text().trim();
      if (subWordWithKanji) {
        subWord.wordWithKanji = subWordWithKanji;
      }

      // 서브 단어 뜻들 - 다음 list_search 요소에서 찾기
      const nextListSearch = $(section).next(".list_search");
      if (nextListSearch.length > 0) {
        nextListSearch.find(".txt_search").each((_, element) => {
          const meaning = $(element).text().trim();
          if (meaning) {
            subWord.meanings.push(meaning);
          }
        });
      }

      // 단어 정보가 있는 경우에만 추가
      if (subWord.word || subWord.wordWithKanji) {
        subWords.push(subWord);
      }
    });

    const result: DictionaryResult = {
      mainWord,
      subWords,
      dictionaryLink,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching dictionary data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dictionary data", details: String(error) },
      { status: 500 }
    );
  }
}
