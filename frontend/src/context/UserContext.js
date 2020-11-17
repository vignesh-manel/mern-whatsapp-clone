import { useState, createContext } from 'react';

export const UserContext = createContext(null);

const UserContextProvider = (props) => {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined
  });

  return (
    <UserContext.Provider value={{userData, setUserData}}>
	{props.children}
    </UserContext.Provider>
  )
}

export default UserContextProvider
