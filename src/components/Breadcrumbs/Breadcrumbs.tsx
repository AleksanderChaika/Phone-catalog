/* eslint-disable max-len */
import './Breadcrumbs.scss';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Props {
  currentLabel?: string;
}

export const Breadcrumbs: React.FC<Props> = ({ currentLabel }) => {
  const { pathname } = useLocation();
  const pathnames = pathname.split('/').filter(x => x);

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/" className="breadcrumbs__home" aria-label="Home" />

      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        const name =
          last && currentLabel
            ? currentLabel
            : value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');

        return (
          <React.Fragment key={to}>
            <div className="breadcrumbs__separator" aria-hidden="true" />
            {last ? (
              <span
                className="breadcrumbs__current"
                aria-current="page"
                title={name}
              >
                {name}
              </span>
            ) : (
              <Link to={to} className="breadcrumbs__link">
                {name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
