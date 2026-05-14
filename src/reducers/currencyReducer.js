export const initialState = {
  amount: 1,
  fromCurrency: 'USD',
  toCurrency: 'EUR',
  convertedAmount: null,
  exchangeRate: null,
  loading: false,
  error: null,
  lastUpdated: null,
  isRefreshing: false
};

export function currencyReducer(state, action) {
  switch (action.type) {
    case 'SET_AMOUNT':
      return {
        ...state,
        amount: action.payload,
        convertedAmount: state.exchangeRate 
          ? action.payload * state.exchangeRate 
          : null
      };
    
    case 'SET_FROM_CURRENCY':
      return {
        ...state,
        fromCurrency: action.payload,
        loading: true,
        error: null
      };
    
    case 'SET_TO_CURRENCY':
      return {
        ...state,
        toCurrency: action.payload,
        loading: true,
        error: null
      };
    
    case 'SET_EXCHANGE_RATE':
      return {
        ...state,
        exchangeRate: action.payload.rate,
        convertedAmount: state.amount * action.payload.rate,
        loading: false,
        isRefreshing: false,
        error: null,
        lastUpdated: action.payload.timestamp
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    
    case 'SET_REFRESHING':
      return {
        ...state,
        isRefreshing: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
        isRefreshing: false
      };
    
    case 'SWAP_CURRENCIES':
      return {
        ...state,
        fromCurrency: state.toCurrency,
        toCurrency: state.fromCurrency,
        loading: true,
        error: null
      };
    
    default:
      return state;
  }
}