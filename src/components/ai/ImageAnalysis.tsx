
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, Loader2, MapPin, DollarSign, Users } from 'lucide-react';
import { visionProcessor, VisionAnalysisResult, DocumentAnalysisResult } from '@/services/ai/VisionProcessor';

interface ImageAnalysisProps {
  onVenueFound?: (venueInfo: VisionAnalysisResult) => void;
  onDocumentAnalyzed?: (documentInfo: DocumentAnalysisResult) => void;
  onSimilarVenuesRequested?: (queries: string[]) => void;
  className?: string;
}

const ImageAnalysis = ({ 
  onVenueFound, 
  onDocumentAnalyzed, 
  onSimilarVenuesRequested,
  className = '' 
}: ImageAnalysisProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<VisionAnalysisResult | null>(null);
  const [documentResult, setDocumentResult] = useState<DocumentAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState<'venue' | 'document' | 'similar'>('venue');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedImage(file);
    setError(null);
    setAnalysisResult(null);
    setDocumentResult(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      if (analysisType === 'venue') {
        const result = await visionProcessor.analyzeVenueImage(selectedImage);
        setAnalysisResult(result);
        onVenueFound?.(result);
      } else if (analysisType === 'document') {
        const result = await visionProcessor.analyzeDocument(selectedImage);
        setDocumentResult(result);
        onDocumentAnalyzed?.(result);
      } else if (analysisType === 'similar') {
        const queries = await visionProcessor.findSimilarVenues(selectedImage);
        onSimilarVenuesRequested?.(queries);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setDocumentResult(null);
    setError(null);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>AI Image Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Analysis Type Selector */}
          <div className="flex space-x-2">
            <Button
              variant={analysisType === 'venue' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAnalysisType('venue')}
            >
              Identify Venue
            </Button>
            <Button
              variant={analysisType === 'document' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAnalysisType('document')}
            >
              Read Menu/Flyer
            </Button>
            <Button
              variant={analysisType === 'similar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAnalysisType('similar')}
            >
              Find Similar
            </Button>
          </div>

          {/* Image Upload */}
          <div className="space-y-3">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
              <Button
                variant="outline"
                onClick={() => cameraInputRef.current?.click()}
                className="flex-1"
              >
                <Camera className="w-4 h-4 mr-2" />
                Take Photo
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="space-y-3">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Selected"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleClearImage}
                  className="absolute top-2 right-2"
                >
                  Clear
                </Button>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full"
              >
                {isAnalyzing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isAnalyzing ? 'Analyzing...' : `Analyze ${analysisType === 'venue' ? 'Venue' : analysisType === 'document' ? 'Document' : 'for Similar Places'}`}
              </Button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Venue Analysis Results */}
          {analysisResult && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Venue Analysis
                  <Badge className={`text-white ${getConfidenceColor(analysisResult.confidence)}`}>
                    {getConfidenceText(analysisResult.confidence)} Confidence
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {analysisResult.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {analysisResult.venueName && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{analysisResult.venueName}</span>
                    </div>
                  )}

                  {analysisResult.venueType && (
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{analysisResult.venueType}</Badge>
                    </div>
                  )}

                  {analysisResult.atmosphere && (
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-sm">{analysisResult.atmosphere}</span>
                    </div>
                  )}

                  {analysisResult.priceRange && (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="text-sm">{analysisResult.priceRange}</span>
                    </div>
                  )}
                </div>

                {analysisResult.suggestions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Suggestions:</p>
                    <div className="space-y-1">
                      {analysisResult.suggestions.map((suggestion, index) => (
                        <p key={index} className="text-sm text-muted-foreground">
                          • {suggestion}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Document Analysis Results */}
          {documentResult && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Document Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Badge variant="outline" className="capitalize">
                  {documentResult.type}
                </Badge>

                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{documentResult.text}</p>
                </div>

                {Object.keys(documentResult.extractedInfo).length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Extracted Information:</p>
                    <div className="space-y-1">
                      {Object.entries(documentResult.extractedInfo).map(([key, value]) => (
                        value && (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="capitalize text-muted-foreground">{key}:</span>
                            <span>{Array.isArray(value) ? value.join(', ') : value}</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}

                {documentResult.recommendations.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Recommendations:</p>
                    <div className="space-y-1">
                      {documentResult.recommendations.map((rec, index) => (
                        <p key={index} className="text-sm text-muted-foreground">
                          • {rec}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageAnalysis;
