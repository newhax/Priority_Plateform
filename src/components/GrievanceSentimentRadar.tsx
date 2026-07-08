import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { Submission } from '../types';

interface GrievanceSentimentRadarProps {
  submissions: Submission[];
}

export const GrievanceSentimentRadar: React.FC<GrievanceSentimentRadarProps> = ({ submissions }) => {
  // Aggregate data for radar chart
  const categories = ['Education', 'Healthcare', 'Roads & Transport', 'Sanitation', 'Water Supply', 'Vocations'];
  
  const data = categories.map(category => {
    const categorySubmissions = submissions.filter(s => s.category === category);
    const count = categorySubmissions.length;
    const urgencyScore = categorySubmissions.reduce((acc, s) => acc + (s.urgency === 'High' ? 3 : s.urgency === 'Medium' ? 2 : 1), 0) / (count || 1);
    const sentimentScore = categorySubmissions.reduce((acc, s) => acc + (s.sentiment === 'positive' ? 3 : s.sentiment === 'neutral' ? 2 : 1), 0) / (count || 1);
    
    return {
      category,
      count: count * 10, // scaling for better visual
      urgency: urgencyScore * 30, // scaling 0-100
      sentiment: sentimentScore * 30 // scaling 0-100
    };
  });

  return (
    <div className="h-80 w-full bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
      <h3 className="text-sm font-bold text-slate-400 mb-4">Sentiment & Urgency Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
          <Radar name="Count" dataKey="count" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.5} />
          <Radar name="Urgency" dataKey="urgency" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.5} />
          <Radar name="Sentiment" dataKey="sentiment" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
          <Legend wrapperStyle={{ fontSize: '10px' }} />
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#f8fafc' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
