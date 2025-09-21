import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Area, AreaChart } from 'recharts';
import { Search, TrendingUp, TrendingDown, DollarSign, BarChart3, Download, Brain, AlertTriangle, Target, PieChart, Calendar, Activity, Shield, Zap, ArrowUpRight, ArrowDownRight, Minus, Eye, FileText, Star, Info, CheckCircle, XCircle } from 'lucide-react';

const Calculator = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <line x1="8" y1="6" x2="16" y2="6"></line>
    <line x1="8" y1="10" x2="16" y2="10"></line>
    <line x1="8" y1="14" x2="16" y2="14"></line>
    <line x1="8" y1="18" x2="12" y2="18"></line>
  </svg>
);

const StockAnalysis = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const ALPHA_VANTAGE_API_KEY = '35WV7APIT7KF99AK';
  const OPENROUTER_API_KEY = import.meta.env.VITE_API_UR;
  const [exchangeRate, setExchangeRate] = useState(83.5);

  // Comprehensive Indian stocks database
  const indianStocks = [
    // ADR Listings (Available for analysis)
    { symbol: 'INFY', name: 'Infosys Limited', sector: 'Technology', available: true },
    { symbol: 'WIT', name: 'Wipro Limited', sector: 'Technology', available: true },
    { symbol: 'HDB', name: 'HDFC Bank Limited', sector: 'Banking', available: true },
    { symbol: 'IBN', name: 'ICICI Bank Limited', sector: 'Banking', available: true },
    { symbol: 'TTM', name: 'Tata Motors Limited', sector: 'Automotive', available: true },
    { symbol: 'RDY', name: 'Dr. Reddys Laboratories', sector: 'Pharmaceuticals', available: true },
    { symbol: 'AZRE', name: 'Azure Power Global', sector: 'Renewable Energy', available: true },
    { symbol: 'MMYT', name: 'MakeMyTrip Limited', sector: 'Travel & Tourism', available: true },
    
    // Popular Indian stocks (Not directly available but will show suggestions)
    { symbol: 'RELIANCE', name: 'Reliance Industries Limited', sector: 'Energy & Petrochemicals', available: false, suggestion: 'Try US energy stocks like XOM or CVX' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'Technology', available: false, suggestion: 'Try INFY or WIT for Indian IT exposure' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Banking', available: false, suggestion: 'Try HDB for HDFC Bank ADR' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Banking', available: false, suggestion: 'Try IBN for ICICI Bank ADR' },
    { symbol: 'BHARTIAIRTEL', name: 'Bharti Airtel Limited', sector: 'Telecommunications', available: false, suggestion: 'Try telecom stocks like VZ or T' },
    { symbol: 'ITC', name: 'ITC Limited', sector: 'FMCG', available: false, suggestion: 'Try consumer goods stocks like PG or UL' },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', sector: 'Banking', available: false, suggestion: 'Try HDB or IBN for Indian banking exposure' },
    { symbol: 'LT', name: 'Larsen & Toubro Limited', sector: 'Construction', available: false, suggestion: 'Try industrial stocks like CAT or DE' },
    { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking', available: false, suggestion: 'Try IBN for Indian banking exposure' },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance Limited', sector: 'Financial Services', available: false, suggestion: 'Try financial stocks like AXP or V' },
    { symbol: 'MARUTI', name: 'Maruti Suzuki India Limited', sector: 'Automotive', available: false, suggestion: 'Try TTM for Indian automotive exposure' },
    { symbol: 'ASIANPAINTS', name: 'Asian Paints Limited', sector: 'Paints', available: false, suggestion: 'Try material stocks like SHW or RPM' },
    { symbol: 'NESTLEIND', name: 'Nestle India Limited', sector: 'FMCG', available: false, suggestion: 'Try NSRGY for Nestle exposure' },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Limited', sector: 'FMCG', available: false, suggestion: 'Try UL for Unilever exposure' },
    { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries', sector: 'Pharmaceuticals', available: false, suggestion: 'Try RDY for Indian pharma exposure' },
    { symbol: 'TECHM', name: 'Tech Mahindra Limited', sector: 'Technology', available: false, suggestion: 'Try INFY or WIT for Indian IT exposure' },
    { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Limited', sector: 'Cement', available: false, suggestion: 'Try material stocks like MLM or VMC' },
    { symbol: 'ONGC', name: 'Oil and Natural Gas Corporation', sector: 'Oil & Gas', available: false, suggestion: 'Try energy stocks like XOM or CVX' },
    { symbol: 'POWERGRID', name: 'Power Grid Corporation of India', sector: 'Utilities', available: false, suggestion: 'Try utility stocks like NEE or SO' },
    { symbol: 'NTPC', name: 'NTPC Limited', sector: 'Power Generation', available: false, suggestion: 'Try utility stocks like AEP or EXC' }
  ];

  // Popular US stocks for comparison
  const usStocks = [
    { symbol: 'AAPL', name: 'Apple Inc', sector: 'Technology', available: true },
    { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', available: true },
    { symbol: 'GOOGL', name: 'Alphabet Inc', sector: 'Technology', available: true },
    { symbol: 'AMZN', name: 'Amazon.com Inc', sector: 'E-commerce', available: true },
    { symbol: 'TSLA', name: 'Tesla Inc', sector: 'Automotive', available: true },
    { symbol: 'META', name: 'Meta Platforms Inc', sector: 'Social Media', available: true },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Semiconductors', available: true },
    { symbol: 'NFLX', name: 'Netflix Inc', sector: 'Entertainment', available: true },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co', sector: 'Banking', available: true },
    { symbol: 'V', name: 'Visa Inc', sector: 'Financial Services', available: true }
  ];

  const allStocks = [...indianStocks, ...usStocks];

  const handleSearchInput = (value) => {
    setSearchQuery(value);
    
    if (value.length > 0) {
      const filtered = allStocks.filter(stock => {
        const searchTerm = value.toLowerCase();
        return (
          stock.symbol.toLowerCase().includes(searchTerm) ||
          stock.name.toLowerCase().includes(searchTerm) ||
          stock.name.toLowerCase().replace(/[^a-z0-9]/g, '').includes(searchTerm.replace(/[^a-z0-9]/g, '')) ||
          // Handle common search terms
          (searchTerm.includes('tata') && (stock.name.toLowerCase().includes('tata') || stock.symbol === 'TTM')) ||
          (searchTerm.includes('hdfc') && (stock.name.toLowerCase().includes('hdfc') || stock.symbol === 'HDB')) ||
          (searchTerm.includes('icici') && (stock.name.toLowerCase().includes('icici') || stock.symbol === 'IBN')) ||
          (searchTerm.includes('wipro') && stock.symbol === 'WIT') ||
          (searchTerm.includes('infosys') && stock.symbol === 'INFY') ||
          (searchTerm.includes('reddy') && stock.symbol === 'RDY') ||
          (searchTerm.includes('reliance') && stock.name.toLowerCase().includes('reliance')) ||
          (searchTerm.includes('apple') && stock.symbol === 'AAPL') ||
          (searchTerm.includes('microsoft') && stock.symbol === 'MSFT') ||
          (searchTerm.includes('google') && stock.symbol === 'GOOGL') ||
          (searchTerm.includes('tesla') && stock.symbol === 'TSLA')
        );
      }).slice(0, 8); // Limit to 8 suggestions
      
      setSearchSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (stock) => {
    if (stock.available) {
      setSearchQuery(stock.symbol);
      setShowSuggestions(false);
      // Auto-search after a brief delay
      setTimeout(() => searchStock(stock.symbol), 100);
    } else {
      setError(`${stock.name} is not directly available. ${stock.suggestion}`);
      setShowSuggestions(false);
    }
  };

  const searchStock = async (symbolToSearch = null) => {
    const queryToUse = symbolToSearch || searchQuery;
    if (!queryToUse.trim()) return;

    setLoading(true);
    setError(null);
    setStockData(null);
    setAiAnalysis(null);
    setShowSuggestions(false);

    try {
      // Get current USD to INR exchange rate
      try {
        const exchangeResponse = await fetch(
          `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=INR&apikey=${ALPHA_VANTAGE_API_KEY}`
        );
        const exchangeData = await exchangeResponse.json();
        const rate = parseFloat(exchangeData['Realtime Currency Exchange Rate']?.[5] || 83.5);
        setExchangeRate(rate);
      } catch (err) {
        console.log('Using default exchange rate');
        setExchangeRate(83.5);
      }

      // Get company overview
      const overviewResponse = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${queryToUse}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const overviewData = await overviewResponse.json();

      if (overviewData.Note || overviewData.Information) {
        throw new Error('API rate limit exceeded. Please try again in a minute.');
      }

      if (!overviewData.Symbol) {
        const upperQuery = queryToUse.toUpperCase();
        let suggestions = '';
        
        if (upperQuery.includes('HDFC')) {
          suggestions = ' Try "HDB" for HDFC Bank ADR listing.';
        } else if (upperQuery.includes('RELIANCE') || upperQuery.includes('RIL')) {
          suggestions = ' Indian stocks have limited coverage. Try major companies like "INFY" (Infosys), "WIT" (Wipro), or "IBN" (ICICI Bank).';
        } else if (upperQuery.includes('TCS') || upperQuery.includes('TATA')) {
          suggestions = ' Try "TTM" for Tata Motors or other major Indian ADRs.';
        } else if (upperQuery.includes('SBI') || upperQuery.includes('SBIN')) {
          suggestions = ' State Bank of India is not available. Try "IBN" for ICICI Bank instead.';
        } else if (upperQuery.includes('ITC') || upperQuery.includes('BHARTI') || upperQuery.includes('MARUTI')) {
          suggestions = ' This Indian stock may not be available. Try major ADRs like "INFY", "WIT", "HDB", "IBN", "TTM", or "RDY".';
        } else {
          suggestions = ' For Indian market exposure, try: "INFY" (Infosys), "WIT" (Wipro), "HDB" (HDFC Bank), "IBN" (ICICI Bank), "TTM" (Tata Motors), "RDY" (Dr. Reddy\'s).';
        }
        
        throw new Error(`Stock symbol "${queryToUse}" not found.${suggestions}`);
      }

      // Get current quote
      const quoteResponse = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${queryToUse}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const quoteData = await quoteResponse.json();

      // Get daily time series
      const timeSeriesResponse = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${queryToUse}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const timeSeriesData = await timeSeriesResponse.json();

      // Get technical indicators (RSI)
      const rsiResponse = await fetch(
        `https://www.alphavantage.co/query?function=RSI&symbol=${queryToUse}&interval=daily&time_period=14&series_type=close&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const rsiData = await rsiResponse.json();

      // Process data
      const quote = quoteData['Global Quote'] || {};
      const timeSeries = timeSeriesData['Time Series (Daily)'] || {};
      const rsiValues = rsiData['Technical Analysis: RSI'] || {};

      // Determine if this is an Indian stock
      const isIndianStock = ['INFY', 'WIT', 'HDB', 'IBN', 'TTM', 'RDY', 'AZRE', 'MMYT'].includes(queryToUse.toUpperCase()) ||
                           overviewData.Country === 'India' || 
                           overviewData.Name?.includes('India') ||
                           overviewData.Description?.toLowerCase().includes('india');

      const currencyMultiplier = isIndianStock ? exchangeRate : 1;
      const currencySymbol = isIndianStock ? '₹' : '$';

      // Convert time series to chart data
      const chartData = Object.entries(timeSeries)
        .slice(0, 30)
        .reverse()
        .map(([date, values]) => ({
          date: date,
          price: parseFloat(values['4. close']) * currencyMultiplier,
          volume: parseInt(values['5. volume']),
          high: parseFloat(values['2. high']) * currencyMultiplier,
          low: parseFloat(values['3. low']) * currencyMultiplier,
          open: parseFloat(values['1. open']) * currencyMultiplier
        }));

      const combinedData = {
        overview: overviewData,
        quote: quote,
        chartData: chartData,
        rsi: Object.values(rsiValues).slice(0, 10).map(val => parseFloat(val.RSI)),
        currentPrice: parseFloat(quote['05. price'] || 0) * currencyMultiplier,
        change: parseFloat(quote['09. change'] || 0) * currencyMultiplier,
        changePercent: parseFloat((quote['10. change percent'] || '0%').replace('%', '')),
        volume: parseInt(quote['06. volume'] || 0),
        previousClose: parseFloat(quote['08. previous close'] || 0) * currencyMultiplier,
        open: parseFloat(quote['02. open'] || 0) * currencyMultiplier,
        dayHigh: parseFloat(quote['03. high'] || 0) * currencyMultiplier,
        dayLow: parseFloat(quote['04. low'] || 0) * currencyMultiplier,
        isIndianStock: isIndianStock,
        currencySymbol: currencySymbol,
        exchangeRate: exchangeRate
      };

      setStockData(combinedData);

    } catch (err) {
      console.error('Stock search error:', err);
      setError(err.message);
    }

    setLoading(false);
  };

  const generateAIAnalysis = async () => {
    if (!stockData) return;

    setGeneratingReport(true);

    const currencyContext = stockData.isIndianStock 
      ? `Note: This is an Indian company (ADR listing). All price recommendations should be in INR (₹) at current exchange rate of ₹${stockData.exchangeRate}/USD. Current price is ₹${stockData.currentPrice.toFixed(2)}.`
      : `Current price is ${stockData.currentPrice.toFixed(2)}.`;

    const analysisPrompt = `Analyze this stock data for ${stockData.overview.Name} (${stockData.overview.Symbol}):

${currencyContext}

**Company Information:**
- Sector: ${stockData.overview.Sector}
- Industry: ${stockData.overview.Industry}
- Market Cap: ${stockData.overview.MarketCapitalization}
- P/E Ratio: ${stockData.overview.PERatio}
- EPS: ${stockData.overview.EPS}
- Dividend Yield: ${stockData.overview.DividendYield}
- 52 Week High: ${stockData.currencySymbol}${stockData.overview['52WeekHigh'] ? (parseFloat(stockData.overview['52WeekHigh']) * (stockData.isIndianStock ? stockData.exchangeRate : 1)).toFixed(2) : 'N/A'}
- 52 Week Low: ${stockData.currencySymbol}${stockData.overview['52WeekLow'] ? (parseFloat(stockData.overview['52WeekLow']) * (stockData.isIndianStock ? stockData.exchangeRate : 1)).toFixed(2) : 'N/A'}

**Current Market Data:**
- Current Price: ${stockData.currencySymbol}${stockData.currentPrice.toFixed(2)}
- Change: ${stockData.currencySymbol}${stockData.change.toFixed(2)} (${stockData.changePercent.toFixed(2)}%)
- Volume: ${stockData.volume.toLocaleString()}
- Day Range: ${stockData.currencySymbol}${stockData.dayLow.toFixed(2)} - ${stockData.currencySymbol}${stockData.dayHigh.toFixed(2)}

**Financial Metrics:**
- Revenue: ${stockData.overview.RevenueTTM}
- Gross Profit: ${stockData.overview.GrossProfitTTM}
- EBITDA: ${stockData.overview.EBITDA}
- ROE: ${stockData.overview.ReturnOnEquityTTM}
- ROA: ${stockData.overview.ReturnOnAssetsTTM}
- Debt to Equity: ${stockData.overview.DebtToEquityRatio}

Please provide a comprehensive investment analysis in JSON format with these exact fields. ${stockData.isIndianStock ? 'All price targets and recommendations should be in INR (₹).' : 'All price targets should be in USD ($).'}`;

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat-v3.1:free',
          messages: [
            {
              role: 'system',
              content: `You are a professional stock analyst. Provide a detailed investment analysis in valid JSON format only. No markdown or additional text.

IMPORTANT: If analyzing an Indian stock (ADR listing), provide all price targets and recommendations in INR (₹). For US stocks, use USD ($).

{
  "investmentRecommendation": "BUY/HOLD/SELL with detailed reasoning",
  "targetPrice": "Price target with timeframe (use correct currency: ₹ for Indian stocks, $ for US stocks)",
  "fundamentalAnalysis": {
    "strengths": ["List of 3-4 key strengths"],
    "weaknesses": ["List of 3-4 key weaknesses"],
    "valuation": "Detailed valuation assessment"
  },
  "technicalAnalysis": {
    "trend": "Current trend analysis",
    "support": "Support level (use correct currency)",
    "resistance": "Resistance level (use correct currency)",
    "momentum": "Momentum indicators analysis"
  },
  "riskAssessment": {
    "level": "LOW/MEDIUM/HIGH",
    "factors": ["List of key risk factors"]
  },
  "futureOutlook": {
    "shortTerm": "3-6 month outlook",
    "longTerm": "1-2 year outlook",
    "catalysts": ["List of potential catalysts"]
  },
  "financialHealth": {
    "score": "Score out of 10",
    "analysis": "Detailed financial health analysis"
  },
  "keyMetrics": {
    "peAnalysis": "P/E ratio analysis",
    "growthRate": "Expected growth rate",
    "dividendAnalysis": "Dividend analysis if applicable"
  },
  "marketContext": "Analysis within current market conditions",
  "actionableInsights": ["List of 4-5 specific actionable insights"]
}`
            },
            {
              role: 'user',
              content: analysisPrompt
            }
          ],
          max_tokens: 5500,
          temperature: 0.7,
          response_format: { "type": "json_object" }
        })
      });

      if (!response.ok) {
        throw new Error(`AI analysis failed with status ${response.status}`);
      }

      const data = await response.json();
      const aiJsonData = JSON.parse(data.choices[0].message.content);
      setAiAnalysis(aiJsonData);

    } catch (err) {
      console.error('AI analysis error:', err);
      setError('Failed to generate AI analysis. Please try again.');
    }

    setGeneratingReport(false);
  };

  const downloadPDFReport = () => {
    if (!stockData || !aiAnalysis) return;

    const formatNumber = (num) => {
      if (!num) return 'N/A';
      if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
      if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
      if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
      return num.toLocaleString();
    };

    const pdfContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Stock Analysis Report - ${stockData.overview.Symbol}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
        .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        .company-name { font-size: 28px; font-weight: bold; color: #1e40af; margin-bottom: 5px; }
        .symbol { font-size: 20px; color: #64748b; }
        .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); 
                    font-size: 60px; color: rgba(37, 99, 235, 0.1); font-weight: bold; z-index: -1; }
        .section { margin: 25px 0; }
        .section-title { font-size: 18px; font-weight: bold; color: #1e40af; border-left: 4px solid #2563eb; padding-left: 15px; margin-bottom: 15px; }
        .metric-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
        .metric-box { background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; }
        .metric-label { font-size: 12px; color: #64748b; text-transform: uppercase; }
        .metric-value { font-size: 18px; font-weight: bold; color: #1e40af; }
        .recommendation { background: linear-gradient(135deg, #2563eb, #1e40af); color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }
        .risk-badge { display: inline-block; padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .risk-low { background: #dcfce7; color: #166534; }
        .risk-medium { background: #fef3c7; color: #92400e; }
        .risk-high { background: #fecaca; color: #991b1b; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; color: #64748b; font-size: 12px; }
        .indian-context { background: #f0f9ff; border: 2px solid #0ea5e9; padding: 15px; border-radius: 8px; margin: 20px 0; }
        ul { margin: 10px 0; padding-left: 20px; }
        li { margin: 5px 0; }
        .disclaimer { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="watermark">FinSight AI</div>
    
    <div class="header">
        <div class="company-name">${stockData.overview.Name}</div>
        <div class="symbol">${stockData.overview.Symbol} - Stock Analysis Report</div>
        <div style="margin-top: 10px; color: #64748b;">Generated on ${new Date().toLocaleDateString()} by FinSight AI</div>
        ${stockData.isIndianStock ? `<div style="margin-top: 5px; color: #0ea5e9; font-weight: bold;">Indian Stock Analysis (Prices in INR)</div>` : ''}
    </div>

    ${stockData.isIndianStock ? `
    <div class="indian-context">
        <h3 style="margin-top: 0; color: #0ea5e9;">Indian Market Context</h3>
        <p><strong>Exchange Rate Used:</strong> ₹${stockData.exchangeRate.toFixed(2)} per USD</p>
        <p><strong>Trading Location:</strong> ${stockData.overview.Exchange} (ADR listing)</p>
        <p><strong>Indian Investor Note:</strong> This analysis considers Indian market dynamics, regulatory environment, and INR-based valuation for better local investment decisions.</p>
    </div>
    ` : ''}

    <div class="recommendation">
        <h2 style="margin-top: 0;">Investment Recommendation: ${aiAnalysis.investmentRecommendation}</h2>
        <div style="font-size: 18px; margin-top: 10px;">Target Price: ${aiAnalysis.targetPrice}</div>
    </div>

    <div class="metric-grid">
        <div class="metric-box">
            <div class="metric-label">Current Price</div>
            <div class="metric-value">${stockData.currencySymbol}${stockData.currentPrice.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
        </div>
        <div class="metric-box">
            <div class="metric-label">Day Change</div>
            <div class="metric-value" style="color: ${stockData.change >= 0 ? '#10b981' : '#ef4444'};">
                ${stockData.change >= 0 ? '+' : ''}${stockData.currencySymbol}${Math.abs(stockData.change).toFixed(2)} (${stockData.changePercent.toFixed(2)}%)
            </div>
        </div>
        <div class="metric-box">
            <div class="metric-label">Market Cap</div>
            <div class="metric-value">${stockData.currencySymbol}${formatNumber(parseInt(stockData.overview.MarketCapitalization) * (stockData.isIndianStock ? stockData.exchangeRate : 1))}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Risk Assessment</div>
        <span class="risk-badge risk-${aiAnalysis.riskAssessment.level.toLowerCase()}">${aiAnalysis.riskAssessment.level} RISK</span>
        <ul>
            ${aiAnalysis.riskAssessment.factors.map(factor => `<li>${factor}</li>`).join('')}
        </ul>
    </div>

    <div class="section">
        <div class="section-title">Fundamental Analysis</div>
        <h4>Strengths:</h4>
        <ul>
            ${aiAnalysis.fundamentalAnalysis.strengths.map(strength => `<li>${strength}</li>`).join('')}
        </ul>
        <h4>Weaknesses:</h4>
        <ul>
            ${aiAnalysis.fundamentalAnalysis.weaknesses.map(weakness => `<li>${weakness}</li>`).join('')}
        </ul>
        <h4>Valuation:</h4>
        <p>${aiAnalysis.fundamentalAnalysis.valuation}</p>
    </div>

    <div class="section">
        <div class="section-title">Financial Health Score</div>
        <div style="text-align: center;">
            <div style="font-size: 48px; font-weight: bold; color: #2563eb;">${aiAnalysis.financialHealth.score}/10</div>
            <p>${aiAnalysis.financialHealth.analysis}</p>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Future Outlook</div>
        <h4>Short-term (3-6 months):</h4>
        <p>${aiAnalysis.futureOutlook.shortTerm}</p>
        <h4>Long-term (1-2 years):</h4>
        <p>${aiAnalysis.futureOutlook.longTerm}</p>
        <h4>Key Catalysts:</h4>
        <ul>
            ${aiAnalysis.futureOutlook.catalysts.map(catalyst => `<li>${catalyst}</li>`).join('')}
        </ul>
    </div>

    <div class="section">
        <div class="section-title">Actionable Insights</div>
        <ul>
            ${aiAnalysis.actionableInsights.map(insight => `<li>${insight}</li>`).join('')}
        </ul>
    </div>

    <div class="disclaimer">
        <strong>Important Disclaimer:</strong> This report is for educational and informational purposes only. It is not personalized investment advice. All investments carry risk of loss. Past performance does not guarantee future results. Please consult with qualified financial advisors before making investment decisions.
    </div>

    <div class="footer">
        <div><strong>FinSight AI</strong> - Professional Stock Analysis Platform</div>
        <div>Powered by Alpha Vantage & Advanced AI Analytics</div>
        <div>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
        <div style="margin-top: 10px;">© 2024 FinSight AI. All rights reserved.</div>
    </div>
</body>
</html>
    `;

    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${stockData.overview.Symbol}_Stock_Analysis_Report.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatNumber = (num) => {
    if (!num) return 'N/A';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toLocaleString();
  };

  const getTrendIcon = (change) => {
    if (change > 0) return <ArrowUpRight className="w-4 h-4 text-green-600" />;
    if (change < 0) return <ArrowDownRight className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 mt-6">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-md border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                  Stock Analysis Pro
                </h1>
                <p className="text-sm text-slate-600">AI-Powered Stock Research Platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Section */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 border border-blue-100 shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Search Stocks</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">🇮🇳 Available Indian Stocks (ADR Listings):</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <div><strong>INFY</strong> - Infosys Limited</div>
              <div><strong>WIT</strong> - Wipro Limited</div>
              <div><strong>HDB</strong> - HDFC Bank</div>
              <div><strong>IBN</strong> - ICICI Bank</div>
              <div><strong>TTM</strong> - Tata Motors</div>
              <div><strong>RDY</strong> - Dr. Reddy's Labs</div>
              <div><strong>AZRE</strong> - Azure Power Global</div>
              <div><strong>MMYT</strong> - MakeMyTrip Limited</div>
            </div>
            <p className="text-blue-700 text-sm mt-2">
              <strong>Note:</strong> These are Indian companies trading as ADRs on US exchanges. Search by company name or symbol. Prices are converted to INR for Indian investors.
            </p>
          </div>
          <div className="flex space-x-4 relative">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search stocks... (e.g., 'Tata Motors', 'HDFC', 'Apple', 'INFY')"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                onKeyPress={(e) => e.key === 'Enter' && searchStock()}
              />
              
              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-blue-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                  {searchSuggestions.map((stock, index) => (
                    <div
                      key={index}
                      onClick={() => selectSuggestion(stock)}
                      className={`p-4 hover:bg-blue-50 cursor-pointer border-b border-blue-100 last:border-b-0 transition-colors ${
                        !stock.available ? 'opacity-75' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800 flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              stock.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {stock.symbol}
                            </span>
                            <span>{stock.name}</span>
                          </div>
                          <div className="text-sm text-slate-600">{stock.sector}</div>
                          {stock.suggestion && (
                            <div className="text-xs text-orange-600 mt-1">{stock.suggestion}</div>
                          )}
                        </div>
                        <div className="text-right">
                          {stock.available ? (
                            <div className="text-green-600 text-xs font-semibold">✓ Available</div>
                          ) : (
                            <div className="text-red-600 text-xs font-semibold">⚠ Not Direct</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Quick Access Popular Stocks */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2 text-sm">Quick Access:</h4>
                    <div className="flex flex-wrap gap-2">
                      {['INFY', 'HDB', 'TTM', 'AAPL', 'MSFT', 'GOOGL'].map(symbol => (
                        <button
                          key={symbol}
                          onClick={() => selectSuggestion(allStocks.find(s => s.symbol === symbol))}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-xs font-medium transition-colors"
                        >
                          {symbol}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => searchStock()}
              disabled={loading || !searchQuery.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Analyze</span>
                </>
              )}
            </button>
          </div>
          
          {/* Search Tips */}
          <div className="mt-4 text-sm text-slate-600">
            <strong>💡 Search Tips:</strong> Type company names like "Tata Motors", "HDFC Bank", "Apple" or stock symbols like "TTM", "HDB", "AAPL". Available Indian stocks are automatically converted to INR.
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
              <div>
                <h3 className="font-semibold text-red-800 mb-2">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stock Data Display */}
        {stockData && (
          <div className="space-y-8">
            {/* Stock Overview */}
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 border border-blue-100 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">{stockData.overview.Name}</h2>
                  <p className="text-lg text-slate-600">{stockData.overview.Symbol} • {stockData.overview.Exchange}</p>
                  <p className="text-sm text-slate-500">{stockData.overview.Sector} • {stockData.overview.Industry}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-3xl font-bold text-slate-800">
                      {stockData.currencySymbol}{stockData.currentPrice.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                    </span>
                    {getTrendIcon(stockData.change)}
                  </div>
                  <div className={`text-lg font-semibold ${getTrendColor(stockData.change)}`}>
                    {stockData.change >= 0 ? '+' : ''}{stockData.currencySymbol}{Math.abs(stockData.change).toFixed(2)} ({stockData.changePercent.toFixed(2)}%)
                  </div>
                  {stockData.isIndianStock && (
                    <div className="text-sm text-slate-500 mt-1">
                      Converted at ₹{stockData.exchangeRate.toFixed(2)}/USD
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-800">Market Cap</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-900">
                    {stockData.currencySymbol}{formatNumber(parseInt(stockData.overview.MarketCapitalization) * (stockData.isIndianStock ? stockData.exchangeRate : 1))}
                  </span>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-semibold text-green-800">P/E Ratio</span>
                  </div>
                  <span className="text-2xl font-bold text-green-900">{stockData.overview.PERatio || 'N/A'}</span>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-800">Volume</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-900">{formatNumber(stockData.volume)}</span>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <PieChart className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-semibold text-orange-800">Dividend Yield</span>
                  </div>
                  <span className="text-2xl font-bold text-orange-900">{stockData.overview.DividendYield || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex space-x-1 bg-white/50 backdrop-blur-sm p-1 rounded-2xl border border-blue-100">
              {[
                { id: 'overview', label: 'Overview', icon: Eye },
                { id: 'chart', label: 'Price Chart', icon: BarChart3 },
                { id: 'fundamentals', label: 'Fundamentals', icon: Calculator },
                { id: 'technicals', label: 'Technical Analysis', icon: Activity }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all ${
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

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-lg">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Company Overview</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">{stockData.overview.Description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-3">Key Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Country:</span>
                          <span className="font-medium">{stockData.overview.Country}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Currency:</span>
                          <span className="font-medium">{stockData.overview.Currency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Employees:</span>
                          <span className="font-medium">{formatNumber(stockData.overview.FullTimeEmployees)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Fiscal Year End:</span>
                          <span className="font-medium">{stockData.overview.FiscalYearEnd}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-3">Trading Info</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">52 Week High:</span>
                          <span className="font-medium">
                            {stockData.currencySymbol}{stockData.overview['52WeekHigh'] ? (parseFloat(stockData.overview['52WeekHigh']) * (stockData.isIndianStock ? stockData.exchangeRate : 1)).toFixed(2) : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">52 Week Low:</span>
                          <span className="font-medium">
                            {stockData.currencySymbol}{stockData.overview['52WeekLow'] ? (parseFloat(stockData.overview['52WeekLow']) * (stockData.isIndianStock ? stockData.exchangeRate : 1)).toFixed(2) : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Shares Outstanding:</span>
                          <span className="font-medium">{formatNumber(stockData.overview.SharesOutstanding)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Beta:</span>
                          <span className="font-medium">{stockData.overview.Beta}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-lg">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Open:</span>
                        <span className="font-medium">{stockData.currencySymbol}{stockData.open.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Previous Close:</span>
                        <span className="font-medium">{stockData.currencySymbol}{stockData.previousClose.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Day's Range:</span>
                        <span className="font-medium">{stockData.currencySymbol}{stockData.dayLow.toFixed(2)} - {stockData.currencySymbol}{stockData.dayHigh.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">EPS:</span>
                        <span className="font-medium">
                          {stockData.currencySymbol}{stockData.overview.EPS ? (parseFloat(stockData.overview.EPS) * (stockData.isIndianStock ? stockData.exchangeRate : 1)).toFixed(2) : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!aiAnalysis && (
                    <button
                      onClick={generateAIAnalysis}
                      disabled={generatingReport}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      {generatingReport ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Generating AI Analysis...</span>
                        </>
                      ) : (
                        <>
                          <Brain className="w-6 h-6" />
                          <span>Generate AI Analysis</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'chart' && (
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-lg">
                <h3 className="text-xl font-bold text-slate-800 mb-6">30-Day Price Chart</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={stockData.chartData}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis tickFormatter={(value) => `${value.toFixed(0)}`} />
                    <Tooltip 
                      formatter={(value, name) => [`${value.toFixed(2)}`, 'Price']}
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      fill="url(#priceGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>

                <div className="mt-6 grid md:grid-cols-2 gap-6">
                  <div className="bg-white/50 p-4 rounded-xl border border-blue-100">
                    <h4 className="font-semibold text-slate-700 mb-4">Volume Chart</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={stockData.chartData.slice(-10)}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis tickFormatter={(value) => formatNumber(value)} />
                        <Tooltip formatter={(value) => [formatNumber(value), 'Volume']} />
                        <Bar dataKey="volume" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white/50 p-4 rounded-xl border border-blue-100">
                    <h4 className="font-semibold text-slate-700 mb-4">Price Statistics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">30-Day High:</span>
                        <span className="font-semibold">{stockData.currencySymbol}{Math.max(...stockData.chartData.map(d => d.high)).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">30-Day Low:</span>
                        <span className="font-semibold">{stockData.currencySymbol}{Math.min(...stockData.chartData.map(d => d.low)).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Average Volume:</span>
                        <span className="font-semibold">{formatNumber(stockData.chartData.reduce((sum, d) => sum + d.volume, 0) / stockData.chartData.length)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">30-Day Return:</span>
                        <span className={`font-semibold ${stockData.chartData.length > 1 && stockData.chartData[stockData.chartData.length - 1].price > stockData.chartData[0].price ? 'text-green-600' : 'text-red-600'}`}>
                          {stockData.chartData.length > 1 ? (((stockData.chartData[stockData.chartData.length - 1].price - stockData.chartData[0].price) / stockData.chartData[0].price) * 100).toFixed(2) : '0.00'}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'fundamentals' && (
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-lg">
                  <h3 className="text-xl font-bold text-slate-800 mb-6">Valuation Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'P/E Ratio', value: stockData.overview.PERatio, desc: 'Price to Earnings' },
                      { label: 'P/B Ratio', value: stockData.overview.PriceToBookRatio, desc: 'Price to Book' },
                      { label: 'P/S Ratio', value: stockData.overview.PriceToSalesRatioTTM, desc: 'Price to Sales' },
                      { label: 'EV/EBITDA', value: stockData.overview.EVToEBITDA, desc: 'Enterprise Value to EBITDA' }
                    ].map((metric, index) => (
                      <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                        <div className="text-sm text-blue-800 font-semibold">{metric.label}</div>
                        <div className="text-2xl font-bold text-blue-900">{metric.value || 'N/A'}</div>
                        <div className="text-xs text-blue-600">{metric.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-lg">
                  <h3 className="text-xl font-bold text-slate-800 mb-6">Financial Performance</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Revenue (TTM)', value: stockData.overview.RevenueTTM, format: 'currency' },
                      { label: 'Gross Profit (TTM)', value: stockData.overview.GrossProfitTTM, format: 'currency' },
                      { label: 'EBITDA', value: stockData.overview.EBITDA, format: 'currency' },
                      { label: 'Net Income (TTM)', value: stockData.overview.NetIncomeTTM, format: 'currency' },
                      { label: 'ROE (%)', value: stockData.overview.ReturnOnEquityTTM, format: 'percent' },
                      { label: 'ROA (%)', value: stockData.overview.ReturnOnAssetsTTM, format: 'percent' }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-b-0">
                        <span className="text-slate-600">{item.label}</span>
                        <span className="font-semibold text-slate-800">
                          {item.format === 'currency' 
                            ? `${formatNumber(parseInt(item.value || 0))}`
                            : item.format === 'percent'
                            ? `${item.value || 'N/A'}%`
                            : item.value || 'N/A'
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-lg">
                  <h3 className="text-xl font-bold text-slate-800 mb-6">Financial Strength Indicators</h3>
                  <div className="grid md:grid-cols-4 gap-6">
                    {[
                      { 
                        label: 'Debt/Equity Ratio', 
                        value: stockData.overview.DebtToEquityRatio || 'N/A',
                        status: parseFloat(stockData.overview.DebtToEquityRatio || 100) < 50 ? 'good' : parseFloat(stockData.overview.DebtToEquityRatio || 100) < 100 ? 'moderate' : 'high'
                      },
                      { 
                        label: 'Current Ratio', 
                        value: stockData.overview.CurrentRatio || 'N/A',
                        status: parseFloat(stockData.overview.CurrentRatio || 0) > 1.5 ? 'good' : parseFloat(stockData.overview.CurrentRatio || 0) > 1 ? 'moderate' : 'high'
                      },
                      { 
                        label: 'Quick Ratio', 
                        value: stockData.overview.QuickRatio || 'N/A',
                        status: parseFloat(stockData.overview.QuickRatio || 0) > 1 ? 'good' : parseFloat(stockData.overview.QuickRatio || 0) > 0.5 ? 'moderate' : 'high'
                      },
                      { 
                        label: 'Interest Coverage', 
                        value: stockData.overview.InterestCoverageRatio || 'N/A',
                        status: parseFloat(stockData.overview.InterestCoverageRatio || 0) > 5 ? 'good' : parseFloat(stockData.overview.InterestCoverageRatio || 0) > 2 ? 'moderate' : 'high'
                      }
                    ].map((indicator, index) => (
                      <div key={index} className="text-center p-4 rounded-xl border-2 border-slate-200">
                        <div className="text-sm text-slate-600 mb-2">{indicator.label}</div>
                        <div className="text-2xl font-bold text-slate-800 mb-2">{indicator.value}</div>
                        <div className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          indicator.status === 'good' ? 'bg-green-100 text-green-800' :
                          indicator.status === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {indicator.status === 'good' ? 'Strong' : indicator.status === 'moderate' ? 'Moderate' : 'Weak'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'technicals' && (
              <div className="space-y-8">
                <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-lg">
                  <h3 className="text-xl font-bold text-slate-800 mb-6">Technical Indicators</h3>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-4">RSI (Relative Strength Index)</h4>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                        <div className="text-3xl font-bold text-purple-900 mb-2">
                          {stockData.rsi.length > 0 ? stockData.rsi[stockData.rsi.length - 1].toFixed(2) : 'N/A'}
                        </div>
                        <div className="text-sm text-purple-700">
                          {stockData.rsi.length > 0 && stockData.rsi[stockData.rsi.length - 1] > 70 && 'Overbought - Consider Selling'}
                          {stockData.rsi.length > 0 && stockData.rsi[stockData.rsi.length - 1] < 30 && 'Oversold - Consider Buying'}
                          {stockData.rsi.length > 0 && stockData.rsi[stockData.rsi.length - 1] >= 30 && stockData.rsi[stockData.rsi.length - 1] <= 70 && 'Neutral Range'}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-4">Moving Averages</h4>
                      <div className="space-y-3">
                        {stockData.chartData.length >= 5 && (
                          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                            <span className="text-blue-800">5-Day MA</span>
                            <span className="font-semibold text-blue-900">
                              ${(stockData.chartData.slice(-5).reduce((sum, d) => sum + d.price, 0) / 5).toFixed(2)}
                            </span>
                          </div>
                        )}
                        {stockData.chartData.length >= 10 && (
                          <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                            <span className="text-green-800">10-Day MA</span>
                            <span className="font-semibold text-green-900">
                              ${(stockData.chartData.slice(-10).reduce((sum, d) => sum + d.price, 0) / 10).toFixed(2)}
                            </span>
                          </div>
                        )}
                        {stockData.chartData.length >= 20 && (
                          <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                            <span className="text-purple-800">20-Day MA</span>
                            <span className="font-semibold text-purple-900">
                              ${(stockData.chartData.slice(-20).reduce((sum, d) => sum + d.price, 0) / 20).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-lg">
                    <h4 className="font-semibold text-slate-700 mb-4 flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span>Support Level</span>
                    </h4>
                    <div className="text-2xl font-bold text-green-600">
                      {stockData.currencySymbol}{Math.min(...stockData.chartData.slice(-10).map(d => d.low)).toFixed(2)}
                    </div>
                    <div className="text-sm text-slate-600 mt-2">10-day low support</div>
                  </div>

                  <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-lg">
                    <h4 className="font-semibold text-slate-700 mb-4 flex items-center space-x-2">
                      <TrendingDown className="w-5 h-5 text-red-600" />
                      <span>Resistance Level</span>
                    </h4>
                    <div className="text-2xl font-bold text-red-600">
                      {stockData.currencySymbol}{Math.max(...stockData.chartData.slice(-10).map(d => d.high)).toFixed(2)}
                    </div>
                    <div className="text-sm text-slate-600 mt-2">10-day high resistance</div>
                  </div>

                  <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-lg">
                    <h4 className="font-semibold text-slate-700 mb-4 flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-blue-600" />
                      <span>Volatility</span>
                    </h4>
                    <div className="text-2xl font-bold text-blue-600">
                      {stockData.chartData.length > 1 ? (
                        (Math.sqrt(
                          stockData.chartData.slice(-10).reduce((sum, d, i, arr) => {
                            if (i === 0) return sum;
                            const dailyReturn = (d.price - arr[i-1].price) / arr[i-1].price;
                            return sum + dailyReturn * dailyReturn;
                          }, 0) / 9
                        ) * Math.sqrt(252) * 100).toFixed(2)
                      ) : '0'}%
                    </div>
                    <div className="text-sm text-slate-600 mt-2">Annualized volatility</div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Analysis Section */}
            {aiAnalysis && (
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
                      <Brain className="w-7 h-7 text-purple-600" />
                      <span>AI Investment Analysis</span>
                    </h3>
                    <button
                      onClick={downloadPDFReport}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center space-x-2"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download Report</span>
                    </button>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 bg-white/70 p-6 rounded-xl border border-purple-200">
                      <div className="flex items-center space-x-3 mb-4">
                        {aiAnalysis.investmentRecommendation.includes('BUY') ? (
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        ) : aiAnalysis.investmentRecommendation.includes('SELL') ? (
                          <XCircle className="w-8 h-8 text-red-600" />
                        ) : (
                          <Minus className="w-8 h-8 text-yellow-600" />
                        )}
                        <div>
                          <h4 className="text-xl font-bold text-slate-800">Investment Recommendation</h4>
                          <p className="text-lg font-semibold text-purple-700">{aiAnalysis.targetPrice}</p>
                        </div>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{aiAnalysis.investmentRecommendation}</p>
                    </div>

                    <div className="bg-white/70 p-6 rounded-xl border border-purple-200">
                      <h4 className="text-lg font-bold text-slate-800 mb-4">Financial Health Score</h4>
                      <div className="text-center">
                        <div className="text-5xl font-bold text-purple-600 mb-2">{aiAnalysis.financialHealth.score}/10</div>
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          parseInt(aiAnalysis.financialHealth.score) >= 8 ? 'bg-green-100 text-green-800' :
                          parseInt(aiAnalysis.financialHealth.score) >= 6 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {parseInt(aiAnalysis.financialHealth.score) >= 8 ? 'Excellent' :
                           parseInt(aiAnalysis.financialHealth.score) >= 6 ? 'Good' : 'Poor'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white/70 p-6 rounded-xl border border-purple-200">
                      <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span>Strengths</span>
                      </h4>
                      <ul className="space-y-2">
                        {aiAnalysis.fundamentalAnalysis.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-slate-700">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white/70 p-6 rounded-xl border border-purple-200">
                      <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span>Weaknesses</span>
                      </h4>
                      <ul className="space-y-2">
                        {aiAnalysis.fundamentalAnalysis.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-slate-700">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 grid lg:grid-cols-2 gap-8">
                    <div className="bg-white/70 p-6 rounded-xl border border-purple-200">
                      <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-orange-600" />
                        <span>Risk Assessment</span>
                      </h4>
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${
                        aiAnalysis.riskAssessment.level === 'LOW' ? 'bg-green-100 text-green-800' :
                        aiAnalysis.riskAssessment.level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {aiAnalysis.riskAssessment.level} RISK
                      </div>
                      <ul className="space-y-2">
                        {aiAnalysis.riskAssessment.factors.map((factor, index) => (
                          <li key={index} className="text-sm text-slate-700">• {factor}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white/70 p-6 rounded-xl border border-purple-200">
                      <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                        <Zap className="w-5 h-5 text-blue-600" />
                        <span>Future Catalysts</span>
                      </h4>
                      <ul className="space-y-2">
                        {aiAnalysis.futureOutlook.catalysts.map((catalyst, index) => (
                          <li key={index} className="text-sm text-slate-700">• {catalyst}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 bg-white/70 p-6 rounded-xl border border-purple-200">
                    <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-600" />
                      <span>Actionable Insights</span>
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {aiAnalysis.actionableInsights.map((insight, index) => (
                        <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-start space-x-2">
                            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                              {index + 1}
                            </div>
                            <span className="text-sm text-slate-700">{insight}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 grid lg:grid-cols-2 gap-8">
                    <div className="bg-white/70 p-6 rounded-xl border border-purple-200">
                      <h4 className="text-lg font-bold text-slate-800 mb-4">Short-term Outlook (3-6 months)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed">{aiAnalysis.futureOutlook.shortTerm}</p>
                    </div>

                    <div className="bg-white/70 p-6 rounded-xl border border-purple-200">
                      <h4 className="text-lg font-bold text-slate-800 mb-4">Long-term Outlook (1-2 years)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed">{aiAnalysis.futureOutlook.longTerm}</p>
                    </div>
                  </div>

                  <div className="mt-8 bg-white/70 p-6 rounded-xl border border-purple-200">
                    <h4 className="text-lg font-bold text-slate-800 mb-4">Technical Analysis Summary</h4>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-sm text-slate-600 mb-1">Trend</div>
                        <div className="font-semibold text-slate-800">{aiAnalysis.technicalAnalysis.trend}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-slate-600 mb-1">Support</div>
                        <div className="font-semibold text-green-600">{aiAnalysis.technicalAnalysis.support}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-slate-600 mb-1">Resistance</div>
                        <div className="font-semibold text-red-600">{aiAnalysis.technicalAnalysis.resistance}</div>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-sm font-semibold text-blue-800 mb-2">Momentum Analysis:</div>
                      <div className="text-sm text-blue-700">{aiAnalysis.technicalAnalysis.momentum}</div>
                    </div>
                  </div>

                  <div className="mt-8 bg-white/70 p-6 rounded-xl border border-purple-200">
                    <h4 className="text-lg font-bold text-slate-800 mb-4">Valuation Analysis</h4>
                    <p className="text-sm text-slate-700 leading-relaxed mb-4">{aiAnalysis.fundamentalAnalysis.valuation}</p>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                        <div className="text-sm font-semibold text-green-800 mb-1">P/E Analysis</div>
                        <div className="text-sm text-green-700">{aiAnalysis.keyMetrics.peAnalysis}</div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-4 rounded-lg border border-blue-200">
                        <div className="text-sm font-semibold text-blue-800 mb-1">Growth Rate</div>
                        <div className="text-sm text-blue-700">{aiAnalysis.keyMetrics.growthRate}</div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                        <div className="text-sm font-semibold text-purple-800 mb-1">Dividend Analysis</div>
                        <div className="text-sm text-purple-700">{aiAnalysis.keyMetrics.dividendAnalysis}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 bg-white/70 p-6 rounded-xl border border-purple-200">
                    <h4 className="text-lg font-bold text-slate-800 mb-4">Market Context</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">{aiAnalysis.marketContext}</p>
                  </div>

                  <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-amber-800 mb-2">Investment Disclaimer</h4>
                        <p className="text-amber-700 text-sm leading-relaxed">
                          This AI-generated analysis is for educational and informational purposes only. It is not personalized investment advice. 
                          All investments carry risk of loss. Past performance does not guarantee future results. Please conduct your own research 
                          and consult with qualified financial professionals before making investment decisions. The analysis is based on available 
                          data and may not reflect all market conditions or company-specific factors.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* No Data State */}
        {!stockData && !loading && !error && (
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-12 border border-slate-200 text-center">
            <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">Ready to Analyze Stocks</h3>
            <p className="text-slate-500 mb-6">Enter a stock symbol above to get comprehensive analysis with real-time data and AI insights.</p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-blue-800 mb-3">Try These Popular Stocks:</h4>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { symbol: 'INFY', name: 'Infosys (Indian)' },
                  { symbol: 'HDB', name: 'HDFC Bank (Indian)' },
                  { symbol: 'AAPL', name: 'Apple' },
                  { symbol: 'MSFT', name: 'Microsoft' },
                  { symbol: 'GOOGL', name: 'Alphabet' },
                  { symbol: 'TSLA', name: 'Tesla' }
                ].map(stock => (
                  <button
                    key={stock.symbol}
                    onClick={() => {
                      setSearchQuery(stock.symbol);
                      setTimeout(() => searchStock(), 100);
                    }}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors font-medium text-sm"
                    title={stock.name}
                  >
                    {stock.symbol}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white/50 backdrop-blur-md border-t border-blue-100 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-600 text-sm">
            Built with React & AI • Powered by Alpha Vantage API & Advanced Analytics •
            <span className="text-blue-600 font-medium"> FinSight AI Stock Analysis</span>
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Real-time data provided by Alpha Vantage • AI analysis powered by advanced language models
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockAnalysis;