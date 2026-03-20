import React, { createContext, useState, useEffect, useContext } from 'react';
import * as customerService from '../services/apiService';
import { AuthContext } from './AuthContext';

export const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, showNotification } = useContext(AuthContext);

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!user) return;
      try {
        const data = await customerService.getCustomers();
        setCustomers(data);
        setLoading(false);
      } catch (error) {
        showNotification(error.response?.data?.message || 'Failed to fetch customers', 'error');
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [user]);

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

  const deleteVisit = async (customerId, serviceId) => {
    try {
      const data = await customerService.deleteVisit(customerId, serviceId);
      setCustomers(prev => prev.map(c => {
        if ((c._id || c.id) === customerId) {
          return { ...c, servicesHistory: data.servicesHistory };
        }
        return c;
      }));
      showNotification('Visit removed');
      return true;
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to delete visit', 'error');
      return false;
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

  return (
    <CustomerContext.Provider value={{
      customers,
      loading,
      addCustomer,
      updateCustomer,
      addVisit,
      updateVisit,
      deleteVisit,
      getCustomer,
      getRecentVisits,
      deleteCustomer
    }}>
      {children}
    </CustomerContext.Provider>
  );
};


