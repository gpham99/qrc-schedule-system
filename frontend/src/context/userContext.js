import React, { createContext, useState } from "react";

export const UserContext = createContext();

// Create a provider for components to consume and subscribe to changes
export const ContextProvider = (props) => {
  const [user, setUser] = useState(false);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
};
