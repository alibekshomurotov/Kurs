import React from 'react';

export function ExchangeRateInfo({ fromCurrency, toCurrency, rate, lastUpdated, loading, error, isRefreshing }) {
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  if (loading && !rate) {
    return (
      <div className="exchange-info loading">
        <div className="skeleton-loader">
          <div className="skeleton-line"></div>
          <div className="skeleton-line short"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="exchange-info error">
        <div className="error-icon">⚠️</div>
        <div className="error-message">{error}</div>
        <div className="error-hint">Please check your connection or try again later</div>
      </div>
    );
  }

  if (!rate) {
    return null;
  }

  return (
    <div className="exchange-info">
      <div className="rate-container">
        <div className="rate-main">
          <span className="rate-label">Exchange Rate</span>
          <div className="rate-value">
            1 {fromCurrency} = <span className="highlight">{rate.toFixed(4)}</span> {toCurrency}
          </div>
        </div>
        <div className="rate-secondary">
          1 {toCurrency} = {(1 / rate).toFixed(4)} {fromCurrency}
        </div>
      </div>
      
      {lastUpdated && (
        <div className="update-info">
          <span className="clock-icon">🕐</span>
          <span>Last updated: {formatDate(lastUpdated)}</span>
          {isRefreshing && <span className="updating-badge">Updating...</span>}
        </div>
      )}
    </div>
  );
}