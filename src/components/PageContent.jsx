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
              infoJson={apiSpec.data.info}
              // TODO: precalculate and use when making requests
              baseUrl={apiSpec.data.host + apiSpec.data.basePath}
            />
            <Collapse>
              {Object.entries(apiSpec.data.paths).map(([path, pathObj]) =>
                Object.entries(pathObj).map(([k, v]) => (
                  <Collapse.Panel key={k} header={k}>
                    <Operation operationJson={v} />
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
