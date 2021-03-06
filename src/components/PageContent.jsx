import React from "react";
import { PageHeader, Input, Button, Layout, Collapse, Tag, Row } from "antd";

import SwaggerInfo from "./SwaggerInfo";
import Operation from "./Operation";
import SchemeSelect from "./SchemeSelect";
import AuthModal from "./AuthModal";
import { useConfigFetcher, useConfig } from "../hooks/SwaggerContext";

const tagColors = {
  get: "blue",
  delete: "red",
  put: "volcano",
  post: "green",
  patch: "purple",
  options: "magenta",
  head: "cyan",
};

function App() {
  const [fetchConfig, configLoading] = useConfigFetcher();
  const [apiSpec] = useConfig();
  return (
    <Layout>
      <PageHeader title="OpenAPI Explorer">
        <Input.Search
          defaultValue="https://petstore.swagger.io/v2/swagger.json"
          loading={configLoading}
          onSearch={(value) => fetchConfig(value)}
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
            <Row>
              <label>Schemes:</label>
              <SchemeSelect />
              <AuthModal
                trigger={(toggleOpen) => (
                  <Button onClick={toggleOpen}>Authorize</Button>
                )}
              />
            </Row>
            <Collapse accordion>
              {Object.entries(apiSpec.paths).map(([path, pathObj]) =>
                Object.entries(pathObj).map(([k, v]) => (
                  <Collapse.Panel
                    key={k + path}
                    header={
                      <h4>
                        <Tag color={tagColors[k]}>{k}</Tag>
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
