import api from './api';

// Auth Services
export const login = async (email, password) => {
  const { data } = await api.post('/users/login', { email, password });
  return data;
};

export const register = async (name, email, password) => {
  const { data } = await api.post('/users', { name, email, password });
  return data;
};

export const updateCustomer = async (id, customerData) => {
  const { data } = await api.put(`/customers/${id}`, customerData);
  return data;
};

// Customer Services
export const getCustomers = async () => {
  const { data } = await api.get('/customers');
  return data;
};

export const getCustomerById = async (id) => {
  const { data } = await api.get(`/customers/${id}`);
  return data;
};

export const createCustomer = async (customerData) => {
  const { data } = await api.post('/customers', customerData);
  return data;
};

export const addVisit = async (customerId, visitData) => {
  const { data } = await api.post(`/customers/${customerId}/services`, {
    service: visitData.service,
    price: visitData.amount, // price in backend is amount in frontend
    date: visitData.date
  });
  return data;
};

export const updateVisit = async (customerId, serviceId, visitData) => {
  const { data } = await api.put(`/customers/${customerId}/services/${serviceId}`, {
    service: visitData.service,
    price: visitData.amount,
    date: visitData.date
  });
  return data;
};

export const deleteVisit = async (customerId, serviceId) => {
  const { data } = await api.delete(`/customers/${customerId}/services/${serviceId}`);
  return data;
};

export const deleteCustomer = async (id) => {
  const { data } = await api.delete(`/customers/${id}`);
  return data;
};
