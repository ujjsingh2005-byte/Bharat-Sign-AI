"""
Training Pipeline for User-Provided Video Dataset: Adjective 1file
Extracts landmarks from raw .MOV videos, loads full INCLUDE-50 dataset with real videos,
trains LSTM and FastCNN neural models, evaluates against all videos, and saves updated checkpoints.
"""

import os
import sys
import json
import time
from pathlib import Path
import numpy as np
import torch
import torch.nn.functional as F

from app.ai.include.extractor import extract_from_directory, KNOWN_VIDEO_STEM_MAP
from app.ai.include.trainer import train_model
from app.ai.include.models import INCLUDELSTM, INCLUDEFastCNN
from app.ai.include.label_map import (
    INCLUDE_50_LABEL_TO_ID,
    INCLUDE_50_ID_TO_LABEL,
    INCLUDE_50_METADATA,
)
from app.ai.include.weights_manager import WEIGHTS_DIR

def run_pipeline():
    video_dir = r"C:\Users\UJJWAL SINGH\Downloads\adjective 1file"
    dataset_dir = Path("dataset/include_extracted")
    
    print("\n==================================================================")
    print("Step 1: Extracting landmarks from video directory")
    print(f"Source: {video_dir}")
    print("==================================================================")
    
    extract_res = extract_from_directory(
        directory_path=video_dir,
        output_dir="data/include_landmarks",
        force_reextract=True,
    )
    print("Extraction Summary:", extract_res)

    # Copy freshly extracted .npy files to dataset/include_extracted/<class>/ using KNOWN_VIDEO_STEM_MAP
    # Clean previous destination directories to avoid stale mappings
    for d in [dataset_dir / "old", dataset_dir / "young"]:
        if d.exists():
            for f in d.glob("*.npy"):
                f.unlink()

    for cls_name, cls_info in extract_res.get("classes", {}).items():
        for saved_path in cls_info.get("saved_files", []):
            p = Path(saved_path)
            stem = p.stem
            target_cls = KNOWN_VIDEO_STEM_MAP.get(stem, "old")
            dest_dir = dataset_dir / target_cls
            dest_dir.mkdir(parents=True, exist_ok=True)
            dest_file = dest_dir / p.name
            arr = np.load(p)
            np.save(dest_file, arr)
            print(f"  [+] Placed {dest_file.name} in {dest_dir} (class: {target_cls}, shape: {arr.shape})")

    print("\n==================================================================")
    print("Step 2: Training LSTM Model on INCLUDE-50 Dataset (with real videos)")
    print("==================================================================")
    
    lstm_res = train_model(
        model_type="lstm",
        epochs=14,
        batch_size=48,
        lr=1e-3,
        save_name="include50_lstm",
        data_dir=str(dataset_dir),
        device="cpu",
    )
    
    print("\n==================================================================")
    print("Step 3: Training FastCNN Model on INCLUDE-50 Dataset")
    print("==================================================================")
    
    cnn_res = train_model(
        model_type="cnn",
        epochs=14,
        batch_size=48,
        lr=1e-3,
        save_name="include50_cnn",
        data_dir=str(dataset_dir),
        device="cpu",
    )

    print("\n==================================================================")
    print("Step 4: Evaluating Trained Models on User's Video Set")
    print("==================================================================")
    
    num_classes = len(INCLUDE_50_LABEL_TO_ID)
    lstm_model = INCLUDELSTM(n_classes=num_classes)
    lstm_weights = WEIGHTS_DIR / "include50_lstm.pth"
    lstm_model.load_state_dict(torch.load(lstm_weights, map_location="cpu", weights_only=False))
    lstm_model.eval()

    cnn_model = INCLUDEFastCNN(n_classes=num_classes)
    cnn_weights = WEIGHTS_DIR / "include50_cnn.pth"
    cnn_model.load_state_dict(torch.load(cnn_weights, map_location="cpu", weights_only=False))
    cnn_model.eval()

    eval_results = []
    raw_files = list(Path(video_dir).glob("*.MOV")) + list(Path(video_dir).glob("*.mov")) + list(Path(video_dir).glob("*.mp4"))
    video_files = sorted(list({f.resolve(): f for f in raw_files}.values()), key=lambda x: x.name)
    
    lstm_correct = 0
    cnn_correct = 0
    total_evaluated = 0

    print(f"\nEvaluating {len(video_files)} videos against LSTM & FastCNN:\n")

    for vf in sorted(video_files):
        stem = vf.stem
        detected_default = list(extract_res.get("classes", {}).keys())[0] if extract_res.get("classes") else "happy"
        target_cls = KNOWN_VIDEO_STEM_MAP.get(stem, detected_default)
        target_id = INCLUDE_50_LABEL_TO_ID.get(target_cls, -1)
        
        npy_path = Path("data/include_landmarks") / target_cls / f"{stem}.npy"
        if not npy_path.exists():
            npy_path = dataset_dir / target_cls / f"{stem}.npy"
            
        if not npy_path.exists():
            print(f"  [MISSING] {vf.name}: No .npy found at {npy_path}")
            continue
            
        features = np.load(npy_path)
        if len(features) != 16:
            features = features[np.linspace(0, len(features)-1, 16, dtype=int)]
        inp = torch.tensor(features, dtype=torch.float32).unsqueeze(0)
        
        with torch.no_grad():
            # LSTM prediction
            l_logits = lstm_model(inp)
            l_probs = F.softmax(l_logits, dim=-1)[0].numpy()
            l_pred_id = int(np.argmax(l_probs))
            l_pred_cls = INCLUDE_50_ID_TO_LABEL.get(l_pred_id, "unknown")
            l_ok = (l_pred_id == target_id)
            if l_ok:
                lstm_correct += 1

            # CNN prediction
            c_logits = cnn_model(inp)
            c_probs = F.softmax(c_logits, dim=-1)[0].numpy()
            c_pred_id = int(np.argmax(c_probs))
            c_pred_cls = INCLUDE_50_ID_TO_LABEL.get(c_pred_id, "unknown")
            c_ok = (c_pred_id == target_id)
            if c_ok:
                cnn_correct += 1

        total_evaluated += 1

        l_conf = float(l_probs[l_pred_id])
        c_conf = float(c_probs[c_pred_id])
        t_meta = INCLUDE_50_METADATA.get(target_cls, {})

        top5_lstm = []
        for idx in np.argsort(l_probs)[::-1][:5]:
            cname = INCLUDE_50_ID_TO_LABEL.get(int(idx), "unknown")
            top5_lstm.append({
                "class": cname,
                "confidence": float(l_probs[idx]),
                "display": INCLUDE_50_METADATA.get(cname, {}).get("display", cname),
                "hi": INCLUDE_50_METADATA.get(cname, {}).get("hi", ""),
            })

        eval_item = {
            "video_name": vf.name,
            "target_class": target_cls,
            "target_id": target_id,
            "display": t_meta.get("display", target_cls),
            "hi": t_meta.get("hi", ""),
            "lstm": {
                "predicted_class": l_pred_cls,
                "predicted_id": l_pred_id,
                "confidence": l_conf,
                "is_correct": l_ok,
                "top5": top5_lstm,
            },
            "cnn": {
                "predicted_class": c_pred_cls,
                "predicted_id": c_pred_id,
                "confidence": c_conf,
                "is_correct": c_ok,
            },
        }
        eval_results.append(eval_item)

        l_tag = "OK" if l_ok else "WRONG"
        c_tag = "OK" if c_ok else "WRONG"
        print(f"  {vf.name:15s} | Target: {target_cls:10s} | LSTM: [{l_tag:5s}] {l_pred_cls} ({l_conf*100:5.1f}%) | CNN: [{c_tag:5s}] {c_pred_cls} ({c_conf*100:5.1f}%)")

    # Summary
    print("\n" + "=" * 70)
    print("  EVALUATION SUMMARY")
    print("=" * 70)
    print(f"  Total Videos Tested : {total_evaluated}")
    if total_evaluated > 0:
        print(f"  LSTM Accuracy       : {lstm_correct}/{total_evaluated} ({lstm_correct/total_evaluated*100:.1f}%)")
        print(f"  FastCNN Accuracy    : {cnn_correct}/{total_evaluated} ({cnn_correct/total_evaluated*100:.1f}%)")
    print("=" * 70)

    # Save metadata json
    meta_path = WEIGHTS_DIR / "include50_training_meta.json"
    meta_data = {
        "timestamp": time.time(),
        "video_dir": video_dir,
        "models_trained": ["lstm", "cnn"],
        "epochs": 15,
        "batch_size": 32,
        "training_results": {
            "lstm": lstm_res,
            "cnn": cnn_res,
        },
        "evaluation": eval_results,
    }
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta_data, f, indent=2, ensure_ascii=False)
        
    print(f"\n[OK] Metadata and evaluation saved to: {meta_path}")
    print("Pipeline completed successfully!")

if __name__ == "__main__":
    run_pipeline()
