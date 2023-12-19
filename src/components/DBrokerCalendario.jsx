import moment from "moment/moment";
import React from "react";

const DBrokerCalendario = ({
  field,
  form,
  showInternalMessage = true,
  includeTime = false,
  autoSaveCallback,
  keepValues,
  ...props
}) => {
  const { name, value } = field;
  const { errors, touched, setFieldValue, setFieldTouched } = form;

  const dateFormat = includeTime ? "YYYY-MM-DDTHH:mm" : "YYYY-MM-DD";
  const backFormat = "DD/MM/YYYY";
  const formatFieldValue = (value, format) => moment(value).format(format);
  const handleChange = (e) => {
    const { value } = e.target;

    // Actualizar el valor del campo en Formik
    // const valueBack = formatFieldValue(value, backFormat);

    setFieldValue(name, value);
    setFieldTouched(name, true);
    if (autoSaveCallback) {
      autoSaveCallback(value);
    }
    if (keepValues) {
      keepValues({
        [name]: value,
      });
    }
  };
  const hasError = errors[name] && touched[name];

  return (
    <>
      <input
        type={includeTime ? "datetime-local" : "date"}
        {...field}
        {...props}
        onChange={handleChange}
        value={formatFieldValue(value, dateFormat) || ""}
      />
      {showInternalMessage && hasError && (
        <small className={"text-danger text-center"}>errorMessage</small>
      )}
    </>
  );
};

export default DBrokerCalendario;
