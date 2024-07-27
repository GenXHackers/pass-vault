import React, { createContext, useContext, useState } from 'react';

type AuthContext = {
  isAuthenticated: boolean;
  login?: (passkey: string) => void;
  logout?: () => void;
};

export const authContext = createContext<AuthContext>({
  isAuthenticated: false,
  login: undefined,
  logout: undefined,
});

export function useAuthContext(): AuthContext {
  return useContext(authContext);
}

type ProvideAuthContextProps = {
  children: React.ReactNode;
};

function useProvideAppContext() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (passkey: string) => {
    window.electron.ipcRenderer.sendMessage('db-init', passkey);
    window.electron.ipcRenderer.once('db-init', (res: any) => {
      setIsAuthenticated(res);
    });
    setIsAuthenticated(true);
  };

  const logout = async () => {
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    login,
    logout,
  };
}

export default function ProvideAuthContext({
  children,
}: ProvideAuthContextProps) {
  const auth = useProvideAppContext();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}