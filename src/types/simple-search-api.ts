export interface SimpleSearchApiResponse {
  items: Item[];
}

interface Item {
  entry: string;
  subEntry: string | null;
  pos: Po[];
}

interface Po {
  type: string;
  meanings: Meaning[];
}

interface Meaning {
  ruby: string | null;
  meaning: string;
  examples: Example[];
  originalMeaning: string;
}

interface Example {
  text: string;
  translatedText: string;
}
