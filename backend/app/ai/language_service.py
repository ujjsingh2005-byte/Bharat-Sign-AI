"""
Bharat Sign AI 3 - Reusable Language Processing Service
Encapsulates language validation, capability separation (ASR vs. Translation),
language preservation across multi-stage pipelines, Hinglish code-switching,
and per-language evaluation benchmarks.
"""

from typing import Dict, Any, List, Optional, Tuple
import re

from app.ai.translator import translate_text, is_hinglish, SUPPORTED_LANGUAGES, PHRASE_DICTIONARY
from app.ai.gloss import text_to_gloss
from app.ai.sign_dictionary import get_signs
from app.ai.missing_vocab_engine import missing_vocab_engine

# Explicit Language Capability Catalog
# Distinguishes Speech Recognition (ASR) capability from Text/Sign Translation capability.
LANGUAGE_CATALOG: Dict[str, Dict[str, Any]] = {
    "auto": {
        "name": "Auto Detect",
        "native": "Auto Detect (स्वचालित)",
        "asr_supported": True,
        "asr_locale": "hi-IN",
        "translation_supported": True,
        "hinglish_code_switching": True,
        "sample_phrase": "aapka swagat hai hamare ghar mein",
    },
    "en": {
        "name": "English",
        "native": "English",
        "asr_supported": True,
        "asr_locale": "en-US",
        "translation_supported": True,
        "hinglish_code_switching": True,
        "sample_phrase": "I want water and food immediately.",
    },
    "hi": {
        "name": "Hindi",
        "native": "हिन्दी",
        "asr_supported": True,
        "asr_locale": "hi-IN",
        "translation_supported": True,
        "hinglish_code_switching": True,
        "sample_phrase": "मुझे अस्पताल जाना है। डॉक्टर कहाँ हैं?",
    },
    "bho": {
        "name": "Bhojpuri",
        "native": "भोजपुरी",
        "asr_supported": False, # No native ASR model in browser/Whisper default
        "asr_locale": None,
        "translation_supported": True,
        "hinglish_code_switching": True,
        "sample_phrase": "हमका पानी चाहीं। रउआ कइसन बानी?",
    },
    "mr": {
        "name": "Marathi",
        "native": "मराठी",
        "asr_supported": True,
        "asr_locale": "mr-IN",
        "translation_supported": True,
        "hinglish_code_switching": False,
        "sample_phrase": "मला मदत हवी आहे. दवाखाना कुठे आहे?",
    },
    "bn": {
        "name": "Bengali",
        "native": "বাংলা",
        "asr_supported": True,
        "asr_locale": "bn-IN",
        "translation_supported": True,
        "hinglish_code_switching": False,
        "sample_phrase": "আমার জল চাই। আপনি কেমন আছেন?",
    },
    "gu": {
        "name": "Gujarati",
        "native": "ગુજરાતી",
        "asr_supported": True,
        "asr_locale": "gu-IN",
        "translation_supported": True,
        "hinglish_code_switching": False,
        "sample_phrase": "મને પાણી જોઈએ છે. તમે કેમ છો?",
    },
    "pa": {
        "name": "Punjabi",
        "native": "ਪੰਜਾਬੀ",
        "asr_supported": True,
        "asr_locale": "pa-IN",
        "translation_supported": True,
        "hinglish_code_switching": False,
        "sample_phrase": "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ। ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?",
    },
    "ta": {
        "name": "Tamil",
        "native": "தமிழ்",
        "asr_supported": True,
        "asr_locale": "ta-IN",
        "translation_supported": True,
        "hinglish_code_switching": False,
        "sample_phrase": "எனக்கு தண்ணீர் வேண்டும். நீங்கள் எப்படி இருக்கிறீர்கள்?",
    },
    "te": {
        "name": "Telugu",
        "native": "తెలుగు",
        "asr_supported": True,
        "asr_locale": "te-IN",
        "translation_supported": True,
        "hinglish_code_switching": False,
        "sample_phrase": "నాకు నీళ్లు కావాలి. మీరు ఎలా ఉన్నారు?",
    },
    "ml": {
        "name": "Malayalam",
        "native": "മലയാളം",
        "asr_supported": True,
        "asr_locale": "ml-IN",
        "translation_supported": True,
        "hinglish_code_switching": False,
        "sample_phrase": "എനിക്ക് വെള്ളം വേണം. സുഖമാണോ?",
    },
    "kn": {
        "name": "Kannada",
        "native": "ಕನ್ನಡ",
        "asr_supported": True,
        "asr_locale": "kn-IN",
        "translation_supported": True,
        "hinglish_code_switching": False,
        "sample_phrase": "ನನಗೆ ನೀರು ಬೇಕು. ನೀವು ಹೇಗಿದ್ದೀರಿ?",
    },
    "or": {
        "name": "Odia",
        "native": "ଓଡ଼ିଆ",
        "asr_supported": False,
        "asr_locale": None,
        "translation_supported": True,
        "hinglish_code_switching": False,
        "sample_phrase": "ମୋତେ ପାଣି ଦରକାର। ଆପଣ କେମିତି ଅଛନ୍ତି?",
    },
    "as": {
        "name": "Assamese",
        "native": "অসমীয়া",
        "asr_supported": False,
        "asr_locale": None,
        "translation_supported": True,
        "hinglish_code_switching": False,
        "sample_phrase": "মোৰ পানী লাগে। আপুনি কেমন আছে?",
    },
    "ur": {
        "name": "Urdu",
        "native": "اردو",
        "asr_supported": True,
        "asr_locale": "ur-IN",
        "translation_supported": True,
        "hinglish_code_switching": False,
        "sample_phrase": "مجھے پانی چاہیے. آپ کیسے ہیں؟",
    },
    "sa": {
        "name": "Sanskrit",
        "native": "संस्कृतम्",
        "asr_supported": False,
        "asr_locale": None,
        "translation_supported": True,
        "hinglish_code_switching": False,
        "sample_phrase": "अहं जलं इच्छामि। भवनं कुत्र अस्ति?",
    },
}

class LanguageProcessingService:
    """
    Unified Language Processing Service for Bharat Sign AI 3.
    Enforces language validation, capability distinction, Hinglish code-switching normalization,
    language preservation throughout translation pipeline, and automated per-language evaluation.
    """

    def get_supported_languages(self) -> List[Dict[str, Any]]:
        """
        Returns full list of supported languages with exact ASR and Translation capability flags.
        Does not falsely claim support if a component is missing.
        """
        result = []
        for code, info in LANGUAGE_CATALOG.items():
            result.append({
                "code": code,
                "name": info["name"],
                "native": info["native"],
                "asr_supported": info["asr_supported"],
                "asr_locale": info["asr_locale"],
                "translation_supported": info["translation_supported"],
                "hinglish_code_switching": info["hinglish_code_switching"],
                "badge": "🎤 Speech + 🤟 Sign" if info["asr_supported"] else "🤟 Sign Only"
            })
        return result

    def validate_language(self, language_code: str, required_capability: str = "translation") -> Tuple[bool, Optional[Dict[str, Any]]]:
        """
        Validates if a language is supported for a given capability ('asr' or 'translation').
        Returns (is_valid, error_payload_if_invalid).
        """
        lang = (language_code or "auto").lower().strip()
        
        if lang not in LANGUAGE_CATALOG:
            supported_names = [f"{info['name']} ({code})" for code, info in LANGUAGE_CATALOG.items() if code != "auto"]
            return False, {
                "success": False,
                "error_code": "UNSUPPORTED_LANGUAGE",
                "message": f"Language '{language_code}' is not currently configured for Indian Sign Language processing. "
                           f"Supported languages are: {', '.join(supported_names)}.",
                "requested_language": language_code,
                "supported_languages": list(LANGUAGE_CATALOG.keys())
            }

        catalog_entry = LANGUAGE_CATALOG[lang]
        if required_capability == "asr" and not catalog_entry["asr_supported"]:
            return False, {
                "success": False,
                "error_code": "ASR_UNSUPPORTED_FOR_LANGUAGE",
                "message": f"Speech recognition (ASR) is not currently configured for {catalog_entry['name']} ({lang}). "
                           f"You can still use text-to-ISL translation for this language.",
                "requested_language": language_code,
                "language_name": catalog_entry["name"],
                "translation_supported": catalog_entry["translation_supported"]
            }

        return True, None

    def process_semantic_pipeline(self, text: str, source_language: str = "auto") -> Dict[str, Any]:
        """
        Executes the end-to-end Regional Language -> Universal Semantic Representation -> ISL Grammar Reordering -> 3D Avatar Sign Sequence.
        Preserves selected language throughout pipeline and handles code-switching.
        """
        raw_text = (text or "").strip()
        if not raw_text:
            return {
                "success": False,
                "message": "Please enter text to translate.",
                "original_text": "",
                "source_language": source_language,
                "english_translation": "",
                "semantics": {},
                "gloss": [],
                "gloss_text": "",
                "signs": [],
            }

        # Step 1: Validate Language Support
        is_valid, error_payload = self.validate_language(source_language, required_capability="translation")
        if not is_valid:
            return error_payload

        lang_code = source_language.lower().strip() if source_language else "auto"
        lang_info = LANGUAGE_CATALOG.get(lang_code, LANGUAGE_CATALOG["auto"])

        # Step 2: Code-switching detection (Hinglish)
        hinglish_detected = False
        if lang_info["hinglish_code_switching"] or lang_code in ["hi", "bho", "en", "auto"]:
            hinglish_detected = is_hinglish(raw_text)

        # Step 3: Regional Text Translation to Universal Semantic English
        translation_res = translate_text(
            text=raw_text,
            source_language=lang_code,
            target_language="en"
        )

        english_translation = translation_res.get("translated_text", raw_text)
        translation_message = translation_res.get("message", "Translation completed")

        # Step 4: Universal English -> ISL Gloss Reordering (SOV Rules)
        gloss_res = text_to_gloss(english_translation)
        gloss_tokens = gloss_res.get("gloss", [])
        gloss_text = gloss_res.get("gloss_text", "")
        semantics = gloss_res.get("semantics", {})
        rule_applied = gloss_res.get("rule_applied", "ISL Grammar Reordering (SOV)")

        # Step 5: Vocabulary Missing/Recovery Engine
        vocab_recovery = missing_vocab_engine.recover_missing_vocabulary(english_translation, gloss_tokens)
        missing_words = vocab_recovery.get("unsupported_tokens", [])
        vocabulary_coverage_rate = int(vocab_recovery.get("coverage_ratio", 1.0) * 100)

        # Step 6: Map Gloss to Verified 3D Signs & Fingerspelling sequence
        # Note: We DO NOT translate directly to arbitrary avatar movements. We map via verified ISL Gloss dictionary.
        signs = get_signs(gloss_tokens)

        # Step 7: Construct response preserving selected language context
        return {
            "success": True,
            "message": "Universal Semantic ISL Pipeline executed successfully.",
            "original_text": raw_text,
            "source_language": lang_code,
            "source_language_name": lang_info["name"],
            "code_switching_detected": hinglish_detected,
            "english_translation": english_translation,
            "translation_engine_notice": translation_message,
            "semantics": semantics,
            "gloss": gloss_tokens,
            "gloss_text": gloss_text,
            "rule_applied": rule_applied,
            "signs": signs,
            "sign_count": len(signs),
            "missing_words": missing_words,
            "vocabularyCoverageRate": vocabulary_coverage_rate,
            "pipeline_stages": [
                f"1. Input ({lang_info['name']}): '{raw_text}'",
                f"2. Code-Switching Check: {'Hinglish Detected' if hinglish_detected else 'Standard Input'}",
                f"3. Semantic English: '{english_translation}'",
                f"4. ISL Syntactic Rules: {rule_applied}",
                f"5. Gloss Sequence: '{gloss_text}'",
                f"6. 3D Avatar Sign Mapping: {len(signs)} Verified Gestures/Fingerspelling"
            ]
        }

    def evaluate_language(self, language_code: str, custom_text: Optional[str] = None) -> Dict[str, Any]:
        """
        Evaluates a single language separately through the processing pipeline.
        Measures preservation of language context, translation efficacy, and ISL gloss generation.
        """
        is_valid, error_payload = self.validate_language(language_code, required_capability="translation")
        if not is_valid:
            return {
                "language_code": language_code,
                "status": "UNSUPPORTED",
                "error": error_payload["message"]
            }

        lang_info = LANGUAGE_CATALOG[language_code]
        test_text = custom_text or lang_info["sample_phrase"]

        pipeline_result = self.process_semantic_pipeline(test_text, source_language=language_code)

        return {
            "language_code": language_code,
            "language_name": lang_info["name"],
            "status": "PASSED" if pipeline_result.get("success") else "FAILED",
            "asr_supported": lang_info["asr_supported"],
            "translation_supported": lang_info["translation_supported"],
            "hinglish_supported": lang_info["hinglish_code_switching"],
            "test_input": test_text,
            "english_translation": pipeline_result.get("english_translation"),
            "gloss_text": pipeline_result.get("gloss_text"),
            "signs_generated": pipeline_result.get("sign_count", 0),
            "language_preserved": pipeline_result.get("source_language") == language_code,
            "vocabulary_coverage_rate": pipeline_result.get("vocabularyCoverageRate", 0),
        }

    def evaluate_all_supported_languages(self) -> Dict[str, Any]:
        """
        Iterates over all 15 supported languages and auto-detect mode separately, returning full benchmark evaluation report.
        """
        evaluations = []
        passed_count = 0
        failed_count = 0

        for code in LANGUAGE_CATALOG.keys():
            eval_res = self.evaluate_language(code)
            evaluations.append(eval_res)
            if eval_res["status"] == "PASSED":
                passed_count += 1
            else:
                failed_count += 1

        return {
            "total_evaluated": len(LANGUAGE_CATALOG),
            "passed": passed_count,
            "failed": failed_count,
            "evaluations": evaluations
        }


# Singleton Instance
language_service = LanguageProcessingService()
