import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import './App.css';

function App() {
  const [inputs, setInputs] = useState({
    income: '',
    expenses: '',
    investPercent: '',
    annualReturn: '',
    years: '',
  });
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const calculate = () => {
    const income = parseFloat(inputs.income);
    const expenses = parseFloat(inputs.expenses);
    const investPercent = parseFloat(inputs.investPercent);
    const annualReturn = parseFloat(inputs.annualReturn);
    const years = parseFloat(inputs.years);

    if (isNaN(income) || isNaN(expenses) || isNaN(investPercent) || isNaN(annualReturn) || isNaN(years)) {
      alert('Please fill all fields correctly');
      return;
    }

    const savingsPerMonth = income - expenses;
    const investmentPerMonth = (investPercent / 100) * savingsPerMonth;
    const monthlyReturnRate = annualReturn / 100 / 12;

    let data = [];
    let totalInvestment = 0;
    let corpus = 0;

    for (let month = 1; month <= years * 12; month++) {
      totalInvestment += investmentPerMonth;
      corpus = (corpus + investmentPerMonth) * (1 + monthlyReturnRate);
      if (month % 12 === 0) {
        data.push({
          year: month / 12,
          invested: totalInvestment.toFixed(2),
          corpus: corpus.toFixed(2),
        });
      }
    }

    setResults(data);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Finance Projection Calculator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {[
          { label: "Monthly Income (₹)", name: "income" },
          { label: "Monthly Expenses (₹)", name: "expenses" },
          { label: "Investment % of Savings", name: "investPercent" },
          { label: "Expected Annual Return %", name: "annualReturn" },
          { label: "Investment Horizon (Years)", name: "years" },
        ].map(({ label, name }) => (
          <div key={name}>
            <label className="block font-medium">{label}</label>
            <input
              type="number"
              name={name}
              value={inputs[name]}
              onChange={handleChange}
              className="border rounded w-full p-2 mt-1"
            />
          </div>
        ))}
      </div>

      <button
        onClick={calculate}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full md:w-auto"
      >
        Calculate
      </button>

      {results.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-6">Projection Table</h2>
          <table className="table-auto border-collapse border border-gray-400 w-full my-4">
            <thead>
              <tr>
                <th className="border p-2">Year</th>
                <th className="border p-2">Total Invested (₹)</th>
                <th className="border p-2">Corpus Value (₹)</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.year}>
                  <td className="border p-2">{r.year}</td>
                  <td className="border p-2">{r.invested}</td>
                  <td className="border p-2">{r.corpus}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-xl font-semibold mb-2">Investment Growth Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={results}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottomRight', offset: -5 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="corpus" stroke="#8884d8" name="Corpus Value" />
              <Line type="monotone" dataKey="invested" stroke="#82ca9d" name="Total Invested" />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}

export default App;