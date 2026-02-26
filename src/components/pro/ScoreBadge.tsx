interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg' | 'large';
}

export const ScoreBadge = ({ score, size = 'md' }: ScoreBadgeProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700 border-green-200';
    if (score >= 60) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (score >= 40) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-blue-500 to-cyan-500';
    if (score >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Bon';
    if (score >= 40) return 'Moyen';
    return 'Faible';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
    large: 'text-2xl px-6 py-3',
  };

  if (size === 'large') {
    return (
      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getScoreGradient(score)} flex items-center justify-center shadow-lg`}>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{score}</div>
          <div className="text-xs text-white/90">/100</div>
        </div>
      </div>
    );
  }

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
