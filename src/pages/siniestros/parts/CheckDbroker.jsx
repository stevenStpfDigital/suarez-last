import React from "react";
import { AUX_CHECK_CONTROLLER } from "../utils";

const CheckDbroker = ({ field, form, keepValues, ...props }) => {
  const auxFields = AUX_CHECK_CONTROLLER.filter((item) => field.name != item);

  return (
    <>
      <input
        type="checkbox"
        checked={field.value}
        onChange={() => {
          form.setFieldValue(field.name, !field.value);
          auxFields.forEach((res) => {
            form.setFieldValue(res, false);
          });
          keepValues({
            [field.name]: !field.value,
          });
        }}
      />
    </>
  );
};

export default CheckDbroker;
