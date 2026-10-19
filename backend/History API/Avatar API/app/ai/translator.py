from deep_translator import GoogleTranslator


# Supported languages
SUPPORTED_LANGUAGES = {
    "en": "English",
    "hi": "Hindi",
    "ta": "Tamil",
    "te": "Telugu",
    "mr": "Marathi",
    "bn": "Bengali",
    "gu": "Gujarati",
    "kn": "Kannada",
    "ml": "Malayalam",
    "pa": "Punjabi",
    "ur": "Urdu",
    "or": "Odia",
    "as": "Assamese",
}


def translate_text(
    text: str,
    source_language: str = "auto",
    target_language: str = "en",
):
    """
    Translate speech text into the requested target language.

    Parameters:
        text: Text that needs to be translated.
        source_language: Source language code, e.g. 'hi', 'en', 'ta'.
        target_language: Target language code, e.g. 'en', 'hi'.

    Returns:
        Dictionary containing translation information.
    """

    if not text or not text.strip():
        return {
            "success": False,
            "message": "No text provided for translation.",
            "original_text": "",
            "translated_text": "",
            "source_language": source_language,
            "target_language": target_language,
        }

    text = text.strip()

    # Convert language codes to lowercase
    source_language = (
        source_language.lower()
        if source_language
        else "auto"
    )

    target_language = (
        target_language.lower()
        if target_language
        else "en"
    )

    # Validate target language
    if target_language not in SUPPORTED_LANGUAGES:
        return {
            "success": False,
            "message": f"Target language '{target_language}' is not supported.",
            "original_text": text,
            "translated_text": "",
            "source_language": source_language,
            "target_language": target_language,
        }

    # If source and target are the same, translation is unnecessary
    if (
        source_language != "auto"
        and source_language == target_language
    ):
        return {
            "success": True,
            "message": "Source and target languages are the same.",
            "original_text": text,
            "translated_text": text,
            "source_language": source_language,
            "target_language": target_language,
        }

    try:
        translator = GoogleTranslator(
            source=source_language,
            target=target_language,
        )

        translated_text = translator.translate(text)

        return {
            "success": True,
            "message": "Translation successful.",
            "original_text": text,
            "translated_text": translated_text,
            "source_language": source_language,
            "target_language": target_language,
        }

    except Exception as e:
        return {
            "success": False,
            "message": "Translation failed.",
            "error": str(e),
            "original_text": text,
            "translated_text": "",
            "source_language": source_language,
            "target_language": target_language,
        }