export const saveToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const saveUserRole = (role) => {
  localStorage.setItem('role', role);
};
export const getUserRole = () => {
  return localStorage.getItem('role');
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
};
