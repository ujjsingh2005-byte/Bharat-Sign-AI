import { useState, useMemo, useEffect, useRef } from "react";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Circle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  GraduationCap,
  Award,
  Video,
  ListVideo,
  Info,
  ShieldAlert,
  Clock,
  Layers,
  Camera,
  Maximize2,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import {
  SIGN_LANGUAGE_PLAYLIST_METADATA,
  SIGN_LANGUAGE_PLAYLIST_VIDEOS,
  type PlaylistItem,
  YOUTUBE_PLAYLIST_ID,
  YOUTUBE_PLAYLIST_URL,
  YOUTUBE_PLAYLIST_DEFAULT_EMBED_URL,
} from "../../data/signLanguagePlaylistData";

interface SignLanguagePlaylistPlayerProps {
  onOpenAvatarPractice?: (searchTerm?: string) => void;
  onOpenCameraPractice?: () => void;
  className?: string;
}

export default function SignLanguagePlaylistPlayer({
  onOpenAvatarPractice,
  onOpenCameraPractice,
  className = "",
}: SignLanguagePlaylistPlayerProps) {
  // Selected video item (null means "Playing whole series playlist from start")
  const [selectedVideo, setSelectedVideo] = useState<PlaylistItem | null>(
    SIGN_LANGUAGE_PLAYLIST_VIDEOS[0]
  );
  const [isSeriesMode, setIsSeriesMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterMode, setFilterMode] = useState<"all" | "completed" | "uncompleted">("all");
  const [showEmbedNotice, setShowEmbedNotice] = useState<boolean>(false);
  const [embedLoadError, setEmbedLoadError] = useState<boolean>(false);
  const [isPlayerLoading, setIsPlayerLoading] = useState<boolean>(true);

  // Persistent Completed Lessons
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("bharat_sign_playlist_completed_lessons");
      if (saved) return new Set(JSON.parse(saved));
    } catch {
      // fallback
    }
    return new Set<string>();
  });

  const toggleCompleted = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(
          "bharat_sign_playlist_completed_lessons",
          JSON.stringify(Array.from(next))
        );
      } catch {
        // fallback
      }
      return next;
    });
  };

  // Compute Embed URL based on selection
  const currentEmbedUrl = useMemo(() => {
    if (isSeriesMode || !selectedVideo) {
      // Default exact series URL requested by user
      return YOUTUBE_PLAYLIST_DEFAULT_EMBED_URL;
    }
    // Specific video from playlist
    return `https://www.youtube.com/embed/${selectedVideo.id}?list=${YOUTUBE_PLAYLIST_ID}&index=${selectedVideo.index}&autoplay=1`;
  }, [isSeriesMode, selectedVideo]);

  // When embed URL changes, reset loading state
  useEffect(() => {
    setIsPlayerLoading(true);
    setEmbedLoadError(false);
  }, [currentEmbedUrl]);

  // Filtered videos in the drawer
  const filteredVideos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SIGN_LANGUAGE_PLAYLIST_VIDEOS.filter((video) => {
      const matchesSearch =
        !q ||
        video.title.toLowerCase().includes(q) ||
        video.description.toLowerCase().includes(q) ||
        video.topics.some((t) => t.toLowerCase().includes(q)) ||
        video.lessonNumber.toString() === q;

      const isCompleted = completedIds.has(video.id);
      const matchesFilter =
        filterMode === "all" ||
        (filterMode === "completed" && isCompleted) ||
        (filterMode === "uncompleted" && !isCompleted);

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filterMode, completedIds]);

  // Active video index helpers
  const currentIndex = selectedVideo ? selectedVideo.index : 0;
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < SIGN_LANGUAGE_PLAYLIST_VIDEOS.length - 1;

  const handlePreviousLesson = () => {
    if (hasPrevious) {
      setIsSeriesMode(false);
      setSelectedVideo(SIGN_LANGUAGE_PLAYLIST_VIDEOS[currentIndex - 1]);
    }
  };

  const handleNextLesson = () => {
    if (hasNext) {
      setIsSeriesMode(false);
      setSelectedVideo(SIGN_LANGUAGE_PLAYLIST_VIDEOS[currentIndex + 1]);
    }
  };

  const handleSelectVideo = (video: PlaylistItem) => {
    setIsSeriesMode(false);
    setSelectedVideo(video);
  };

  const handlePlayFullSeries = () => {
    setIsSeriesMode(true);
    setSelectedVideo(null);
  };

  const completionPercent = Math.round(
    (completedIds.size / SIGN_LANGUAGE_PLAYLIST_VIDEOS.length) * 100
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ========================================================= */}
      {/* 1. PLAYLIST HERO BANNER & STATS */}
      {/* ========================================================= */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #0A0F24 0%, #161B40 50%, #102A43 100%)",
        }}
        className="rounded-3xl border border-indigo-500/30 p-6 md:p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-red-600/30 text-red-300 border border-red-500/50 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                <Video size={13} />
                YouTube Master Playlist
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                <Sparkles size={12} />
                13 Complete Video Lessons • 77 Mins
              </span>
              <span className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                <Sparkles size={12} className="text-purple-400" />
                AI Model Trained: 123 Signs (99.7% Acc)
              </span>
              <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                <GraduationCap size={12} />
                Learn with Pragya
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {SIGN_LANGUAGE_PLAYLIST_METADATA.title} — Video Academy
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {SIGN_LANGUAGE_PLAYLIST_METADATA.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={handlePlayFullSeries}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg ${
                  isSeriesMode
                    ? "bg-red-600 text-white shadow-red-600/40"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                }`}
              >
                <ListVideo size={15} />
                <span>Continuous Playlist Mode</span>
              </button>

              <a
                href={YOUTUBE_PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5 hover:text-white"
              >
                <span>Open in YouTube</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Progress Card */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 min-w-[280px] shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-amber-400" />
                <span className="text-xs font-bold text-slate-200">
                  Course Completion
                </span>
              </div>
              <span className="text-sm font-extrabold text-blue-400 font-mono">
                {completedIds.size} / {SIGN_LANGUAGE_PLAYLIST_VIDEOS.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div
                style={{ width: `${completionPercent}%` }}
                className="h-full bg-gradient-to-r from-red-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{completionPercent}% Mastered</span>
              {completionPercent === 100 ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} /> Certificate Ready!
                </span>
              ) : (
                <span>
                  {SIGN_LANGUAGE_PLAYLIST_VIDEOS.length - completedIds.size}{" "}
                  remaining
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MAIN WORKSPACE: VIDEO PLAYER + LESSON NAVIGATOR */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: RESPONSIVE PLAYER & LESSON DETAILS (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Responsive 16:9 Video Container */}
          <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
            {/* 16:9 Aspect Ratio Frame */}
            <div className="relative w-full aspect-video">
              <iframe
                key={currentEmbedUrl}
                src={currentEmbedUrl}
                title={selectedVideo ? selectedVideo.title : "Indian Sign Language 101 Playlist"}
                className="absolute top-0 left-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={() => setIsPlayerLoading(false)}
                onError={() => {
                  setIsPlayerLoading(false);
                  setEmbedLoadError(true);
                }}
              />

              {/* Loading Placeholder */}
              {isPlayerLoading && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 space-y-3 pointer-events-none">
                  <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-slate-300 font-medium">
                    Loading YouTube Player...
                  </p>
                </div>
              )}
            </div>

            {/* Error / Fallback Banner if embedding is restricted */}
            {embedLoadError && (
              <div className="bg-amber-950/90 border-t border-amber-800/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-200">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={16} className="text-amber-400 shrink-0" />
                  <span>
                    If this video cannot be played inside an embedded frame, you can open it directly on YouTube.
                  </span>
                </div>
                <a
                  href={
                    selectedVideo
                      ? `https://www.youtube.com/watch?v=${selectedVideo.id}&list=${YOUTUBE_PLAYLIST_ID}`
                      : YOUTUBE_PLAYLIST_URL
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold transition flex items-center gap-1 shrink-0"
                >
                  <span>Watch on YouTube</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>

          {/* Player Controls & Current Lesson Header */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-red-400 bg-red-950/70 border border-red-800/60 px-2.5 py-0.5 rounded-full">
                    {isSeriesMode
                      ? "Playlist Overview Mode"
                      : `Lesson ${selectedVideo?.lessonNumber ?? 0} of 12`}
                  </span>
                  {selectedVideo && (
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                      <Clock size={12} />
                      {selectedVideo.duration}
                    </span>
                  )}
                </div>

                <h2 className="text-lg md:text-xl font-bold text-white">
                  {isSeriesMode
                    ? "Full Playlist Series: Indian Sign Language 101"
                    : selectedVideo?.title}
                </h2>
              </div>

              {/* Actions & Mark as Completed */}
              <div className="flex items-center gap-2">
                {selectedVideo && (
                  <button
                    onClick={() => toggleCompleted(selectedVideo.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                      completedIds.has(selectedVideo.id)
                        ? "bg-emerald-600/30 text-emerald-300 border-emerald-500/50 hover:bg-emerald-600/40"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                    }`}
                  >
                    {completedIds.has(selectedVideo.id) ? (
                      <>
                        <CheckCircle2 size={14} className="text-emerald-400" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <Circle size={14} className="text-slate-400" />
                        <span>Mark Completed</span>
                      </>
                    )}
                  </button>
                )}

                <a
                  href={
                    selectedVideo
                      ? `https://www.youtube.com/watch?v=${selectedVideo.id}&list=${YOUTUBE_PLAYLIST_ID}`
                      : YOUTUBE_PLAYLIST_URL
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition"
                  title="Open in YouTube"
                >
                  <ExternalLink size={15} />
                </a>
              </div>
            </div>

            {/* Previous / Next Lesson Navigation Toolbar */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={handlePreviousLesson}
                disabled={!hasPrevious}
                className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none border border-slate-800 text-xs font-semibold text-slate-200 transition flex items-center gap-1.5"
              >
                <ChevronLeft size={14} />
                <span>Previous Lesson</span>
              </button>

              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline-block">
                Navigate between playlist videos or select below
              </span>

              <button
                onClick={handleNextLesson}
                disabled={!hasNext}
                className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none border border-slate-800 text-xs font-semibold text-slate-200 transition flex items-center gap-1.5"
              >
                <span>Next Lesson</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Lesson Description & Topics */}
            {selectedVideo && (
              <div className="space-y-3 pt-2">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedVideo.description}
                </p>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 font-semibold mr-1">
                    Key Topics Covered:
                  </span>
                  {selectedVideo.topics.map((topic, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-indigo-300 font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Practice Integration Card */}
          <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-400" />
                <span>Pair Video Learning with AI Tools</span>
              </h3>
              <span className="text-[10px] uppercase font-extrabold text-indigo-400 bg-indigo-950/80 border border-indigo-800 px-2 py-0.5 rounded-full">
                Interactive Practice
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Enhance what you watch in this video lesson by practicing with our 360° 3D Avatar and verifying your hand landmarks in real time with the camera vision engine.
            </p>

            {selectedVideo?.trainedSigns && selectedVideo.trainedSigns.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <span>🎯</span> Trained AI Vocabulary for Lesson {selectedVideo.lessonNumber} ({selectedVideo.trainedSigns.length} Signs):
                  </span>
                  <span className="text-emerald-400 font-mono text-[11px] font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                    99.7% Bi-LSTM Model
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {selectedVideo.trainedSigns.map((sign, idx) => (
                    <span
                      key={idx}
                      onClick={() => onOpenAvatarPractice?.(sign)}
                      className="px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 text-[11px] font-bold cursor-pointer hover:bg-indigo-600 hover:text-white transition"
                      title={`Click to inspect '${sign}' in 3D Avatar`}
                    >
                      {sign}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {onOpenAvatarPractice && (
                <button
                  onClick={() =>
                    onOpenAvatarPractice(
                      selectedVideo ? selectedVideo.topics[0] : undefined
                    )
                  }
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
                >
                  <Layers size={14} />
                  <span>Inspect in 3D Avatar Studio</span>
                </button>
              )}

              {onOpenCameraPractice && (
                <button
                  onClick={onOpenCameraPractice}
                  className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-cyan-600/30"
                >
                  <Camera size={14} />
                  <span>Practice with Camera AI</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PLAYLIST CURRICULUM DRAWER (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListVideo size={18} className="text-red-400" />
                <h3 className="text-sm font-bold text-white">Course Curriculum</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono font-bold">
                13 Lessons
              </span>
            </div>

            {/* Search within playlist */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lessons or topics..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
              />
            </div>

            {/* Filter buttons */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-semibold">
              <button
                onClick={() => setFilterMode("all")}
                className={`py-1 rounded-lg transition ${
                  filterMode === "all"
                    ? "bg-red-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All (13)
              </button>
              <button
                onClick={() => setFilterMode("uncompleted")}
                className={`py-1 rounded-lg transition ${
                  filterMode === "uncompleted"
                    ? "bg-red-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Pending ({13 - completedIds.size})
              </button>
              <button
                onClick={() => setFilterMode("completed")}
                className={`py-1 rounded-lg transition ${
                  filterMode === "completed"
                    ? "bg-red-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Done ({completedIds.size})
              </button>
            </div>

            {/* Scrollable Video List */}
            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {filteredVideos.map((video) => {
                const isSelected =
                  !isSeriesMode && selectedVideo?.id === video.id;
                const isDone = completedIds.has(video.id);

                return (
                  <div
                    key={video.id}
                    onClick={() => handleSelectVideo(video)}
                    className={`group cursor-pointer rounded-xl border p-2.5 transition flex items-start gap-3 ${
                      isSelected
                        ? "bg-red-950/30 border-red-500/70 shadow-lg shadow-red-950/40"
                        : "bg-slate-950/80 hover:bg-slate-800/60 border-slate-800/80 hover:border-slate-700"
                    }`}
                  >
                    {/* Thumbnail with overlay duration */}
                    <div className="relative w-20 h-12 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          // fallback if thumbnail doesn't load
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                      <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-[9px] font-mono font-bold text-white px-1 rounded">
                        {video.duration}
                      </span>
                      {isSelected && (
                        <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center">
                          <Play size={14} className="text-white fill-white" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-extrabold text-red-400">
                            Lesson {video.lessonNumber}
                          </span>
                          {video.trainedSigns && video.trainedSigns.length > 0 && (
                            <span className="text-[9px] font-bold bg-purple-950/80 text-purple-300 border border-purple-800/60 px-1.5 py-0.5 rounded-full">
                              {video.trainedSigns.length} AI Signs
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => toggleCompleted(video.id, e)}
                          className="text-slate-500 hover:text-emerald-400 transition"
                          title={isDone ? "Completed" : "Mark as completed"}
                        >
                          {isDone ? (
                            <CheckCircle2 size={13} className="text-emerald-400" />
                          ) : (
                            <Circle size={13} />
                          )}
                        </button>
                      </div>

                      <h4
                        className={`text-xs font-bold truncate mt-0.5 ${
                          isSelected ? "text-white" : "text-slate-200"
                        }`}
                      >
                        {video.title.replace(/^\d+[\s-]+Indian Sign Language 101[\s-]+/i, "")}
                      </h4>

                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {video.topics.slice(0, 2).join(" • ")}
                      </p>
                    </div>
                  </div>
                );
              })}

              {filteredVideos.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-500">
                  No lessons found matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>

          {/* Learning Instructions Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <Info size={16} className="text-blue-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Recommended Study Method
              </h4>
            </div>

            <ol className="space-y-2 text-[11px] text-slate-300 list-decimal list-inside leading-relaxed">
              <li>
                <span className="font-semibold text-slate-200">Watch full clip</span> without signing first to observe palm orientations and facial expressions.
              </li>
              <li>
                <span className="font-semibold text-slate-200">Replay and mirror</span> gestures slowly with your dominant hand.
              </li>
              <li>
                <span className="font-semibold text-slate-200">Check 3D Avatar</span> from different angles to understand hand depth and finger curvature.
              </li>
              <li>
                <span className="font-semibold text-slate-200">Practice with Camera</span> in Vision Lab to verify gesture detection accuracy.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
