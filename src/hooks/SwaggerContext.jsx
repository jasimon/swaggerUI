import React, { useState, useContext, createContext } from "react";
import useAjax from "./useAjax";

const SwaggerContext = createContext();

const SwaggerProvider = ({ children }) => {
  const [
    fetchSchema,
    { data: swaggerSchema, loading: schemaLoading },
  ] = useAjax();
  return (
    <SwaggerContext.Provider
      value={{ fetchSchema, swaggerSchema, schemaLoading }}
    >
      {children}
    </SwaggerContext.Provider>
  );
};

const useSwaggerContext = () => {
  const context = useContext(SwaggerContext);
  if (context === undefined) {
    throw new Error("useSwaggerContext must be used within a swagger provider");
  }
  return context;
};

const useConfigFetcher = () => {
  const { fetchSchema, schemaLoading } = useSwaggerContext();
  return [fetchSchema, schemaLoading];
};

const useConfig = () => {
  const { swaggerSchema } = useSwaggerContext();
  return [swaggerSchema];
};

export { SwaggerProvider, useConfigFetcher, useConfig };
