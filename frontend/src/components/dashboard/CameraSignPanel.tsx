import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import {
  Camera,
  Square,
  ScanLine,
  Volume2,
  Copy,
  Trash2,
  Video,
  Languages,
  CheckCircle2,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { API_BASE_URL as API } from "../../utils/apiConfig";

interface AlternativePrediction {
  sign: string;
  confidence: number;
}

export default function CameraSignPanel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const sendingFrameRef = useRef(false);
  const mediaPipeHandsRef = useRef<any>(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("en");

  // Recognition Results
  const [detectedSign, setDetectedSign] = useState<string | null>(null);
  const [translatedText, setTranslatedText] = useState("Waiting for camera...");
  const [confidence, setConfidence] = useState(0);
  const [alternatives, setAlternatives] = useState<AlternativePrediction[]>([]);
  const [sentence, setSentence] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showVocabList, setShowVocabList] = useState(false);
  const [datasetStatus, setDatasetStatus] = useState<any>(null);
  const [activeModelSource, setActiveModelSource] = useState<string>("playlist");
  const [detectedLesson, setDetectedLesson] = useState<number | null>(null);
  const [detectedLessonTitle, setDetectedLessonTitle] = useState<string | null>(null);
  const [playlistCurriculum, setPlaylistCurriculum] = useState<any[]>([]);
  const [selectedLessonFilter, setSelectedLessonFilter] = useState<number | "all">("all");
  const [vocabSearch, setVocabSearch] = useState<string>("");

  useEffect(() => {
    axios
      .get(`${API}/sign/dataset/status`)
      .then((res) => {
        if (res.data && res.data.success) {
          setDatasetStatus(res.data);
        }
      })
      .catch(() => {});

    axios
      .get(`${API}/sign/models`)
      .then((res) => {
        if (res.data && res.data.success && res.data.active_model) {
          setActiveModelSource(res.data.active_model.model_source || "playlist");
        }
      })
      .catch(() => {});

    axios
      .get(`${API}/sign/playlist-curriculum`)
      .then((res) => {
        if (res.data && res.data.success && res.data.lessons) {
          setPlaylistCurriculum(res.data.lessons);
        }
      })
      .catch(() => {});
  }, []);

  const handleSwitchModel = async (newSource: string) => {
    try {
      const res = await axios.post(`${API}/sign/switch-model`, {
        model_source: newSource,
        model_type: "lstm",
      });
      if (res.data && res.data.success) {
        setActiveModelSource(newSource);
      }
    } catch (err) {
      console.warn("Model switch notice:", err);
      setActiveModelSource(newSource);
    }
  };

  const PLAYLIST_123_VOCAB = [
    // Lesson 1: Alphabet
    { sign: "A", hi: "अक्षर A", lesson: 1, lessonTitle: "Alphabet", category: "Alphabet" },
    { sign: "B", hi: "अक्षर B", lesson: 1, lessonTitle: "Alphabet", category: "Alphabet" },
    { sign: "C", hi: "अक्षर C", lesson: 1, lessonTitle: "Alphabet", category: "Alphabet" },
    { sign: "D", hi: "अक्षर D", lesson: 1, lessonTitle: "Alphabet", category: "Alphabet" },
    { sign: "E", hi: "अक्षर E", lesson: 1, lessonTitle: "Alphabet", category: "Alphabet" },
    { sign: "F", hi: "अक्षर F", lesson: 1, lessonTitle: "Alphabet", category: "Alphabet" },
    { sign: "G", hi: "अक्षर G", lesson: 1, lessonTitle: "Alphabet", category: "Alphabet" },
    { sign: "H", hi: "अक्षर H", lesson: 1, lessonTitle: "Alphabet", category: "Alphabet" },
    { sign: "I", hi: "अक्षर I", lesson: 1, lessonTitle: "Alphabet", category: "Alphabet" },
    { sign: "J", hi: "अक्षर J", lesson: 1, lessonTitle: "Alphabet", category: "Alphabet" },
    { sign: "K", hi: "अक्षर K", lesson: 1, lessonTitle: "Alphabet", category: "Alphabet" },
    { sign: "L", hi: "अक्षर L", lesson: 1, lessonTitle: "Alphabet", category: "Alphabet" },
    { sign: "M", hi: "अक्षर M", lesson: 1, lessonTitle: "Alphabet", category: "Alphabet" },
    { sign: "N", hi: "अक्षर N", lesson: 1, lessonTitle: "Alphabet", category: "Alphabet" },
    { sign: "O", hi: "अक्षर O", lesson: 1, lessonTitle: "Alphabet", category: "Alphabet" },
    { sign: "P", hi: "अक्षर P", lesson: 1, lessonTitle: "Alphabet", category: "Alphabet" },
    { sign: "Q", hi: "अक्षर Q", lesson: 1, lessonTitle: "Alphabet", category: "Alphabet" },
    { sign: "R", hi: "अक्षर R", lesson: 1, lessonTitle: "Alphabet", category: "Alphabet" },
    { sign: "S", hi: "अक्षर S", lesson: 1, lessonTitle: "Alphabet", category: "Alphabet" },
    { sign: "T", hi: "अक्षर T", lesson: 1, lessonTitle: "Alphabet", category: "Alphabet" },
    { sign: "U", hi: "अक्षर U", lesson: 1, lessonTitle: "Alphabet", category: "Alphabet" },
    { sign: "V", hi: "अक्षर V", lesson: 1, lessonTitle: "Alphabet", category: "Alphabet" },
    { sign: "W", hi: "अक्षर W", lesson: 1, lessonTitle: "Alphabet", category: "Alphabet" },
    { sign: "X", hi: "अक्षर X", lesson: 1, lessonTitle: "Alphabet", category: "Alphabet" },
    { sign: "Y", hi: "अक्षर Y", lesson: 1, lessonTitle: "Alphabet", category: "Alphabet" },
    { sign: "Z", hi: "अक्षर Z", lesson: 1, lessonTitle: "Alphabet", category: "Alphabet" },
    // Lesson 2: Numbers
    { sign: "0", hi: "संख्या 0", lesson: 2, lessonTitle: "Numbers", category: "Numbers" },
    { sign: "1", hi: "संख्या 1", lesson: 2, lessonTitle: "Numbers", category: "Numbers" },
    { sign: "2", hi: "संख्या 2", lesson: 2, lessonTitle: "Numbers", category: "Numbers" },
    { sign: "3", hi: "संख्या 3", lesson: 2, lessonTitle: "Numbers", category: "Numbers" },
    { sign: "4", hi: "संख्या 4", lesson: 2, lessonTitle: "Numbers", category: "Numbers" },
    { sign: "5", hi: "संख्या 5", lesson: 2, lessonTitle: "Numbers", category: "Numbers" },
    { sign: "6", hi: "संख्या 6", lesson: 2, lessonTitle: "Numbers", category: "Numbers" },
    { sign: "7", hi: "संख्या 7", lesson: 2, lessonTitle: "Numbers", category: "Numbers" },
    { sign: "8", hi: "संख्या 8", lesson: 2, lessonTitle: "Numbers", category: "Numbers" },
    { sign: "9", hi: "संख्या 9", lesson: 2, lessonTitle: "Numbers", category: "Numbers" },
    // Lesson 3: Basic Words 1
    { sign: "HELLO", hi: "नमस्ते / हेलो", lesson: 3, lessonTitle: "Basic Words 1", category: "Greetings" },
    { sign: "NAMASTE", hi: "नमस्ते", lesson: 3, lessonTitle: "Basic Words 1", category: "Greetings" },
    { sign: "THANK_YOU", hi: "धन्यवाद", lesson: 3, lessonTitle: "Basic Words 1", category: "Greetings" },
    { sign: "PLEASE", hi: "कृपया", lesson: 3, lessonTitle: "Basic Words 1", category: "Greetings" },
    { sign: "WELCOME", hi: "स्वागत हे", lesson: 3, lessonTitle: "Basic Words 1", category: "Greetings" },
    { sign: "SORRY", hi: "माफ़ कीजिए", lesson: 3, lessonTitle: "Basic Words 1", category: "Greetings" },
    { sign: "YES", hi: "हाँ", lesson: 3, lessonTitle: "Basic Words 1", category: "Greetings" },
    { sign: "NO", hi: "नहीं", lesson: 3, lessonTitle: "Basic Words 1", category: "Greetings" },
    { sign: "GOOD", hi: "अच्छा", lesson: 3, lessonTitle: "Basic Words 1", category: "Greetings" },
    { sign: "BAD", hi: "बुरा", lesson: 3, lessonTitle: "Basic Words 1", category: "Greetings" },
    // Lesson 4: Basic Words 2
    { sign: "FOOD", hi: "खाना / भोजन", lesson: 4, lessonTitle: "Basic Words 2", category: "Needs" },
    { sign: "WATER", hi: "पानी", lesson: 4, lessonTitle: "Basic Words 2", category: "Needs" },
    { sign: "DRINK", hi: "पीना", lesson: 4, lessonTitle: "Basic Words 2", category: "Needs" },
    { sign: "EAT", hi: "खाना", lesson: 4, lessonTitle: "Basic Words 2", category: "Needs" },
    { sign: "TEA", hi: "चाय", lesson: 4, lessonTitle: "Basic Words 2", category: "Needs" },
    { sign: "MILK", hi: "दूध", lesson: 4, lessonTitle: "Basic Words 2", category: "Needs" },
    { sign: "HOME", hi: "घर", lesson: 4, lessonTitle: "Basic Words 2", category: "Needs" },
    { sign: "BATHROOM", hi: "शौचालय", lesson: 4, lessonTitle: "Basic Words 2", category: "Needs" },
    // Lesson 5: Question Words
    { sign: "WHAT", hi: "क्या?", lesson: 5, lessonTitle: "Questions", category: "Questions" },
    { sign: "WHERE", hi: "कहाँ?", lesson: 5, lessonTitle: "Questions", category: "Questions" },
    { sign: "WHY", hi: "क्यों?", lesson: 5, lessonTitle: "Questions", category: "Questions" },
    { sign: "WHEN", hi: "कब?", lesson: 5, lessonTitle: "Questions", category: "Questions" },
    { sign: "WHO", hi: "कौन?", lesson: 5, lessonTitle: "Questions", category: "Questions" },
    { sign: "HOW", hi: "कैसे?", lesson: 5, lessonTitle: "Questions", category: "Questions" },
    { sign: "HOW_ARE_YOU", hi: "आप कैसे हैं?", lesson: 5, lessonTitle: "Questions", category: "Questions" },
    // Lesson 6: Colours
    { sign: "RED", hi: "लाल", lesson: 6, lessonTitle: "Colours", category: "Colors" },
    { sign: "BLUE", hi: "नीला", lesson: 6, lessonTitle: "Colours", category: "Colors" },
    { sign: "GREEN", hi: "हरा", lesson: 6, lessonTitle: "Colours", category: "Colors" },
    { sign: "YELLOW", hi: "पीला", lesson: 6, lessonTitle: "Colours", category: "Colors" },
    { sign: "BLACK", hi: "काला", lesson: 6, lessonTitle: "Colours", category: "Colors" },
    { sign: "WHITE", hi: "सफ़ेद", lesson: 6, lessonTitle: "Colours", category: "Colors" },
    { sign: "ORANGE", hi: "नारंगी", lesson: 6, lessonTitle: "Colours", category: "Colors" },
    { sign: "PINK", hi: "गुलाबी", lesson: 6, lessonTitle: "Colours", category: "Colors" },
    { sign: "BROWN", hi: "भूरा", lesson: 6, lessonTitle: "Colours", category: "Colors" },
    { sign: "PURPLE", hi: "बैंगनी", lesson: 6, lessonTitle: "Colours", category: "Colors" },
    // Lesson 7: Relations
    { sign: "MOTHER", hi: "माँ", lesson: 7, lessonTitle: "Relations", category: "Family" },
    { sign: "FATHER", hi: "पिताजी", lesson: 7, lessonTitle: "Relations", category: "Family" },
    { sign: "BROTHER", hi: "भाई", lesson: 7, lessonTitle: "Relations", category: "Family" },
    { sign: "SISTER", hi: "बहन", lesson: 7, lessonTitle: "Relations", category: "Family" },
    { sign: "FRIEND", hi: "दोस्त", lesson: 7, lessonTitle: "Relations", category: "Family" },
    { sign: "FAMILY", hi: "परिवार", lesson: 7, lessonTitle: "Relations", category: "Family" },
    { sign: "SON", hi: "बेटा", lesson: 7, lessonTitle: "Relations", category: "Family" },
    { sign: "DAUGHTER", hi: "बेटी", lesson: 7, lessonTitle: "Relations", category: "Family" },
    { sign: "BABY", hi: "शिशु", lesson: 7, lessonTitle: "Relations", category: "Family" },
    { sign: "GRANDPARENTS", hi: "दादा-दादी", lesson: 7, lessonTitle: "Relations", category: "Family" },
    // Lesson 8: Days of the Week
    { sign: "MONDAY", hi: "सोमवार", lesson: 8, lessonTitle: "Days", category: "Time" },
    { sign: "TUESDAY", hi: "मंगलवार", lesson: 8, lessonTitle: "Days", category: "Time" },
    { sign: "WEDNESDAY", hi: "बुधवार", lesson: 8, lessonTitle: "Days", category: "Time" },
    { sign: "THURSDAY", hi: "गुरुवार", lesson: 8, lessonTitle: "Days", category: "Time" },
    { sign: "FRIDAY", hi: "शुक्रवार", lesson: 8, lessonTitle: "Days", category: "Time" },
    { sign: "SATURDAY", hi: "शनिवार", lesson: 8, lessonTitle: "Days", category: "Time" },
    { sign: "SUNDAY", hi: "रविवार", lesson: 8, lessonTitle: "Days", category: "Time" },
    { sign: "TODAY", hi: "आज", lesson: 8, lessonTitle: "Days", category: "Time" },
    { sign: "TOMORROW", hi: "कल", lesson: 8, lessonTitle: "Days", category: "Time" },
    { sign: "YESTERDAY", hi: "कल (बीता)", lesson: 8, lessonTitle: "Days", category: "Time" },
    // Lesson 9: Months
    { sign: "JANUARY", hi: "जनवरी", lesson: 9, lessonTitle: "Months", category: "Time" },
    { sign: "FEBRUARY", hi: "फ़रवरी", lesson: 9, lessonTitle: "Months", category: "Time" },
    { sign: "MARCH", hi: "मार्च", lesson: 9, lessonTitle: "Months", category: "Time" },
    { sign: "APRIL", hi: "अप्रैल", lesson: 9, lessonTitle: "Months", category: "Time" },
    { sign: "MAY", hi: "मई", lesson: 9, lessonTitle: "Months", category: "Time" },
    { sign: "JUNE", hi: "जून", lesson: 9, lessonTitle: "Months", category: "Time" },
    { sign: "JULY", hi: "जुलाई", lesson: 9, lessonTitle: "Months", category: "Time" },
    { sign: "AUGUST", hi: "अगस्त", lesson: 9, lessonTitle: "Months", category: "Time" },
    { sign: "SEPTEMBER", hi: "सितंबर", lesson: 9, lessonTitle: "Months", category: "Time" },
    { sign: "OCTOBER", hi: "अक्टूबर", lesson: 9, lessonTitle: "Months", category: "Time" },
    { sign: "NOVEMBER", hi: "नवंबर", lesson: 9, lessonTitle: "Months", category: "Time" },
    { sign: "DECEMBER", hi: "दिसंबर", lesson: 9, lessonTitle: "Months", category: "Time" },
    // Lesson 10: Basic Words 3 (Actions)
    { sign: "WORK", hi: "काम", lesson: 10, lessonTitle: "Actions", category: "Actions" },
    { sign: "STUDY", hi: "पढ़ाई", lesson: 10, lessonTitle: "Actions", category: "Actions" },
    { sign: "SCHOOL", hi: "स्कूल", lesson: 10, lessonTitle: "Actions", category: "Actions" },
    { sign: "COLLEGE", hi: "कॉलेज", lesson: 10, lessonTitle: "Actions", category: "Actions" },
    { sign: "HELP", hi: "मदद", lesson: 10, lessonTitle: "Actions", category: "Actions" },
    { sign: "STOP", hi: "रुकिए", lesson: 10, lessonTitle: "Actions", category: "Actions" },
    { sign: "LOVE", hi: "प्यार", lesson: 10, lessonTitle: "Actions", category: "Actions" },
    { sign: "HAPPY", hi: "खुश", lesson: 10, lessonTitle: "Actions", category: "Actions" },
    { sign: "SAD", hi: "उदास", lesson: 10, lessonTitle: "Actions", category: "Actions" },
    { sign: "LIKE", hi: "पसंद", lesson: 10, lessonTitle: "Actions", category: "Actions" },
    { sign: "WANT", hi: "चाहना", lesson: 10, lessonTitle: "Actions", category: "Actions" },
    { sign: "NEED", hi: "ज़रूरी", lesson: 10, lessonTitle: "Actions", category: "Actions" },
    // Lesson 11: Standard Signs
    { sign: "TEACH", hi: "सिखाना", lesson: 11, lessonTitle: "Standards", category: "Standards" },
    { sign: "LEARN", hi: "सीखना", lesson: 11, lessonTitle: "Standards", category: "Standards" },
    { sign: "SIGN", hi: "सांकेतिक भाषा", lesson: 11, lessonTitle: "Standards", category: "Standards" },
    { sign: "UNDERSTAND", hi: "समझना", lesson: 11, lessonTitle: "Standards", category: "Standards" },
    { sign: "RIGHT", hi: "सही", lesson: 11, lessonTitle: "Standards", category: "Standards" },
    { sign: "WRONG", hi: "गलत", lesson: 11, lessonTitle: "Standards", category: "Standards" },
    { sign: "BEAUTIFUL", hi: "सुंदर", lesson: 11, lessonTitle: "Standards", category: "Standards" },
    { sign: "DEAF", hi: "बधिर", lesson: 11, lessonTitle: "Standards", category: "Standards" },
  ];

  const INCLUDE_50_VOCAB = [
    { sign: "BANK", hi: "बैंक" },
    { sign: "BIG/LARGE", hi: "बड़ा" },
    { sign: "BIRD", hi: "चिड़िया" },
    { sign: "BLACK", hi: "काला" },
    { sign: "BOY", hi: "लड़का" },
    { sign: "BROTHER", hi: "भाई" },
    { sign: "CAR", hi: "कार" },
    { sign: "CELLPHONE", hi: "मोबाइल" },
    { sign: "COURT", hi: "अदालत" },
    { sign: "COW", hi: "गाय" },
    { sign: "DEATH", hi: "मृत्यु" },
    { sign: "DOG", hi: "कुत्ता" },
    { sign: "DRY", hi: "सूखा" },
    { sign: "ELECTION", hi: "चुनाव" },
    { sign: "FALL", hi: "गिरना" },
    { sign: "FAN", hi: "पंखा" },
    { sign: "FATHER", hi: "पिताजी" },
    { sign: "GIRL", hi: "लड़की" },
    { sign: "GOOD", hi: "अच्छा" },
    { sign: "GOOD MORNING", hi: "शुभ प्रभात" },
    { sign: "HAPPY", hi: "खुश" },
    { sign: "HAT", hi: "टोपी" },
    { sign: "HELLO", hi: "नमस्ते" },
    { sign: "HOT", hi: "गर्म" },
    { sign: "HOUSE", hi: "घर" },
    { sign: "I / MYSELF", hi: "मैं" },
    { sign: "IT", hi: "यह" },
    { sign: "LONG", hi: "लंबा" },
    { sign: "LOUD", hi: "तेज़ आवाज़" },
    { sign: "MONDAY", hi: "सोमवार" },
    { sign: "NEW", hi: "नया" },
    { sign: "PAINT", hi: "रंग" },
    { sign: "PEN", hi: "कलम" },
    { sign: "PRIEST", hi: "पुजारी" },
    { sign: "QUIET", hi: "शांत" },
    { sign: "RED", hi: "लाल" },
    { sign: "SHOES", hi: "जूते" },
    { sign: "SHORT", hi: "छोटा" },
    { sign: "SMALL/LITTLE", hi: "छोटा" },
    { sign: "STORE/SHOP", hi: "दुकान" },
    { sign: "SUMMER", hi: "गर्मी" },
    { sign: "TEACHER", hi: "अध्यापक" },
    { sign: "THANK YOU", hi: "धन्यवाद" },
    { sign: "TIME", hi: "समय" },
    { sign: "TRAIN TICKET", hi: "रेल टिकट" },
    { sign: "T-SHIRT", hi: "टी-शर्ट" },
    { sign: "WHITE", hi: "सफ़ेद" },
    { sign: "WINDOW", hi: "खिड़की" },
    { sign: "YEAR", hi: "साल" },
    { sign: "YOU (PLURAL)", hi: "आप सब" },
    { sign: "SAD", hi: "उदास / दुखी" },
    { sign: "BEAUTIFUL", hi: "सुंदर" },
    { sign: "UGLY", hi: "कुरूप" },
    { sign: "DEAF", hi: "बधिर" },
    { sign: "BLIND", hi: "दृष्टिहीन" },
  ];

  const lastAddedSignRef = useRef<string | null>(null);
  const signHoldCountRef = useRef<number>(0);
  const liveLandmarksRef = useRef<any[] | null>(null);

  const LANGUAGES = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi (हिन्दी)" },
    { code: "bho", name: "Bhojpuri (भोजपुरी)" },
    { code: "mr", name: "Marathi (मराठी)" },
    { code: "bn", name: "Bengali (বাংলা)" },
    { code: "gu", name: "Gujarati (ગુજરાતી)" },
    { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)" },
    { code: "ta", name: "Tamil (தமிழ்)" },
    { code: "te", name: "Telugu (తెలుగు)" },
    { code: "ml", name: "Malayalam (മലയാളം)" },
    { code: "kn", name: "Kannada (ಕನ್ನಡ)" },
    { code: "or", name: "Odia (ଓଡ଼ିଆ)" },
    { code: "as", name: "Assamese (অসমীয়া)" },
    { code: "ur", name: "Urdu (اردو)" },
    { code: "sa", name: "Sanskrit (संस्कृतम्)" },
  ];

  // -------------------------------------------------------------
  // Text to Speech (TTS)
  // -------------------------------------------------------------
  const speakText = useCallback((textToSpeak: string, langCode = "en") => {
    if (!window.speechSynthesis || !textToSpeak) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;

      const langMap: Record<string, string> = {
        en: "en-IN",
        hi: "hi-IN",
        bho: "hi-IN",
        mr: "mr-IN",
        bn: "bn-IN",
        gu: "gu-IN",
        pa: "pa-IN",
        ta: "ta-IN",
        te: "te-IN",
        ml: "ml-IN",
        kn: "kn-IN",
        ur: "ur-IN",
        sa: "hi-IN",
      };
      utterance.lang = langMap[langCode] || "en-IN";

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
      setIsSpeaking(false);
    }
  }, []);

  // -------------------------------------------------------------
  // Draw Live Skeleton ON TOP OF THE USER'S ACTUAL HAND
  // -------------------------------------------------------------
  const drawOverlay = useCallback(() => {
    const video = videoRef.current;
    const overlay = overlayCanvasRef.current;
    if (!video || !overlay || !cameraOn) return;

    const ctx = overlay.getContext("2d");
    if (!ctx) return;

    overlay.width = video.videoWidth || 640;
    overlay.height = video.videoHeight || 480;

    ctx.clearRect(0, 0, overlay.width, overlay.height);

    if (detecting) {
      const w = overlay.width;
      const h = overlay.height;
      const time = performance.now() * 0.003;

      // Draw bounding guide box
      const boxX = w * 0.2;
      const boxY = h * 0.1;
      const boxW = w * 0.6;
      const boxH = h * 0.8;

      ctx.strokeStyle = "rgba(59, 130, 246, 0.5)";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.strokeRect(boxX, boxY, boxW, boxH);
      ctx.setLineDash([]);

      // Draw active scanner laser line
      const scanY = boxY + ((Math.sin(time * 2.5) + 1) / 2) * boxH;
      const grad = ctx.createLinearGradient(boxX, scanY, boxX + boxW, scanY);
      grad.addColorStop(0, "rgba(59, 130, 246, 0)");
      grad.addColorStop(0.5, "rgba(96, 165, 250, 0.85)");
      grad.addColorStop(1, "rgba(59, 130, 246, 0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(boxX, scanY);
      ctx.lineTo(boxX + boxW, scanY);
      ctx.stroke();

      // If MediaPipe hand landmarks are detected, draw directly over actual hand
      const landmarks = liveLandmarksRef.current;
      if (landmarks && landmarks.length >= 21) {
        // MediaPipe connections for hand skeleton
        const HAND_CONNECTIONS = [
          [0,1],[1,2],[2,3],[3,4], // Thumb
          [0,5],[5,6],[6,7],[7,8], // Index
          [5,9],[9,10],[10,11],[11,12], // Middle
          [9,13],[13,14],[14,15],[15,16], // Ring
          [13,17],[17,18],[18,19],[19,20],[0,17] // Pinky & Palm
        ];

        // Draw bone connection lines
        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 3;
        HAND_CONNECTIONS.forEach(([i, j]) => {
          const p1 = landmarks[i];
          const p2 = landmarks[j];
          if (p1 && p2) {
            ctx.beginPath();
            ctx.moveTo(p1.x * w, p1.y * h);
            ctx.lineTo(p2.x * w, p2.y * h);
            ctx.stroke();
          }
        });

        // Draw 21 landmark nodes
        landmarks.forEach((pt: any, idx: number) => {
          const px = pt.x * w;
          const py = pt.y * h;
          ctx.fillStyle = idx === 0 ? "#3b82f6" : idx % 4 === 0 ? "#ef4444" : "#22c55e";
          ctx.beginPath();
          ctx.arc(px, py, idx % 4 === 0 ? 6 : 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
      }
    }

    animFrameRef.current = requestAnimationFrame(drawOverlay);
  }, [cameraOn, detecting]);

  useEffect(() => {
    if (cameraOn) {
      animFrameRef.current = requestAnimationFrame(drawOverlay);
    }
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [cameraOn, drawOverlay]);

  // -------------------------------------------------------------
  // Initialize MediaPipe Hands client-side if available
  // -------------------------------------------------------------
  useEffect(() => {
    if ((window as any).Hands) {
      try {
        const hands = new (window as any).Hands({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });
        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        hands.onResults((results: any) => {
          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            liveLandmarksRef.current = results.multiHandLandmarks[0];
          } else {
            liveLandmarksRef.current = null;
          }
        });

        mediaPipeHandsRef.current = hands;
      } catch (e) {
        console.warn("MediaPipe Hands setup note:", e);
      }
    }
  }, []);

  // -------------------------------------------------------------
  // Stop Detection & Camera
  // -------------------------------------------------------------
  const stopDetection = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    sendingFrameRef.current = false;
    liveLandmarksRef.current = null;
    setDetecting(false);
  };

  const stopCamera = () => {
    stopDetection();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
    setTranslatedText("Camera stopped");
    setErrorMessage("");
    setConfidence(0);
    setDetectedSign(null);
    setAlternatives([]);
  };

  // -------------------------------------------------------------
  // Start Camera
  // -------------------------------------------------------------
  const startCamera = async () => {
    try {
      setErrorMessage("");
      setConfidence(0);
      setTranslatedText("Requesting camera access...");

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) throw new Error("Video element not found");

      video.srcObject = stream;

      await new Promise<void>((resolve) => {
        if (video.readyState >= 1) {
          resolve();
        } else {
          video.onloadedmetadata = () => resolve();
        }
      });

      await video.play();
      setCameraOn(true);
      setTranslatedText("Camera ready. Click 'Start Detection' to begin recognizing gestures.");
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraOn(false);
      setTranslatedText("Camera unavailable");
      setErrorMessage(err?.message || "Unable to start camera. Please verify permissions.");
    }
  };

  // -------------------------------------------------------------
  // Process Recognition Results
  // -------------------------------------------------------------
  const [signDialect, setSignDialect] = useState("ISL");
  const [autoVoiceOutput, setAutoVoiceOutput] = useState(true);

  // Play audio speech data URL from backend or Web Speech API
  const playAudioOutput = useCallback((textToSpeak: string, audioDataUrl?: string) => {
    if (audioDataUrl) {
      try {
        const audio = new Audio(audioDataUrl);
        audio.play().catch(() => {
          speakText(textToSpeak, targetLanguage);
        });
        return;
      } catch {}
    }
    speakText(textToSpeak, targetLanguage);
  }, [speakText, targetLanguage]);

  const handleRecognitionData = useCallback((data: any) => {
    if (data && data.success && data.sign) {
      const sign = data.sign;
      const text = data.text || sign;
      const conf = Math.round((data.confidence || 0.92) * 100);

      setDetectedSign(sign);
      setTranslatedText(text);
      setConfidence(conf);
      setAlternatives(data.alternatives || []);
      setDetectedLesson(data.lesson ?? null);
      setDetectedLessonTitle(data.lesson_title ?? null);

      if (sign === lastAddedSignRef.current) {
        signHoldCountRef.current += 1;
      } else {
        lastAddedSignRef.current = sign;
        signHoldCountRef.current = 1;
      }

      if (signHoldCountRef.current === 2) {
        setSentence((prev) => {
          if (prev[prev.length - 1] !== text) {
            const updated = [...prev, text];
            if (autoVoiceOutput) {
              playAudioOutput(text, data.audio);
            }
            return updated;
          }
          return prev;
        });
      }
    } else {
      setDetectedSign(null);
      setConfidence(0);
      setAlternatives([]);
      setDetectedLesson(null);
      setDetectedLessonTitle(null);
      setTranslatedText(data?.text || data?.message || "Place hand inside camera frame");
    }
  }, [playAudioOutput, targetLanguage, autoVoiceOutput]);

  // -------------------------------------------------------------
  // Capture Frame & Send to Recognition Engine
  // -------------------------------------------------------------
  const captureAndSendFrame = async () => {
    if (sendingFrameRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2 || video.videoWidth === 0) return;

    // Send frame to MediaPipe client-side tracking if enabled
    if (mediaPipeHandsRef.current) {
      try {
        await mediaPipeHandsRef.current.send({ image: video });
      } catch {}
    }

    sendingFrameRef.current = true;

    try {
      // 1. If MediaPipe landmarks are available, send high-precision landmarks
      const landmarks = liveLandmarksRef.current;
      if (landmarks && landmarks.length >= 21) {
        const res = await axios.post(`${API}/sign/recognize-landmarks`, {
          landmarks: landmarks,
          target_language: targetLanguage,
          sign_language: signDialect,
        });
        handleRecognitionData(res.data);
        return;
      }

      // 2. Otherwise send camera frame JPEG to backend computer vision endpoint
      const context = canvas.getContext("2d");
      if (!context) return;

      const width = 480;
      const height = Math.round((video.videoHeight / video.videoWidth) * width) || 360;
      canvas.width = width;
      canvas.height = height;

      context.drawImage(video, 0, 0, width, height);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), "image/jpeg", 0.8);
      });

      if (!blob) return;

      const formData = new FormData();
      formData.append("image", new File([blob], "camera_frame.jpg", { type: "image/jpeg" }));
      formData.append("target_language", targetLanguage);
      formData.append("sign_language", signDialect);

      const response = await axios.post(`${API}/sign/recognize`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 8000,
      });

      handleRecognitionData(response.data);
    } catch (err) {
      console.warn("Frame recognition notice:", err);
    } finally {
      sendingFrameRef.current = false;
    }
  };

  // -------------------------------------------------------------
  // Start Gesture Detection Loop
  // -------------------------------------------------------------
  const startDetection = () => {
    if (!cameraOn) {
      alert("Please start the camera first.");
      return;
    }
    setDetecting(true);
    setTranslatedText("Scanning camera for sign language gestures...");
    captureAndSendFrame();

    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(() => {
      captureAndSendFrame();
    }, 700);
  };

  const copySentence = () => {
    if (sentence.length === 0) return;
    navigator.clipboard.writeText(sentence.join(" "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearSentence = () => {
    setSentence([]);
    setDetectedSign(null);
    setConfidence(0);
    lastAddedSignRef.current = null;
    signHoldCountRef.current = 0;
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <span>📷</span>
            <span>Camera Sign Recognition Studio</span>
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Real-time hand landmark tracking & gesture classification to English & 14+ Indian Languages
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Sign Language Dialect Selector */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs text-purple-400 font-bold">Sign Dialect:</span>
            <select
              value={signDialect}
              onChange={(e) => setSignDialect(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              <option value="ISL" className="bg-slate-900 text-white">ISL (Indian Sign Language)</option>
              <option value="ASL" className="bg-slate-900 text-white">ASL (American Sign Language)</option>
              <option value="BSL" className="bg-slate-900 text-white">BSL (British Sign Language)</option>
              <option value="Auslan" className="bg-slate-900 text-white">Auslan (Australian Sign Language)</option>
              <option value="LSF" className="bg-slate-900 text-white">LSF (French Sign Language)</option>
              <option value="DGS" className="bg-slate-900 text-white">DGS (German Sign Language)</option>
              <option value="JSL" className="bg-slate-900 text-white">JSL (Japanese Sign Language)</option>
              <option value="KSL" className="bg-slate-900 text-white">KSL (Korean Sign Language)</option>
              <option value="CSL" className="bg-slate-900 text-white">CSL (Chinese Sign Language)</option>
              <option value="INT" className="bg-slate-900 text-white">INT (International Sign / Gestuno)</option>
              <option value="Libras" className="bg-slate-900 text-white">Libras (Brazilian Sign Language)</option>
              <option value="LSFB" className="bg-slate-900 text-white">LSFB (Belgian French Sign Language)</option>
              <option value="LSM" className="bg-slate-900 text-white">LSM (Mexican Sign Language)</option>
              <option value="LSE" className="bg-slate-900 text-white">LSE (Spanish Sign Language)</option>
              <option value="LIS" className="bg-slate-900 text-white">LIS (Italian Sign Language)</option>
              <option value="NGT" className="bg-slate-900 text-white">NGT (Dutch Sign Language)</option>
              <option value="PJM" className="bg-slate-900 text-white">PJM (Polish Sign Language)</option>
              <option value="RSL" className="bg-slate-900 text-white">RSL (Russian Sign Language)</option>
              <option value="SASL" className="bg-slate-900 text-white">SASL (South African Sign Language)</option>
              <option value="ISL_IL" className="bg-slate-900 text-white">ISL (Israeli Sign Language)</option>
              <option value="TSL" className="bg-slate-900 text-white">TSL (Taiwanese Sign Language)</option>
              <option value="FSL" className="bg-slate-900 text-white">FSL (Filipino Sign Language)</option>
              <option value="NZSL" className="bg-slate-900 text-white">NZSL (New Zealand Sign Language)</option>
              <option value="HKSL" className="bg-slate-900 text-white">HKSL (Hong Kong Sign Language)</option>
              <option value="VGT" className="bg-slate-900 text-white">VGT (Flemish Sign Language)</option>
              <option value="MSL" className="bg-slate-900 text-white">MSL (Malaysian Sign Language)</option>
              <option value="ÖGS" className="bg-slate-900 text-white">ÖGS (Austrian Sign Language)</option>
              <option value="ČSJ" className="bg-slate-900 text-white">ČSJ (Czech Sign Language)</option>
              <option value="DSL" className="bg-slate-900 text-white">DSL (Danish Sign Language)</option>
              <option value="ETH" className="bg-slate-900 text-white">ETH (Ethiopian Sign Language)</option>
              <option value="FSD" className="bg-slate-900 text-white">FSD (Finnish Sign Language)</option>
              <option value="GSL" className="bg-slate-900 text-white">GSL (Greek Sign Language)</option>
              <option value="MHJ" className="bg-slate-900 text-white">MHJ (Hungarian Sign Language)</option>
              <option value="İSL" className="bg-slate-900 text-white">İSL (Icelandic Sign Language)</option>
              <option value="ISL_IR" className="bg-slate-900 text-white">ISL (Irish Sign Language)</option>
              <option value="LIU" className="bg-slate-900 text-white">LIU (Jordanian Sign Language)</option>
              <option value="KSL_KE" className="bg-slate-900 text-white">KSL (Kenyan Sign Language)</option>
              <option value="LGK" className="bg-slate-900 text-white">LGK (Lithuanian Sign Language)</option>
              <option value="MSL_MY" className="bg-slate-900 text-white">MSL (Myanmar Sign Language)</option>
              <option value="NSL" className="bg-slate-900 text-white">NSL (Norwegian Sign Language)</option>
              <option value="LGP" className="bg-slate-900 text-white">LGP (Portuguese Sign Language)</option>
              <option value="LSR" className="bg-slate-900 text-white">LSR (Romanian Sign Language)</option>
              <option value="SSL" className="bg-slate-900 text-white">SSL (Swedish Sign Language)</option>
              <option value="TSL_TH" className="bg-slate-900 text-white">TSL (Thai Sign Language)</option>
              <option value="TİD" className="bg-slate-900 text-white">TİD (Turkish Sign Language)</option>
              <option value="USL" className="bg-slate-900 text-white">USL (Ukrainian Sign Language)</option>
              <option value="VSL" className="bg-slate-900 text-white">VSL (Vietnamese Sign Language)</option>
              <option value="ASL_AR" className="bg-slate-900 text-white">Argentine Sign Language</option>
              <option value="ASL_CL" className="bg-slate-900 text-white">Chilean Sign Language</option>
              <option value="ASL_CO" className="bg-slate-900 text-white">Colombian Sign Language</option>
              <option value="ASL_PE" className="bg-slate-900 text-white">Peruvian Sign Language</option>
              <option value="ASL_VE" className="bg-slate-900 text-white">Venezuelan Sign Language</option>
              <option value="ISL_IN" className="bg-slate-900 text-white">Indonesian Sign Language (BISINDO)</option>
              <option value="NSL_NE" className="bg-slate-900 text-white">Nepalese Sign Language</option>
              <option value="SSL_SL" className="bg-slate-900 text-white">Sri Lankan Sign Language</option>
              <option value="BD_SL" className="bg-slate-900 text-white">Bengali Sign Language (BD-SL)</option>
              <option value="PK_SL" className="bg-slate-900 text-white">Pakistani Sign Language (PSL)</option>
              <option value="EGY_SL" className="bg-slate-900 text-white">Egyptian Sign Language</option>
              <option value="SA_SL" className="bg-slate-900 text-white">Saudi Sign Language</option>
              <option value="AE_SL" className="bg-slate-900 text-white">UAE Sign Language</option>
            </select>
          </div>

          {/* Target Translation Regional Language Selector */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <Languages size={15} className="text-blue-400" />
            <span className="text-xs text-slate-400">Comfortable Language:</span>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Active AI Model Selector */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <Sparkles size={13} />
              <span>Model:</span>
            </span>
            <select
              value={activeModelSource}
              onChange={(e) => handleSwitchModel(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              <option value="playlist" className="bg-slate-900 text-white font-semibold">
                🎓 ISL 101 Playlist Model (123 Signs • 99.7% Acc)
              </option>
              <option value="include50" className="bg-slate-900 text-white font-semibold">
                🏛️ AI4Bharat INCLUDE (50 Signs)
              </option>
            </select>
          </div>

          {/* Model Vocabulary Library Drawer Toggle */}
          <button
            onClick={() => setShowVocabList((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
              showVocabList
                ? "bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30"
                : "bg-indigo-950/70 border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/60"
            }`}
            title="View Trained Sign Classes"
          >
            <BookOpen size={14} className="text-indigo-400" />
            <span>
              {activeModelSource === "playlist" ? "Curriculum (123 Signs)" : "INCLUDE (50 Signs)"}
            </span>
            <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-1.5 py-0.2 rounded font-extrabold">
              {showVocabList ? "Hide" : "View"}
            </span>
          </button>
        </div>
      </div>

      {/* Expandable Vocabulary Library (Playlist 123 vs INCLUDE 50) */}
      {showVocabList && (
        <div className="rounded-2xl border border-indigo-500/30 bg-slate-950 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-400" />
              <h4 className="text-sm font-bold text-white">
                {activeModelSource === "playlist"
                  ? "Indian Sign Language 101 — YouTube Playlist Curriculum"
                  : "AI4Bharat INCLUDE-50 Supported Signs & Gestures"}
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-300 font-semibold bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {activeModelSource === "playlist"
                  ? "123 Classes • 13 Lessons • 99.73% Accuracy (Bi-LSTM / 1D-CNN)"
                  : "50 Classes • Official AI4Bharat Pretrained Weights"}
              </span>
            </div>
          </div>

          {activeModelSource === "playlist" ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-purple-950/40 border border-purple-500/20 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-purple-300 font-bold">
                    YouTube Playlist: Indian Sign Language 101 (PLxYMaKXKMMcMgg4f47WkG7AM0bb3AyjTi)
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300">
                    Neural model trained across all 13 lessons with 134-D temporal kinematic trajectories
                  </span>
                </div>
                <span className="text-[11px] text-purple-300 font-mono">
                  123 Trained Classes
                </span>
              </div>

              {/* Lesson Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-800 pb-2">
                <button
                  onClick={() => setSelectedLessonFilter("all")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    selectedLessonFilter === "all"
                      ? "bg-purple-600 text-white"
                      : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  All (123)
                </button>
                {[
                  { num: 1, label: "L1: Alphabet (26)" },
                  { num: 2, label: "L2: Numbers (10)" },
                  { num: 3, label: "L3: Basics 1 (10)" },
                  { num: 4, label: "L4: Basics 2 (8)" },
                  { num: 5, label: "L5: Questions (7)" },
                  { num: 6, label: "L6: Colours (10)" },
                  { num: 7, label: "L7: Relations (10)" },
                  { num: 8, label: "L8: Days (10)" },
                  { num: 9, label: "L9: Months (12)" },
                  { num: 10, label: "L10: Actions (12)" },
                  { num: 11, label: "L11: Standards (8)" },
                ].map((l) => (
                  <button
                    key={l.num}
                    onClick={() => setSelectedLessonFilter(l.num)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition ${
                      selectedLessonFilter === l.num
                        ? "bg-purple-600 text-white"
                        : "bg-slate-900 text-slate-400 hover:text-white"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              {/* Signs List */}
              <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1">
                {PLAYLIST_123_VOCAB.filter(
                  (item) =>
                    selectedLessonFilter === "all" || item.lesson === selectedLessonFilter
                ).map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200 flex items-center gap-1.5 hover:border-purple-500/50 hover:text-white transition"
                  >
                    <span className="text-purple-400 font-bold">{item.sign}</span>
                    <span className="text-[10px] text-slate-400">({item.hi})</span>
                    <span className="text-[9px] bg-slate-800 text-slate-500 px-1 rounded">
                      L{item.lesson}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Perform any of the following signs in front of your camera. The model predicts the ISL sign and automatically translates it to your selected regional language with spoken audio:
              </p>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                {INCLUDE_50_VOCAB.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200 flex items-center gap-1.5 hover:border-indigo-500/50 hover:text-white transition"
                  >
                    <span className="text-indigo-400 font-bold">{item.sign}</span>
                    <span className="text-[10px] text-slate-400">({item.hi})</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Video Stream + Skeleton Overlay Container */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-black aspect-video flex items-center justify-center">
        <video
          ref={videoRef}
          playsInline
          muted
          className={`h-full w-full object-cover transform -scale-x-100 ${
            cameraOn ? "block" : "hidden"
          }`}
        />

        <canvas
          ref={overlayCanvasRef}
          className={`absolute inset-0 h-full w-full object-cover transform -scale-x-100 pointer-events-none ${
            cameraOn ? "block" : "hidden"
          }`}
        />

        {/* Camera Off Placeholder */}
        {!cameraOn && (
          <div className="text-center p-6">
            <Video size={48} className="mx-auto text-slate-600 mb-3" />
            <p className="text-sm font-semibold text-slate-300">Camera is currently turned off</p>
            <p className="text-xs text-slate-500 mt-1">
              Click 'Start Camera' below to launch real-time ISL recognition.
            </p>
          </div>
        )}

        {/* Live Status Badge */}
        {cameraOn && (
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-lg ${
                detecting
                  ? "bg-green-500 text-slate-950 animate-pulse"
                  : "bg-blue-600 text-white"
              }`}
            >
              <ScanLine size={13} />
              {detecting ? "Live Vision Tracking" : "Camera Standby"}
            </span>
          </div>
        )}
      </div>

      {/* Error Message Banner */}
      {errorMessage && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-300">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-wrap gap-3">
        {!cameraOn ? (
          <button
            onClick={startCamera}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-3 font-bold text-xs transition text-white shadow-lg shadow-blue-600/20"
          >
            <Camera size={16} />
            Start Camera
          </button>
        ) : !detecting ? (
          <button
            onClick={startDetection}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-500 px-5 py-3 font-bold text-xs transition text-white shadow-lg shadow-green-600/20"
          >
            <ScanLine size={16} />
            Start Detection
          </button>
        ) : (
          <button
            onClick={stopDetection}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-yellow-600 hover:bg-yellow-500 px-5 py-3 font-bold text-xs transition text-white shadow-lg shadow-yellow-600/20"
          >
            <Square size={16} />
            Pause Detection
          </button>
        )}

        {cameraOn && (
          <button
            onClick={stopCamera}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 px-5 py-3 font-bold text-xs transition text-white shadow-lg shadow-red-600/20"
          >
            <Square size={16} />
            Stop Camera
          </button>
        )}
      </div>

      {/* Recognized Gesture Output Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Recognition Output:</span>
            {detectedLesson !== null && (
              <span className="text-[11px] font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-500/40 flex items-center gap-1">
                <span>📚</span> Lesson {detectedLesson}: {detectedLessonTitle}
              </span>
            )}
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
              {activeModelSource === "playlist" ? "ISL 101 Playlist Model" : "AI4Bharat INCLUDE-50"}
            </span>
          </div>
          {confidence > 0 && (
            <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
              Confidence: {confidence}%
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="text-2xl font-black text-white flex items-center gap-2">
              <span>{translatedText || "Perform sign in front of camera..."}</span>
              {detectedSign && (
                <button
                  onClick={() => speakText(translatedText, targetLanguage)}
                  className={`p-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition ${
                    isSpeaking ? "animate-pulse text-green-400" : ""
                  }`}
                  title="Listen Pronunciation"
                >
                  <Volume2 size={18} />
                </button>
              )}
            </div>
            {detectedSign && (
              <p className="text-xs font-medium text-slate-400 mt-1">
                Indian Sign: <span className="text-blue-400 font-bold">{detectedSign}</span>
              </p>
            )}
          </div>
        </div>

        {/* Alternative Predictions */}
        {alternatives.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-500 font-semibold">
              Alternative Candidates:
            </span>
            <div className="flex flex-wrap gap-2">
              {alternatives.map((alt, i) => (
                <span
                  key={i}
                  className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg"
                >
                  {alt.sign} ({Math.round(alt.confidence * 100)}%)
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Live Sentence Builder */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <span>📝</span> Constructed Sentence Output:
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoVoiceOutput((prev) => !prev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                autoVoiceOutput
                  ? "bg-green-600/20 text-green-400 border border-green-500/40"
                  : "bg-slate-900 text-slate-400 border border-slate-800"
              }`}
              title="Toggle Auto Spoken Voice Output"
            >
              <Volume2 size={14} />
              <span>{autoVoiceOutput ? "Auto Spoken Voice ON" : "Auto Spoken Voice OFF"}</span>
            </button>
            <button
              onClick={copySentence}
              disabled={sentence.length === 0}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white disabled:opacity-40 transition"
            >
              {copied ? <CheckCircle2 size={13} className="text-green-400" /> : <Copy size={13} />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>

            <button
              onClick={clearSentence}
              disabled={sentence.length === 0}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 disabled:opacity-40 transition"
            >
              <Trash2 size={13} />
              <span>Clear</span>
            </button>
          </div>
        </div>

        <div className="min-h-[42px] rounded-xl bg-slate-900 border border-slate-800 p-3 flex flex-wrap items-center gap-2">
          {sentence.length > 0 ? (
            sentence.map((w, idx) => (
              <span
                key={idx}
                className="bg-blue-600/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-lg text-xs font-bold shadow"
              >
                {w}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500 italic">
              Recognized signs will automatically construct full sentences here...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}