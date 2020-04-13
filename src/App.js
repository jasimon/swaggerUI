import React from "react";

import { SwaggerProvider } from "./hooks/SwaggerContext";
import PageContent from "./components/PageContent";

import "./App.scss";

function App() {
  return (
    <div className="App">
      <SwaggerProvider>
        <PageContent />
      </SwaggerProvider>
    </div>
  );
}

export default App;
