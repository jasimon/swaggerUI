import React, { useState } from "react";
import axios from "axios";

const useAjax = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [responseHeaders, setResponseHeaders] = useState();

  const call = async (url, { method, params, headers } = {}) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const resp = await axios({
        url,
        method,
        headers,
        params,
      });
      setData(resp.data);
      setResponseHeaders(resp.headers);
    } catch (error) {
      console.log(error);
      setError(error);
      setResponseHeaders(error.response.headers);
    } finally {
      setLoading(false);
    }
  };
  return [call, { loading, data, error, responseHeaders }];
};

export default useAjax;
