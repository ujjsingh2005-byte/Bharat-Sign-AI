export interface PlaylistItem {
  id: string; // YouTube Video ID
  index: number; // 0-based playlist index
  lessonNumber: number;
  title: string;
  duration: string;
  durationSeconds: number;
  description: string;
  topics: string[];
  thumbnailUrl: string;
  relatedCategory?: string;
  trainedSigns?: string[];
}

export interface PlaylistMetadata {
  id: string;
  title: string;
  creator: string;
  totalVideos: number;
  totalDurationText: string;
  playlistUrl: string;
  defaultEmbedUrl: string;
  description: string;
  modelAccuracy: string;
  totalTrainedSigns: number;
}

export const YOUTUBE_PLAYLIST_ID = "PLxYMaKXKMMcMgg4f47WkG7AM0bb3AyjTi";
export const YOUTUBE_PLAYLIST_URL = `https://www.youtube.com/playlist?list=${YOUTUBE_PLAYLIST_ID}`;
export const YOUTUBE_PLAYLIST_DEFAULT_EMBED_URL = `https://www.youtube.com/embed/videoseries?list=${YOUTUBE_PLAYLIST_ID}`;

export const SIGN_LANGUAGE_PLAYLIST_METADATA: PlaylistMetadata = {
  id: YOUTUBE_PLAYLIST_ID,
  title: "Indian Sign Language 101",
  creator: "Learn with Pragya",
  totalVideos: 13,
  totalDurationText: "77 mins",
  playlistUrl: YOUTUBE_PLAYLIST_URL,
  defaultEmbedUrl: YOUTUBE_PLAYLIST_DEFAULT_EMBED_URL,
  description:
    "A structured, step-by-step master course covering foundational Indian Sign Language (ISL), including the manual alphabet, numbers, essential everyday vocabulary, question formations, colors, relations, calendar signs, and standardized ISLRTC guidelines.",
  modelAccuracy: "99.73%",
  totalTrainedSigns: 123,
};

export const SIGN_LANGUAGE_PLAYLIST_VIDEOS: PlaylistItem[] = [
  {
    id: "JPV-vboWfhY",
    index: 0,
    lessonNumber: 0,
    title: "0 - Indian Sign Language 101 - Introduction",
    duration: "2:10",
    durationSeconds: 130,
    description:
      "Welcome to Indian Sign Language 101. An introduction to how Indian Sign Language works, Deaf communication etiquette, visual-gestural orientation, and foundational advice for beginners.",
    topics: ["Course Overview", "Introduction to ISL", "Visual-Gestural Communication", "Deaf Culture & Respect"],
    thumbnailUrl: "https://i.ytimg.com/vi/JPV-vboWfhY/hqdefault.jpg",
    relatedCategory: "Basics",
    trainedSigns: [],
  },
  {
    id: "qcdivQfA41Y",
    index: 1,
    lessonNumber: 1,
    title: "1 - Indian Sign Language 101 - Alphabet",
    duration: "9:06",
    durationSeconds: 546,
    description:
      "Learn the complete 26-letter Indian Sign Language manual alphabet (A to Z). ISL primarily uses two-handed fingerspelling for clear, unambiguous spelling of names, cities, and technical terms.",
    topics: ["Fingerspelling A-Z", "Two-Handed Manual Alphabet", "Hand Dominance", "Clear Articulation"],
    thumbnailUrl: "https://i.ytimg.com/vi/qcdivQfA41Y/hqdefault.jpg",
    relatedCategory: "Alphabet",
    trainedSigns: [
      "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
      "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
      "U", "V", "W", "X", "Y", "Z"
    ],
  },
  {
    id: "vnH2BmcSRMA",
    index: 2,
    lessonNumber: 2,
    title: "2 - Indian Sign Language 101 - Numbers",
    duration: "3:52",
    durationSeconds: 232,
    description:
      "Master standard number signing in Indian Sign Language from 0 through 9 and higher numbers, essential for communicating time, dates, currency, and quantities.",
    topics: ["Numbers 0 to 9", "Counting Formations", "Single & Double Digits", "Practical Number Drills"],
    thumbnailUrl: "https://i.ytimg.com/vi/vnH2BmcSRMA/hqdefault.jpg",
    relatedCategory: "Numbers",
    trainedSigns: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  },
  {
    id: "VtbYvVDItvg",
    index: 3,
    lessonNumber: 3,
    title: "3 - Indian Sign Language 101 - Basic Words 1",
    duration: "10:15",
    durationSeconds: 615,
    description:
      "Essential core vocabulary part 1: polite greetings, courtesy words, affirmative and negative responses (Hello, Namaste, Thank You, Please, Yes, No), and foundational daily signs.",
    topics: ["Hello & Namaste", "Thank You & Please", "Yes & No", "Polite Conversation Openers"],
    thumbnailUrl: "https://i.ytimg.com/vi/VtbYvVDItvg/hqdefault.jpg",
    relatedCategory: "Greetings",
    trainedSigns: ["HELLO", "NAMASTE", "THANK_YOU", "PLEASE", "WELCOME", "SORRY", "YES", "NO", "GOOD", "BAD"],
  },
  {
    id: "lffGJ29IhZQ",
    index: 4,
    lessonNumber: 4,
    title: "4 - Indian Sign Language 101 - Basic Words 2",
    duration: "7:00",
    durationSeconds: 420,
    description:
      "Essential core vocabulary part 2: signs for everyday needs and survival, including food, water, drink, eating, tea, milk, home, and urgent bathroom requests.",
    topics: ["Food & Water", "Eat & Drink", "Bathroom / Toilet", "Daily Necessities"],
    thumbnailUrl: "https://i.ytimg.com/vi/lffGJ29IhZQ/hqdefault.jpg",
    relatedCategory: "Basics",
    trainedSigns: ["FOOD", "WATER", "DRINK", "EAT", "TEA", "MILK", "HOME", "BATHROOM"],
  },
  {
    id: "DOFPRw6Epl0",
    index: 5,
    lessonNumber: 5,
    title: "5 - Indian Sign Language 101 - Question Words",
    duration: "4:01",
    durationSeconds: 241,
    description:
      "Learn WH-question words in ISL (What, Where, Why, When, Who, How) and master non-manual markers (eyebrow position and facial expressions) that transform statements into questions.",
    topics: ["What, Where, Why", "When, Who, How", "Facial Expressions in Inquiries", "Brow Furrowing"],
    thumbnailUrl: "https://i.ytimg.com/vi/DOFPRw6Epl0/hqdefault.jpg",
    relatedCategory: "Questions",
    trainedSigns: ["WHAT", "WHERE", "WHY", "WHEN", "WHO", "HOW", "HOW_ARE_YOU"],
  },
  {
    id: "qtrBGmioR2Q",
    index: 6,
    lessonNumber: 6,
    title: "6 - Indian Sign Language 101 - Colours",
    duration: "4:20",
    durationSeconds: 260,
    description:
      "Learn signs for common colors in ISL (Red, Blue, Green, Yellow, Black, White, Orange, Pink, Brown, Purple) along with natural visual and anatomical associations.",
    topics: ["Red, Blue, Green", "Yellow, Black, White", "Orange & Pink", "Anatomical Colour Anchors"],
    thumbnailUrl: "https://i.ytimg.com/vi/qtrBGmioR2Q/hqdefault.jpg",
    relatedCategory: "Colors",
    trainedSigns: ["RED", "BLUE", "GREEN", "YELLOW", "BLACK", "WHITE", "ORANGE", "PINK", "BROWN", "PURPLE"],
  },
  {
    id: "drs0_jcKr5w",
    index: 7,
    lessonNumber: 7,
    title: "7 - Indian Sign Language 101 - Relations",
    duration: "4:03",
    durationSeconds: 243,
    description:
      "Signs for family members, relatives, friends, and relationships (Mother, Father, Brother, Sister, Friend, Family, Son, Daughter, Baby, Grandparents), including gender-distinguishing facial zones.",
    topics: ["Mother & Father", "Brother & Sister", "Friend & Family", "Gender Spatial Anchors"],
    thumbnailUrl: "https://i.ytimg.com/vi/drs0_jcKr5w/hqdefault.jpg",
    relatedCategory: "Family",
    trainedSigns: ["MOTHER", "FATHER", "BROTHER", "SISTER", "FRIEND", "FAMILY", "SON", "DAUGHTER", "BABY", "GRANDPARENTS"],
  },
  {
    id: "XPRtZQSKL-4",
    index: 8,
    lessonNumber: 8,
    title: "8 - Indian Sign Language 101 - Days of the Week",
    duration: "4:56",
    durationSeconds: 296,
    description:
      "Learn the signs for Monday through Sunday in ISL, along with essential time markers like Today, Tomorrow, Yesterday, Day, and Week.",
    topics: ["Monday to Sunday", "Letter-Initial Handshapes", "Today, Tomorrow, Yesterday", "Time Concepts"],
    thumbnailUrl: "https://i.ytimg.com/vi/XPRtZQSKL-4/hqdefault.jpg",
    relatedCategory: "Time",
    trainedSigns: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY", "TODAY", "TOMORROW", "YESTERDAY"],
  },
  {
    id: "x58C6-ZtW_8",
    index: 9,
    lessonNumber: 9,
    title: "9 - Indian Sign Language 101 - Months",
    duration: "5:16",
    durationSeconds: 316,
    description:
      "Complete guide to signing the 12 months of the year from January to December using standardized ISL abbreviation patterns and seasonal context.",
    topics: ["12 Months (Jan - Dec)", "Standard Abbreviations", "Fingerspelling Initials", "Yearly Calendars"],
    thumbnailUrl: "https://i.ytimg.com/vi/x58C6-ZtW_8/hqdefault.jpg",
    relatedCategory: "Time",
    trainedSigns: [
      "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
      "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ],
  },
  {
    id: "bIkHfFlu4VU",
    index: 10,
    lessonNumber: 10,
    title: "10 - Indian Sign Language 101 - Basic Words 3",
    duration: "6:59",
    durationSeconds: 419,
    description:
      "Expanded core vocabulary part 3: conversational action verbs, school and office signs, work activities, and expressive emotion gestures.",
    topics: ["Action Verbs", "Work & Study", "Help & Stop", "Emotional Expressions"],
    thumbnailUrl: "https://i.ytimg.com/vi/bIkHfFlu4VU/hqdefault.jpg",
    relatedCategory: "Actions",
    trainedSigns: ["WORK", "STUDY", "SCHOOL", "COLLEGE", "HELP", "STOP", "LOVE", "HAPPY", "SAD", "LIKE", "WANT", "NEED"],
  },
  {
    id: "-Eh3ktA52jw",
    index: 11,
    lessonNumber: 11,
    title: "11 - Indian Sign Language 101 - Standard Signs",
    duration: "7:04",
    durationSeconds: 424,
    description:
      "Deep dive into standard Indian Sign Language recognized by ISLRTC (Indian Sign Language Research and Training Centre), regional dialect variations, and formal communication.",
    topics: ["ISLRTC Standard Vocabulary", "Regional Variations", "Formal ISL Registers", "Grammar Harmony"],
    thumbnailUrl: "https://i.ytimg.com/vi/-Eh3ktA52jw/hqdefault.jpg",
    relatedCategory: "Standard",
    trainedSigns: ["TEACH", "LEARN", "SIGN", "UNDERSTAND", "RIGHT", "WRONG", "BEAUTIFUL", "DEAF"],
  },
  {
    id: "ZE7EFgd0IWs",
    index: 12,
    lessonNumber: 12,
    title: "12 - Indian Sign Language 101 - Courses in ISL",
    duration: "8:05",
    durationSeconds: 485,
    description:
      "Next steps for continuing your ISL education: recognized diploma and degree courses, interpreter qualification pathways, Deaf community resources, and advocacy opportunities.",
    topics: ["ISLRTC Certification", "Interpreter Training", "Academic Courses", "Deaf Community Engagement"],
    thumbnailUrl: "https://i.ytimg.com/vi/ZE7EFgd0IWs/hqdefault.jpg",
    relatedCategory: "Courses",
    trainedSigns: [],
  },
];
