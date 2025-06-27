
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SplashScreenProps {
  onComplete: (targetTab: string, initialMessage?: string) => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showNova, setShowNova] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const getDayOfWeek = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const textLines = [
    "Hi there,",
    `Happy ${getDayOfWeek()}`,
    "What do you want to do tonight?"
  ];

  const quickActions = [
    { label: 'View My Plans', targetTab: 'planner' },
    { label: "Who's Out?", targetTab: 'friends' },
    { label: "What's Hot Tonight?", targetTab: 'home', message: 'show me the hottest spots tonight' },
    { label: 'Surprise Me', targetTab: 'home', message: 'surprise me with something fun' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < textLines.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [currentStep, textLines.length]);

  const handleInputSubmit = () => {
    if (userInput.trim()) {
      setShowNova(true);
      setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          onComplete('home', userInput);
        }, 800);
      }, 2000);
    }
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    // For navigation actions (planner, friends), go directly without Nova animation
    if (action.targetTab !== 'home') {
      setIsTransitioning(true);
      setTimeout(() => {
        onComplete(action.targetTab);
      }, 300);
      return;
    }

    // For chat actions, show Nova animation
    setUserInput(action.message || '');
    setShowNova(true);
    setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        onComplete(action.targetTab, action.message);
      }, 800);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 overflow-hidden px-6">
      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className={`text-center max-w-md w-full transition-all duration-1000 ${isTransitioning ? 'opacity-0 transform translate-y-8 scale-95' : ''}`}>
        {/* Enhanced animated text lines with dramatic fade-in */}
        <div className="mb-12 space-y-4">
          {textLines.map((line, index) => (
            <div
              key={index}
              className={`text-2xl md:text-3xl font-light text-white transition-all duration-1000 ease-out ${
                index <= currentStep 
                  ? 'opacity-100 transform translate-y-0 scale-100 blur-0' 
                  : 'opacity-0 transform translate-y-8 scale-95 blur-sm'
              }`}
              style={{ 
                transitionDelay: `${index * 300}ms`,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}
            >
              {line}
            </div>
          ))}
        </div>

        {/* Input field - appears after all text is shown with enhanced animation */}
        <div className={`transition-all duration-1000 ease-out delay-1500 ${
          currentStep >= textLines.length - 1 
            ? 'opacity-100 transform translate-y-0 scale-100 blur-0' 
            : 'opacity-0 transform translate-y-8 scale-95 blur-sm'
        }`}>
          <div className="mb-8">
            <Input
              type="text"
              placeholder="Type your vibe…"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 text-lg py-4 px-6 rounded-2xl backdrop-blur-sm focus:bg-white/15 focus:border-purple-400/50 transition-all w-full"
              disabled={showNova}
            />
          </div>

          {/* Quick Action Pills with staggered animation */}
          <div className={`grid grid-cols-2 gap-3 transition-all duration-1000 ease-out delay-2000 ${
            currentStep >= textLines.length - 1 
              ? 'opacity-100 transform translate-y-0 scale-100' 
              : 'opacity-0 transform translate-y-8 scale-95'
          }`}>
            {quickActions.map((action, index) => (
              <Button
                key={index}
                onClick={() => handleQuickAction(action)}
                disabled={showNova}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-sm py-3 px-4 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in"
                variant="ghost"
                style={{ animationDelay: `${2200 + index * 100}ms` }}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Nova response card */}
        {showNova && (
          <div className="fixed bottom-8 left-4 right-4 animate-slide-in-bottom">
            <Card className="bg-gradient-to-r from-purple-600 to-blue-600 border-none shadow-2xl max-w-sm mx-auto">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-sm">
                    N
                  </div>
                  <div className="text-white">
                    <div className="font-medium text-sm">Nova</div>
                    <div className="text-sm opacity-90">Got it. Let me find some spots for you…</div>
                  </div>
                </div>
                <div className="mt-3 flex space-x-1">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SplashScreen;
