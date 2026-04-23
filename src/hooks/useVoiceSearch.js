import { useCallback, useEffect, useRef, useState } from 'react';

export function useVoiceSearch({ onResult, lang = 'pt-BR' } = {}) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);

  const supported = typeof window !== 'undefined'
    && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => () => {
    try { recognitionRef.current?.stop(); } catch { /* noop */ }
    recognitionRef.current = null;
  }, []);

  const stop = useCallback(() => {
    try { recognitionRef.current?.stop(); } catch { /* noop */ }
  }, []);

  const start = useCallback(async () => {
    if (!supported) {
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
          setError('Microfone bloqueado. Permita acesso nas Preferências do navegador.');
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
        setError('Permita o acesso ao microfone para buscar por voz.');
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
  }, [supported, lang, onResult]);

  const toggle = useCallback(() => {
    if (listening) stop();
    else start();
  }, [listening, stop, start]);

  return { supported, listening, error, start, stop, toggle, clearError: () => setError(null) };
}
