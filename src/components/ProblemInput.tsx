import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProblemInputProps {
  userInput: string;
  setUserInput: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: () => void;
  isLoading: boolean;
}

const ProblemInput: React.FC<ProblemInputProps> = ({ 
  userInput, 
  setUserInput, 
  handleSubmit,
  isLoading 
}) => {
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Get reference to the audio element when component mounts
  React.useEffect(() => {
    audioRef.current = document.querySelector('audio');
  }, []);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Please try using a modern browser like Chrome.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Pause background music when starting to listen
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "Listening...",
          description: "Start speaking. Click the microphone again to stop.",
        });
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        setUserInput(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        // Resume background music on error
        if (audioRef.current) {
          audioRef.current.play();
        }
        toast({
          title: "Error",
          description: "There was an error with speech recognition. Please try again.",
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setIsListening(false);
        // Resume background music when recognition ends
        if (audioRef.current) {
          audioRef.current.play();
        }
      };

      recognition.start();
    } catch (error) {
      console.error('Speech recognition error:', error);
      // Resume background music on error
      if (audioRef.current) {
        audioRef.current.play();
      }
      toast({
        title: "Error",
        description: "There was an error starting speech recognition. Please try again.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      // Resume background music when stopping manually
      if (audioRef.current) {
        audioRef.current.play();
      }
      toast({
        title: "Stopped Listening",
        description: "Speech recognition has been stopped.",
      });
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 flex flex-col items-center space-y-6">
      <div className="w-full relative">
        <Textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Explain your problem or situation here..."
          className="min-h-28 p-4 text-lg border-0 shadow-lg rounded-2xl bg-[#f5e6d0]/90 backdrop-blur-sm text-gray-800 focus:ring-0 focus:border-0 placeholder:text-gray-600 pr-12"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleListening}
          className={`absolute bottom-2 right-2 h-8 w-8 rounded-full transition-all duration-300 ${
            isListening 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'bg-white/50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </Button>
      </div>
      
      <div>
        <Button
          onClick={handleSubmit}
          disabled={!userInput.trim() || isLoading}
          className="px-10 py-6 text-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 rounded-full border-0 font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
        >
          <span className="text-2xl">✦</span>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Finding verses...
            </>
          ) : (
            "Find My Verses"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProblemInput;
