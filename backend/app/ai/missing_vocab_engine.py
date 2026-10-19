"""
Bharat Sign AI 3 - Context-Guided Missing-Vocabulary Recovery Engine
Identifies out-of-vocabulary (OOV) words and routes fallback strategies:
Verified ISL Sign -> ISL Fingerspelling -> Explanatory Text -> Expert Review Queue.
"""

from typing import List, Dict, Any
from app.ai.sign_dictionary import VOCABULARY_SIGNS, LEMMA_MAP, get_signs

class MissingVocabEngine:
    def __init__(self):
        # Alphabet signs for ISL fingerspelling fallback
        self.alphabet_signs = {c: f"LETTER_{c}" for c in "ABCDEFGHIJKLMNOPQRSTUVWXYZ"}

    def is_verified_sign(self, token: str) -> bool:
        clean = token.upper().strip(".,!?")
        return (clean in VOCABULARY_SIGNS) or (clean in LEMMA_MAP and LEMMA_MAP[clean] in VOCABULARY_SIGNS)

    def analyze_coverage(self, tokens: List[str]) -> Dict[str, Any]:
        """
        Analyzes tokens against verified ISL dictionary and returns coverage ratio and OOV tokens.
        """
        if not tokens:
            return {
                "coverage_ratio": 1.0,
                "supported_tokens": [],
                "unsupported_tokens": [],
                "total_tokens": 0
            }

        upper_tokens = [t.upper().strip(".,!?") for t in tokens if t.strip()]
        supported = []
        unsupported = []

        for token in upper_tokens:
            if self.is_verified_sign(token):
                supported.append(token)
            else:
                unsupported.append(token)

        total = len(upper_tokens)
        ratio = len(supported) / total if total > 0 else 1.0

        return {
            "coverage_ratio": round(ratio, 4),
            "supported_tokens": supported,
            "unsupported_tokens": unsupported,
            "total_tokens": total
        }

    def generate_fingerspelling_sequence(self, word: str) -> List[Dict[str, Any]]:
        """
        Generates letter-by-letter ISL fingerspelling sequence for OOV word.
        """
        clean_word = "".join(c for c in word.upper() if c.isalnum())
        letters = []
        for char in clean_word:
            letters.append({
                "word": char,
                "asset": f"/assets/signs/letters/{char}.glb",
                "type": "letter",
                "category": "Fingerspelling",
                "description": f"ISL Fingerspelling for letter '{char}'",
                "available": True
            })
        return letters

    def recover_missing_vocabulary(self, original_text: str, tokens: List[str]) -> Dict[str, Any]:
        """
        Processes text tokens, identifies OOV terms, and constructs a linguistically safe fallback sequence.
        """
        coverage = self.analyze_coverage(tokens)
        recovered_sequence = []
        fallback_log = []

        for token in tokens:
            clean_tok = token.upper().strip(".,!?")
            if not clean_tok:
                continue

            has_direct_sign = self.is_verified_sign(clean_tok)

            if has_direct_sign:
                signs = get_signs([clean_tok])
                recovered_sequence.append({
                    "token": clean_tok,
                    "strategy": "DIRECT_VERIFIED_SIGN",
                    "signs": signs
                })
            else:
                # OOV Fallback Strategy: Fingerspelling
                fs_seq = self.generate_fingerspelling_sequence(clean_tok)
                recovered_sequence.append({
                    "token": clean_tok,
                    "strategy": "ISL_FINGERSPELLING_FALLBACK",
                    "signs": fs_seq,
                    "explanation": f"Fingerspelled letter-by-letter for unsupported vocabulary '{clean_tok}'"
                })
                fallback_log.append({
                    "token": clean_tok,
                    "strategy": "ISL_FINGERSPELLING",
                    "reason": "Word not found in primary 5M ISL dictionary"
                })

        return {
            "original_text": original_text,
            "coverage_ratio": coverage["coverage_ratio"],
            "supported_count": len(coverage["supported_tokens"]),
            "unsupported_count": len(coverage["unsupported_tokens"]),
            "unsupported_tokens": coverage["unsupported_tokens"],
            "recovered_sequence": recovered_sequence,
            "fallback_log": fallback_log,
            "expertReviewFlagged": len(coverage["unsupported_tokens"]) > 0
        }

missing_vocab_engine = MissingVocabEngine()
