import './NotFoundPage.scss';
import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  title?: string;
  subtitle?: string;
  text?: string;
  linkTo?: string;
  linkLabel?: string;
}

export const NotFoundPage: React.FC<Props> = ({
  title = '404',
  subtitle = 'Page not found',
  text = 'Sorry, the page you are looking for does not exist or has moved.',
  linkTo = '/',
  linkLabel = 'Go to Home Page',
}) => {
  return (
    <div className="not-found">
      <h1 className="not-found__title">{title}</h1>
      <h2 className="not-found__subtitle">{subtitle}</h2>
      <p className="not-found__text">{text}</p>
      <Link to={linkTo} className="not-found__link">
        {linkLabel}
      </Link>
    </div>
  );
};
