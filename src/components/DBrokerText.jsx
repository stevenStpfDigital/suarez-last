import React from "react";

const DBrokerText = ({ field, form, keepValues, ...props }) => {
  const { name, value } = field;
  const { setFieldValue, setFieldTouched } = form;
  const handleChange = (e) => {
    const { value } = e.target;
    setFieldValue(name, value.toUpperCase());
    setFieldTouched(name, true);
    if (keepValues) {
      keepValues({
        [name]: value.toUpperCase(),
      });
    }
  };
  return (
    <>
      <input
        {...field}
        {...props}
        onChange={handleChange}
        value={value.toUpperCase()}
      />
    </>
  );
};

export default DBrokerText;
