"""
Weights Manager for AI4Bharat INCLUDE Pretrained Checkpoints
Handles downloading, caching, and loading .pth model weights.
"""

import os
import urllib.request
from pathlib import Path
from typing import Optional
import torch

WEIGHTS_DIR = Path(__file__).parent / "weights"
WEIGHTS_DIR.mkdir(parents=True, exist_ok=True)

OFFICIAL_PRETRAINED_URLS = {
    "include50_lstm": "https://api.wandb.ai/files/abdur-ai4bharat/include50-no-cnn/1isx5nl6/augs_lstm.pth",
    "include50_transformer": "https://api.wandb.ai/files/abdur-ai4bharat/include50-no-cnn/11d20bb9/augs_transformer.pth",
    "isl101_playlist_lstm": "local://isl101_playlist_lstm.pth",
    "isl101_playlist_cnn": "local://isl101_playlist_cnn.pth",
}

def get_weights_path(model_name: str = "isl101_playlist_lstm") -> Path:
    return WEIGHTS_DIR / f"{model_name}.pth"

def is_weights_available(model_name: str = "isl101_playlist_lstm") -> bool:
    path = get_weights_path(model_name)
    return path.exists() and path.stat().st_size > 1024 * 1024

def download_weights(model_name: str = "include50_lstm", progress_callback=None) -> Path:
    dest_path = get_weights_path(model_name)
    if is_weights_available(model_name):
        return dest_path

    url = OFFICIAL_PRETRAINED_URLS.get(model_name)
    if not url:
        raise ValueError(f"Unknown model name '{model_name}'. Available: {list(OFFICIAL_PRETRAINED_URLS.keys())}")

    print(f"[INCLUDE Weights] Downloading {model_name} from AI4Bharat ({url})...")
    
    # Download with buffer
    temp_path = dest_path.with_suffix(".tmp")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    
    with urllib.request.urlopen(req) as response, open(temp_path, "wb") as out_file:
        total_size = int(response.headers.get("Content-Length", 0))
        downloaded = 0
        chunk_size = 64 * 1024
        
        while True:
            chunk = response.read(chunk_size)
            if not chunk:
                break
            out_file.write(chunk)
            downloaded += len(chunk)
            if progress_callback and total_size > 0:
                progress_callback(downloaded, total_size)

    if temp_path.exists():
        temp_path.replace(dest_path)
    
    print(f"[INCLUDE Weights] Successfully saved to {dest_path} ({dest_path.stat().st_size / (1024*1024):.2f} MB)")
    return dest_path
