interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreBadge = ({ score, size = 'md' }: ScoreBadgeProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700 border-green-200';
    if (score >= 60) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (score >= 40) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Low';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center font-semibold rounded-full border ${getScoreColor(
          score
        )} ${sizeClasses[size]}`}
      >
        {score}%
      </span>
      <span className="text-sm text-gray-600 font-medium">{getScoreLabel(score)}</span>
    </div>
  );
};
