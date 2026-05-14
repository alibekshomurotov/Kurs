import React, { useState, useEffect } from 'react';
import { useCurrencyConverter } from './hooks/useCurrencyConverter';
import { CurrencyInput } from './components/CurrencyInput';
import { ExchangeRateInfo } from './components/ExchangeRateInfo';
import { RefreshButton } from './components/RefreshButton';
import { ThemeToggle } from './components/ThemeToggle';
import './App.css';

function App() {
  const { state, actions } = useCurrencyConverter();
  const [isSwapping, setIsSwapping] = useState(false);
  const [showNotification, setShowNotification] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoritePairs');
    return saved ? JSON.parse(saved) : [];
  });
  const [alertRate, setAlertRate] = useState('');
  const [priceHistory, setPriceHistory] = useState([]);

  const showTemporaryMessage = (message, type = 'success') => {
    setShowNotification({ message, type });
    setTimeout(() => setShowNotification(null), 3000);
  };

  // Save price history
  useEffect(() => {
    if (state.exchangeRate && !state.isRefreshing) {
      setPriceHistory(prev => {
        // Avoid duplicate consecutive rates
        if (prev.length > 0 && prev[prev.length - 1] === state.exchangeRate) {
          return prev;
        }
        const newHistory = [...prev, state.exchangeRate];
        if (newHistory.length > 10) newHistory.shift();
        return newHistory;
      });
    }
  }, [state.exchangeRate, state.isRefreshing]);

  const handleSwap = async () => {
    setIsSwapping(true);
    actions.swapCurrencies();
    showTemporaryMessage('Currencies swapped!', 'success');
    setTimeout(() => setIsSwapping(false), 300);
  };

  const handleRefresh = () => {
    actions.refreshRate(true);
    showTemporaryMessage('Updating exchange rate...', 'info');
  };

  const handleQuickAmount = (amount) => {
    actions.setAmount(amount);
    showTemporaryMessage(`Amount set to ${amount} ${state.fromCurrency}`, 'success');
  };

  const toggleFavorite = () => {
    const pair = `${state.fromCurrency}/${state.toCurrency}`;
    if (favorites.includes(pair)) {
      setFavorites(favorites.filter(f => f !== pair));
      showTemporaryMessage(`${pair} removed from favorites`, 'info');
    } else {
      setFavorites([...favorites, pair]);
      showTemporaryMessage(`${pair} added to favorites`, 'success');
    }
  };

  const loadFavoritePair = (pair) => {
    const [from, to] = pair.split('/');
    actions.setFromCurrency(from);
    actions.setToCurrency(to);
    showTemporaryMessage(`Loaded ${pair}`, 'success');
  };

  const setRateAlert = () => {
    if (alertRate && !isNaN(alertRate) && parseFloat(alertRate) > 0) {
      localStorage.setItem(`alert_${state.fromCurrency}_${state.toCurrency}`, alertRate);
      showTemporaryMessage(`Alert set at ${alertRate} ${state.toCurrency}`, 'success');
      setAlertRate('');
    } else {
      showTemporaryMessage('Please enter a valid rate', 'error');
    }
  };

  const checkAlert = () => {
    const alertValue = localStorage.getItem(`alert_${state.fromCurrency}_${state.toCurrency}`);
    if (alertValue && state.exchangeRate >= parseFloat(alertValue)) {
      showTemporaryMessage(`🔔 RATE ALERT! 1 ${state.fromCurrency} = ${state.exchangeRate.toFixed(4)} ${state.toCurrency}`, 'warning');
      localStorage.removeItem(`alert_${state.fromCurrency}_${state.toCurrency}`);
    }
  };

  useEffect(() => {
    if (state.exchangeRate) {
      checkAlert();
    }
  }, [state.exchangeRate]);

  useEffect(() => {
    localStorage.setItem('favoritePairs', JSON.stringify(favorites));
  }, [favorites]);

  // Calculate chart statistics
  const maxHistory = priceHistory.length > 0 ? Math.max(...priceHistory) : 1;
  const minHistory = priceHistory.length > 0 ? Math.min(...priceHistory) : 0;
  const avgHistory = priceHistory.length > 0 
    ? (priceHistory.reduce((a, b) => a + b, 0) / priceHistory.length).toFixed(4)
    : 0;

  return (
    <div className="app">
      {showNotification && (
        <div className={`notification notification-${showNotification.type}`}>
          {showNotification.message}
        </div>
      )}
      
      <div className="container">
        <div className="header">
          <div className="title-section">
            <h1>
              <span className="icon">💱</span>
              Currency Converter
            </h1>
            <p className="subtitle">Real-time exchange rates</p>
          </div>
          <ThemeToggle />
        </div>
        
        <div className="converter-card">
          <CurrencyInput
            label="From"
            amount={state.amount}
            currency={state.fromCurrency}
            onAmountChange={actions.setAmount}
            onCurrencyChange={actions.setFromCurrency}
            type="from"
          />

          <div className="action-buttons">
            <button 
              className={`swap-button ${isSwapping ? 'swapping' : ''}`}
              onClick={handleSwap}
              disabled={state.loading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M7 10L3 14L7 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M21 14L17 10L13 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M3 14H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M17 10V4H7V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Swap
            </button>
            
            <RefreshButton 
              onRefresh={handleRefresh}
              isRefreshing={state.isRefreshing}
              lastUpdated={state.lastUpdated}
            />

            <button 
              className={`favorite-button ${favorites.includes(`${state.fromCurrency}/${state.toCurrency}`) ? 'active' : ''}`}
              onClick={toggleFavorite}
            >
              ★ Favorite
            </button>
          </div>

          <CurrencyInput
            label="To"
            amount={state.convertedAmount || 0}
            currency={state.toCurrency}
            onAmountChange={() => {}}
            onCurrencyChange={actions.setToCurrency}
            disabled={true}
            type="to"
          />
        </div>

        {/* Favorite Pairs Section */}
        {favorites.length > 0 && (
          <div className="favorite-pairs">
            <div className="favorite-title">
              <span>⭐</span> Favorite Pairs
            </div>
            <div className="favorite-list">
              {favorites.map(pair => (
                <div key={pair} className="favorite-pair" onClick={() => loadFavoritePair(pair)}>
                  {pair}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price History Chart */}
        {priceHistory.length > 1 && (
          <div className="chart-container">
            <div className="chart-title">
              <span>📊</span> Price History (Last {priceHistory.length} rates)
            </div>
            <div className="chart-bars">
              {priceHistory.map((rate, index) => {
                // Calculate height percentage (between 20% and 95%)
                let heightPercent = 30;
                if (maxHistory !== minHistory) {
                  heightPercent = ((rate - minHistory) / (maxHistory - minHistory)) * 75 + 20;
                }
                return (
                  <div key={index} className="chart-bar-wrapper">
                    <div 
                      className="chart-bar" 
                      style={{ height: `${heightPercent}%` }}
                    >
                      <span className="chart-tooltip">{rate.toFixed(4)}</span>
                    </div>
                    <div className="chart-label">{rate.toFixed(2)}</div>
                  </div>
                );
              })}
            </div>
            <div className="chart-stats">
              <span>📈 High: {maxHistory.toFixed(4)}</span>
              <span>📉 Low: {minHistory.toFixed(4)}</span>
              <span>📊 Avg: {avgHistory}</span>
              <span>🔄 Change: {priceHistory.length > 1 
                ? ((priceHistory[priceHistory.length - 1] - priceHistory[0]) / priceHistory[0] * 100).toFixed(2) 
                : 0}%</span>
            </div>
          </div>
        )}

        {/* Rate Alert Section */}
        <div className="alert-container">
          <div className="chart-title">
            <span>🔔</span> Rate Alert
          </div>
          <div className="alert-input-group">
            <input 
              type="number" 
              className="alert-input"
              placeholder={`Alert when 1 ${state.fromCurrency} ≥ ? ${state.toCurrency}`}
              value={alertRate}
              onChange={(e) => setAlertRate(e.target.value)}
              step="0.0001"
            />
            <button className="alert-button" onClick={setRateAlert}>
              Set Alert
            </button>
          </div>
        </div>

        <ExchangeRateInfo
          fromCurrency={state.fromCurrency}
          toCurrency={state.toCurrency}
          rate={state.exchangeRate}
          lastUpdated={state.lastUpdated}
          loading={state.loading}
          error={state.error}
          isRefreshing={state.isRefreshing}
        />

        <div className="quick-actions">
          <span className="quick-label">Quick amounts:</span>
          <button onClick={() => handleQuickAmount(1)}>1</button>
          <button onClick={() => handleQuickAmount(10)}>10</button>
          <button onClick={() => handleQuickAmount(50)}>50</button>
          <button onClick={() => handleQuickAmount(100)}>100</button>
          <button onClick={() => handleQuickAmount(500)}>500</button>
          <button onClick={() => handleQuickAmount(1000)}>1K</button>
          <button onClick={() => handleQuickAmount(5000)}>5K</button>
          <button onClick={() => handleQuickAmount(10000)}>10K</button>
        </div>

        <div className="features">
          <div className="feature">
            <span className="feature-icon">🔄</span>
            <span>Auto-updates every 30s</span>
          </div>
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <span>Real-time rates</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🌍</span>
            <span>25+ currencies</span>
          </div>
          <div className="feature">
            <span className="feature-icon">⭐</span>
            <span>Favorite pairs</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🔔</span>
            <span>Rate alerts</span>
          </div>
          <div className="feature">
            <span className="feature-icon">📊</span>
            <span>Price chart</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;