import React, { useState } from "react";
import { PageHeader, Input, Button, Layout, Collapse } from "antd";
import axios from "axios";

import SwaggerInfo from "./SwaggerInfo";
import Operation from "./Operation";
import { useConfigFetcher, useConfig } from "../hooks/SwaggerContext";

function App() {
  const [apiUrl, setApiUrl] = useState(
    "https://petstore.swagger.io/v2/swagger.json"
  );
  const [fetchConfig, configLoading] = useConfigFetcher();
  const [apiSpec] = useConfig();
  return (
    <Layout>
      <PageHeader title="OpenAPI Explorer">
        <Input
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
        ></Input>
        <Button onClick={() => fetchConfig(apiUrl)} loading={configLoading}>
          Load
        </Button>
      </PageHeader>
      <Layout.Content>
        {apiSpec && (
          <>
            <SwaggerInfo
              infoJson={apiSpec.info}
              // TODO: precalculate and use when making requests
              baseUrl={apiSpec.host + apiSpec.basePath}
            />
            <Collapse accordion>
              {Object.entries(apiSpec.paths).map(([path, pathObj]) =>
                Object.entries(pathObj).map(([k, v]) => (
                  <Collapse.Panel key={k + path} header={k + path}>
                    <Operation operationJson={v} path={path} method={k} />
                  </Collapse.Panel>
                ))
              )}
            </Collapse>
          </>
        )}
      </Layout.Content>
    </Layout>
  );
}

export default App;
