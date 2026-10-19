import sys
from pathlib import Path
sys.path.append(r"c:\Users\UJJWAL SINGH\OneDrive\Desktop\Bharat-Sign-AI-3-Sign-Working\zip\backend")

from app.ai.motion_pipeline import VideoMotionPipeline
p = VideoMotionPipeline()
res = p.process_video(r"C:\Users\UJJWAL SINGH\Downloads\adjective 1file\MVI_9699.MOV")
print("Video processed!")
print("Frames count:", len(res["frames"]))
for f in res["frames"][::2]:
    rw = f.get("r_wrist")
    lw = f.get("l_wrist")
    re = f.get("r_elbow")
    le = f.get("l_elbow")
    rs = f.get("r_shoulder")
    ls = f.get("l_shoulder")
    nose = f.get("nose")
    print(f"F{f['frame']:02d} (t={f['timestamp']:.2f}s): RW={rw}, LW={lw}, RE={re}, LE={le}")
