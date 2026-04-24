import { useCallback, useEffect, useRef, useState } from 'react';
import { buildMicBlockedHelp } from '../utils/micPermissionHelp';

// Fallback para navegadores sem Web Speech API (iOS Chrome, Android Firefox).
// Usa MediaRecorder + Whisper tiny via Transformers.js rodando 100% no cliente.
// Modelo (~40MB) baixa uma vez e fica em cache do navegador.

let pipelinePromise = null;
let transformersEnv = null;

async function getPipeline(onProgress) {
  if (pipelinePromise) return pipelinePromise;
  pipelinePromise = (async () => {
    const tf = await import('@xenova/transformers');
    transformersEnv = tf.env;
    // Garante cache local (IndexedDB) — modelo baixa 1x
    tf.env.allowLocalModels = false;
    tf.env.useBrowserCache = true;
    const pipe = await tf.pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny', {
      progress_callback: onProgress,
    });
    return pipe;
  })();
  return pipelinePromise;
}

async function blobToFloat32(blob) {
  const arrayBuf = await blob.arrayBuffer();
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioCtx({ sampleRate: 16000 });
  try {
    const audioBuf = await ctx.decodeAudioData(arrayBuf.slice(0));
    // Whisper espera mono 16kHz
    let data;
    if (audioBuf.numberOfChannels > 1) {
      const len = audioBuf.length;
      data = new Float32Array(len);
      const chans = [];
      for (let c = 0; c < audioBuf.numberOfChannels; c++) chans.push(audioBuf.getChannelData(c));
      for (let i = 0; i < len; i++) {
        let sum = 0;
        for (let c = 0; c < chans.length; c++) sum += chans[c][i];
        data[i] = sum / chans.length;
      }
    } else {
      data = audioBuf.getChannelData(0);
    }
    // Resample se não for 16kHz
    if (audioBuf.sampleRate !== 16000) {
      const ratio = audioBuf.sampleRate / 16000;
      const newLen = Math.floor(data.length / ratio);
      const resampled = new Float32Array(newLen);
      for (let i = 0; i < newLen; i++) {
        resampled[i] = data[Math.floor(i * ratio)];
      }
      data = resampled;
    }
    return data;
  } finally {
    try { ctx.close(); } catch { /* noop */ }
  }
}

export function useWhisperRecognition({ onResult, onFinalSegment, lang = 'portuguese' } = {}) {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const onResultRef = useRef(onResult);
  const onFinalSegmentRef = useRef(onFinalSegment);
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => { onResultRef.current = onResult; }, [onResult]);
  useEffect(() => { onFinalSegmentRef.current = onFinalSegment; }, [onFinalSegment]);

  const supported = typeof window !== 'undefined'
    && !!(navigator.mediaDevices?.getUserMedia)
    && typeof MediaRecorder !== 'undefined';

  useEffect(() => () => {
    try { mediaRecorderRef.current?.stop(); } catch { /* noop */ }
    try { streamRef.current?.getTracks().forEach(t => t.stop()); } catch { /* noop */ }
  }, []);

  const transcribe = useCallback(async (blob) => {
    setProcessing(true);
    try {
      const pipe = await getPipeline((p) => {
        if (p.status === 'progress' && typeof p.progress === 'number') {
          setLoadProgress(Math.round(p.progress));
        }
      });
      const audio = await blobToFloat32(blob);
      if (audio.length < 16000 * 0.3) {
        // Menos de 300ms — provavelmente só ruído
        setProcessing(false);
        return;
      }
      const out = await pipe(audio, { language: lang, task: 'transcribe' });
      const text = (out?.text || '').trim();
      if (text) {
        onResultRef.current?.(text);
        onFinalSegmentRef.current?.(text);
      }
    } catch (err) {
      console.error('[Whisper] erro na transcrição', err);
      setError('Não foi possível transcrever o áudio.');
    } finally {
      setProcessing(false);
    }
  }, [lang]);

  const start = useCallback(async () => {
    if (!supported) {
      setError('Seu navegador não suporta gravação de áudio.');
      return;
    }
    setError(null);
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      if (err?.name === 'NotAllowedError' || err?.name === 'SecurityError') {
        setError(buildMicBlockedHelp());
      } else if (err?.name === 'NotFoundError') {
        setError('Nenhum microfone detectado neste dispositivo.');
      } else {
        setError('Não foi possível acessar o microfone.');
      }
      return;
    }
    streamRef.current = stream;
    chunksRef.current = [];
    let mime = '';
    const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
    for (const c of candidates) {
      if (MediaRecorder.isTypeSupported?.(c)) { mime = c; break; }
    }
    const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
    rec.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };
    rec.onstop = async () => {
      try { stream.getTracks().forEach(t => t.stop()); } catch { /* noop */ }
      streamRef.current = null;
      setListening(false);
      if (chunksRef.current.length === 0) return;
      const blob = new Blob(chunksRef.current, { type: mime || 'audio/webm' });
      chunksRef.current = [];
      await transcribe(blob);
    };
    rec.onerror = () => {
      setError('Erro na gravação.');
      setListening(false);
    };
    try {
      rec.start();
      mediaRecorderRef.current = rec;
      setListening(true);
    } catch {
      setError('Não foi possível iniciar a gravação.');
      try { stream.getTracks().forEach(t => t.stop()); } catch { /* noop */ }
      setListening(false);
    }
  }, [supported, transcribe]);

  const stop = useCallback(() => {
    try { mediaRecorderRef.current?.stop(); } catch { /* noop */ }
  }, []);

  const toggle = useCallback(() => {
    if (listening) stop(); else start();
  }, [listening, start, stop]);

  const clearError = useCallback(() => setError(null), []);

  return { supported, listening, processing, loadProgress, error, start, stop, toggle, clearError };
}
