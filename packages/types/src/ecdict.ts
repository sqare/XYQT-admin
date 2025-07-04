/** 音频URL */
interface Audio {
  name: string;
  url: string;
}
/** Ecdict 单词 */
interface EcdictWord {
  audio?: Audio[];
  bnc?: number;
  collins?: number;
  definition?: string;
  detail?: string;
  exchange?: string;
  frq?: number;
  id: number;
  oxford?: number;
  phonetic?: string;
  pos?: string;
  tag?: string;
  translation: string;
  word: string;
}

/** Ecdict Page */
interface EcdictPage {
  total: number;
  words: EcdictWord[];
}

export type { EcdictPage, EcdictWord };
