import { useEffect, useReducer, useCallback, useRef } from 'react';
import { currencyReducer, initialState } from '../reducers/currencyReducer';
import toast from 'react-hot-toast';

// API KEYNI SHU YERGA JOYLANG 👇
const API_KEY = 'a9adca21bd163435e3e1fbdc'; // <--- API KEYINGIZNI SHU YERGA YOZING
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair`;

export function useCurrencyConverter() {
  const [state, dispatch] = useReducer(currencyReducer, initialState);
  const intervalRef = useRef(null);

  const fetchExchangeRate = useCallback(async (from, to, showToast = false) => {
    if (from === to) {
      dispatch({
        type: 'SET_EXCHANGE_RATE',
        payload: { rate: 1, timestamp: new Date() }
      });
      if (showToast) {
        toast.success('Same currency selected! Rate is 1:1');
      }
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/${from}/${to}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rate');
      }
      
      const data = await response.json();
      
      if (data.result === 'success') {
        dispatch({
          type: 'SET_EXCHANGE_RATE',
          payload: { 
            rate: data.conversion_rate, 
            timestamp: new Date() 
          }
        });
        if (showToast) {
          toast.success(`Exchange rate updated! 1 ${from} = ${data.conversion_rate.toFixed(4)} ${to}`);
        }
      } else {
        throw new Error(data['error-type'] || 'Unknown error');
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.message
      });
      if (showToast) {
        toast.error(`Error: ${error.message}`);
      }
    }
  }, []);

  const refreshRate = useCallback(async (showToast = true) => {
    dispatch({ type: 'SET_REFRESHING', payload: true });
    await fetchExchangeRate(state.fromCurrency, state.toCurrency, showToast);
  }, [state.fromCurrency, state.toCurrency, fetchExchangeRate]);

  useEffect(() => {
    fetchExchangeRate(state.fromCurrency, state.toCurrency, false);
  }, [state.fromCurrency, state.toCurrency, fetchExchangeRate]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      refreshRate(false);
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshRate]);

  const setAmount = (amount) => {
    dispatch({ type: 'SET_AMOUNT', payload: parseFloat(amount) || 0 });
  };

  const setFromCurrency = (currency) => {
    dispatch({ type: 'SET_FROM_CURRENCY', payload: currency });
  };

  const setToCurrency = (currency) => {
    dispatch({ type: 'SET_TO_CURRENCY', payload: currency });
  };

  const swapCurrencies = () => {
    dispatch({ type: 'SWAP_CURRENCIES' });
    toast.success('Currencies swapped!');
  };

  return {
    state,
    actions: {
      setAmount,
      setFromCurrency,
      setToCurrency,
      swapCurrencies,
      refreshRate
    }
  };
}