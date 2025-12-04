import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

const SEVERITY_CONFIG = {
    critical: {
        icon: AlertTriangle,
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/50',
        label: 'Critical',
    },
    high: {
        icon: AlertCircle,
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/50',
        label: 'High',
    },
    medium: {
        icon: Info,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/50',
        label: 'Medium',
    },
    low: {
        icon: CheckCircle,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/50',
        label: 'Low',
    },
};

export const SeverityAnalysis = ({ severity, issues = [] }) => {
    if (!severity && (!issues || issues.length === 0)) {
        return null;
    }

    // Calculate severity from issues if not provided
    const severityCounts = severity || issues.reduce((acc, issue) => {
        const level = issue.severity || 'low';
        acc[level] = (acc[level] || 0) + 1;
        return acc;
    }, {});

    const totalIssues = Object.values(severityCounts).reduce((sum, count) => sum + count, 0);

    const getSeverityScore = () => {
        const weights = { critical: 4, high: 3, medium: 2, low: 1 };
        const totalWeight = Object.entries(severityCounts).reduce(
            (sum, [level, count]) => sum + (weights[level] || 1) * count,
            0
        );
        return totalIssues > 0 ? Math.round((totalWeight / (totalIssues * 4)) * 100) : 0;
    };

    const score = getSeverityScore();

    const getScoreColor = (score) => {
        if (score >= 75) return 'text-red-500';
        if (score >= 50) return 'text-orange-500';
        if (score >= 25) return 'text-yellow-500';
        return 'text-green-500';
    };

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-primary" />
                        <span>Severity Analysis</span>
                    </span>
                    <Badge variant="secondary" className={getScoreColor(score)}>
                        Score: {score}/100
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Overall Progress */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Overall Risk</span>
                        <span className={`font-medium ${getScoreColor(score)}`}>
                            {score >= 75 ? 'High Risk' : score >= 50 ? 'Medium Risk' : score >= 25 ? 'Low Risk' : 'Minimal Risk'}
                        </span>
                    </div>
                    <Progress value={score} className="h-2" />
                </div>

                {/* Severity Breakdown */}
                <div className="space-y-3">
                    {Object.entries(SEVERITY_CONFIG).map(([level, config]) => {
                        const count = severityCounts[level] || 0;
                        const Icon = config.icon;
                        const percentage = totalIssues > 0 ? (count / totalIssues) * 100 : 0;

                        return (
                            <div
                                key={level}
                                className={`flex items-center justify-between p-3 rounded-lg border ${config.borderColor} ${config.bgColor}`}
                            >
                                <div className="flex items-center space-x-3">
                                    <Icon className={`w-5 h-5 ${config.color}`} />
                                    <div>
                                        <p className="font-medium text-foreground">{config.label}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {percentage.toFixed(0)}% of issues
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className={config.color}>
                                    {count}
                                </Badge>
                            </div>
                        );
                    })}
                </div>

                {/* Issue List */}
                {issues && issues.length > 0 && (
                    <div className="space-y-2 mt-4">
                        <h4 className="text-sm font-medium text-foreground">Detected Issues</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {issues.map((issue, index) => {
                                const config = SEVERITY_CONFIG[issue.severity] || SEVERITY_CONFIG.low;
                                const Icon = config.icon;

                                return (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-2 p-2 rounded bg-secondary/30 text-sm"
                                    >
                                        <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${config.color}`} />
                                        <div className="flex-1">
                                            <p className="text-foreground">{issue.message}</p>
                                            {issue.line && (
                                                <p className="text-xs text-muted-foreground">
                                                    Line {issue.line}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
