"""
Verify: Run model predictions on every video in adjective 1file folder.
These are 8 'ugly' sign videos: MVI_9576-9579, MVI_9844-9847
"""
import sys
from pathlib import Path
import numpy as np
import torch
import torch.nn.functional as F

from app.ai.include.extractor import VideoLandmarkExtractor, KNOWN_VIDEO_STEM_MAP
from app.ai.include.models import INCLUDELSTM, INCLUDEFastCNN
from app.ai.include.label_map import INCLUDE_50_LABEL_TO_ID, INCLUDE_50_ID_TO_LABEL
from app.ai.include.weights_manager import WEIGHTS_DIR

VIDEO_DIR   = Path(r"C:\Users\UJJWAL SINGH\Downloads\adjective 1file")
DATASET_DIR = Path("dataset/include_extracted")
num_classes = len(INCLUDE_50_LABEL_TO_ID)

# Load models
lstm_state = torch.load(WEIGHTS_DIR / "include50_lstm.pth", map_location="cpu", weights_only=True)
lstm_model = INCLUDELSTM(input_size=134, hidden_size=256, num_layers=2, n_classes=num_classes)
lstm_model.load_state_dict(lstm_state)
lstm_model.eval()

cnn_state = torch.load(WEIGHTS_DIR / "include50_cnn.pth", map_location="cpu", weights_only=True)
cnn_model = INCLUDEFastCNN(input_size=134, n_classes=num_classes)
cnn_model.load_state_dict(cnn_state)
cnn_model.eval()

extractor = VideoLandmarkExtractor()

print("\n" + "=" * 70)
print("  adjective 1file -> Sign Verification")
print("  Evaluating latest LSTM and FastCNN checkpoints")
print("=" * 70)

videos = sorted(VIDEO_DIR.glob("*.MOV"))
print(f"\nFound {len(videos)} videos in folder\n")

all_ok_lstm = 0
all_ok_cnn  = 0

for vf in videos:
    # Identify ground truth class from stem map
    gt_class = KNOWN_VIDEO_STEM_MAP.get(vf.stem, "deaf")
    gt_id    = INCLUDE_50_LABEL_TO_ID.get(gt_class, -1)

    # Use cached .npy if available, else extract live
    npy_cached = DATASET_DIR / gt_class / (vf.stem + ".npy")
    if npy_cached.exists():
        arr = np.load(npy_cached)
    else:
        arr = extractor.extract_from_video_file(str(vf))
        if arr is None:
            print(f"  {vf.name}  [FAIL - no landmarks]")
            continue

    if len(arr) != 16:
        idxs = np.linspace(0, len(arr) - 1, 16, dtype=int)
        arr = arr[idxs]

    t = torch.tensor(arr, dtype=torch.float32).unsqueeze(0)

    with torch.no_grad():
        # LSTM
        lp = torch.softmax(lstm_model(t), dim=-1)[0]
        l_id   = int(lp.argmax())
        l_conf = float(lp[l_id])
        l_pred = INCLUDE_50_ID_TO_LABEL.get(l_id, "?")
        l_ok   = (l_id == gt_id)
        if l_ok: all_ok_lstm += 1

        # CNN
        cp = torch.softmax(cnn_model(t), dim=-1)[0]
        c_id   = int(cp.argmax())
        c_conf = float(cp[c_id])
        c_pred = INCLUDE_50_ID_TO_LABEL.get(c_id, "?")
        c_ok   = (c_id == gt_id)
        if c_ok: all_ok_cnn += 1

    l_mark = "OK" if l_ok else "WRONG"
    c_mark = "OK" if c_ok else "WRONG"
    print(f"  {vf.name}")
    print(f"    GT={gt_class:10s}  LSTM=[{l_mark}] {l_pred} ({l_conf*100:.1f}%)  CNN=[{c_mark}] {c_pred} ({c_conf*100:.1f}%)")

n = len(videos)
print(f"\n{'='*70}")
print(f"  SUMMARY")
print(f"  LSTM:    {all_ok_lstm}/{n} correct  ({all_ok_lstm/n*100:.1f}%)")
print(f"  FastCNN: {all_ok_cnn}/{n} correct  ({all_ok_cnn/n*100:.1f}%)")
print(f"{'='*70}")
