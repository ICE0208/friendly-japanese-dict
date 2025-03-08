import { NextResponse } from "next/server";

interface DictionaryResult {
  meanings: string[];
  dictionaryLink: string;
}

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
    const response = await fetch(dictionaryLink);
    const html = await response.text();

    // Extract meanings from the HTML response
    const meanings: string[] = [];
    const meaningMatches = html.match(
      /<span class="txt_search">(.*?)<\/span>/g
    );

    if (meaningMatches) {
      meaningMatches.slice(0, 2).forEach((match) => {
        const meaning = match.replace(/<[^>]+>/g, "").trim();
        if (meaning) {
          meanings.push(meaning);
        }
      });
    }

    const result: DictionaryResult = {
      meanings,
      dictionaryLink,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching dictionary data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dictionary data" },
      { status: 500 }
    );
  }
}
