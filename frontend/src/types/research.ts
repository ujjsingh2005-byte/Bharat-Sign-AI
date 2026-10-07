export type ImplementationStatus = "Implemented" | "Experimental" | "Planned";

export interface ResearchStatus {
  success: boolean;
  targetLanguage: string;
  paperTitle: string;
  systemStatus: {
    implemented: string[];
    experimental: string[];
    planned: string[];
  };
}

export interface WerResult {
  wer: number;
  wer_percent: string;
  substitutions: number;
  deletions: number;
  insertions: number;
  ref_length: number;
  hyp_length: number;
  evaluated: boolean;
}

export interface CerResult {
  cer: number;
  cer_percent: string;
  evaluated: boolean;
}

export interface EvaluationResponse {
  success: boolean;
  reference: string;
  hypothesis: string;
  targetLanguage: string;
  wer: WerResult;
  cer: CerResult;
  translationAccuracy: string;
  semanticAdequacyF1: string;
}

export interface PipelineComparisonResult {
  success: boolean;
  targetLanguage: string;
  baseline: {
    pipeline: string;
    input_text: string;
    intermediate: string[];
    isl_gloss_text: string;
    signs: any[];
    latencyMs: number;
    grammarReorderingApplied: boolean;
    semanticInterpretation: string;
  };
  proposed: {
    pipeline: string;
    targetLanguage: string;
    input_text: string;
    normalized_text: string;
    semanticIR: any;
    isl_gloss: string[];
    isl_gloss_text: string;
    signs: any[];
    latencyMs: number;
    stageLatencyMs: {
      asrMock: number;
      textNormalization: number;
      nlpExtraction: number;
      contextResolution: number;
      islMapping: number;
      signRendering: number;
      totalMs: number;
    };
    grammarReorderingApplied: boolean;
    ruleApplied: string;
  };
  comparisonSummary: {
    linguisticAccuracy: string;
    latencyDifferenceMs: number;
  };
}

export interface TraceabilityItem {
  requirement: string;
  paperSection: string;
  implementation: string;
  status: ImplementationStatus;
  evidence: string;
}

export interface HumanEvaluationItem {
  id: string;
  evaluator_name: string;
  evaluator_role: string;
  linguistic_correctness: number;
  semantic_adequacy: number;
  naturalness: number;
  comments: string;
  date: string;
}

export interface ExperimentItem {
  id: string;
  name: string;
  date: string;
  targetLanguage: string;
  model: string;
  asrVersion: string;
  nlpVersion: string;
  dataset: string;
  datasetVersion: string;
  hardware: string;
  sentencesTested: number;
  wholeWordSignAdherence?: string;
  letterSplittingViolations?: number;
  status: ImplementationStatus;
  reproducibilityCard: {
    randomSeed: number;
    pythonVersion: string;
    framework: string;
    evaluationScript: string;
  };
}
