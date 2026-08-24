import { useRef, useState } from "react";

export default function useAudioRecorder() {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const [recording, setRecording] = useState(false);

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const recorder = new MediaRecorder(stream);

    chunks.current = [];

    recorder.ondataavailable = (event) => {
      chunks.current.push(event.data);
    };

    recorder.start();

    mediaRecorder.current = recorder;
    setRecording(true);
  }

  function stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      if (!mediaRecorder.current) return;

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, {
          type: "audio/webm",
        });

        setRecording(false);

        resolve(blob);
      };

      mediaRecorder.current.stop();
    });
  }

  return {
    recording,
    startRecording,
    stopRecording,
  };
}
