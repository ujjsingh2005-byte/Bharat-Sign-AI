import axios from "axios";

const API = "http://127.0.0.1:8000";

export async function speechToText(audio: Blob) {
  const formData = new FormData();

  formData.append("audio", audio, "voice.wav");

  const response = await axios.post(`${API}/voice/speech-to-text`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
