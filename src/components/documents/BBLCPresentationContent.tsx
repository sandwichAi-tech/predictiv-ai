import { useState, useCallback, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Download, ZoomIn, ZoomOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDF_URL = "/deck/BBLC_Corporate_Presentation.pdf";

interface BBLCPresentationContentProps {
  onClose?: () => void;
}

const BBLCPresentationContent = ({ onClose }: BBLCPresentationContentProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const goToSlide = useCallback((slide: number) => {
    if (slide >= 1 && slide <= numPages) {
      setCurrentSlide(slide);
    }
  }, [numPages]);

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const zoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.25, 2.5));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === " ") {
      e.preventDefault();
      nextSlide();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "Escape") {
      if (isFullscreen) {
        setIsFullscreen(false);
      } else if (onClose) {
        onClose();
      }
    }
  }, [nextSlide, prevSlide, isFullscreen, onClose]);

  // Auto-focus for keyboard navigation
  useEffect(() => {
    const timer = setTimeout(() => {
      document.getElementById('presentation-container')?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const containerClass = isFullscreen
    ? "fixed inset-0 z-50 bg-black flex flex-col"
    : "relative flex flex-col h-full bg-black";

  const totalSlides = numPages || 12;

  return (
    <div 
      id="presentation-container"
      className={containerClass} 
      tabIndex={0} 
      onKeyDown={handleKeyDown}
    >
      {/* Header Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-black border-b border-primary/20 flex-shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-primary font-mono text-sm font-bold">
            SLIDE {currentSlide} OF {totalSlides}
          </span>
          <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
            <kbd className="px-1.5 py-0.5 bg-muted/30 rounded text-[10px]">←</kbd>
            <kbd className="px-1.5 py-0.5 bg-muted/30 rounded text-[10px]">→</kbd>
            <span className="ml-1">to navigate</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center gap-1 border border-primary/20 rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={zoomOut}
              disabled={scale <= 0.5}
              className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground font-mono w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={zoomIn}
              disabled={scale >= 2.5}
              className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Download Button */}
          <a
            href={PDF_URL}
            download="BBLC_Corporate_Presentation.pdf"
            className="hidden sm:inline-flex"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
            >
              <Download className="h-4 w-4" />
            </Button>
          </a>

          {/* Fullscreen Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>

          {/* Close Button */}
          {onClose && !isFullscreen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Main Slide Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-auto bg-gradient-to-b from-black via-black/95 to-black">
        {/* Ambient Glow Effect */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/10 blur-[100px] rounded-full" />
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          disabled={currentSlide === 1}
          className="absolute left-2 sm:left-4 z-10 p-2 sm:p-3 rounded-full bg-black/50 border border-primary/30 text-primary hover:bg-primary/20 hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black/50"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={nextSlide}
          disabled={currentSlide === numPages}
          className="absolute right-2 sm:right-4 z-10 p-2 sm:p-3 rounded-full bg-black/50 border border-primary/30 text-primary hover:bg-primary/20 hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black/50"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* PDF Viewer */}
        <div className="relative flex items-center justify-center p-4 sm:p-8">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <span className="text-primary font-mono text-sm">Loading presentation...</span>
              </div>
            </div>
          )}
          
          <Document
            file={PDF_URL}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={null}
            className="flex items-center justify-center"
          >
            <Page
              pageNumber={currentSlide}
              scale={scale}
              className="shadow-2xl shadow-primary/10 rounded-lg overflow-hidden"
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>
      </div>

      {/* Thumbnail Navigation Strip */}
      <div className="px-4 py-3 bg-black border-t border-primary/20 flex-shrink-0">
        <div className="flex items-center justify-center gap-2 overflow-x-auto scrollbar-none">
          {Array.from({ length: totalSlides }, (_, i) => i + 1).map((slideNum) => (
            <button
              key={slideNum}
              onClick={() => goToSlide(slideNum)}
              className={`
                flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-mono text-xs sm:text-sm font-bold
                transition-all duration-200 border
                ${currentSlide === slideNum
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30'
                  : 'bg-black/50 text-muted-foreground border-primary/20 hover:border-primary/50 hover:text-primary'
                }
              `}
            >
              {slideNum}
            </button>
          ))}
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3 h-1 bg-muted/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-300 ease-out"
            style={{ width: `${(currentSlide / totalSlides) * 100}%` }}
          />
        </div>
      </div>

      {/* Mobile Download Button */}
      <div className="sm:hidden px-4 pb-3 bg-black flex-shrink-0">
        <a
          href={PDF_URL}
          download="BBLC_Corporate_Presentation.pdf"
          className="block"
        >
          <Button
            variant="outline"
            className="w-full border-primary/30 text-primary hover:bg-primary/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </a>
      </div>
    </div>
  );
};

export default BBLCPresentationContent;
