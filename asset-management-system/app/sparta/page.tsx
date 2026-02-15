'use client';

import { useState } from 'react';
import { ClipboardList, FileText, ExternalLink } from 'lucide-react';

export default function SpartPage() {
    const [activeTab, setActiveTab] = useState('da5');

    const tabs = [
        { id: 'da5', label: 'DA5', icon: FileText },
    ];

    const openDA5Form = () => {
        window.open('/sparta/da5', '_blank');
    };

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-5">
                <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    SISTEM PENDAFTARAN ASET ROL TAK ALIH (SPARTA)DBKL
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    Sistem pendaftaran aset untuk bangunan dan kemudahan DBKL
                </p>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium
                                    ${activeTab === tab.id
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }
                                `}
                            >
                                <Icon
                                    className={`
                                        -ml-0.5 mr-2 h-5 w-5
                                        ${activeTab === tab.id ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}
                                    `}
                                    aria-hidden="true"
                                />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'da5' && (
                    <div className="rounded-lg bg-white shadow">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center space-x-3">
                                <ClipboardList className="h-8 w-8 text-indigo-600" />
                                <div>
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                                        DA5 Registration
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Building Space & Finishes Registration Form
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 border-t border-gray-100 pt-6">
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                                        About DA5 Form
                                    </h4>
                                    <ul className="text-sm text-gray-600 space-y-2 mb-6">
                                        <li>• Register building spaces with complete finish details</li>
                                        <li>• Record floor, ceiling, and wall measurements</li>
                                        <li>• Capture GPS coordinates for location tracking</li>
                                        <li>• Upload photos for documentation</li>
                                        <li>• Submit for approval workflow</li>
                                    </ul>
                                    <button
                                        onClick={openDA5Form}
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                    >
                                        <ExternalLink className="h-5 w-5 mr-2" />
                                        Open DA5 Registration Form
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
