import React, { useState } from "react";
import { Input, Button } from "antd";

import { useAuth } from "../hooks/SwaggerContext";

const ApiKeyAuth = ({ authJson, authName }) => {
  const [auth, _, setAuth] = useAuth();
  const [authValue, setAuthValue] = useState();
  const isCurrent = auth && auth.authName == authName;
  return (
    <div>
      <h3>Api Key Auth</h3>
      <label>Name: {authJson.name}</label>
      {!isCurrent && <Input onChange={(e) => setAuthValue(e.target.value)} />}
      {isCurrent ? (
        <Button onClick={() => setAuth()}>Logout</Button>
      ) : (
        <Button onClick={() => setAuth({ authName, authValue, ...authJson })}>
          Authorize
        </Button>
      )}
    </div>
  );
};

export default ApiKeyAuth;
