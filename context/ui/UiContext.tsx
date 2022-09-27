import { createContext } from 'react';

interface ContextProps {
  isMenuOpen: boolean;

  /* Metodos */
  toogleSideMenu: () => void;
}

export const UiContext = createContext({} as ContextProps);
