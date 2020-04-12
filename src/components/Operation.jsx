import React from "react";
import { Field, Formik, Form } from "formik";
import { Input, Button, Spin } from "antd";

import { useOperation } from "../hooks/SwaggerContext";

const Operation = ({ operationJson, path, method }) => {
  const parameters = operationJson.parameters || [];
  const contentTypeOptions = operationJson.produces;
  const contentType = (contentTypeOptions || [])[0];
  const [
    call,
    { loading, data, error, responseHeaders, statusCode },
  ] = useOperation();
  return (
    <div>
      <h2>Parameters</h2>
      <Formik
        onSubmit={(values) => {
          console.log(values);
          call(path, {
            params: values,
            method,
            headers: { accept: contentType },
          });
        }}
        initialValues={{}}
      >
        {(props) => (
          <Form>
            {parameters.map((parameter) => (
              <div className="form-item" key={parameter.name}>
                <label>
                  {parameter.name} - {parameter.description}
                </label>
                <Field name={`${parameter.in}.${parameter.name}`} as={Input} />
              </div>
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
