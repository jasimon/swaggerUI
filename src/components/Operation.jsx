import React from "react";
import { Field, Formik, Form } from "formik";
import { Input, Button, Spin, Row, Col, Upload } from "antd";
import jsf from "json-schema-faker";

import { useOperation, useDefinition } from "../hooks/SwaggerContext";

import "./Operation.scss";

const Operation = ({ operationJson, path, method }) => {
  const parameters = operationJson.parameters || [];
  const headers = {};
  const contentTypeOptions = operationJson.consumes;
  if (contentTypeOptions) {
    headers["content-type"] = contentTypeOptions[0];
  }
  const acceptOptions = operationJson.produces;
  if (acceptOptions) {
    headers["accept"] = acceptOptions[0];
  }
  const [call, { loading, data, error, statusCode }] = useOperation();

  // handle body
  const bodyParam = parameters.find((p) => p.in === "body");
  const [bodyDef, definitions] = useDefinition(
    bodyParam && bodyParam.schema["$ref"]
  );
  const defaultValues = {};
  if (bodyDef) {
    defaultValues.body = JSON.stringify(
      jsf.generate({ ...bodyParam.schema, definitions }),
      null,
      2
    );
  }
  return (
    <div>
      <h2>Parameters</h2>
      <Formik
        onSubmit={(values) => {
          console.log(values);
          call(path, {
            params: values,
            method,
            headers,
          });
        }}
        initialValues={defaultValues}
      >
        {({ setFieldValue }) => (
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
                        <pre className="body-schema">
                          {JSON.stringify(
                            (bodyDef || parameter.schema).properties,
                            null,
                            2
                          )}
                        </pre>
                      </Col>
                    </>
                  ) : (
                    <Col span={12}>
                      {parameter.type === "file" ? (
                        <Upload
                          beforeUpload={(file) => {
                            setFieldValue(
                              `${parameter.in}.${parameter.name}`,
                              file
                            );
                            return false;
                          }}
                        >
                          <Button>Choose File</Button>
                        </Upload>
                      ) : (
                        <Field
                          name={`${parameter.in}.${parameter.name}`}
                          as={Input}
                        />
                      )}
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
          <pre className="api-response">
            <code>{JSON.stringify(data || error, null, 2)}</code>
          </pre>
        </>
      )}
    </div>
  );
};

export default Operation;
