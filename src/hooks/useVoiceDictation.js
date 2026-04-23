import { useCallback, useEffect, useRef, useState } from 'react';
import { buildMicBlockedHelp } from '../utils/micPermissionHelp';

// Ditado contínuo: acumula transcript até usuário parar manualmente.
export function useVoiceDictation({ lang = 'pt-BR', onFinalSegment } = {}) {
  const recognitionRef = useRef(null);
  const baseTranscriptRef = useRef('');
  const shouldContinueRef = useRef(false);
  const onFinalSegmentRef = useRef(onFinalSegment);
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { onFinalSegmentRef.current = onFinalSegment; }, [onFinalSegment]);

  const supported = typeof window !== 'undefined'
    && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => () => {
    shouldContinueRef.current = false;
    try { recognitionRef.current?.stop(); } catch { /* noop */ }
    recognitionRef.current = null;
  }, []);

  const createRecognition = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = true;
    rec.maxAlternatives = 1;

    rec.onresult = (event) => {
      let finalized = '';
      let partial = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) finalized += r[0].transcript;
        else partial += r[0].transcript;
      }
      if (finalized) {
        const seg = finalized.trim();
        baseTranscriptRef.current = (baseTranscriptRef.current + ' ' + seg).trim();
        setTranscript(baseTranscriptRef.current);
        setInterim('');
        if (seg) {
          try { onFinalSegmentRef.current?.(seg); } catch { /* noop */ }
        }
      } else {
        setInterim(partial);
      }
    };
    rec.onerror = (event) => {
      const code = event.error;
      if (code === 'not-allowed' || code === 'service-not-allowed') {
        setError(buildMicBlockedHelp());
        shouldContinueRef.current = false;
      } else if (code === 'no-speech') {
        // silêncio prolongado — deixa o onend reiniciar
      } else if (code !== 'aborted') {
        setError('Erro no microfone. Tente novamente.');
      }
    };
    rec.onend = () => {
      if (shouldContinueRef.current) {
        try { rec.start(); } catch { /* pode falhar se Chrome bloqueou */ }
      } else {
        setListening(false);
        setInterim('');
        recognitionRef.current = null;
      }
    };
    return rec;
  }, [lang]);

  const start = useCallback(async () => {
    if (!supported) {
      setError('Seu navegador não suporta ditado por voz.');
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

    baseTranscriptRef.current = '';
    setTranscript('');
    setInterim('');
    shouldContinueRef.current = true;
    const rec = createRecognition();
    try {
      rec.start();
      recognitionRef.current = rec;
      setListening(true);
    } catch {
      setError('Não foi possível iniciar a gravação.');
      shouldContinueRef.current = false;
      setListening(false);
    }
  }, [supported, createRecognition]);

  const stop = useCallback(() => {
    shouldContinueRef.current = false;
    try { recognitionRef.current?.stop(); } catch { /* noop */ }
  }, []);

  const reset = useCallback(() => {
    baseTranscriptRef.current = '';
    setTranscript('');
    setInterim('');
    setError(null);
  }, []);

  return { supported, listening, transcript, interim, error, start, stop, reset };
}
