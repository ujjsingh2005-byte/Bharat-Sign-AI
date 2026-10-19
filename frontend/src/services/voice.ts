import axios from "axios";

import { API_BASE_URL as API } from "../utils/apiConfig";

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
