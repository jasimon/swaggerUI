import React, { useState, useContext, createContext, useEffect } from "react";
import useAjax from "./useAjax";

const SwaggerContext = createContext();

const SwaggerProvider = ({ children }) => {
  const [
    fetchSchema,
    { data: swaggerSchema, loading: schemaLoading },
  ] = useAjax();
  const [scheme, setScheme] = useState();
  // TODO: cleaner way of processing post-fetching config
  useEffect(() => {
    setScheme(swaggerSchema && swaggerSchema.schemes[0]);
  }, [swaggerSchema]);
  return (
    <SwaggerContext.Provider
      value={{ fetchSchema, swaggerSchema, schemaLoading, scheme, setScheme }}
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

const useScheme = () => {
  const { scheme, setScheme } = useSwaggerContext();
  const [{ schemes }] = useConfig();
  return [scheme, schemes, setScheme];
};

const useBaseUrl = () => {
  const [{ basePath, host }] = useConfig();
  const [scheme] = useScheme();
  console.log(host, basePath);
  return [`${scheme}://${host}${basePath}`];
};

const useOperation = () => {
  const [call, { loading, data, error, responseHeaders }] = useAjax();
  const [scheme] = useScheme();
  const [baseUrl] = useBaseUrl();
  console.log(baseUrl);
  const wrappedCall = (url, { params = {}, ...rest }) => {
    let fullUrl = baseUrl + url;
    Object.entries(params.path || {}).forEach(([k, v]) => {
      fullUrl = fullUrl.replace(`{${k}}`, v);
    });
    call(fullUrl, { ...rest, params: params.query });
  };
  return [wrappedCall, { loading, data, error, responseHeaders }];
};

export { SwaggerProvider, useConfigFetcher, useConfig, useOperation };
