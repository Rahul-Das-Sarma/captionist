import React from "react";

const AppHeader: React.FC = () => {
  return (
    <header className="app-header">
      <div className="text-center py-5">
        <h1 className="text-4xl font-bold text-dark-text-primary mb-2 tracking-tight">
          Captionist
        </h1>
        <p className="text-lg text-dark-text-secondary m-0 font-normal">
          Professional video captioning made simple
        </p>
      </div>
    </header>
  );
};

export default AppHeader;
