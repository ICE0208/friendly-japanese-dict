import { NextResponse } from "next/server";

interface SuggestionItem {
  key: string;
  item: string;
}

// Define types for Naver API response
type NaverSuggestionItem = string[][];
type NaverSuggestionGroup = NaverSuggestionItem[];
interface NaverSuggestionResponse {
  query: string[];
  items: NaverSuggestionGroup[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json({ suggestions: [] });
    }

    const response = await fetch(
      `https://ac-dict.naver.com/jako/ac?n_katahira=0&st=11&r_lt=11&q=${encodeURIComponent(
        query
      )}`
    );
    const data: NaverSuggestionResponse = await response.json();

    // Naver API returns data in a nested array format
    // items[0] contains main suggestions, items[1] contains related suggestions
    const suggestions: SuggestionItem[] = [];

    // Process main suggestions
    if (data.items && data.items[0]) {
      data.items[0].forEach((item: NaverSuggestionItem) => {
        if (item && item.length >= 4) {
          const reading = item[0][0]; // Hiragana reading
          const word = item[1][0]; // Kanji/word
          const meaning = item[3][0]; // Korean meaning

          suggestions.push({
            key: word,
            item: `${word} (${reading}) - ${meaning}`,
          });
        }
      });
    }

    // Process related suggestions if needed
    if (data.items && data.items[1]) {
      data.items[1].forEach((item: NaverSuggestionItem) => {
        if (item && item.length >= 4) {
          const reading = item[0][0]; // Hiragana reading
          const word = item[1][0]; // Kanji/word
          const meaning = item[3][0]; // Korean meaning

          suggestions.push({
            key: word,
            item: `${word} (${reading}) - ${meaning}`,
          });
        }
      });
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json({ suggestions: [] });
  }
}
