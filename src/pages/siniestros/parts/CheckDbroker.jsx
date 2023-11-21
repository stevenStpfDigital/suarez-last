import React from "react";

const CheckDbroker = ({ field, form, ...props }) => {
  return (
    <>
      <input
        type="checkbox"
        checked={field.value}
        onChange={() => {
          form.setFieldValue(field.name, !field.value);
        }}
      />
    </>
  );
};

export default CheckDbroker;
