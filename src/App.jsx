import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, DollarSign, PieChart as PieChartIcon, AlertTriangle, Target, Calculator, Brain, Sparkles, ArrowRight, CheckCircle, Info, Lightbulb, Shield, Calendar } from 'lucide-react';

// This component now dynamically generates the text analysis from the structured JSON data
const AIAnalysisText = ({ analysisData }) => {
  if (!analysisData || !analysisData.userGoal) {
    return null;
  }

  const sections = [
    { title: "User's Goal", content: analysisData.userGoal },
    { title: "Investment Options", content: analysisData.investmentOptions },
    { title: "Expected Profit/Return Range", content: analysisData.expectedReturns },
    { title: "Risks & Drawbacks", content: analysisData.risks },
    { title: "Probability of Success", content: analysisData.probabilityOfSuccess },
    { title: "Suggested Strategy / Roadmap", content: analysisData.strategyRoadmap }
  ];

  return (
    <div className="space-y-6">
      {sections.map((section, index) => {
        if (!section.content || section.content.length === 0) return null;
        
        const contentPoints = Array.isArray(section.content) ? section.content : [section.content];

        return (
          <div key={index} className="bg-white/70 p-4 rounded-xl border border-blue-100">
            <h4 className="font-bold text-md text-slate-800 mb-2">{section.title}</h4>
            {contentPoints.length > 1 ? (
              <ul className="list-disc list-inside space-y-2 text-slate-700 text-sm">
                {contentPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-700 text-sm leading-relaxed">{contentPoints[0]}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};


const FinancialAIAgent = () => {
  const [formData, setFormData] = useState({
    amount: '10000',
    goal: 'daily-income',
    timeHorizon: '1',
    riskTolerance: 'balanced',
    age: '28',
    location: 'India'
  });
  
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('input');
  const [error, setError] = useState(null);

  const YOUR_OPENROUTER_API_KEY = import.meta.env.VITE_API_URL;

  const generateAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    let userContent = `Analyze the following investment scenario for a user in India:
- **Investment Amount:** ₹${formData.amount}
- **Primary Goal:** ${formData.goal.replace('-', ' ')}
- **Timeframe:** ${formData.timeHorizon} year(s)
- **Risk Tolerance:** ${formData.riskTolerance}
`;

    if (formData.goal === 'daily-income') {
        userContent += `
The user wants to know how to generate daily or very short-term income with ₹${formData.amount}. Please provide specific strategies. Focus on high-liquidity options.`;
    } else if (formData.goal === 'long-term-growth') {
        userContent += `
The user wants to grow their investment of ₹${formData.amount} over ${formData.timeHorizon} years. Please provide a long-term strategy with a focus on compounding.`;
    } else {
         userContent += `
The user's goal is ${formData.goal.replace('-', ' ')}. Please provide a suitable strategy.`;
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${YOUR_OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
          messages: [
            {
              role: 'system',
              content: `You are an expert financial advisor for the Indian market, known for providing deep, insightful, and comprehensive analysis. Your response MUST be a single, valid JSON object and nothing else. Do not include markdown, comments, or any text outside the JSON structure. Every field must be populated with a detailed, in-depth analysis tailored to the user's specific situation.

**JSON Response Format:**
{
  "userGoal": "Provide a deep analysis of the user's stated goal, considering their age, risk tolerance, and timeframe.",
  "investmentOptions": ["Provide a detailed explanation for investment option 1, explaining why it's suitable for this user.", "Provide a detailed explanation for investment option 2..."],
  "expectedReturns": ["For option 1, provide a realistic profit/return range with a brief justification.", "For option 2..."],
  "risks": ["Detail the specific risks associated with option 1 for this user.", "Detail the risks for option 2..."],
  "probabilityOfSuccess": ["Provide a qualitative assessment (High / Medium / Low) for each option and explain your reasoning."],
  "strategyRoadmap": ["Provide a detailed, multi-step roadmap with clear actions. Explain the logic behind the allocation percentages."],
  "portfolioAllocation": { "equity": 0, "debt": 0, "gold": 0, "international": 0, "other": 0 },
  "returnProjections": { "conservative": 0, "realistic": 0, "optimistic": 0 },
  "keyRecommendations": ["Provide at least 4 detailed, actionable recommendations with explanations.", "Recommendation 2...", "Recommendation 3...", "Recommendation 4..."],
  "specificFunds": {
    "equity": ["Provide a specific equity fund and a brief rationale.", "Provide another specific equity fund and rationale."],
    "debt": ["Provide a specific debt fund and a brief rationale."],
    "gold": ["Provide a specific gold instrument and a brief rationale."],
    "international": ["Provide a specific international fund and a brief rationale."]
  },
  "taxImplications": ["Explain relevant tax implication 1 in detail.", "Explain tax implication 2...", "Explain tax implication 3..."],
  "nextSteps": ["Provide a clear, actionable step 1.", "Actionable step 2...", "Actionable step 3..."]
}
Ensure all values are populated based on your analysis. The sum of portfolioAllocation must be 100. Be thorough and specific in all fields.
`
            },
            {
              role: 'user',
              content: userContent
            }
          ],
          max_tokens: 3000,
          temperature: 0.7,
          response_format: { "type": "json_object" } // Enforce JSON output
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        throw new Error('Invalid or empty API response format');
      }
      
      let aiJsonData;
      try {
        aiJsonData = JSON.parse(data.choices[0].message.content);
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        throw new Error("The AI returned a malformed response. Please try again.");
      }


      if (!aiJsonData) {
        throw new Error("AI did not return valid JSON data. Please try again.");
      }
      
      const amount = parseFloat(formData.amount);
      const years = parseInt(formData.timeHorizon);
      
      const portfolio = aiJsonData.portfolioAllocation || { equity: 100, debt: 0, gold: 0, international: 0, other: 0 };
      const returnProjections = aiJsonData.returnProjections || { conservative: 5, realistic: 8, optimistic: 12 };
      
      const returns = {
          min: returnProjections.conservative,
          avg: returnProjections.realistic,
          max: returnProjections.optimistic
      };

      const pessimistic = amount * Math.pow(1 + (returns.min || 0)/100, years);
      const realistic = amount * Math.pow(1 + (returns.avg || 0)/100, years);
      const optimistic = amount * Math.pow(1 + (returns.max || 0)/100, years);

      const yearlyProjections = Array.from({ length: Math.min(years, 20) + 1 }, (_, year) => ({
        year: year,
        pessimistic: Math.round(amount * Math.pow(1 + (returns.min || 0)/100, year)),
        realistic: Math.round(amount * Math.pow(1 + (returns.avg || 0)/100, year)),
        optimistic: Math.round(amount * Math.pow(1 + (returns.max || 0)/100, year))
      }));

      const analysisResult = {
        aiStructuredData: aiJsonData,
        riskProfile: formData.riskTolerance,
        portfolio: portfolio,
        projections: {
          pessimistic: Math.round(pessimistic),
          realistic: Math.round(realistic),
          optimistic: Math.round(optimistic),
          yearly: yearlyProjections
        },
        recommendations: aiJsonData.keyRecommendations || [],
        taxInsights: aiJsonData.taxImplications || [],
        specificFunds: aiJsonData.specificFunds || { equity: [], debt: [], gold: [], international: [] },
        nextSteps: aiJsonData.nextSteps || []
      };

      setAnalysis(analysisResult);
      setActiveTab('results');

    } catch (error) {
      console.error('Error generating analysis:', error);
      setError(error);
    }
    
    setLoading(false);
  };

  const portfolioData = (analysis && analysis.portfolio) ? Object.entries(analysis.portfolio)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value })) : [];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="bg-white/70 backdrop-blur-md border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                  FinSight AI
                </h1>
                <p className="text-sm text-slate-600">Personalized Investment Intelligence</p>
              </div>
            </div>
             <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Sparkles className="w-4 h-4" />
                <span>Powered by CodeLift</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
              <div>
                <h3 className="font-semibold text-red-800 mb-2">Analysis Generation Error</h3>
                <p className="text-red-700 text-sm">
                  {error.message}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-1 bg-white/50 backdrop-blur-sm p-1 rounded-2xl mb-8 border border-blue-100 w-full md:w-auto">
          {[
            { id: 'input', label: 'Investment Goals', icon: Target },
            { id: 'results', label: 'AI Analysis', icon: Brain }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 md:px-6 py-3 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-white shadow-lg text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'input' && (
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 border border-blue-100 shadow-xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Plan Your Financial Future</h2>
              <p className="text-slate-600">Our AI will create a personalized investment strategy based on your goals.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Investment Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                    placeholder="e.g., 10000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Primary Investment Goal</label>
                  <select
                    value={formData.goal}
                    onChange={(e) => setFormData({...formData, goal: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  >
                    <option value="daily-income">Daily Short-Term Income</option>
                    <option value="long-term-growth">Long-Term Growth</option>
                    <option value="wealth-creation">Wealth Creation</option>
                    <option value="retirement">Retirement Planning</option>
                    <option value="tax-saving">Tax Saving</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Time Horizon (Years)</label>
                  <select
                    value={formData.timeHorizon}
                    onChange={(e) => setFormData({...formData, timeHorizon: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  >
                    <option value="1">1 Year</option>
                    <option value="3">3 Years</option>
                    <option value="5">5 Years</option>
                    <option value="10">10 Years</option>
                    <option value="15">15+ Years</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Risk Tolerance</label>
                  <div className="space-y-3">
                    {[
                      { value: 'conservative', label: 'Conservative', desc: 'Stable returns, lower risk' },
                      { value: 'balanced', label: 'Balanced', desc: 'Moderate risk, balanced growth' },
                      { value: 'aggressive', label: 'Aggressive', desc: 'High growth potential, higher risk' }
                    ].map((option) => (
                      <label key={option.value} className={`flex items-center space-x-3 p-3 rounded-xl border  hover:bg-blue-50 cursor-pointer transition-colors ${formData.riskTolerance === option.value ? 'bg-blue-50 border-blue-300' : 'border-slate-200'}`}>
                        <input
                          type="radio"
                          name="riskTolerance"
                          value={option.value}
                          checked={formData.riskTolerance === option.value}
                          onChange={(e) => setFormData({...formData, riskTolerance: e.target.value})}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <div>
                          <div className="font-medium text-slate-800">{option.label}</div>
                          <div className="text-sm text-slate-600">{option.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={generateAnalysis}
              disabled={!formData.amount || !formData.goal || !formData.timeHorizon || !formData.riskTolerance || loading}
              className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>AI is analyzing...</span>
                </>
              ) : (
                <>
                  <Brain className="w-6 h-6" />
                  <span>Generate AI Analysis</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}

        {activeTab === 'results' && analysis && (
          <div className="space-y-8">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-2">Important Disclaimer</h3>
                  <p className="text-amber-700 text-sm">
                    This is an AI-generated educational analysis. It is not personalized financial advice. All investments carry risk. Please consult a qualified financial advisor before making any decisions.
                  </p>
                </div>
              </div>
            </div>

            {analysis.aiStructuredData && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center space-x-2">
                  <Brain className="w-6 h-6 text-blue-600" />
                  <span>AI Financial Analysis</span>
                </h3>
                <AIAnalysisText analysisData={analysis.aiStructuredData} />
              </div>
            )}
            
            {analysis.projections && (
                <div className="grid md:grid-cols-3 gap-6">
                {[
                    {
                    title: 'Conservative Scenario',
                    value: `₹${analysis.projections.pessimistic.toLocaleString('en-IN')}`,
                    subtitle: 'Lower risk estimate',
                    color: 'red',
                    icon: Shield,
                    gain: Math.round(((analysis.projections.pessimistic / parseFloat(formData.amount)) - 1) * 100)
                    },
                    {
                    title: 'Expected Scenario',
                    value: `₹${analysis.projections.realistic.toLocaleString('en-IN')}`,
                    subtitle: 'Most likely outcome',
                    color: 'blue',
                    icon: Target,
                    gain: Math.round(((analysis.projections.realistic / parseFloat(formData.amount)) - 1) * 100)
                    },
                    {
                    title: 'Optimistic Scenario',
                    value: `₹${analysis.projections.optimistic.toLocaleString('en-IN')}`,
                    subtitle: 'Best case scenario',
                    color: 'green',
                    icon: TrendingUp,
                    gain: Math.round(((analysis.projections.optimistic / parseFloat(formData.amount)) - 1) * 100)
                    }
                ].map((metric, index) => (
                    <div key={index} className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-${metric.color}-100 flex items-center justify-center`}>
                        <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
                        </div>
                        <div className={`text-sm font-medium px-2 py-1 rounded-full bg-${metric.color}-100 text-${metric.color}-700`}>
                        +{metric.gain}%
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">{metric.title}</h3>
                    <p className="text-2xl font-bold text-slate-900 mb-1">{metric.value}</p>
                    <p className="text-sm text-slate-600">{metric.subtitle}</p>
                    </div>
                ))}
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-lg">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
                  <PieChartIcon className="w-6 h-6 text-blue-600" />
                  <span>AI-Powered Portfolio Allocation</span>
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={portfolioData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {portfolioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {analysis.projections && analysis.projections.yearly && (
                <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-lg">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                    <span>AI-Powered Growth Projection</span>
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analysis.projections.yearly}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="year" unit=" yr" />
                        <YAxis tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
                        <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Value']} />
                        <Legend />
                        <Line type="monotone" dataKey="pessimistic" stroke="#ef4444" strokeWidth={2} name="Conservative" />
                        <Line type="monotone" dataKey="realistic" stroke="#3b82f6" strokeWidth={3} name="Expected" />
                        <Line type="monotone" dataKey="optimistic" stroke="#10b981" strokeWidth={2} name="Optimistic" />
                    </LineChart>
                    </ResponsiveContainer>
                </div>
              )}
            </div>

            {analysis.specificFunds && (
                <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-lg">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
                    <Target className="w-6 h-6 text-green-600" />
                    <span>Recommended Funds & Instruments</span>
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <h4 className="font-semibold text-blue-700 mb-3">Equity Funds</h4>
                        <ul className="space-y-2">
                        {analysis.specificFunds.equity && analysis.specificFunds.equity.length > 0 ? analysis.specificFunds.equity.map((fund, index) => (
                            <li key={index} className="text-sm text-slate-600 bg-blue-50 p-2 rounded-lg">{fund}</li>
                        )) : <li className="text-sm text-slate-500">N/A</li>}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-green-700 mb-3">Debt Funds</h4>
                        <ul className="space-y-2">
                        {analysis.specificFunds.debt && analysis.specificFunds.debt.length > 0 ? analysis.specificFunds.debt.map((fund, index) => (
                            <li key={index} className="text-sm text-slate-600 bg-green-50 p-2 rounded-lg">{fund}</li>
                        )) : <li className="text-sm text-slate-500">N/A</li>}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-yellow-700 mb-3">Gold/Commodities</h4>
                        <ul className="space-y-2">
                        {analysis.specificFunds.gold && analysis.specificFunds.gold.length > 0 ? analysis.specificFunds.gold.map((fund, index) => (
                            <li key={index} className="text-sm text-slate-600 bg-yellow-50 p-2 rounded-lg">{fund}</li>
                        )) : <li className="text-sm text-slate-500">N/A</li>}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-red-700 mb-3">International</h4>
                        <ul className="space-y-2">
                        {analysis.specificFunds.international && analysis.specificFunds.international.length > 0 ? analysis.specificFunds.international.map((fund, index) => (
                            <li key={index} className="text-sm text-slate-600 bg-red-50 p-2 rounded-lg">{fund}</li>
                        )) : <li className="text-sm text-slate-500">N/A</li>}
                        </ul>
                    </div>
                </div>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-lg">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
                  <Lightbulb className="w-6 h-6 text-yellow-600" />
                  <span>AI Recommendations</span>
                </h3>
                <div className="space-y-3">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-lg">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
                  <ArrowRight className="w-6 h-6 text-blue-600" />
                  <span>Next Steps</span>
                </h3>
                <div className="space-y-3">
                  {analysis.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-slate-700 text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-lg">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
                <Calculator className="w-6 h-6 text-purple-600" />
                <span>Tax Optimization Insights</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {analysis.taxInsights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <Info className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 text-sm">{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-lg">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
                <Shield className="w-6 h-6 text-blue-600" />
                <span>Risk Analysis & Mitigation</span>
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">Market Risk</h4>
                  <p className="text-red-700 text-sm">Equity markets can be volatile. Diversification helps mitigate this risk.</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">Inflation Risk</h4>
                  <p className="text-yellow-700 text-sm">Your returns must outpace inflation to grow your wealth in real terms.</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Liquidity Risk</h4>
                  <p className="text-blue-700 text-sm">Ensure you have an emergency fund for unexpected needs.</p>
                </div>
              </div>
            </div>
            
            {analysis.projections && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
                    <Calculator className="w-6 h-6 text-green-600" />
                    <span>Investment Summary</span>
                </h3>
                <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white/70 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">₹{parseFloat(formData.amount).toLocaleString('en-IN')}</div>
                    <div className="text-sm text-slate-600">Initial Investment</div>
                    </div>
                    <div className="text-center p-4 bg-white/70 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{formData.timeHorizon} Years</div>
                    <div className="text-sm text-slate-600">Investment Period</div>
                    </div>
                    <div className="text-center p-4 bg-white/70 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">{analysis.projections.realistic ? Math.round(((analysis.projections.realistic / parseFloat(formData.amount)) ** (1/parseInt(formData.timeHorizon)) - 1) * 100) : 'N/A'}%</div>
                    <div className="text-sm text-slate-600">Expected CAGR</div>
                    </div>
                    <div className="text-center p-4 bg-white/70 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600">₹{Math.round(analysis.projections.realistic - parseFloat(formData.amount)).toLocaleString('en-IN')}</div>
                    <div className="text-sm text-slate-600">Expected Gains</div>
                    </div>
                </div>
                </div>
            )}

          </div>
        )}

        {activeTab === 'results' && !analysis && (
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-12 border border-slate-200 text-center">
            <Brain className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No Analysis Yet</h3>
            <p className="text-slate-500">Please fill out the form to generate your personalized AI analysis.</p>
            <button
              onClick={() => setActiveTab('input')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Go to Input Form
            </button>
          </div>
        )}
      </div>

      <div className="bg-white/50 backdrop-blur-md border-t border-blue-100 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-600 text-sm">
            Built with ❤️ • Powered by CodeLift •
            <span className="text-blue-600 font-medium"> FinSight AI</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialAIAgent