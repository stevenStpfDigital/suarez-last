import Datetime from "react-datetime";
import moment from "moment";
import React, { useState } from "react";
import memoize from "memoize-one";
import { Field } from "formik";

export const formatDate = memoize((value) => {
  return value
    ? moment(value).locale("moment/locale/es").format("DD/MMM/YYYY")
    : "";
});

export const formatDateDBroker = (value) => {
  return value
    ? moment(value).startOf("month").locale("es").format("DD/MM/YYYY")
    : "";
};

export const UqaiCalendario = ({
  field,
  form,
  showInternalMessage = true,
  ...props
}) => {
  console.log("VALUE: ? ", field.value);
  const dateFormat = "DD/MM/YYYY";
  const maxValueFormated = moment(props?.maxValue).format(dateFormat);
  const minValueFormated = moment(props?.minValue).format(dateFormat);
  const valueFormatted = props?.maxValue ? maxValueFormated : minValueFormated;
  const tipoError = `${props?.maxValue ? "superior" : "inferior"}`;
  const errorMessage =
    props?.maxValue || props?.minValue
      ? `Fecha inválida o ${tipoError} a ${valueFormatted} `
      : "Fecha inválida";

  const [hasError, setHasError] = useState(false);

  const handleValidDate = (e) => {
    // let currentHasError = false;
    // if (typeof e === "string" && e.length >= 8) {
    //   e = e.slice(0, 2) + "/" + e.slice(2, 4) + "/" + e.slice(4, 8);
    //   e = moment(e, dateFormat);
    // }
    // if (e instanceof Object) {
    //   let isValidDate = e._isValid;
    //   if (props?.maxValue)
    //     isValidDate =
    //       isValidDate &&
    //       (e.isBefore(props?.maxValue) || e.isSame(new Date(), "day"));
    //   if (props?.minValue)
    //     isValidDate =
    //       isValidDate &&
    //       (e.isAfter(props?.minValue) || e.isSame(new Date(), "day"));
    //   e = moment(
    //     e.format(dateFormat) + " " + moment().format("HH:mm:ss"),
    //     `${dateFormat} HH:mm:ss`
    //   );
    //   props?.onFieldSet?.(e.toDate());
    //   currentHasError = !isValidDate;
    // } else {
    //   currentHasError = true;
    //   if (e.length === 0) {
    //     form.setFieldValue(field.name, "");
    //     props?.onFieldSet?.("");
    //     currentHasError = false;
    //   }
    // }
    // setHasError(() => currentHasError);
    // form.setFieldValue(field.name, e instanceof Object ? e?.toDate() : e);
    // props?.getValidatedDate?.(e, currentHasError);
    console.log("VALYUE?: ", e);
    form.setFieldValue(field.name, e);
  };
  const formatFieldValue = (value) => moment(value).format(dateFormat);

  const formatFieldValueDBroker = (value) =>
    moment(value).startOf("month").format(dateFormat);

  return (
    <>
      <Datetime
        // className={props.className}
        // {...props}
        // dateFormat={dateFormat}
        // timeFormat={false}
        // initialViewDate={formatFieldValue(field.value)}
        // value={formatFieldValue(field.value)}
        // onChange={handleValidDate}
        // closeOnSelect={true}
        // onOpen={() => form.setFieldTouched(field.name, true)}
        // inputProps={{
        //   disabled: !!props.readOnly,
        //   placeholder: dateFormat,
        // }}
        // renderInput={(props) => {
        //   return <input {...props} value={field.value ? props.value : ""} />;
        // }}
        className={props.className}
        {...props}
        initialViewDate={field.value}
        initialValue={field.value}
        value={field.value}
        onChange={handleValidDate}
        closeOnSelect={true}
        dateFormat={dateFormat}
        timeFormat={false}
        renderInput={(props) => {
          return <input {...props} value={field.value ? props.value : ""} />;
        }}
      />
      {showInternalMessage && hasError && (
        <small className={"text-danger text-center"}>{errorMessage}</small>
      )}
    </>
  );
};
