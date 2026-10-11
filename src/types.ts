export interface DocumentMetadata {
  fileName: string;
  fileType: string;
  fileSize: number;
  wordCount: number;
  charCount: number;
  paragraphCount?: number;
}

export interface TransformationOptions {
  targetAudience: string;
  readingLevel: string;
  tone: string;
  outputFormat: string;
  language: string;
  desiredLength: string;
  customInstructions: string;
}

export interface FidelityChecklist {
  fidelityScore: number;
  fidelityVerdict: string;
  preservedCoreFacts: string[];
  omittedOrCondensedDetails: {
    detail: string;
    reason: string;
  }[];
  conceptAdaptations: {
    originalConcept: string;
    adaptedExplanation: string;
  }[];
}

export interface TransformationResult {
  title: string;
  transformedContent: string;
  summaryOverview: string;
  keyTakeaways: string[];
  fidelityChecklist: FidelityChecklist;
  metadata: {
    targetAudience: string;
    readingLevelAchieved: string;
    toneAssessment: string;
    estimatedWordCount: number;
    actualTransformedWordCount?: number;
    estimatedReadingTimeMinutes: number;
  };
}

export interface ExtractionResponse {
  success: boolean;
  text: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  wordCount: number;
  charCount: number;
  paragraphCount: number;
  error?: string;
  details?: string;
}
