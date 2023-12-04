import React from "react";

import { UqaiModalHeader } from "../../../components/UqaiModalHeader";
import ReactTable from "react-table";
import { TableColumnsFinanciamiento } from "../parts/TableColumnsFinanciamiento";
import { Modal, ModalBody } from "reactstrap";

const ModalFinanciamiento = ({ open, setOpen }) => {
  return (
    <Modal isOpen={open} toggle={() => setOpen(false)} size="xl" centered>
      <UqaiModalHeader toggle={() => setOpen(false)} title="FINANCIAMIENTO" />
      <ModalBody>
        <div>
          <div>
            <ReactTable
              noDataText={<></>}
              data={[]}
              rowsText={"filas"}
              columns={TableColumnsFinanciamiento}
              filterable={false}
              defaultPageSize={10}
              //   showPaginationTop
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
