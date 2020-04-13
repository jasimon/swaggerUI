import React from "react";
import { Select } from "antd";

import { useScheme } from "../hooks/SwaggerContext";

const SchemeSelect = () => {
  const [scheme, schemes, setScheme] = useScheme();
  return (
    <Select value={scheme} onChange={(value) => setScheme(value)}>
      {schemes.map((schemeOpt) => (
        <Select.Option key={schemeOpt} value={schemeOpt}>
          {schemeOpt}
        </Select.Option>
      ))}
    </Select>
  );
};

export default SchemeSelect;
