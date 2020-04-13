import React, { useState } from "react";
import { PageHeader, Input, Button, Layout, Collapse, Tag } from "antd";
import axios from "axios";

import SwaggerInfo from "./SwaggerInfo";
import Operation from "./Operation";
import SchemeSelect from "./SchemeSelect";
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
        <Input.Search
          value={apiUrl}
          loading={configLoading}
          onChange={(e) => setApiUrl(e.target.value)}
          onSearch={() => fetchConfig(apiUrl)}
          enterButton="Load"
        ></Input.Search>
      </PageHeader>
      <Layout.Content>
        {apiSpec && (
          <>
            <SwaggerInfo
              infoJson={apiSpec.info}
              // TODO: precalculate and use when making requests
              baseUrl={apiSpec.host + apiSpec.basePath}
            />
            <SchemeSelect />
            <Collapse accordion>
              {Object.entries(apiSpec.paths).map(([path, pathObj]) =>
                Object.entries(pathObj).map(([k, v]) => (
                  <Collapse.Panel
                    key={k + path}
                    header={
                      <h4>
                        <Tag>{k}</Tag>
                        {path}
                      </h4>
                    }
                  >
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
