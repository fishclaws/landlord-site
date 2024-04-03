import React, { ReactChildren, ReactElement, useState } from 'react';

const ErrorBoundary = () => {

    return (
      <div>
        <h1>Something went wrong. Click <a href='/'>here</a> to go back :)</h1>
      </div>
    );

};

export default ErrorBoundary;