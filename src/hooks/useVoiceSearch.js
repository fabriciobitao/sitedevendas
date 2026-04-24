import { useCallback, useEffect, useRef, useState } from 'react';
import { buildMicBlockedHelp } from '../utils/micPermissionHelp';
import { useWhisperRecognition } from './useWhisperRecognition';

export function useVoiceSearch({ onResult, lang = 'pt-BR' } = {}) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);

  const hasWebSpeech = typeof window !== 'undefined'
    && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  // Fallback Whisper (iPhone Chrome, Android Firefox, etc.)
  const whisper = useWhisperRecognition({ onResult, lang: 'portuguese' });
  const useWhisper = !hasWebSpeech && whisper.supported;

  const supported = hasWebSpeech || whisper.supported;

  useEffect(() => () => {
    try { recognitionRef.current?.stop(); } catch { /* noop */ }
    recognitionRef.current = null;
  }, []);

  const stop = useCallback(() => {
    if (useWhisper) { whisper.stop(); return; }
    try { recognitionRef.current?.stop(); } catch { /* noop */ }
  }, [useWhisper, whisper]);

  const start = useCallback(async () => {
    if (useWhisper) { whisper.start(); return; }
    if (!hasWebSpeech) {
      setError('Seu navegador não suporta busca por voz. Use Chrome ou Edge.');
      return;
    }
    setError(null);

    // Priming: força o prompt de permissao do mic no Safari/macOS antes do SR.start
    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(t => t.stop());
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
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => setListening(true);
    rec.onresult = (event) => {
      let finalText = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      const text = (finalText || interim).trim();
      if (text) onResult?.(text);
    };
    rec.onerror = (event) => {
      const code = event.error;
      if (code === 'not-allowed' || code === 'service-not-allowed') {
        setError(buildMicBlockedHelp());
      } else if (code === 'no-speech') {
        setError('Não ouvi nada. Tente novamente.');
      } else if (code !== 'aborted') {
        setError('Erro ao gravar. Tente novamente.');
      }
      setListening(false);
    };
    rec.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    try {
      rec.start();
      recognitionRef.current = rec;
    } catch {
      setError('Não foi possível iniciar a gravação.');
      setListening(false);
    }
  }, [useWhisper, whisper, hasWebSpeech, lang, onResult]);

  const toggle = useCallback(() => {
    if (useWhisper ? whisper.listening : listening) stop();
    else start();
  }, [useWhisper, whisper, listening, stop, start]);

  const activeListening = useWhisper ? whisper.listening : listening;
  const activeError = useWhisper ? whisper.error : error;
  const processing = useWhisper ? whisper.processing : false;
  const loadProgress = useWhisper ? whisper.loadProgress : 0;

  return {
    supported,
    listening: activeListening,
    processing,
    loadProgress,
    engine: useWhisper ? 'whisper' : 'webspeech',
    error: activeError,
    start,
    stop,
    toggle,
    clearError: () => { setError(null); whisper.clearError?.(); },
  };
}
