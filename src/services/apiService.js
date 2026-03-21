import api from './api';

// Auth Services
export const login = async (email, password) => {
  const { data } = await api.post('/users/login', { email, password });
  return data;
};

export const register = async (name, email, password, salonName) => {
  const { data } = await api.post('/users', { name, email, password, salonName });
  return data;
};

export const updateProfile = async (userData) => {
  const { data } = await api.put('/users/profile', userData);
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

// Reminder Services
export const getReminders = async () => {
  const { data } = await api.get('/customers/reminders');
  return data;
};

export const markAsContacted = async (id) => {
  const { data } = await api.put(`/customers/${id}/contacted`);
  return data;
};

export const deleteCustomer = async (id) => {
  const { data } = await api.delete(`/customers/${id}`);
  return data;
};

// Appointment Services
export const getAppointments = async () => {
  const { data } = await api.get('/appointments');
  return data;
};

export const createAppointment = async (appointmentData) => {
  const { data } = await api.post('/appointments', appointmentData);
  return data;
};

export const updateAppointmentStatus = async (id, status) => {
  const { data } = await api.put(`/appointments/${id}`, { status });
  return data;
};

export const deleteAppointment = async (id) => {
  const { data } = await api.delete(`/appointments/${id}`);
  return data;
};
