import React, { useEffect, useRef, useState } from "react";
import { CardBody, Offcanvas } from "react-bootstrap";
import UqaiFormik from "../../../components/UqaiFormik";
import { Card, CardHeader } from "reactstrap";
import CheckDbroker from "../parts/CheckDbroker";
import DBrokerCalendario from "../../../components/DBrokerCalendario";
import { PRIORIDAD_SELECTS } from "../utils";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { UqaiField } from "../../../components/UqaiField";
import useCdUser from "../../../hooks/useCdUser";

const FiltrosSideBarComponent = ({
  query,
  onSubmit,
  handleResetForm,
  selectsData,
  loadOptionsNew,
  loadOptionsNewDiagnostico,
}) => {
  const [show, setShow] = useState(false);
  const [valuePrioridad, setValuePrioridad] = useState(PRIORIDAD_SELECTS[0]);
  const [v0, set0] = useState(null);
  const [v1, set1] = useState(selectsData.aseguradora[0]);
  const [v2, set2] = useState(selectsData.agentes[0]);
  const [v3, set3] = useState(selectsData.estSiniestro[0]);
  const [v4, set4] = useState(selectsData.sucursal[0]);
  const [v5, set5] = useState(selectsData.usuariosD[0]);
  const [v6, set6] = useState(selectsData.subArea[0]);
  const [v7, set7] = useState(selectsData.ramos[0]);
  const [v8, set8] = useState(selectsData.taller[0]);
  const [v9, set9] = useState(selectsData.anios[0]);
  const [v10, set10] = useState(null);

  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);
  const form = useRef();
  const user = useCdUser();
  useEffect(() => {
    const currentUser = getCurrentUserDBroker();
    if (currentUser) {
      set5(currentUser);
      query.cdUsuario = currentUser.USUARIO;
    }
  }, []);
  const getCurrentUserDBroker = () => {
    const currentUser = selectsData.usuariosD.find(
      (item) => item.USUARIO === user
    );
    return currentUser || selectsData.usuariosD[0];
  };

  return (
    <>
      <button
        variant="primary"
        onClick={toggleShow}
        className="bm-burger-button text-center"
      >
        <i className="icon-uqai uqai-flecha-derecha text-white"></i>
      </button>

      <Offcanvas
        show={show}
        onHide={handleClose}
        scroll={true}
        backdrop={true}
        className="w-40"
      >
        <Offcanvas.Body className="p-0">
          <div className="col-12  bg-primary">
            <Card className="shadow">
              <CardHeader className="d-flex align-items-center border-bottom border-primary">
                <h5 className="my-0 fw-bold">
                  <i className="icon-uqai align-middle uqai-filtros text-primary me-2"></i>
                  Filtros
                </h5>
              </CardHeader>
              <CardBody>
                <UqaiFormik
                  initialValues={query}
                  onSubmit={onSubmit}
                  enableReinitialize={true}
                  validateOnChange={false}
                  ref={form}
                >
                  {({
                    resetForm,
                    submitForm,
                    setFieldValue,
                    values,
                    isSubmitting,
                  }) => (
                    <div className="row gy-3">
                      <div className="col-12">
                        <label className="form-label fw-bold text-secondary fs-7">
                          Cliente:
                        </label>
                        <AsyncSelect
                          placeholder="TODOS"
                          isClearable
                          value={v0}
                          cacheOptions
                          defaultOptions
                          loadOptions={loadOptionsNew}
                          onChange={(valueSelect) => {
                            set0(valueSelect);
                            if (!valueSelect) {
                              setFieldValue("cdCliente", "%");
                              return;
                            }
                            setFieldValue("cdCliente", valueSelect.value);
                          }}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold text-secondary fs-7">
                          Póliza:
                        </label>
                        <UqaiField
                          type="text"
                          name={"poliza"}
                          className={"form-control"}
                          placeholder={"TODOS"}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-bold text-secondary fs-7">
                          Nº:
                        </label>
                        <UqaiField
                          type="number"
                          name={"numSiniestro"}
                          className={"form-control"}
                          placeholder={"TODOS"}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-bold text-secondary fs-7">
                          Año:
                        </label>
                        <Select
                          value={v9}
                          defaultValue={selectsData.anios[0]}
                          options={selectsData.anios}
                          onChange={(valueSelect) => {
                            setFieldValue("año", valueSelect.value);
                            set9(valueSelect);
                          }}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold text-secondary fs-7">
                          Aseguradora:
                        </label>
                        <Select
                          value={v1}
                          defaultValue={selectsData.aseguradora[0]}
                          options={selectsData.aseguradora}
                          getOptionLabel={(option) => option.ALIAS}
                          getOptionValue={(option) => option.ID}
                          onChange={(valueSelect) => {
                            setFieldValue("cdAseguradora", valueSelect.ID);
                            set1(valueSelect);
                          }}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold text-secondary fs-7">
                          Agentes:
                        </label>
                        <Select
                          value={v2}
                          defaultValue={selectsData.agentes[0]}
                          options={selectsData.agentes}
                          getOptionLabel={(option) => option.AGENTE}
                          getOptionValue={(option) => option.ID}
                          onChange={(valueSelect) => {
                            setFieldValue("cdAgente", valueSelect.ID);
                            set2(valueSelect);
                          }}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold text-secondary fs-7">
                          Est. Siniestro:
                        </label>
                        <Select
                          value={v3}
                          defaultValue={selectsData.estSiniestro[0]}
                          options={selectsData.estSiniestro}
                          getOptionLabel={(option) => option.DSC_ESTADO}
                          getOptionValue={(option) => option.CD_EST_SINIESTRO}
                          onChange={(valueSelect) => {
                            setFieldValue(
                              "cdEstado",
                              valueSelect.CD_EST_SINIESTRO
                            );
                            set3(valueSelect);
                          }}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold text-secondary fs-7">
                          Ramo:
                        </label>
                        <Select
                          value={v7}
                          defaultValue={selectsData.ramos[0]}
                          options={selectsData.ramos}
                          getOptionLabel={(option) => option.NM_RAMO}
                          getOptionValue={(option) => option.CD_RAMO}
                          onChange={(valueSelect) => {
                            setFieldValue("cdRamo", valueSelect.CD_RAMO);
                            set7(valueSelect);
                          }}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold text-secondary fs-7">
                          Sucursal:
                        </label>
                        <Select
                          value={v4}
                          defaultValue={selectsData.sucursal[0]}
                          options={selectsData.sucursal}
                          getOptionLabel={(option) => option.SUCURSAL}
                          getOptionValue={(option) => option.ID}
                          onChange={(valueSelect) => {
                            setFieldValue("cdSucursal", valueSelect.ID);
                            set4(valueSelect);
                          }}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold text-secondary fs-7">
                          Usuario:
                        </label>
                        <Select
                          value={v5}
                          defaultValue={selectsData.usuariosD[0]}
                          options={selectsData.usuariosD}
                          getOptionLabel={(option) => option.NOMBRE}
                          getOptionValue={(option) => option.USUARIO}
                          onChange={(valueSelect) => {
                            setFieldValue("cdUsuario", valueSelect.USUARIO);
                            set5(valueSelect);
                          }}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold text-secondary fs-7">
                          Fc.Ingreso:
                        </label>
                        <div className=" row  align-items-center">
                          <div className="col-1 p-0">
                            <UqaiField
                              name="checkFcIngreso"
                              component={CheckDbroker}
                            />
                          </div>
                          <div className="col-11">
                            <UqaiField
                              component={DBrokerCalendario}
                              name="fcIngreso"
                              className="form-control"
                              placeholder="DD/MM/AAAA"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold text-secondary fs-7">
                          Fc.Evento:
                        </label>
                        <div className="row align-items-center">
                          <div className="col-1 p-0">
                            <UqaiField
                              name="checkFcEvento"
                              component={CheckDbroker}
                            />
                          </div>
                          <div className="col-11">
                            <UqaiField
                              component={DBrokerCalendario}
                              name="fcEvento"
                              className="form-control"
                              placeholder="DD/MM/AAAA"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold text-secondary fs-7">
                          Fc. Recepción:
                        </label>
                        <div className="row align-items-center">
                          <div className="col-1 p-0">
                            <UqaiField
                              name="checkFcRecepcion"
                              component={CheckDbroker}
                            />
                          </div>
                          <div className="col-11">
                            <UqaiField
                              component={DBrokerCalendario}
                              name="fcRecepcion"
                              className="form-control"
                              placeholder="DD/MM/AAAA"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold text-secondary fs-7">
                          Ultima Gestión
                        </label>
                        <div className="row align-items-center">
                          <div className="col-1 p-0">
                            <UqaiField
                              name="checkFcGestion"
                              component={CheckDbroker}
                            />
                          </div>
                          <div className="col-11">
                            <UqaiField
                              component={DBrokerCalendario}
                              name="fcGestion"
                              className="form-control"
                              placeholder="DD/MM/AAAA"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold text-secondary fs-7">
                          Subarea:
                        </label>
                        <Select
                          value={v6}
                          defaultValue={selectsData.subArea[0]}
                          options={selectsData.subArea}
                          getOptionLabel={(option) => option.SUBAREA}
                          getOptionValue={(option) => option.ID}
                          onChange={(valueSelect) => {
                            setFieldValue("cdSubarea", valueSelect.ID);
                            set6(valueSelect);
                          }}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold text-secondary fs-7">
                          Diagnostico:
                        </label>
                        <AsyncSelect
                          placeholder="TODOS"
                          value={v10}
                          cacheOptions
                          defaultOptions
                          loadOptions={loadOptionsNewDiagnostico}
                          onChange={(valueSelect) => {
                            setFieldValue("cdDiagnostico", valueSelect.label);
                            set10(valueSelect);
                          }}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold text-secondary fs-7">
                          Placa:
                        </label>
                        <UqaiField
                          type="text"
                          name={"cdPlaca"}
                          className={"form-control"}
                          placeholder={"TODOS"}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold text-secondary fs-7">
                          Taller:
                        </label>
                        <Select
                          value={v8}
                          defaultValue={selectsData.taller[0]}
                          options={selectsData.taller}
                          getOptionLabel={(option) => option.DSC_TALLER}
                          getOptionValue={(option) => option.CD_TALLER}
                          onChange={(valueSelect) => {
                            setFieldValue("cdTaller", valueSelect.CD_TALLER);
                            set8(valueSelect);
                          }}
                        />
                      </div>
                      <div>
                        <div
                          className="d-flex align-items-center justify-content-end"
                          align="right"
                        >
                          <button
                            type="button"
                            className="btn btn-success me-2"
                            onClick={() => {
                              setFieldValue("cdRamo");
                              setValuePrioridad(PRIORIDAD_SELECTS[0]);
                              set0(null);
                              set1(selectsData.aseguradora[0]);
                              set2(selectsData.agentes[0]);
                              set3(selectsData.estSiniestro[0]);
                              set4(selectsData.sucursal[0]);
                              set5(getCurrentUserDBroker());
                              set6(selectsData.subArea[0]);
                              set7(selectsData.ramos[0]);
                              set8(selectsData.taller[0]);
                              set9(selectsData.anios[0]);
                              set10(null);
                              handleResetForm(resetForm);
                            }}
                          >
                            Limpiar filtros
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={submitForm}
                            disabled={isSubmitting}
                          >
                            Buscar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </UqaiFormik>
              </CardBody>
            </Card>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default FiltrosSideBarComponent;
