import React, { useState } from "react";
import axios from "axios";

const useAjax = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [responseHeaders, setResponseHeaders] = useState();
  const [statusCode, setStatusCode] = useState();

  const call = async (url, { method, params, headers, data } = {}) => {
    setLoading(true);
    setError(null);
    setData(null);
    setResponseHeaders(null);
    setStatusCode(null);
    try {
      const resp = await axios({
        url,
        method,
        headers,
        params,
        data,
      });
      setData(resp.data);
      setResponseHeaders(resp.headers);
      setStatusCode(resp.status);
    } catch (error) {
      setError(error.response.data || error.response.statusText);
      setResponseHeaders(error.response.headers);
      setStatusCode(error.response.status);
    } finally {
      setLoading(false);
    }
  };
  return [call, { loading, data, error, responseHeaders, statusCode }];
};

export default useAjax;
