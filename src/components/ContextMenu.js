import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { FaTimes } from "react-icons/fa";
import { Transition, TransitionGroup } from "react-transition-group";

const MenuContext = createContext();
export function useMenu() {
  return useContext(MenuContext);
}

function getModalTransitionStyles(state) {
  console.log("state", state);
  switch (state) {
    case "exiting":
    case "exited":
      return "opacity-0 transform scale-90";
    case "entering":
    case "entered":
      return "opacity-100 transform scale-100";

    default:
      return "";
  }
}
function Menu({ children, id }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <MenuContext.Provider
      value={{ onClose, isOpen, setIsOpen, position, setPosition }}
    >
      {children}
    </MenuContext.Provider>
  );
}
function MenuItems({ children }) {
  const modalContentRef = useRef(null);
  const { onClose, isOpen, position } = useContext(MenuContext);
  const handleCloseOnClickOutside = (event) => {
    if (!modalContentRef.current.contains(event.target)) {
      onClose();
    }
  };
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (modalContentRef.current) {
      const menuWidth = modalContentRef.current.offsetWidth;
      const menuHeight = modalContentRef.current.offsetHeight;

      const x =
        position.x + menuWidth > window.innerWidth
          ? window.innerWidth - menuWidth
          : position.x;
      const y =
        position.y + menuHeight > window.innerHeight
          ? window.innerHeight - menuHeight
          : position.y;

      setMenuPosition({ x, y });
    }
  }, [position, isOpen]);
  return (
    <Transition in={isOpen} timeout={300} unmountOnExit>
      {(state) => (
        <div
          className={`z-50 fixed inset-0   min-h-screen transition-all duration-200 ${getModalTransitionStyles(
            state
          )}`}
          onClick={handleCloseOnClickOutside}
        >
          <div
            ref={modalContentRef}
            className={`w-52 bg-white dark:bg-gray-900 shadow-lg relative rounded-md`}
            style={{ top: menuPosition.y, left: menuPosition.x }}
          >
            {children}
          </div>
        </div>
      )}
    </Transition>
  );
}

function Open({ children }) {
  const { setIsOpen, setPosition } = useContext(MenuContext);

  const handleClick = (e) => {
    // Capture click position
    console.log("clicked ");
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  };

  return React.cloneElement(children, {
    onClick: handleClick,
  });
}
function Item({ onClick, icon, children }) {
  const { onClose } = useContext(MenuContext);

  return (
    <div
      onClick={() => {
        if (onClick) {
          onClick();
        }

        onClose();
      }}
      className="cursor-pointer h-12 px-5 flex items-center dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800 hover:bg-slate-100 transition-all duration-200 w-full rounded-md"
    >
      {icon && <span className="mr-4 dark:text-white">{icon}</span>}{" "}
      {/* Render icon if provided */}
      {children}
    </div>
  );
}

Menu.Open = Open;
Menu.Item = Item;
Menu.MenuItems = MenuItems;
export default Menu;
