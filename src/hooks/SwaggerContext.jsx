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
  return [`${scheme}://${host}${basePath}`];
};

const useOperation = () => {
  const [
    call,
    { loading, data, error, responseHeaders, statusCode },
  ] = useAjax();
  const [scheme] = useScheme();
  const [baseUrl] = useBaseUrl();
  const wrappedCall = (url, { params = {}, ...rest }) => {
    let fullUrl = baseUrl + url;
    Object.entries(params.path || {}).forEach(([k, v]) => {
      fullUrl = fullUrl.replace(`{${k}}`, v);
    });
    const { body } = params;
    // From the spec: 'the name of the body param is for informational purposes only
    const bodyString = Object.values(body)[0];
    console.log(bodyString);
    call(fullUrl, {
      ...rest,
      params: params.query,
      data: JSON.parse(bodyString),
    });
  };
  return [wrappedCall, { loading, data, error, responseHeaders, statusCode }];
};

export { SwaggerProvider, useConfigFetcher, useConfig, useOperation };
