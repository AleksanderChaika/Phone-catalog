import React from 'react';
import './Loader.scss';

interface Props {
  text?: string;
}

export const Loader: React.FC<Props> = ({ text = 'Loading...' }) => (
  <div className="loader" role="status" aria-live="polite">
    <div className="loader__spinner" aria-hidden="true" />
    <p className="loader__text">{text}</p>
  </div>
);
