import React, {
  useContext,
  useRef,
  createContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";
import { Transition } from "react-transition-group";
function getModalTransitionStyles(state) {
  switch (state) {
    case "entering":
    case "exiting":
    case "exited":
      return "opacity-0 transform scale-90";
    case "entered":
      return "opacity-100 transform scale-100";
    default:
      return "";
  }
}
const ModalContext = createContext();

function Modal({ children, isOpen, toggleModal, isSmall, close }) {
  const modalContentRef = useRef(null);

  const handleCloseOnClickOutside = (event) => {
    if (!modalContentRef.current.contains(event.target)) {
      toggleModal();
    }
  };
  useEffect(() => {
    const mainElement = document.querySelector("main");

    if (isOpen) {
      mainElement.style.overflow = "hidden";
    } else {
      mainElement.style.overflow = "auto";
    }

    return () => {
      mainElement.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.keyCode === 27) close();
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [toggleModal]);
  return createPortal(
    <ModalContext.Provider value={{ toggleModal }}>
      <Transition in={isOpen} timeout={500} unmountOnExit>
        {(state) => (
          <div
            className={`z-50 fixed  inset-0 bg-slate-200/20 backdrop-blur-sm flex justify-center items-center min-h-screen transition-all duration-200 ${getModalTransitionStyles(
              state
            )}`}
            onClick={handleCloseOnClickOutside}
          >
            <div
              ref={modalContentRef}
              className={` ${
                isSmall ? "" : "w-2/3"
              } space-y-8 bg-white px-16 py-7 shadow-lg relative rounded-md`}
            >
              {children}
            </div>
          </div>
        )}
      </Transition>
    </ModalContext.Provider>,
    document.body
  );
}

function Header({ children }) {
  return <div className="modal-header">{children}</div>;
}

function Close({ isDisabled }) {
  const { toggleModal } = useContext(ModalContext);
  return (
    <FaTimes
      className={`cursor-pointer absolute right-3 top-3 ${
        isDisabled ? "text-gray-400" : "text-gray-600"
      }`}
      onClick={isDisabled ? null : toggleModal}
    />
  );
}
function Actions({ children }) {
  return <div className="flex justify-end gap-2 ">{children}</div>;
}

function Content({ children }) {
  return <div className="modal-content">{children}</div>;
}

export function useModal(modalProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const toggleModal = useCallback((props) => {
    setIsOpen((prev) => !prev);
    setModalData(props);
  }, []);
  const close = useCallback((props) => {
    setIsOpen(false);
  }, []);
  const ModalComponent = useCallback(
    (props) => (
      <Modal
        isOpen={isOpen}
        toggleModal={toggleModal}
        close={close}
        {...props}
        {...modalProps}
      />
    ),
    [isOpen]
  );

  return [ModalComponent, toggleModal, modalData];
}
export { Header, Close, Content, Actions };
