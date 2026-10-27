export type StyleCategory =
  | 'Fine Art & Historical'
  | 'Digital & Cinematic'
  | 'Craft & Tactile'
  | 'Graphic & Avant-Garde'
  | 'Illustrative & Print';

export interface StyleDefinition {
  id: string;
  name: string;
  category: StyleCategory;
  medium: string;
  lighting: string;
  substrate: string;
  signatureModifiers: string[];
  colorPalette: string[];
  diffusionBehavior: string;
  styleBleedRisk: 'Low' | 'Moderate' | 'High';
  promptTemplate: string; // e.g. "{style_prefix} of {subject}, {modifiers}"
}

export interface ExperimentVariant {
  id: string;
  styleId: string;
  styleName: string;
  styleCategory: StyleCategory;
  prompt: string;
  negativePrompt?: string;
  imageSrc: string;
  colorPalette: string[];
  keyModifiers: string[];
  medium: string;
  lighting: string;
  diffusionParameters: {
    guidanceScale: number; // e.g. 7.5
    steps: number; // e.g. 35
    sampler: string; // e.g. "DPM++ 2M Karras"
    aspectRatio: string; // "1:1"
    seed: number;
    model: string;
  };
  promptTokens: {
    token: string;
    category: 'subject' | 'style' | 'medium' | 'lighting' | 'composition' | 'quality';
    weight: number;
  }[];
  notes: string;
}

export interface ExperimentSet {
  id: string;
  title: string;
  subject: string;
  coreSubjectToken: string;
  description: string;
  syllabusTopic: string;
  referenceImage?: string;
  variants: ExperimentVariant[];
  educationalInsight: string;
}

export interface PromptAnalysisResponse {
  subject: string;
  style: string;
  medium: string;
  lighting: string;
  framing: string;
  styleBleedRisk: string;
  tokenBreakdown: {
    token: string;
    category: string;
    estimatedAttentionWeight: string;
  }[];
  diffusionInsight: string;
}

export interface StyleSuggestionResponse {
  suggestions: {
    styleName: string;
    prompt: string;
    rationale: string;
  }[];
}

export interface PromptComparisonResponse {
  commonSubject: string;
  divergenceFactors: string[];
  semanticDriftRisk: string;
  latentSpaceDistanceScore: string;
  comparativeAnalysis: string;
}
