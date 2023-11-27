import React, { useEffect, useState } from "react";
import { Modal, ModalBody } from "reactstrap";
import { UqaiModalHeader } from "../../../components/UqaiModalHeader";
import axios from "axios";
import moment from "moment/moment";

//DEVELOPMENT
const routesVam = "http://10.147.20.248:3030/api";
//LIVE
//  const routesVam = "http://localhost:3030/api";

const ObsEstadoHistorial = ({ data, open, setOpen }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);
  console.log("OBSDATA: ", data);

  useEffect(() => {
    console.log("MOUNTING?:");
    const fetchData = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/seguimientos`, data);
        // console.log("RES OBSERVACION:", response.data);
        response.data.FC_CREACION = moment(response.data.FC_CREACION)
          .locale("es")
          .format("DD/MM/YYYY");
        if (isLoading) {
          setList(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.log("ERROR: ", error);
      }
    };

    fetchData();

    return () => {
      console.log("UNMOUNTING COMPONENT ------------------>>>>>>>");
    };
  }, [data, isLoading]);
  const defineWidth = (length) => {
    if (length < 50) return "100%";
    if (length < 100) return "200px";
    if (length < 200) return "400px";
    return "500px";
  };
  return (
    <Modal isOpen={open} toggle={() => setOpen(false)} size="xl" centered>
      <UqaiModalHeader
        toggle={() => setOpen(false)}
        title="Estados del Siniestro"
      />
      <ModalBody>
        <div className="table-responsive">
          <br />
          <table className="table table-borderless table-hover">
            <thead>
              <tr className="text-secondary">
                <th className="bg-white">Fecha</th>
                <th className="bg-white">Estado</th>
                <th className="bg-white">Observación</th>
              </tr>
            </thead>
            <tbody>
              {(list || []).map((x, index) => (
                <tr key={x.CD_INSPECCION}>
                  <td className="w-25" style={{ minWidth: "100px" }}>
                    <div>
                      {moment(x.FC_CREACION).locale("es").format("DD/MM/YYYY")}
                    </div>
                  </td>
                  <td className="w-25" style={{ minWidth: "100px" }}>
                    <div>{x.DSC_ESTADO}</div>
                  </td>
                  <td className="w-100">
                    <textarea
                      disabled
                      style={{
                        width: "100%",
                        minWidth: defineWidth(x.OBSERVACIONES?.length),
                      }}
                      value={x.OBSERVACIONES || ""}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ObsEstadoHistorial;
