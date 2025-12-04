import { useState } from 'react';
import { uploadCodeFile } from '../api';
import { saveReviewToHistory } from '../utils/historyManager';

export const useCodeReview = () => {
    const [summary, setSummary] = useState('');
    const [originalCode, setOriginalCode] = useState('');
    const [improvedCode, setImprovedCode] = useState('');
    const [diff, setDiff] = useState({ old: '', new: '' });
    const [filename, setFilename] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [multiFileResults, setMultiFileResults] = useState([]);
    const [severity, setSeverity] = useState(null);
    const [issues, setIssues] = useState([]);

    const analyzeSeverity = (summary, improvedCode, originalCode) => {
        // Simple heuristic-based severity detection
        const issues = [];
        const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };

        // Analyze based on keywords in summary
        const criticalKeywords = ['security', 'vulnerability', 'injection', 'unsafe', 'critical'];
        const highKeywords = ['error', 'bug', 'crash', 'memory leak', 'performance'];
        const mediumKeywords = ['warning', 'deprecated', 'inefficient', 'refactor'];
        const lowKeywords = ['style', 'formatting', 'comment', 'naming'];

        const summaryLower = summary.toLowerCase();

        criticalKeywords.forEach(keyword => {
            if (summaryLower.includes(keyword)) {
                severityCounts.critical++;
                issues.push({
                    severity: 'critical',
                    message: `Critical issue detected: ${keyword}`,
                });
            }
        });

        highKeywords.forEach(keyword => {
            if (summaryLower.includes(keyword)) {
                severityCounts.high++;
                issues.push({
                    severity: 'high',
                    message: `High priority issue: ${keyword}`,
                });
            }
        });

        mediumKeywords.forEach(keyword => {
            if (summaryLower.includes(keyword)) {
                severityCounts.medium++;
                issues.push({
                    severity: 'medium',
                    message: `Medium priority improvement: ${keyword}`,
                });
            }
        });

        lowKeywords.forEach(keyword => {
            if (summaryLower.includes(keyword)) {
                severityCounts.low++;
                issues.push({
                    severity: 'low',
                    message: `Low priority suggestion: ${keyword}`,
                });
            }
        });

        // If no specific issues found, add a general low severity item
        if (issues.length === 0) {
            severityCounts.low = 1;
            issues.push({
                severity: 'low',
                message: 'Code review completed with minor suggestions',
            });
        }

        return { severityCounts, issues };
    };

    const uploadFile = async (fileOrFiles) => {
        const isMultiple = Array.isArray(fileOrFiles);
        setLoading(true);
        setError(null);

        // Reset previous results
        setSummary('');
        setOriginalCode('');
        setImprovedCode('');
        setDiff({ old: '', new: '' });
        setFilename('');
        setMultiFileResults([]);
        setSeverity(null);
        setIssues([]);

        try {
            if (isMultiple) {
                // Handle multiple files
                const results = [];
                for (const file of fileOrFiles) {
                    const data = await uploadCodeFile(file);
                    const severityData = analyzeSeverity(data.summary, data.improved_code, data.original_code);

                    const result = {
                        filename: data.filename,
                        summary: data.summary,
                        originalCode: data.original_code,
                        improvedCode: data.improved_code,
                        diff: data.diff,
                        severity: severityData.severityCounts,
                        issues: severityData.issues,
                    };

                    results.push(result);

                    // Save each to history
                    saveReviewToHistory(result);
                }

                setMultiFileResults(results);

                // Set first file as active view
                if (results.length > 0) {
                    const first = results[0];
                    setSummary(first.summary);
                    setOriginalCode(first.originalCode);
                    setImprovedCode(first.improvedCode);
                    setDiff({ old: first.originalCode, new: first.improvedCode });
                    setFilename(first.filename);
                    setSeverity(first.severity);
                    setIssues(first.issues);
                }
            } else {
                // Handle single file
                const data = await uploadCodeFile(fileOrFiles);
                const severityData = analyzeSeverity(data.summary, data.improved_code, data.original_code);

                setSummary(data.summary);
                setOriginalCode(data.original_code);
                setImprovedCode(data.improved_code);
                setDiff({
                    old: data.original_code,
                    new: data.improved_code,
                });
                setFilename(data.filename);
                setSeverity(severityData.severityCounts);
                setIssues(severityData.issues);

                // Save to history
                saveReviewToHistory({
                    filename: data.filename,
                    summary: data.summary,
                    originalCode: data.original_code,
                    improvedCode: data.improved_code,
                    diff: data.diff,
                    severity: severityData.severityCounts,
                    issues: severityData.issues,
                });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.message || 'Failed to process the file';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const loadReview = (reviewData) => {
        setSummary(reviewData.summary || '');
        setOriginalCode(reviewData.originalCode || '');
        setImprovedCode(reviewData.improvedCode || '');
        setDiff({
            old: reviewData.originalCode || '',
            new: reviewData.improvedCode || '',
        });
        setFilename(reviewData.filename || '');
        setSeverity(reviewData.severity || null);
        setIssues(reviewData.issues || []);
    };

    return {
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
    };
};