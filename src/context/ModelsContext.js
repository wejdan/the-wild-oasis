import React, { useState } from "react";

const ModalContext = React.createContext();

function ModalProvider({ children }) {
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  return (
    <ModalContext.Provider
      value={{ activeModal, setActiveModal, modalData, setModalData }}
    >
      {children}
    </ModalContext.Provider>
  );
}
