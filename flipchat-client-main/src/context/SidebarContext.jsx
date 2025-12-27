import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SidebarContext = createContext(null);

export const useSidebarContext = () => {
  return useContext(SidebarContext);
};

const SidebarContextProvider = ({ children }) => {
  const [currentTab, setCurrentTab] = useState("/dashboard");
  const location = useLocation();
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);

  const path = location.pathname;

  // handle change sidebar tab
  const handleChangeTab = (tab) => {
    navigate(tab)
    setCurrentTab(tab);
  };

  // handle toggle sidebar
  const handleToggleSidebar = () => {
    setOpen(true)
  }

  let items = {
    currentTab,
    handleChangeTab,
    open,
    setOpen,
    handleToggleSidebar
  };

  // handle sidebar state on page reload 
  useEffect(() => {
    if (path) {
      handleChangeTab(path);
    }
  }, [path]);

  useEffect(() => {
    function handleClickOutside(event) {
      const sidebar = document.querySelector(".sidebar")
      if(sidebar && !sidebar.contains(event?.target)){
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <SidebarContext.Provider value={items}>{children}</SidebarContext.Provider>
  );
};

export default SidebarContextProvider;
