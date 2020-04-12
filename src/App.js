import React, { useState } from "react";
import logo from "./logo.svg";

import { SwaggerProvider } from "./hooks/SwaggerContext";
import PageContent from "./components/PageContent";

import "./App.scss";

function App() {
  const [apiUrl, setApiUrl] = useState(
    "https://petstore.swagger.io/v2/swagger.json"
  );
  const [apiSpec, setApiSpec] = useState({});
  return (
    <div className="App">
      <SwaggerProvider>
        <PageContent />
      </SwaggerProvider>
    </div>
  );
}

export default App;
