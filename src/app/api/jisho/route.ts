import { NextRequest, NextResponse } from "next/server";
import JishoAPI from "unofficial-jisho-api";

const jisho = new JishoAPI();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    let result;
    if (type === "kanji") {
      result = await jisho.searchForKanji(query);
    } else {
      result = await jisho.searchForPhrase(query);
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in Jisho API:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from Jisho" },
      { status: 500 }
    );
  }
}
