import React, { createContext, useContext, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Transition, TransitionGroup } from "react-transition-group";

const ModalContext = createContext();
export function useModalWindow() {
  return useContext(ModalContext);
}

function getModalTransitionStyles(state) {
  switch (state) {
    case "exiting":
    case "exited":
      return "opacity-0 ";
    case "entering":
    case "entered":
      return "opacity-100 ";

    default:
      return "";
  }
}
function Modal({ children }) {
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  const onClose = () => {
    setActiveModal(null);
    setModalData(null);
  };
  return (
    <ModalContext.Provider
      value={{ activeModal, setActiveModal, onClose, setModalData, modalData }}
    >
      {children}
    </ModalContext.Provider>
  );
}
function Open({ opens, children, data }) {
  const { setActiveModal, setModalData } = useContext(ModalContext);
  return React.cloneElement(children, {
    onClick: () => {
      setActiveModal(opens);
      setModalData(data);
    },
  });
}

function Window({ name, children, isSmall, isLoading }) {
  const { setActiveModal, activeModal, onClose } = useContext(ModalContext);
  const modalContentRef = useRef(null);

  const handleCloseOnClickOutside = (event) => {
    if (!modalContentRef.current.contains(event.target)) {
      onClose();
    }
  };
  return (
    <Transition in={activeModal === name} timeout={300} unmountOnExit>
      {(state) => (
        <div
          className={`z-50 fixed  inset-0 bg-slate-200/20 dark:bg-slate-200/10 backdrop-blur-sm flex justify-center items-center min-h-screen transition-all duration-200 ${getModalTransitionStyles(
            state
          )}`}
          onClick={handleCloseOnClickOutside}
        >
          <div
            ref={modalContentRef}
            className={` ${
              isSmall ? "" : "w-2/3"
            } space-y-8 bg-white dark:bg-gray-800 px-16 py-7 shadow-lg relative rounded-md`}
          >
            <FaTimes
              className={`cursor-pointer absolute right-3 top-3 ${
                isLoading ? "text-gray-400" : "text-gray-600"
              }`}
              onClick={onClose}
            />
            {React.cloneElement(children, {
              onClose: onClose,
            })}
          </div>
        </div>
      )}
    </Transition>
  );
}
Modal.Open = Open;
Modal.Window = Window;
export default Modal;
