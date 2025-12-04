import React, { useState, useCallback } from 'react';
import { Upload, FileCode, X, AlertCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';

export const FileUpload = ({ onFileUpload, isLoading, multiFile = false }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [validationError, setValidationError] = useState(null);

    const ALLOWED_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.cs', '.php', '.rb', '.go', '.rs', '.swift'];

    const validateFile = (file) => {
        if (!file) return false;

        const fileName = file.name.toLowerCase();
        const isValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));

        if (!isValidExtension) {
            setValidationError(`Invalid file type. Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}`);
            return false;
        }

        setValidationError(null);
        return true;
    };

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);

        if (multiFile) {
            const validFiles = files.filter(validateFile);
            setSelectedFiles(prev => [...prev, ...validFiles]);
        } else {
            const file = files[0];
            if (file && validateFile(file)) {
                setSelectedFiles([file]);
            }
        }
    }, [multiFile]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        if (multiFile) {
            const validFiles = files.filter(validateFile);
            setSelectedFiles(prev => [...prev, ...validFiles]);
        } else {
            const file = files[0];
            if (file && validateFile(file)) {
                setSelectedFiles([file]);
            } else {
                e.target.value = null;
            }
        }
    };

    const handleRemoveFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setValidationError(null);
    };

    const handleReview = () => {
        if (selectedFiles.length > 0 && onFileUpload) {
            if (multiFile) {
                onFileUpload(selectedFiles);
            } else {
                onFileUpload(selectedFiles[0]);
            }
        }
    };

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-card/80'
                        }`}
                >
                    {selectedFiles.length === 0 ? (
                        <>
                            <div className="flex flex-col items-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Upload className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        Upload Your Code
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Drag and drop your code file{multiFile ? 's' : ''} here, or click to browse
                                    </p>
                                    {multiFile && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Multiple files supported
                                        </p>
                                    )}
                                </div>
                                <label htmlFor="file-upload">
                                    <Button variant="secondary" className="cursor-pointer" asChild>
                                        <span>Browse Files</span>
                                    </Button>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept={ALLOWED_EXTENSIONS.join(',')}
                                        multiple={multiFile}
                                    />
                                </label>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center space-y-4 animate-fade-in">
                            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                                <FileCode className="w-8 h-8 text-accent" />
                            </div>

                            <div className="w-full space-y-2">
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className="flex items-center space-x-3 bg-secondary/50 px-4 py-3 rounded-lg">
                                        <FileCode className="w-5 h-5 text-primary flex-shrink-0" />
                                        <span className="text-sm font-medium text-foreground flex-1 truncate">
                                            {file.name}
                                        </span>
                                        <Badge variant="secondary" className="text-xs">
                                            {(file.size / 1024).toFixed(1)} KB
                                        </Badge>
                                        <button
                                            onClick={() => handleRemoveFile(index)}
                                            className="p-1 hover:bg-destructive/10 rounded transition-colors flex-shrink-0"
                                            disabled={isLoading}
                                        >
                                            <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {multiFile && (
                                <label htmlFor="file-upload-more">
                                    <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                                        <span>
                                            <Upload className="w-4 h-4 mr-2" />
                                            Add More Files
                                        </span>
                                    </Button>
                                    <input
                                        id="file-upload-more"
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept={ALLOWED_EXTENSIONS.join(',')}
                                        multiple
                                    />
                                </label>
                            )}

                            <Button
                                onClick={handleReview}
                                disabled={isLoading}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                                        Reviewing...
                                    </>
                                ) : (
                                    `Review ${selectedFiles.length} File${selectedFiles.length > 1 ? 's' : ''}`
                                )}
                            </Button>
                        </div>
                    )}
                </div>

                {validationError && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {validationError}
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
};