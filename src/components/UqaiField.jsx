import { ErrorMessage, Field } from "formik";
import React from "react";

export const UqaiField = (props) => {
  return (
    <React.Fragment>
      <Field {...props} />
      {props?.addMsg && (
        <span className={"text-secondary"}>{props?.addMsg}</span>
      )}
      <ErrorMessage name={props.name}>
        {(error) => <span className={"invalid-feedback d-block"}>{error}</span>}
      </ErrorMessage>
    </React.Fragment>
  );
};
