import React from "react";
import { Field, Formik, Form } from "formik";
import { Input, Button } from "antd";

import { useOperation } from "../hooks/SwaggerContext";

const Operation = ({ operationJson, path, method }) => {
  const parameters = operationJson.parameters || [];
  const [call] = useOperation();
  return (
    <div>
      <h2>Parameters</h2>
      <Formik
        onSubmit={(values) => {
          console.log(values);
          call(path, { params: values });
        }}
        initialValues={{}}
      >
        {(props) => (
          <Form>
            {parameters.map((parameter) => (
              <div className="form-item">
                <label>{parameter.name}</label>
                <Field name={`${parameter.in}.${parameter.name}`} as={Input} />
              </div>
            ))}
            <Button htmlType="submit">Execute</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Operation;
