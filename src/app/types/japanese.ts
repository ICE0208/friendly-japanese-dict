export interface KanjiResult {
  found: boolean;
  strokeOrderGifUri?: string;
  meaning?: string;
  kunyomi?: string[];
  onyomi?: string[];
  dictionaryLink: string;
}

export interface JapaneseWord {
  word?: string;
  reading?: string;
}

export interface JishoResult {
  data: Array<{
    japanese: JapaneseWord[];
    senses?: Array<{
      english_definitions?: string[];
      parts_of_speech?: string[];
    }>;
  }>;
}

export interface DictionaryResult {
  meanings: string[];
  dictionaryLink: string;
}

export interface SuggestionItem {
  word: string;
  reading: string;
  meaning: string;
}

export interface ExamplePiece {
  lifted: string;
  unlifted: string;
}

export interface ExampleResult {
  kanji: string;
  kana: string;
  english: string;
  pieces: ExamplePiece[];
}

export interface ExampleSearchResult {
  uri: string;
  results: ExampleResult[];
}
