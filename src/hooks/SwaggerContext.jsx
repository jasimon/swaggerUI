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
  const wrappedCall = (url, { params = {}, headers = {}, ...rest }) => {
    let fullUrl = baseUrl + url;
    Object.entries(params.path || {}).forEach(([k, v]) => {
      fullUrl = fullUrl.replace(`{${k}}`, v);
    });
    let bodyString = null;
    const { body = null } = params;
    const { formData } = params;
    let form;
    if (formData) {
      if (headers["content-type"] === "application/x-www-form-urlencoded") {
        // TODO: use a standardized query string encoder for this
        form = Object.entries(formData)
          .map(([k, v]) => `${k}=${v}`)
          .join("&");
      } else {
        form = new FormData();
        Object.entries(formData).forEach(([k, v]) => {
          form.append(k, v);
        });
      }
    }
    call(fullUrl, {
      ...rest,
      params: params.query,
      data: form || JSON.parse(body),
      headers,
    });
  };
  return [wrappedCall, { loading, data, error, responseHeaders, statusCode }];
};

const useDefinition = (path = "") => {
  const [{ definitions }] = useConfig();
  const defnKey = path.replace("#/definitions/", "");
  // intentionally returning undefined when no path is passed in so we don't need to check the path
  // exists at the call site
  return definitions[defnKey];
};

export {
  SwaggerProvider,
  useConfigFetcher,
  useConfig,
  useOperation,
  useDefinition,
  useScheme,
};
