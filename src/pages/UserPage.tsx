import React, { useState } from 'react';
import { billApi } from '../services/api';
import type { BillResponse } from '../types';
import BillResult from '../components/BillResult';

const UserPage: React.FC = () => {
    const [unitsConsumed, setUnitsConsumed] = useState<string>('');
    const [billResult, setBillResult] = useState<BillResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setBillResult(null);

        const units = parseFloat(unitsConsumed);
        if (isNaN(units) || units <= 0) {
            setError('Please enter a valid positive number for units consumed');
            return;
        }

        setLoading(true);
        try {
            const result = await billApi.calculateBill({
                unitsConsumed: units,
            });
            setBillResult(result);
        } catch (err: unknown) {
            setError(
                (err as { response?: { data?: { message?: string } } }).response
                    ?.data?.message ||
                    'Failed to calculate bill. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setUnitsConsumed('');
        setBillResult(null);
        setError('');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    ⚡ Utility Bill Calculator
                </h1>
                <p className="text-gray-600 mb-8">
                    Enter your electricity consumption to calculate your bill
                </p>

                <form onSubmit={handleCalculate} className="mb-8">
                    <div className="mb-6">
                        <label
                            htmlFor="units"
                            className="block text-gray-700 font-semibold mb-2"
                        >
                            Units Consumed (kWh)
                        </label>
                        <input
                            type="number"
                            id="units"
                            value={unitsConsumed}
                            onChange={(e) => setUnitsConsumed(e.target.value)}
                            placeholder="Enter units consumed"
                            step="0.01"
                            required
                            disabled={loading}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? 'Calculating...' : 'Calculate Bill'}
                        </button>
                        {billResult && (
                            <button
                                type="button"
                                onClick={handleReset}
                                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </form>

                {billResult && <BillResult bill={billResult} />}
            </div>
        </div>
    );
};

export default UserPage;
