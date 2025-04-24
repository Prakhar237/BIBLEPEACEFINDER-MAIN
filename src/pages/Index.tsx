import React, { useState } from 'react';
import Header from '@/components/Header';
import ProblemInput from '@/components/ProblemInput';
import VersesDisplay from '@/components/VersesDisplay';
import Footer from '@/components/Footer';
import LiveUserCounter from '@/components/LiveUserCounter';
import LanguageSelector from '@/components/LanguageSelector';
import BibleVersionSelector from '@/components/BibleVersionSelector';
import { fetchVerses } from '@/services/api';
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const translations = {
  en: {
    tagline: "We provide tailored advice straight from God's word for any situation you're facing"
  },
  es: {
    tagline: "Proporcionamos consejos personalizados directamente de la palabra de Dios para cualquier situación que enfrentes"
  },
  fr: {
    tagline: "Nous fournissons des conseils personnalisés directement de la parole de Dieu pour toute situation que vous rencontrez"
  }
};

const IndexContent = () => {
  const [userInput, setUserInput] = useState('');
  const [verses, setVerses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bibleVersion, setBibleVersion] = useState('KJV');
  const { toast } = useToast();
  const { language, setLanguage } = useLanguage();
  
  const t = translations[language as keyof typeof translations] || translations.en;
  const taglineWords = t.tagline.split(' ');

  const handleSubmit = async () => {
    if (!userInput.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const prompt = language === 'en' 
        ? userInput 
        : `${userInput} - generate in ${language === 'es' ? 'Spanish' : 'French'}`;
      
      const fetchedVerses = await fetchVerses(prompt, bibleVersion);
      setVerses(fetchedVerses);
      
      setTimeout(() => {
        window.scrollTo({
          top: document.getElementById('results-section')?.offsetTop || 0,
          behavior: 'smooth'
        });
      }, 100);
    } catch (error) {
      console.error('Error:', error);
      setError('We couldn\'t retrieve your verses. Please try again later.');
      toast({
        title: "Error fetching verses",
        description: error instanceof Error ? error.message : "We couldn't retrieve your verses. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    toast({
      title: "Language Updated",
      description: `The interface language has been changed to ${newLanguage === 'en' ? 'English' : newLanguage === 'es' ? 'Spanish' : 'French'}`,
    });
  };

  const handleBibleVersionChange = (version: string) => {
    setBibleVersion(version);
    toast({
      title: "Bible Version Updated",
      description: `Bible version has been changed to ${version}`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto py-8 px-4 flex-grow">
        <Header />
        
        <div className="mt-16 md:mt-24">
          <div className="flex flex-wrap justify-center gap-2 mb-6 text-center">
            {taglineWords.map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                className="text-lg md:text-xl text-white/90 inline-block"
              >
                {word}
              </motion.span>
            ))}
          </div>
          <div className="flex justify-center gap-4 mb-6">
            <BibleVersionSelector 
              onVersionChange={handleBibleVersionChange}
              selectedVersion={bibleVersion}
            />
            <LanguageSelector 
              onLanguageChange={handleLanguageChange} 
              currentLanguage={language}
            />
          </div>
          <ProblemInput 
            userInput={userInput}
            setUserInput={setUserInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
        
        {error && (
          <div className="mt-8 p-4 bg-red-50/90 text-red-800 rounded-lg flex items-start gap-3 max-w-2xl mx-auto">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Error occurred</h3>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}
        
        <div id="results-section" className="mt-10">
          <VersesDisplay verses={verses} />
        </div>
      </div>
      
      <LiveUserCounter />
      <Footer />
    </div>
  );
};

const Index = () => {
  return (
    <LanguageProvider>
      <IndexContent />
    </LanguageProvider>
  );
};

export default Index;
