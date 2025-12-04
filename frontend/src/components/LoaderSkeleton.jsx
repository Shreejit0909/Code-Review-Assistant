import React from 'react';
import { Card, CardHeader, CardContent } from './ui/card';

export const LoaderSkeleton = () => {
    return (
        <div className="space-y-6">
            {/* Summary Skeleton */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-muted animate-shimmer rounded" />
                        <div className="w-24 h-5 bg-muted animate-shimmer rounded" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="w-full h-4 bg-muted animate-shimmer rounded" />
                        <div className="w-5/6 h-4 bg-muted animate-shimmer rounded" />
                        <div className="w-4/6 h-4 bg-muted animate-shimmer rounded" />
                    </div>
                </CardContent>
            </Card>

            {/* Code Panels Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                    <Card key={i} className="border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <div className="w-5 h-5 bg-muted animate-shimmer rounded" />
                                <div className="w-32 h-5 bg-muted animate-shimmer rounded" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[500px] bg-muted animate-shimmer rounded" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Diff Panel Skeleton */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-muted animate-shimmer rounded" />
                        <div className="w-24 h-5 bg-muted animate-shimmer rounded" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-96 bg-muted animate-shimmer rounded" />
                </CardContent>
            </Card>
        </div>
    );
};