import React, { useState } from "react";
import { Input, Button } from "antd";

import { useAuth } from "../hooks/SwaggerContext";

const BasicAuth = ({ authJson, authName }) => {
  const [auth, _, setAuth] = useAuth();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const isCurrent = auth && auth.authName == authName;
  return (
    <div>
      <h3>Api Key Auth</h3>
      {!isCurrent && (
        <>
          <label>Username:</label>
          <Input onChange={(e) => setUsername(e.target.value)} />
          <label>Password:</label>
          <Input onChange={(e) => setPassword(e.target.value)} />
        </>
      )}
      {isCurrent ? (
        <Button onClick={() => setAuth()}>Logout</Button>
      ) : (
        <Button
          onClick={() =>
            setAuth({
              authName,
              authValue: { username, password },
              ...authJson,
            })
          }
        >
          Authorize
        </Button>
      )}
    </div>
  );
};

export default BasicAuth;
