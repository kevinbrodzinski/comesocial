
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { voiceProcessor, VoiceCommand, VoiceResponse } from '@/services/ai/VoiceProcessor';

interface VoiceInterfaceProps {
  onVoiceCommand?: (command: VoiceCommand) => void;
  onVoiceResponse?: (response: VoiceResponse) => void;
  disabled?: boolean;
}

const VoiceInterface = ({ onVoiceCommand, onVoiceResponse, disabled = false }: VoiceInterfaceProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    setIsSupported(voiceProcessor.isSupported());
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isListening) {
      startVolumeVisualization();
    } else {
      stopVolumeVisualization();
    }
  }, [isListening]);

  const startVolumeVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      
      const updateVolume = () => {
        if (analyserRef.current && isListening) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setVolume(average / 255);
          animationRef.current = requestAnimationFrame(updateVolume);
        }
      };
      
      updateVolume();
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopVolumeVisualization = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setVolume(0);
  };

  const handleStartListening = async () => {
    if (disabled || !isSupported) return;

    try {
      setError(null);
      setTranscript('');
      setIsListening(true);

      const result = await voiceProcessor.startListening();
      setTranscript(result);
      
      // Process the voice command
      setIsProcessing(true);
      const command = await voiceProcessor.processVoiceCommand(result);
      
      onVoiceCommand?.(command);

      // Generate and speak response
      const response = await voiceProcessor.generateVoiceResponse(command);
      
      if (response.shouldSpeak) {
        setIsSpeaking(true);
        await voiceProcessor.speak(response.text);
        setIsSpeaking(false);
      }

      onVoiceResponse?.(response);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Voice processing failed');
    } finally {
      setIsListening(false);
      setIsProcessing(false);
    }
  };

  const handleStopListening = () => {
    voiceProcessor.stopListening();
    setIsListening(false);
    setIsProcessing(false);
  };

  if (!isSupported) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <VolumeX className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Voice features are not supported in your browser
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          {/* Voice Visualization */}
          <div className="relative">
            <div
              className={`w-24 h-24 mx-auto rounded-full border-4 transition-all duration-200 flex items-center justify-center ${
                isListening
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : isSpeaking
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-gray-50'
              }`}
              style={{
                transform: isListening ? `scale(${1 + volume * 0.3})` : 'scale(1)',
              }}
            >
              {isListening ? (
                <Mic className="w-8 h-8 text-blue-600" />
              ) : isSpeaking ? (
                <Volume2 className="w-8 h-8 text-green-600" />
              ) : (
                <MicOff className="w-8 h-8 text-gray-500" />
              )}
            </div>

            {/* Volume bars visualization */}
            {isListening && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 bg-blue-500 rounded-full transition-all duration-100 ${
                      volume * 5 > i ? 'h-4' : 'h-1'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Status Text */}
          <div className="min-h-[2rem]">
            {isListening && (
              <p className="text-blue-600 font-medium">Listening...</p>
            )}
            {isProcessing && (
              <p className="text-orange-600 font-medium">Processing...</p>
            )}
            {isSpeaking && (
              <p className="text-green-600 font-medium">Speaking...</p>
            )}
            {!isListening && !isProcessing && !isSpeaking && (
              <p className="text-muted-foreground">Tap to speak with Nova</p>
            )}
          </div>

          {/* Action Button */}
          <Button
            onClick={isListening ? handleStopListening : handleStartListening}
            disabled={disabled || isProcessing || isSpeaking}
            size="lg"
            className={`w-full ${
              isListening ? 'bg-red-500 hover:bg-red-600' : ''
            }`}
          >
            {isListening ? 'Stop' : 'Start Voice Chat'}
          </Button>

          {/* Transcript */}
          {transcript && (
            <div className="p-3 bg-muted rounded-lg text-left">
              <p className="text-sm text-muted-foreground mb-1">You said:</p>
              <p className="text-sm">{transcript}</p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setError(null)}
                className="mt-2"
              >
                Dismiss
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceInterface;
