import React from 'react';

const POPULAR_CURRENCIES = ['USD', 'EUR', 'UZS', 'GBP', 'JPY'];
const ALL_CURRENCIES = [
  'USD', 'EUR', 'UZS', 'GBP', 'JPY', 'CNY', 'RUB', 
  'KZT', 'TRY', 'AED', 'INR', 'KRW', 'CAD', 'AUD', 'CHF',
  'SGD', 'NZD', 'MXN', 'BRL', 'ZAR', 'SEK', 'NOK', 'DKK'
];

const getCurrencySymbol = (currency) => {
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    UZS: 'so‘m',
    RUB: '₽',
    CNY: '¥',
    KRW: '₩',
    INR: '₹',
    CHF: 'Fr',
    CAD: 'C$',
    AUD: 'A$',
    SGD: 'S$',
    NZD: 'NZ$',
    BRL: 'R$',
    TRY: '₺',
    AED: 'د.إ',
    KZT: '₸'
  };
  return symbols[currency] || currency;
};

export function CurrencyInput({ 
  label, 
  amount, 
  currency, 
  onAmountChange, 
  onCurrencyChange, 
  disabled = false,
  type = 'from'
}) {
  return (
    <div className={`currency-input ${type}`}>
      <label>
        {label}
        {type === 'from' && <span className="label-badge">You send</span>}
        {type === 'to' && <span className="label-badge">You receive</span>}
      </label>
      <div className="input-group">
        <div className="amount-wrapper">
          <span className="currency-symbol">
            {getCurrencySymbol(currency)}
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            disabled={disabled}
            step="any"
            min="0"
            placeholder="0.00"
          />
        </div>
        <select value={currency} onChange={(e) => onCurrencyChange(e.target.value)}>
          <optgroup label="⭐ Popular">
            {POPULAR_CURRENCIES.map(curr => (
              <option key={curr} value={curr}>{curr} - {getCurrencySymbol(curr)}</option>
            ))}
          </optgroup>
          <optgroup label="🌍 All Currencies">
            {ALL_CURRENCIES.map(curr => (
              <option key={curr} value={curr}>{curr} - {getCurrencySymbol(curr)}</option>
            ))}
          </optgroup>
        </select>
      </div>
    </div>
  );
}