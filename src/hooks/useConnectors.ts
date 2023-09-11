import { useContext } from "react";
import {
  ConnectorsContext,
  ConnectorsContextValue,
} from "../contexts/connectors";

const useConnectors = (): ConnectorsContextValue => {
  return useContext(ConnectorsContext);
};

export { useConnectors };
