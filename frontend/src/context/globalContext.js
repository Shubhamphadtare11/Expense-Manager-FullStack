import React, { useContext, useState, useEffect } from "react";
import axios from 'axios';

// Base URL for your backend API
const BASE_URL = "https://expense-manager-9nth.onrender.com/api/v1/";
// const BASE_URL = "http://localhost:5000/api/v1/";

// Create the context
const GlobalContext = React.createContext();

// GlobalProvider component to wrap your application
export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);

    // Fetch incomes from API
    const getIncomes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-incomes`);
            setIncomes(response.data);
        } catch (error) {
            setError(error.message); // Handle error
        }
    };

    // Fetch expenses from API
    const getExpenses = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-expenses`);
            setExpenses(response.data);
        } catch (error) {
            setError(error.message); // Handle error
        }
    };

    // Add new income to API
    const addIncome = async (income) => {
        try {
            await axios.post(`${BASE_URL}add-income`, income);
            getIncomes(); // Refresh incomes after addition
        } catch (error) {
            setError(error.message); // Handle error
        }
    };

    // Delete income from API
    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-income/${id}`);
            getIncomes(); // Refresh incomes after deletion
        } catch (error) {
            setError(error.message); // Handle error
        }
    };

    // Add new expense to API
    const addExpense = async (expense) => {
        try {
            await axios.post(`${BASE_URL}add-expense`, expense);
            getExpenses(); // Refresh expenses after addition
        } catch (error) {
            setError(error.message); // Handle error
        }
    };

    // Delete expense from API
    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-expense/${id}`);
            getExpenses(); // Refresh expenses after deletion
        } catch (error) {
            setError(error.message); // Handle error
        }
    };

    // Calculate total income from fetched data
    const totalIncome = () => {
        return incomes.reduce((total, income) => total + income.amount, 0);
    };

    // Calculate total expenses from fetched data
    const totalExpenses = () => {
        return expenses.reduce((total, expense) => total + expense.amount, 0);
    };

    // Calculate total balance
    const totalBalance = () => {
        return totalIncome() - totalExpenses();
    };

    // Get transaction history (incomes + expenses)
    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return history.slice(0, 3); // Return the latest 3 transactions
    };

    // Fetch initial data on component mount
    useEffect(() => {
        getIncomes();
        getExpenses();
    }, []);

    // Provide the context values to consuming components
    return (
        <GlobalContext.Provider
            value={{
                addIncome,
                getIncomes,
                incomes,
                deleteIncome,
                addExpense,
                getExpenses,
                expenses,
                deleteExpense,
                totalIncome,
                totalExpenses,
                totalBalance,
                transactionHistory,
                error,
                setError
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

// Custom hook to consume the context
export const useGlobalContext = () => {
    return useContext(GlobalContext);
};
