import React, { useRef } from 'react';
import VerseCard from './VerseCard';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import html2pdf from 'html2pdf.js';

interface VersesDisplayProps {
  verses: string[];
}

const VersesDisplay: React.FC<VersesDisplayProps> = ({ verses }) => {
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);

  const exportPdf = async () => {
    if (!contentRef.current || verses.length === 0) return;

    const element = contentRef.current;
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: 'verses-for-the-soul.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    toast({
      title: "Preparing your PDF",
      description: "Please wait while we generate your verses document..."
    });

    try {
      await html2pdf().from(element).set(opt).save();
      
      toast({
        title: "PDF Downloaded Successfully",
        description: "Your verses have been saved as a PDF",
      });
    } catch (error) {
      toast({
        title: "Failed to generate PDF",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  if (verses.length === 0) return null;

  // Always skip the first verse and display the rest
  const displayVerses = verses.slice(1);

  return (
    <div className="w-full max-w-3xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-playfair text-2xl md:text-3xl text-white">Your Verses</h2>
        <Button 
          variant="outline" 
          className="border-black text-black hover:bg-black/10 shadow-sm transition-all duration-300" 
          onClick={exportPdf}
        >
          <Download className="mr-2 h-4 w-4" />
          Save as PDF
        </Button>
      </div>

      <div className="bg-white/60 p-6 md:p-8 rounded-xl shadow-md backdrop-blur-sm">
        <div ref={contentRef} className="space-y-6">
          <div className="text-center text-lg font-montserrat font-bold text-white mb-6">
            Here are your 21 Bible Verses that sympathise with your situation and provide you guidance
          </div>
          {displayVerses.length > 0 ? (
            displayVerses.map((verse, index) => (
              <VerseCard key={index} verse={verse} index={index} />
            ))
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default VersesDisplay;
