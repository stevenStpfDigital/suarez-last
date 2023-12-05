import React, { useEffect, useState } from "react";

import { UqaiModalHeader } from "../../../components/UqaiModalHeader";
import ReactTable from "react-table";
import { TableColumnsFinanciamiento } from "../parts/TableColumnsFinanciamiento";
import { Modal, ModalBody } from "reactstrap";
import axios from "axios";

const ModalFinanciamiento = ({ open, setOpen, valuePolizaSelect }) => {
  const [data, setData] = useState({
    data: [],
    page: 12,
    loading: false,
  });
  useEffect(() => {
    if (!valuePolizaSelect) return;
    setData((prevData) => ({
      ...prevData,
      loading: true,
    }));
    const obj = {
      cdSucursal: valuePolizaSelect.CD_COMPANIA,
      cdRC: valuePolizaSelect.CD_RAMO_COTIZACION,
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}/financiamiento`, obj)
      .then((res) => {
        setData({
          data: res.data || [],
          page: res.data.length,
          loading: false,
        });
      });
  }, []);

  return (
    <Modal isOpen={open} toggle={() => setOpen(false)} size="xl" centered>
      <UqaiModalHeader toggle={() => setOpen(false)} title="FINANCIAMIENTO" />
      <ModalBody>
        <div>
          <div>
            <ReactTable
              noDataText={<></>}
              data={data.data}
              rowsText={"filas"}
              columns={TableColumnsFinanciamiento}
              filterable={false}
              pageSize={data.page}
              showPaginationBottom={false}
              className="-highlight fs-7 mi-div "
            />
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ModalFinanciamiento;
