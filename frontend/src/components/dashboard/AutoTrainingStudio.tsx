import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Video,
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Cpu,
  Layers,
  Activity,
  Sliders,
  Sparkles,
  BarChart2,
  Tag,
  Film,
  RotateCcw,
  Zap,
  Info,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Eye,
} from "lucide-react";
import AvatarViewer from "./AvatarViewer";
import { registerDynamicKinematics } from "../../utils/signKinematicsEngine";

interface VideoRecord {
  id: string;
  filename: string;
  label: string | null;
  english_meaning: string | null;
  hindi_meaning: string | null;
  category: string;
  status: string;
  duration: number;
  fps: number;
  width: number;
  height: number;
  total_frames: number;
  processed_frames: number;
  hand1_detection_pct: number;
  hand2_detection_pct: number;
  pose_detection_pct: number;
  is_verified: number;
  created_at: string;
  error_message?: string;
}

interface TrainingJob {
  id: string;
  name: string;
  status: string;
  progress: number;
  current_step: string;
  total_videos: number;
  classes_count: number;
  dataset_split?: any;
  metrics?: any;
  model_version_id?: string;
  log_output?: string;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

interface RegisteredModel {
  id: string;
  version: string;
  architecture: string;
  num_classes: number;
  classes?: Record<string, string>;
  validation_accuracy: number;
  test_accuracy: number;
  is_active: number;
  created_at: string;
}

export default function AutoTrainingStudio() {
  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [jobs, setJobs] = useState<TrainingJob[]>([]);
  const [models, setModels] = useState<RegisteredModel[]>([]);
  const [datasetSummary, setDatasetSummary] = useState<any>(null);

  // Upload state
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadLabel, setUploadLabel] = useState("");
  const [uploadEnglish, setUploadEnglish] = useState("");
  const [uploadHindi, setUploadHindi] = useState("");
  const [uploadCategory, setUploadCategory] = useState("general");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  // Inspection & Comparison State
  const [selectedVideo, setSelectedVideo] = useState<VideoRecord | null>(null);
  const [showPreviewVideo, setShowPreviewVideo] = useState(true);
  const [comparisonSign, setComparisonSign] = useState<string | null>(null);

  // Training parameters
  const [epochs, setEpochs] = useState(12);
  const [batchSize, setBatchSize] = useState(16);
  const [learningRate, setLearningRate] = useState(0.001);
  const [architecture, setArchitecture] = useState("lstm");
  const [isStartingTraining, setIsStartingTraining] = useState(false);

  // Active Job log streaming
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [activeJob, setActiveJob] = useState<TrainingJob | null>(null);

  // Fetch all state from API
  const refreshData = async () => {
    try {
      const [vRes, jRes, mRes, sRes] = await Promise.all([
        fetch("http://localhost:8000/training/videos"),
        fetch("http://localhost:8000/training/jobs"),
        fetch("http://localhost:8000/training/models"),
        fetch("http://localhost:8000/training/dataset/summary"),
      ]);

      if (vRes.ok) {
        const vData = await vRes.json();
        setVideos(vData.videos || []);
        if (!selectedVideo && vData.videos && vData.videos.length > 0) {
          setSelectedVideo(vData.videos[0]);
        }
      }

      if (jRes.ok) {
        const jData = await jRes.json();
        setJobs(jData.jobs || []);
        if (jData.jobs && jData.jobs.length > 0) {
          const running = jData.jobs.find((j: any) => j.status === "training" || j.status === "preparing_dataset" || j.status === "evaluating");
          if (running) {
            setActiveJobId(running.id);
          } else if (!activeJobId) {
            setActiveJobId(jData.jobs[0].id);
          }
        }
      }

      if (mRes.ok) {
        const mData = await mRes.json();
        setModels(mData.models || []);
      }

      if (sRes.ok) {
        const sData = await sRes.json();
        setDatasetSummary(sData);
      }
    } catch (err) {
      console.error("Failed to load training studio data:", err);
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Poll active job details
  useEffect(() => {
    if (!activeJobId) return;
    const fetchJobDetail = async () => {
      try {
        const res = await fetch(`http://localhost:8000/training/job/${activeJobId}`);
        if (res.ok) {
          const data = await res.json();
          setActiveJob(data.job);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobDetail();
    const jInt = setInterval(fetchJobDetail, 2000);
    return () => clearInterval(jInt);
  }, [activeJobId]);

  // Synchronize Avatar Kinematics when video is selected
  useEffect(() => {
    if (selectedVideo && selectedVideo.label) {
      setComparisonSign(selectedVideo.label);
      // Fetch dynamic kinematics from backend
      fetch(`http://localhost:8000/training/kinematics/${selectedVideo.label}`)
        .then((r) => r.json())
        .then((kData) => {
          if (kData.success && kData.kinematics) {
            registerDynamicKinematics(selectedVideo.label!, kData.kinematics);
          }
        })
        .catch(() => {});
    }
  }, [selectedVideo]);

  // Handle Video Upload
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFiles || selectedFiles.length === 0) {
      alert("Please select at least one sign language video file.");
      return;
    }

    setIsUploading(true);
    setUploadSuccessMsg(null);

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }
    if (uploadLabel.trim()) formData.append("label", uploadLabel.trim().toLowerCase());
    if (uploadEnglish.trim()) formData.append("english_meaning", uploadEnglish.trim());
    if (uploadHindi.trim()) formData.append("hindi_meaning", uploadHindi.trim());
    formData.append("category", uploadCategory);

    try {
      const res = await fetch("http://localhost:8000/training/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUploadSuccessMsg(`Successfully uploaded ${data.count} video(s)! Background landmark extraction started.`);
        setSelectedFiles(null);
        setUploadLabel("");
        setUploadEnglish("");
        setUploadHindi("");
        refreshData();
      } else {
        alert(data.message || "Upload failed.");
      }
    } catch (err: any) {
      alert("Upload error: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Trigger Model Training
  const handleStartTraining = async () => {
    setIsStartingTraining(true);
    try {
      const res = await fetch("http://localhost:8000/training/train/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `ISL Training (${new Date().toLocaleTimeString()})`,
          epochs,
          batch_size: batchSize,
          learning_rate: learningRate,
          architecture,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveJobId(data.job_id);
        refreshData();
      } else {
        alert("Training error: " + (data.message || "Failed to start."));
      }
    } catch (err: any) {
      alert("Training dispatch failed: " + err.message);
    } finally {
      setIsStartingTraining(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Studio Header */}
      <div className="rounded-3xl border border-indigo-600/40 bg-gradient-to-r from-slate-950 via-indigo-950/60 to-purple-950/40 p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 text-xs px-3 py-1.5 rounded-full border border-indigo-500/30 font-bold uppercase tracking-wider">
              <Sparkles size={14} className="text-indigo-400" />
              Automated ISL Video Learning & 3D Avatar Sync
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Sign-to-Model Neural Training Engine
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Upload multi-angle reference videos of Indian Sign Language gestures. The system extracts 134-D MediaPipe
              landmarks, trains real temporal neural networks, versions verified models, and synchronizes bone rotations
              directly to the 3D Avatar.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-4 min-w-[140px] text-center shadow-lg">
              <div className="text-2xl font-black text-indigo-400">{datasetSummary?.total_videos || 0}</div>
              <div className="text-xs text-slate-400 uppercase font-semibold mt-0.5">Total Videos</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-4 min-w-[140px] text-center shadow-lg">
              <div className="text-2xl font-black text-emerald-400">{datasetSummary?.processed_videos || 0}</div>
              <div className="text-xs text-slate-400 uppercase font-semibold mt-0.5">Landmarks Extracted</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-4 min-w-[140px] text-center shadow-lg">
              <div className="text-2xl font-black text-purple-400">{models.length}</div>
              <div className="text-xs text-slate-400 uppercase font-semibold mt-0.5">Trained Models</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Upload & Side-by-Side Avatar Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Video Upload & Pipeline Dispatch (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upload Form Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                <Upload size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Upload ISL Reference Videos</h2>
                <p className="text-xs text-slate-400">Supports .MOV, .mp4, .webm (single or batch upload)</p>
              </div>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* File Input Box */}
              <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-950/40 relative">
                <input
                  type="file"
                  multiple
                  accept="video/*,.mov,.mp4"
                  onChange={(e) => setSelectedFiles(e.target.files)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Film size={32} className="mx-auto text-indigo-400 mb-2" />
                <div className="text-sm font-semibold text-slate-200">
                  {selectedFiles && selectedFiles.length > 0
                    ? `Selected ${selectedFiles.length} video file(s)`
                    : "Click or drag sign videos here"}
                </div>
                <p className="text-xs text-slate-500 mt-1">Full 1080p, 720p, mobile recordings supported</p>
              </div>

              {/* Sign Label Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Sign / Gloss Label *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. happy, loud, namaste"
                    value={uploadLabel}
                    onChange={(e) => setUploadLabel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  >
                    <option value="general">General</option>
                    <option value="adjectives">Adjectives</option>
                    <option value="greetings">Greetings</option>
                    <option value="emergency">Emergency & Help</option>
                    <option value="numbers">Numbers</option>
                    <option value="alphabet">Alphabet</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    English Meaning
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Happy / Joy"
                    value={uploadEnglish}
                    onChange={(e) => setUploadEnglish(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Hindi Meaning (हिन्दी)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. खुश / प्रसन्नता"
                    value={uploadHindi}
                    onChange={(e) => setUploadHindi(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isUploading || !selectedFiles}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-bold text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    Uploading & Starting Extraction...
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    Extract Landmarks & Register Video
                  </>
                )}
              </button>
            </form>

            {uploadSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{uploadSuccessMsg}</span>
              </div>
            )}
          </div>

          {/* Model Training Controls Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <Cpu size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Model Retraining Pipeline</h2>
                <p className="text-xs text-slate-400">Train real PyTorch neural classifier on uploaded landmarks</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Architecture</span>
                <select
                  value={architecture}
                  onChange={(e) => setArchitecture(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="lstm">LSTM (Bidirectional)</option>
                  <option value="cnn">Fast 1D CNN</option>
                </select>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Epochs</span>
                <input
                  type="number"
                  min="2"
                  max="50"
                  value={epochs}
                  onChange={(e) => setEpochs(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Batch Size</span>
                <input
                  type="number"
                  min="4"
                  max="64"
                  value={batchSize}
                  onChange={(e) => setBatchSize(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Learning Rate</span>
                <input
                  type="number"
                  step="0.0005"
                  value={learningRate}
                  onChange={(e) => setLearningRate(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>

            <button
              onClick={handleStartTraining}
              disabled={isStartingTraining || (datasetSummary && !datasetSummary.ready_for_training)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 font-bold text-white shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isStartingTraining ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Dispatching PyTorch Job...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Start Neural Training & Model Checkpoint
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Live Video vs 3D Avatar Side-by-Side (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
                  <Activity size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Video Landmark vs. 3D Avatar Synchronizer</h2>
                  <p className="text-xs text-slate-400">
                    Direct validation of reference motion retargeted onto isl-avatar.glb
                  </p>
                </div>
              </div>

              {selectedVideo && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPreviewVideo(!showPreviewVideo)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      showPreviewVideo
                        ? "bg-indigo-600/30 text-indigo-300 border-indigo-500/50"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    {showPreviewVideo ? "Skeleton Preview" : "Raw Video"}
                  </button>
                </div>
              )}
            </div>

            {/* Split Screen Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box 1: Reference Video Player with Annotated Landmarks */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden aspect-[4/5] flex flex-col relative">
                <div className="bg-slate-900/80 px-3 py-2 border-b border-slate-800 text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Sign Video: {selectedVideo?.label || "None selected"}</span>
                  <span className="text-[10px] text-indigo-400">
                    {selectedVideo?.hand1_detection_pct ? `${selectedVideo.hand1_detection_pct}% hands tracked` : ""}
                  </span>
                </div>
                <div className="flex-1 relative flex items-center justify-center bg-black">
                  {selectedVideo ? (
                    <video
                      key={`${selectedVideo.id}-${showPreviewVideo}`}
                      src={
                        showPreviewVideo && selectedVideo.status === "processed"
                          ? `http://localhost:8000/training/video/${selectedVideo.id}/preview`
                          : `http://localhost:8000/training/video/${selectedVideo.id}/stream`
                      }
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center p-6 text-slate-500 text-xs">
                      <Film size={36} className="mx-auto mb-2 opacity-40" />
                      Select a video below to view reference motion
                    </div>
                  )}
                </div>
              </div>

              {/* Box 2: 3D Avatar reproducing the exact sign */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden aspect-[4/5] flex flex-col relative">
                <div className="bg-slate-900/80 px-3 py-2 border-b border-slate-800 text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>3D Avatar: {comparisonSign || "Standby"}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Retargeted Skeleton</span>
                </div>
                <div className="flex-1 relative">
                  <AvatarViewer
                    currentSign={comparisonSign}
                    sign={comparisonSign}
                    isPlaying={true}
                    playbackSpeed={1.0}
                  />
                </div>
              </div>
            </div>

            {/* Telemetry Bar */}
            {selectedVideo && (
              <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Duration</div>
                  <div className="font-bold text-white">{selectedVideo.duration}s</div>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">FPS</div>
                  <div className="font-bold text-white">{selectedVideo.fps}</div>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Hand Detection</div>
                  <div className="font-bold text-emerald-400">{selectedVideo.hand1_detection_pct}%</div>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Pose Tracking</div>
                  <div className="font-bold text-cyan-400">{selectedVideo.pose_detection_pct}%</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Inventory & Label Manager Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <Film size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Uploaded Video Repository & Annotation Status</h2>
              <p className="text-xs text-slate-400">
                Click any row to test side-by-side motion retargeting with the 3D Avatar
              </p>
            </div>
          </div>
          <button
            onClick={refreshData}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Video</th>
                <th className="p-3">Sign Label</th>
                <th className="p-3">Meanings (EN / HI)</th>
                <th className="p-3">Category</th>
                <th className="p-3">Telemetry</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {videos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-500">
                    No videos uploaded yet. Use the upload box above to add your first ISL reference video!
                  </td>
                </tr>
              ) : (
                videos.map((vid) => (
                  <tr
                    key={vid.id}
                    onClick={() => setSelectedVideo(vid)}
                    className={`cursor-pointer transition-all hover:bg-slate-800/40 ${
                      selectedVideo?.id === vid.id ? "bg-indigo-600/10 border-l-4 border-indigo-500" : ""
                    }`}
                  >
                    <td className="p-3 font-semibold text-white flex items-center gap-2">
                      <Film size={14} className="text-indigo-400 shrink-0" />
                      <span className="truncate max-w-[140px]">{vid.filename}</span>
                    </td>
                    <td className="p-3 font-bold text-indigo-300">{vid.label || <span className="text-amber-400 italic">Unlabeled</span>}</td>
                    <td className="p-3 text-slate-300">
                      {vid.english_meaning || "—"} / {vid.hindi_meaning || "—"}
                    </td>
                    <td className="p-3 text-slate-400">{vid.category}</td>
                    <td className="p-3 text-slate-400">
                      {vid.duration}s · {vid.hand1_detection_pct}% hands
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          vid.status === "processed"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : vid.status === "extracting_landmarks"
                            ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 animate-pulse"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {vid.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVideo(vid);
                          if (vid.label) setComparisonSign(vid.label);
                        }}
                        className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[10px]"
                      >
                        Compare
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real Training Job Logs & History */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <BarChart2 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Live Training Job Progress & Logs</h2>
              <p className="text-xs text-slate-400">
                Real PyTorch training execution, loss reduction, and multi-class accuracy
              </p>
            </div>
          </div>
          {activeJob && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                activeJob.status === "completed"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : activeJob.status === "training"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              Status: {activeJob.status} ({activeJob.progress}%)
            </span>
          )}
        </div>

        {/* Progress Bar */}
        {activeJob && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300 font-semibold">
              <span>{activeJob.current_step || "Idle"}</span>
              <span>{activeJob.progress}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${activeJob.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Real-time Terminal Log Console */}
        <div className="bg-black/80 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-emerald-400 max-h-56 overflow-y-auto space-y-1">
          {activeJob?.log_output ? (
            activeJob.log_output.split("\n").map((line, idx) => (
              <div key={idx} className="leading-relaxed whitespace-pre-wrap">
                {line}
              </div>
            ))
          ) : (
            <div className="text-slate-600 italic">No active training logs. Start a training job to view real-time PyTorch outputs.</div>
          )}
        </div>
      </div>
    </div>
  );
}
