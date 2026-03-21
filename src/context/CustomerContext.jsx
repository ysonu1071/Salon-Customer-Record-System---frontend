import React, { createContext, useState, useEffect, useContext } from 'react';
import * as customerService from '../services/apiService';
import { AuthContext } from './AuthContext';

export const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reminders, setReminders] = useState({ followUps: [], missed: [] });
  const [loading, setLoading] = useState(true);
  const { user, showNotification } = useContext(AuthContext);
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user) return;
      try {
        const [customerData, appointmentData] = await Promise.all([
          customerService.getCustomers(),
          customerService.getAppointments()
        ]);
        setCustomers(customerData);
        setAppointments(appointmentData);
        setLoading(false);
      } catch (error) {
        showNotification(error.response?.data?.message || 'Failed to fetch data', 'error');
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const data = await customerService.getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Fetch appointments error:', error);
    }
  };

  const addCustomer = async (customerData) => {
    try {
      const data = await customerService.createCustomer(customerData);
      setCustomers(prev => [data, ...prev]);
      showNotification('Customer added successfully!');
      return true;
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to add customer', 'error');
      return false;
    }
  };

  const updateCustomer = async (id, customerData) => {
    try {
      const data = await customerService.updateCustomer(id, customerData);
      setCustomers(prev => prev.map(c => ((c._id || c.id) === id ? data : c)));
      showNotification('Customer updated successfully!');
      return true;
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to update customer', 'error');
      return false;
    }
  };

  const addVisit = async (customerId, visitData) => {
    try {
      const data = await customerService.addVisit(customerId, visitData);
      
      // Update local state
      setCustomers(prev => prev.map(c => {
        if (c._id === customerId) {
          return {
            ...c,
            servicesHistory: data.servicesHistory,
            lastVisit: visitData.date || new Date()
          };
        }
        return c;
      }));
      
      showNotification('Visit added successfully!');
      return true;
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to add visit', 'error');
      return false;
    }
  };

  const updateVisit = async (customerId, serviceId, visitData) => {
    try {
      const data = await customerService.updateVisit(customerId, serviceId, visitData);
      setCustomers(prev => prev.map(c => {
        if ((c._id || c.id) === customerId) {
          return { ...c, servicesHistory: data.servicesHistory };
        }
        return c;
      }));
      showNotification('Visit updated successfully!');
      return true;
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to update visit', 'error');
      return false;
    }
  };

  const deleteVisit = async (id, serviceId) => {
    try {
      const data = await customerService.deleteVisit(id, serviceId);
      setCustomers(customers.map(c => c._id === id ? { ...c, servicesHistory: data.servicesHistory } : c));
      return true;
    } catch (error) {
      console.error('Delete visit error:', error);
      return false;
    }
  };

  const fetchReminders = async () => {
    try {
      const data = await customerService.getReminders();
      setReminders(data);
    } catch (error) {
      console.error('Fetch reminders error:', error);
    }
  };

  const markAsContacted = async (id) => {
    try {
      await customerService.markAsContacted(id);
      // Refresh reminders after marking
      fetchReminders();
    } catch (error) {
      console.error('Mark as contacted error:', error);
    }
  };

  const getCustomer = (id) => customers.find(c => (c._id || c.id) === id);

  const getRecentVisits = (limit = 5) => {
    const allVisits = customers.flatMap(c => 
      (c.servicesHistory || []).map(v => ({ 
        ...v, 
        customerName: c.name, 
        customerId: c._id || c.id,
        amount: v.price // for UI compatibility
      }))
    );
    return allVisits.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit);
  };

  const deleteCustomer = async (id) => {
    try {
      await customerService.deleteCustomer(id);
      setCustomers(prev => prev.filter(c => (c._id || c.id) !== id));
      showNotification('Customer removed');
      return true;
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to delete customer', 'error');
      return false;
    }
  };

  const addAppointment = async (appointmentData) => {
    try {
      const data = await customerService.createAppointment(appointmentData);
      setAppointments(prev => [data, ...prev].sort((a, b) => new Date(a.date) - new Date(b.date)));
      showNotification('Appointment booked successfully!');
      return true;
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to book appointment', 'error');
      return false;
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      const data = await customerService.updateAppointmentStatus(id, status);
      setAppointments(prev => prev.map(a => (a._id === id ? data : a)));
      return true;
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to update appointment', 'error');
      return false;
    }
  };

  const removeAppointment = async (id) => {
    try {
      await customerService.deleteAppointment(id);
      setAppointments(prev => prev.filter(a => a._id !== id));
      showNotification('Appointment cancelled');
      return true;
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to cancel appointment', 'error');
      return false;
    }
  };

  return (
    <CustomerContext.Provider value={{
      customers,
      loading,
      addCustomer,
      updateCustomer,
      addVisit,
      updateVisit,
      deleteVisit,
      fetchReminders,
      markAsContacted,
      reminders,
      getCustomer,
      getRecentVisits,
      deleteCustomer,
      appointments,
      fetchAppointments,
      addAppointment,
      updateAppointmentStatus,
      removeAppointment
    }}>
      {children}
    </CustomerContext.Provider>
  );
};


