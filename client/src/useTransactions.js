// create the logic for the data for the user to see

// Imports
import { useContext } from 'react';
import { ExpenseTrackerContext } from './context/context';

import { categoriesIncome, categoriesExpense, categoriesReset } from './constants/categories';

// // set using transaction
const useTransactions = (title) => {
    categoriesReset();
  const { transactions } = useContext(ExpenseTrackerContext);
  const rightTransactions = transactions.filter((t) => t.type === title);
  const total = rightTransactions.reduce((acc, currVal) => acc += currVal.amount, 0);
  const categories = title === 'Income' ? categoriesIncome : categoriesExpense;

  rightTransactions.forEach((t) => {
    const category = categories.find((c) => c.type === t.category);

    if (category) category.amount += t.amount;
  });

  const filteredCategories = categories.filter((sc) => sc.amount > 0);

  const chartData = {
    datasets: [{
      data: filteredCategories.map((c) => c.amount),
      backgroundColor: filteredCategories.map((c) => c.color),
    }],
    labels: filteredCategories.map((c) => c.type),
  };

  // return data from details
  return { filteredCategories, total, chartData };
};

// export for cross file
export default useTransactions;