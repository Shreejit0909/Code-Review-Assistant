import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Sparkles } from 'lucide-react';

export const SummaryCard = ({ summary }) => {
    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span>AI Summary</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground leading-relaxed">{summary}</p>
            </CardContent>
        </Card>
    );
};