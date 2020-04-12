import React, { useState } from "react";
import axios from "axios";

const useAjax = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState();

  const call = async (url /*{ method, parameters, headers } = {}*/) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const resp = await axios({
        url,
        // method,
        // headers,
        // params: parameters.query,
      });
      setData(resp);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  return [call, { loading, data, error }];
};

export default useAjax;
