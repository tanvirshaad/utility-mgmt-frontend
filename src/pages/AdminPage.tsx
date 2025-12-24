import React, { useState, useEffect } from 'react';
import { configApi } from '../services/api';
import type { UpdateConfigDto, Configuration } from '../types';

const AdminPage: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminPin, setAdminPin] = useState('');
    const [currentConfig, setCurrentConfig] = useState<Configuration | null>(
        null
    );
    const [ratePerUnit, setRatePerUnit] = useState('');
    const [vatPercentage, setVatPercentage] = useState('');
    const [fixedServiceCharge, setFixedServiceCharge] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [configLoading, setConfigLoading] = useState(false);

    // Fetch current configuration when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            fetchCurrentConfig();
        }
    }, [isAuthenticated]);

    // Populate form fields when current config is loaded
    useEffect(() => {
        if (currentConfig) {
            setRatePerUnit(currentConfig.ratePerUnit.toString());
            setVatPercentage(currentConfig.vatPercentage.toString());
            setFixedServiceCharge(currentConfig.fixedServiceCharge.toString());
        }
    }, [currentConfig]);

    const fetchCurrentConfig = async () => {
        console.log('Fetching current configuration...');
        setConfigLoading(true);
        try {
            const config = await configApi.getActiveConfig();
            console.log('Fetched config:', config);
            setCurrentConfig(config);
        } catch (err) {
            console.error('Failed to fetch configuration', err);
            setError('Failed to load current configuration');
        } finally {
            setConfigLoading(false);
        }
    };

    const handlePinSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!adminPin) {
            setError('Admin PIN is required');
            return;
        }

        setLoading(true);
        try {
            console.log('Verifying PIN...');
            // Try to get config history to verify PIN
            await configApi.getConfigHistory(adminPin);
            console.log('PIN verified successfully');
            setIsAuthenticated(true);
            setError('');
        } catch (err: unknown) {
            console.error('PIN verification failed:', err);
            setError('Invalid Admin PIN');
            setAdminPin('');
        } finally {
            setLoading(false);
        }
    };

    const handleConfigSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const rate = parseFloat(ratePerUnit);
        const vat = parseFloat(vatPercentage);
        const serviceCharge = parseFloat(fixedServiceCharge);

        if (isNaN(rate) || rate <= 0) {
            setError('Rate per unit must be a positive number');
            return;
        }

        if (isNaN(vat) || vat < 0 || vat > 100) {
            setError('VAT percentage must be between 0 and 100');
            return;
        }

        if (isNaN(serviceCharge) || serviceCharge < 0) {
            setError('Fixed service charge must be a non-negative number');
            return;
        }

        const updateData: UpdateConfigDto = {
            ratePerUnit: rate,
            vatPercentage: vat,
            fixedServiceCharge: serviceCharge,
        };

        setLoading(true);
        try {
            await configApi.updateConfig(updateData, adminPin);
            setSuccess('Configuration updated successfully!');
            // Reset form and refresh current config
            setRatePerUnit('');
            setVatPercentage('');
            setFixedServiceCharge('');
            await fetchCurrentConfig();
        } catch (err: unknown) {
            const errorMessage =
                (err as { response?: { data?: { message?: string } } }).response
                    ?.data?.message || 'Failed to update configuration';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setAdminPin('');
        setCurrentConfig(null);
        setRatePerUnit('');
        setVatPercentage('');
        setFixedServiceCharge('');
        setError('');
        setSuccess('');
    };

    // PIN verification screen
    if (!isAuthenticated) {
        return (
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        🔐 Admin Access
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Enter your admin PIN to continue
                    </p>

                    <form onSubmit={handlePinSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="adminPin"
                                className="block text-gray-700 font-semibold mb-2"
                            >
                                Admin PIN
                            </label>
                            <input
                                type="password"
                                id="adminPin"
                                value={adminPin}
                                onChange={(e) => setAdminPin(e.target.value)}
                                placeholder="Enter admin PIN"
                                required
                                disabled={loading}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors disabled:bg-gray-100"
                                autoFocus
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? 'Verifying...' : 'Access Admin Panel'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Configuration form (only shown after authentication)
    if (configLoading) {
        return (
            <div className="max-w-4xl mx-auto text-center py-12">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="text-lg text-gray-600">
                        Loading configuration...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Current Configuration Display */}
            {currentConfig && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        📊 Current Configuration
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-1">
                                Rate per Unit
                            </p>
                            <p className="text-2xl font-bold text-indigo-600">
                                $
                                {parseFloat(
                                    currentConfig.ratePerUnit.toString()
                                ).toFixed(2)}
                                /kWh
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-1">
                                VAT Percentage
                            </p>
                            <p className="text-2xl font-bold text-indigo-600">
                                {parseFloat(
                                    currentConfig.vatPercentage.toString()
                                ).toFixed(2)}
                                %
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-1">
                                Service Charge
                            </p>
                            <p className="text-2xl font-bold text-indigo-600">
                                $
                                {parseFloat(
                                    currentConfig.fixedServiceCharge.toString()
                                ).toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                        Last updated:{' '}
                        {new Date(currentConfig.updatedAt).toLocaleString()}
                    </p>
                </div>
            )}

            {/* Update Configuration Form */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-3xl font-bold text-gray-800">
                        🔐 Update Configuration
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-gray-600 hover:text-gray-800 underline"
                    >
                        Logout
                    </button>
                </div>
                <p className="text-gray-600 mb-8">
                    Update utility billing rates and charges
                </p>

                <form onSubmit={handleConfigSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="ratePerUnit"
                            className="block text-gray-700 font-semibold mb-2"
                        >
                            Rate per Unit ($/kWh) *
                        </label>
                        <input
                            type="number"
                            id="ratePerUnit"
                            value={ratePerUnit}
                            onChange={(e) => setRatePerUnit(e.target.value)}
                            placeholder="e.g., 0.50"
                            step="0.01"
                            required
                            disabled={loading}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors disabled:bg-gray-100"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="vatPercentage"
                            className="block text-gray-700 font-semibold mb-2"
                        >
                            VAT Percentage (%) *
                        </label>
                        <input
                            type="number"
                            id="vatPercentage"
                            value={vatPercentage}
                            onChange={(e) => setVatPercentage(e.target.value)}
                            placeholder="e.g., 15"
                            step="0.01"
                            min="0"
                            max="100"
                            required
                            disabled={loading}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors disabled:bg-gray-100"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="fixedServiceCharge"
                            className="block text-gray-700 font-semibold mb-2"
                        >
                            Fixed Service Charge ($) *
                        </label>
                        <input
                            type="number"
                            id="fixedServiceCharge"
                            value={fixedServiceCharge}
                            onChange={(e) =>
                                setFixedServiceCharge(e.target.value)
                            }
                            placeholder="e.g., 5.00"
                            step="0.01"
                            min="0"
                            required
                            disabled={loading}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors disabled:bg-gray-100"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? 'Updating...' : 'Update Configuration'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminPage;
