import sys
from pathlib import Path
sys.path.append(r"c:\Users\UJJWAL SINGH\OneDrive\Desktop\Bharat-Sign-AI-3-Sign-Working\zip\backend")

from app.ai.motion_pipeline import VideoMotionPipeline
p = VideoMotionPipeline()
for fname in ["MVI_9699.MOV", "MVI_9823.MOV"]:
    vpath = Path(r"C:\Users\UJJWAL SINGH\Downloads\adjective 1file") / fname
    res = p.process_video(str(vpath))
    print(f"\n=== {fname} ({res['total_frames']} frames) ===")
    for f in res["frames"]:
        rw = f.get("r_wrist")
        lw = f.get("l_wrist")
        if rw and rw[1] < 0.60: # Above lower chest
            print(f"  F{f['frame']:02d} (t={f['timestamp']:.2f}s): RW={rw}, LW={lw}")
