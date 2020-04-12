import React, { useState } from "react";
import logo from "./logo.svg";
import { PageHeader, Input, Button, Layout, Collapse } from "antd";
import axios from "axios";

import SwaggerInfo from "./components/SwaggerInfo";
import Operation from "./components/Operation";

import "./App.scss";

function App() {
  const [apiUrl, setApiUrl] = useState(
    "https://petstore.swagger.io/v2/swagger.json"
  );
  const [apiSpec, setApiSpec] = useState({});
  return (
    <div className="App">
      <Layout>
        <PageHeader title="OpenAPI Explorer">
          <Input
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
          ></Input>
          <Button
            onClick={() => axios.get(apiUrl).then((d) => setApiSpec(d.data))}
          >
            Load
          </Button>
        </PageHeader>
        <Layout.Content>
          {apiSpec.info && (
            <SwaggerInfo
              infoJson={apiSpec.info}
              // TODO: precalculate and use when making requests
              baseUrl={apiSpec.host + apiSpec.basePath}
            />
          )}
          {apiSpec.paths && (
            <Collapse>
              {Object.entries(apiSpec.paths["/pet"]).map(([k, v]) => (
                <Collapse.Panel key={k} header={k}>
                  <Operation operationJson={v} />
                </Collapse.Panel>
              ))}
            </Collapse>
          )}
        </Layout.Content>
      </Layout>
    </div>
  );
}

export default App;
