import React from 'react';

export function RefreshButton({ onRefresh, isRefreshing, lastUpdated }) {
  return (
    <button 
      className={`refresh-button ${isRefreshing ? 'refreshing' : ''}`}
      onClick={onRefresh}
      disabled={isRefreshing}
    >
      <svg 
        className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`}
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M23 4V10H17" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M1 20V14H7" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M3.51 9C4.15817 6.87213 5.45061 4.98691 7.19644 3.58876C8.94227 2.19061 11.0586 1.34201 13.2679 1.15033C15.4772 0.958654 17.6939 1.43272 19.6406 2.51135C21.5872 3.58997 23.1742 5.22297 24 7.19998" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M20.49 15C19.8418 17.1279 18.5494 19.0131 16.8036 20.4112C15.0577 21.8094 12.9414 22.658 10.7321 22.8497C8.52283 23.0413 6.30608 22.5673 4.35939 21.4887C2.4127 20.41 0.825774 18.777 0 16.8" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      {isRefreshing ? 'Updating...' : 'Update Rate'}
    </button>
  );
}