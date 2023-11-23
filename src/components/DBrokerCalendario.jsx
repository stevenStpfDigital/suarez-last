import moment from "moment/moment";
import React from "react";

const DBrokerCalendario = ({
  field,
  form,
  showInternalMessage = true,
  ...props
}) => {
  const { name, value } = field;
  const { errors, touched, setFieldValue, setFieldTouched } = form;

  const dateFormat = "YYYY-MM-DD";
  const backFormat = "DD/MM/YYYY";
  const formatFieldValue = (value, format) => moment(value).format(format);
  const handleChange = (e) => {
    const { value } = e.target;

    // Actualizar el valor del campo en Formik
    // const valueBack = formatFieldValue(value, backFormat);

    setFieldValue(name, value);
    // Marcar el campo como tocado
    setFieldTouched(name, true);
  };
  const hasError = errors[name] && touched[name];

  return (
    <>
      <input
        type="date"
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
