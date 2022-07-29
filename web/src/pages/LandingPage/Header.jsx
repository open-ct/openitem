import React from 'react';

export default function Header(props) {
  return (
    <header {...props}>
      <div className="header-content">
        <h1>
          <a>
            <span>openitem</span>
          </a>
          <span>命题与题库系统</span>
        </h1>
      </div>
    </header>
  );
}
