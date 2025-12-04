import React, { useEffect, useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { SummaryCard } from '../components/SummaryCard';
import { CodePanel } from '../components/CodePanel';
import { DiffPanel } from '../components/DiffPanel';
import { LoaderSkeleton } from '../components/LoaderSkeleton';
import { DownloadReport } from '../components/DownloadReport';
import { ReviewHistory } from '../components/ReviewHistory';
import { SeverityAnalysis } from '../components/SeverityAnalysis';
import { useCodeReview } from '../hooks/useCodeReview';
import { FileCode, Sparkles, Code2, History as HistoryIcon } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function Home() {
    const {
        summary,
        originalCode,
        improvedCode,
        diff,
        filename,
        loading,
        error,
        uploadFile,
        multiFileResults,
        severity,
        issues,
        loadReview,
    } = useCodeReview();

    const { toast } = useToast();
    const [showHistory, setShowHistory] = useState(false);
    const [multiFileMode, setMultiFileMode] = useState(false);
    const [activeFileIndex, setActiveFileIndex] = useState(0);

    useEffect(() => {
        if (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error,
            });
        }
    }, [error, toast]);

    const hasResults = summary && originalCode && improvedCode;

    const handleSelectReview = (review) => {
        loadReview(review);
        setShowHistory(false);
    };

    const handleFileSelect = (index) => {
        setActiveFileIndex(index);
        const file = multiFileResults[index];
        if (file) {
            loadReview(file);
        }
    };

    const reviewData = {
        summary,
        originalCode,
        improvedCode,
        diff: diff.old,
        filename,
        severity,
        issues,
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                <Code2 className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-foreground">AI Code Review</h1>
                                <p className="text-xs text-muted-foreground">Powered by Ollama</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant={multiFileMode ? "default" : "outline"}
                                size="sm"
                                onClick={() => setMultiFileMode(!multiFileMode)}
                            >
                                {multiFileMode ? 'Multi-File Mode' : 'Single File Mode'}
                            </Button>
                            <Button
                                variant={showHistory ? "default" : "outline"}
                                size="sm"
                                onClick={() => setShowHistory(!showHistory)}
                            >
                                <HistoryIcon className="w-4 h-4 mr-2" />
                                History
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Hero Section */}
                    <div className="text-center space-y-3 mb-8">
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                            Elevate Your Code Quality
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Upload your code and get instant AI-powered reviews with actionable improvements
                        </p>
                    </div>

                    {/* History Sidebar */}
                    {showHistory && (
                        <div className="animate-fade-in">
                            <ReviewHistory onSelectReview={handleSelectReview} />
                        </div>
                    )}

                    {/* File Upload */}
                    <FileUpload
                        onFileUpload={uploadFile}
                        isLoading={loading}
                        multiFile={multiFileMode}
                    />

                    {/* Multi-file tabs */}
                    {multiFileResults.length > 1 && (
                        <Tabs value={activeFileIndex.toString()} onValueChange={(v) => handleFileSelect(parseInt(v))}>
                            <TabsList className="w-full justify-start overflow-x-auto">
                                {multiFileResults.map((file, index) => (
                                    <TabsTrigger key={index} value={index.toString()}>
                                        <FileCode className="w-4 h-4 mr-2" />
                                        {file.filename}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    )}

                    {/* Loading State */}
                    {loading && <LoaderSkeleton />}

                    {/* Results */}
                    {!loading && hasResults && (
                        <div className="space-y-8 animate-fade-in">
                            {/* Summary and Severity */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <SummaryCard summary={summary} />
                                </div>
                                <div>
                                    <SeverityAnalysis severity={severity} issues={issues} />
                                </div>
                            </div>

                            {/* Download Report */}
                            <DownloadReport reviewData={reviewData} />

                            {/* Code Comparison */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <CodePanel
                                    title={`Original Code (${filename})`}
                                    code={originalCode}
                                    icon={FileCode}
                                    language="javascript"
                                />
                                <CodePanel
                                    title="Improved Code"
                                    code={improvedCode}
                                    icon={Sparkles}
                                    language="javascript"
                                />
                            </div>

                            {/* Diff Viewer */}
                            <DiffPanel oldCode={diff.old} newCode={diff.new} />
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-16">
                <div className="container mx-auto px-4 py-6">
                    <p className="text-center text-sm text-muted-foreground">
                        Built by Shreejit Bhakte
                    </p>
                </div>
            </footer>
        </div>
    );
}