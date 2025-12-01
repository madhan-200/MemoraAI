/**
 * Voice input component using Web Speech API
 */
import { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

export const VoiceInput = ({ onTranscript, disabled = false }) => {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        // Check if Web Speech API is supported
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            setIsSupported(true);

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognitionInstance = new SpeechRecognition();

            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = false;
            recognitionInstance.lang = 'en-US';

            recognitionInstance.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                onTranscript(transcript);
                setIsListening(false);
            };

            recognitionInstance.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognitionInstance.onend = () => {
                setIsListening(false);
            };

            setRecognition(recognitionInstance);
        }
    }, [onTranscript]);

    const toggleListening = () => {
        if (!recognition) return;

        if (isListening) {
            recognition.stop();
            setIsListening(false);
        } else {
            recognition.start();
            setIsListening(true);
        }
    };

    if (!isSupported) {
        return null; // Don't render if not supported
    }

    return (
        <button
            onClick={toggleListening}
            disabled={disabled}
            className={`p-3 rounded-lg transition-all duration-200 ${isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                    : 'glass-effect hover:bg-white/10 text-dark-100'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isListening ? 'Stop recording' : 'Start voice input'}
        >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
    );
};
