import React, { useState, useEffect } from 'react';
import { History, Trash2, Eye, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import {
    getReviewHistory,
    deleteReviewFromHistory,
    clearReviewHistory,
} from '../utils/historyManager';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from './ui/alert-dialog';

export const ReviewHistory = ({ onSelectReview }) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = () => {
        const reviews = getReviewHistory();
        setHistory(reviews);
    };

    const handleDelete = (id) => {
        deleteReviewFromHistory(id);
        loadHistory();
    };

    const handleClearAll = () => {
        clearReviewHistory();
        loadHistory();
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString();
    };

    if (history.length === 0) {
        return (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <History className="w-5 h-5 text-primary" />
                        <span>Review History</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No reviews yet. Upload a file to get started!
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                        <History className="w-5 h-5 text-primary" />
                        <span>Review History</span>
                        <Badge variant="secondary">{history.length}</Badge>
                    </CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Clear All
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete all review history. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleClearAll}>
                                    Delete All
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-3">
                        {history.map((review) => (
                            <div
                                key={review.id}
                                className="border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-foreground">
                                            {review.filename || 'Unnamed file'}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDate(review.timestamp)}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onSelectReview(review)}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(review.id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {review.summary}
                                </p>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};
