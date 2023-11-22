import React, { useRef, useState } from "react";
import UqaiFormik from "../../../components/UqaiFormik";
import moment from "moment";
import { UqaiField } from "../../../components/UqaiField";

const FcOcurrencia = () => {
  const form = useRef();
  const handleOnSubmit = (newValues, actions) => {};
  const [v3, set3] = useState(null);
  const [aux, setAux] = useState();
  return (
    <>
      <UqaiFormik
        validateOnChange={false}
        ref={form}
        initialValues={{
          fc_ocurrencia: moment().format("DD/MM/YYYY"),
        }}
        onSubmit={handleOnSubmit}
      >
        {({ resetForm, submitForm, setFieldValue, values, isSubmitting }) => (
          <div className="row ">
            <div className="col-12">
              <UqaiField
                type="text"
                name={"fc_ocurrencia"}
                className={"form-control"}
                placeholder={"DD/MM/AAAA"}
              />
            </div>
          </div>
        )}
      </UqaiFormik>
    </>
  );
};

export default FcOcurrencia;
