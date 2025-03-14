interface KanjiSearchResult {
  found: boolean;
  strokeOrderGifUri?: string;
  meaning?: string;
  kunyomi?: string[];
  onyomi?: string[];
}

interface PhraseSearchResult {
  data: Array<{
    japanese: Array<{
      word?: string;
      reading?: string;
    }>;
  }>;
}

interface ExamplePiece {
  lifted: string;
  unlifted: string;
}

interface ExampleResult {
  kanji: string;
  kana: string;
  english: string;
  pieces: ExamplePiece[];
}

interface ExampleSearchResult {
  uri: string;
  results: ExampleResult[];
}

class JishoWrapper {
  async searchForPhrase(phrase: string): Promise<PhraseSearchResult> {
    const response = await fetch(
      `/api/jisho?query=${encodeURIComponent(phrase)}&type=phrase`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from Jisho API");
    }
    return await response.json();
  }

  async searchForKanji(kanji: string): Promise<KanjiSearchResult> {
    const response = await fetch(
      `/api/jisho?query=${encodeURIComponent(kanji)}&type=kanji`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from Jisho API");
    }
    return await response.json();
  }

  async searchForExamples(phrase: string): Promise<ExampleSearchResult> {
    const response = await fetch(
      `/api/jisho?query=${encodeURIComponent(phrase)}&type=examples`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from Jisho API");
    }
    return await response.json();
  }
}

export const jisho = new JishoWrapper();
