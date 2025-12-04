import React from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

export const CodePanel = ({ title, code, icon: Icon, language = 'javascript' }) => {
    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in h-full flex flex-col">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-foreground">
                    {Icon && <Icon className="w-5 h-5 text-primary" />}
                    <span>{title}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <div className="h-[500px] rounded-b-lg overflow-hidden border-t border-border/50">
                    <Editor
                        height="100%"
                        language={language}
                        value={code}
                        theme="vs-dark"
                        options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            fontSize: 13,
                            lineNumbers: 'on',
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            padding: { top: 16, bottom: 16 },
                            fontFamily: 'JetBrains Mono, Fira Code, Consolas, Monaco, monospace',
                            fontLigatures: true,
                            renderLineHighlight: 'none',
                            scrollbar: {
                                vertical: 'auto',
                                horizontal: 'auto',
                                useShadows: false,
                                verticalScrollbarSize: 8,
                                horizontalScrollbarSize: 8,
                            },
                        }}
                    />
                </div>
            </CardContent>
        </Card>
    );
};