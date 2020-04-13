import React from "react";
import { Field, Formik, Form } from "formik";
import { Input, Button, Spin, Row, Col } from "antd";

import { useOperation, useDefinition } from "../hooks/SwaggerContext";

const Operation = ({ operationJson, path, method }) => {
  const parameters = operationJson.parameters || [];
  const contentTypeOptions = operationJson.consumes;
  const contentType = (contentTypeOptions || [])[0];
  const acceptOptions = operationJson.produces;
  const accept = (acceptOptions || [])[0];
  const [
    call,
    { loading, data, error, responseHeaders, statusCode },
  ] = useOperation();
  const bodyParam = parameters.find((p) => p.in === "body");
  const bodyDef = useDefinition(bodyParam && bodyParam.schema["$ref"]);
  return (
    <div>
      <h2>Parameters</h2>
      <Formik
        onSubmit={(values) => {
          console.log(values);
          call(path, {
            params: values,
            method,
            headers: { "content-type": contentType, accept },
          });
        }}
        initialValues={{}}
      >
        {(props) => (
          <Form>
            {parameters.map((parameter) => (
              <>
                <Row className="form-item" key={path + parameter.name}>
                  <label>
                    {parameter.name} - {parameter.description}
                  </label>
                </Row>
                <Row>
                  {parameter.in === "body" ? (
                    <>
                      <Col span={12}>
                        <Field name="body" as={Input.TextArea}></Field>
                      </Col>
                      <Col span={12}>
                        <pre>
                          {JSON.stringify(bodyDef || parameter.schema, null, 2)}
                        </pre>
                      </Col>
                    </>
                  ) : (
                    <Col span={12}>
                      <Field
                        name={`${parameter.in}.${parameter.name}`}
                        as={Input}
                      />
                    </Col>
                  )}
                </Row>
              </>
            ))}
            <Button htmlType="submit">Execute</Button>
          </Form>
        )}
      </Formik>
      <Spin spinning={loading} size="large" />
      {(data || error) && (
        <>
          <h2>Response</h2>
          <label>Status code:</label>
          <span>{statusCode}</span>
          <pre>
            <code>{JSON.stringify(data || error, null, 2)}</code>
          </pre>
        </>
      )}
    </div>
  );
};

export default Operation;
