import React from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { GitCompare } from 'lucide-react';

export const DiffPanel = ({ oldCode, newCode }) => {
    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                    <GitCompare className="w-5 h-5 text-primary" />
                    <span>Code Diff</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="diff-viewer rounded-b-lg overflow-hidden border-t border-border/50">
                    <ReactDiffViewer
                        oldValue={oldCode}
                        newValue={newCode}
                        splitView={true}
                        useDarkTheme={true}
                        hideLineNumbers={false}
                        showDiffOnly={false}
                        styles={{
                            variables: {
                                dark: {
                                    diffViewerBackground: 'hsl(217, 20%, 10%)',
                                    diffViewerColor: 'hsl(220, 10%, 95%)',
                                    addedBackground: 'hsl(142, 30%, 15%)',
                                    addedColor: 'hsl(142, 76%, 60%)',
                                    removedBackground: 'hsl(0, 30%, 15%)',
                                    removedColor: 'hsl(0, 72%, 65%)',
                                    wordAddedBackground: 'hsl(142, 40%, 20%)',
                                    wordRemovedBackground: 'hsl(0, 40%, 20%)',
                                    addedGutterBackground: 'hsl(142, 35%, 12%)',
                                    removedGutterBackground: 'hsl(0, 35%, 12%)',
                                    gutterBackground: 'hsl(217, 25%, 8%)',
                                    gutterBackgroundDark: 'hsl(217, 25%, 8%)',
                                    highlightBackground: 'hsl(217, 20%, 14%)',
                                    highlightGutterBackground: 'hsl(217, 20%, 14%)',
                                    codeFoldGutterBackground: 'hsl(217, 20%, 12%)',
                                    codeFoldBackground: 'hsl(217, 20%, 12%)',
                                    emptyLineBackground: 'transparent',
                                    gutterColor: 'hsl(215, 15%, 45%)',
                                    addedGutterColor: 'hsl(142, 76%, 50%)',
                                    removedGutterColor: 'hsl(0, 72%, 55%)',
                                    codeFoldContentColor: 'hsl(215, 15%, 60%)',
                                    diffViewerTitleBackground: 'hsl(217, 20%, 10%)',
                                    diffViewerTitleColor: 'hsl(220, 10%, 95%)',
                                    diffViewerTitleBorderColor: 'hsl(215, 20%, 19%)',
                                },
                            },
                            diffContainer: {
                                fontFamily: 'JetBrains Mono, Fira Code, Consolas, Monaco, monospace',
                                fontSize: '13px',
                            },
                        }}
                    />
                </div>
            </CardContent>
        </Card>
    );
};