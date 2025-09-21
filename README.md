
# FinSight-AI

FinSight-AI is a modern React + Vite web application that provides AI-powered financial and stock analysis, tailored for Indian and US markets. It leverages OpenRouter AI for deep investment insights and Alpha Vantage for real-time stock data.

## Features

- **Personalized Investment Analysis:**  
	Users can input their investment amount, goal, time horizon, and risk tolerance to receive a detailed, AI-generated financial plan, including portfolio allocation, return projections, fund recommendations, tax insights, and next steps.

- **Stock Analysis:**  
	Search for Indian ADRs and US stocks. Get real-time data, technical/fundamental analysis, and actionable AI insights. Download comprehensive PDF reports.

- **Modern UI:**  
	Built with Tailwind CSS and Recharts for beautiful, responsive data visualizations.

- **Routing:**  
	Uses React Router DOM for seamless navigation between the AI Analysis and Stock Analysis pages.

## Project Structure

```
src/
	App.jsx                # Main app with React Router setup
	main.jsx               # Entry point, renders <App />
	App.css, index.css     # Tailwind CSS imports
	pages/
		AIAnalysisText.jsx   # AI-powered investment analysis form and results
		StockAnalysis.jsx    # Stock search, charting, and AI stock analysis
	assets/                # (Your static assets)
public/                  # Static files
```

## Getting Started

1. **Install dependencies:**
	 ```sh
	 npm install
	 ```

2. **Set up environment variables:**
	 - Create a `.env` file in the project root.
	 - Add your OpenRouter API key:
		 ```
		 VITE_API_URL=your_openrouter_api_key
		 ```

3. **Run the development server:**
	 ```sh
	 npm run dev
	 ```

4. **Open the app:**
	 - Visit [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

- **AI Analysis:**  
	Go to `/` (Home). Fill out the investment form and click "Generate AI Analysis" for a personalized plan.

- **Stock Analysis:**  
	Go to `/stock`. Search for a stock symbol (e.g., `INFY`, `AAPL`). View charts, metrics, and generate an AI-powered stock report.

## Dependencies

- React, Vite
- react-router-dom
- recharts
- lucide-react
- tailwindcss
- Alpha Vantage API (for stock data)
- OpenRouter AI API (for AI analysis)

## Customization

- Update the list of supported stocks or add new analysis features in `pages/AIAnalysisText.jsx` and `pages/StockAnalysis.jsx`.
- Tailwind CSS is used for styling; customize in `App.css` and `index.css`.

## License

MIT
