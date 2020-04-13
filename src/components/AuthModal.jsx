import React, { useState } from "react";
import { Modal } from "antd";

import { useAuth } from "../hooks/SwaggerContext";
import ApiKeyAuth from "./ApiKeyAuth";
import BasicAuth from "./BasicAuth";

const AuthModal = ({ trigger }) => {
  const [visible, setVisible] = useState(false);
  const [_, authOpts] = useAuth();

  return (
    <>
      {trigger(() => setVisible(true))}
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => setVisible(false)}
      >
        {Object.entries(authOpts).map(([k, v]) => {
          switch (v.type) {
            case "apiKey":
              return <ApiKeyAuth key={k} authJson={v} authName={k} />;
            case "basic":
              return <BasicAuth key={k} authJson={v} authName={k} />;
            default:
              return (
                <div key={k}>
                  <h3>Oauth</h3>
                  Auth type {v.type} not implemented yet
                </div>
              );
          }
        })}
      </Modal>
    </>
  );
};

export default AuthModal;
