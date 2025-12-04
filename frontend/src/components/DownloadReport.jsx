import React from 'react';
import { Download, FileJson, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { downloadJSON, downloadPDF } from '../utils/reportGenerator';

export const DownloadReport = ({ reviewData }) => {
    const handleDownloadJSON = () => {
        downloadJSON(reviewData, reviewData.filename || 'code');
    };

    const handleDownloadPDF = () => {
        downloadPDF(reviewData);
    };

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Download className="w-5 h-5 text-primary" />
                    <span>Download Report</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-3">
                    <Button
                        onClick={handleDownloadPDF}
                        variant="default"
                        className="flex items-center space-x-2"
                    >
                        <FileText className="w-4 h-4" />
                        <span>Download PDF</span>
                    </Button>
                    <Button
                        onClick={handleDownloadJSON}
                        variant="outline"
                        className="flex items-center space-x-2"
                    >
                        <FileJson className="w-4 h-4" />
                        <span>Download JSON</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
