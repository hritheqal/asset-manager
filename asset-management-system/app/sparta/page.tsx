'use client';

import { useState, useEffect } from 'react';
import { ClipboardList, FileText, ExternalLink, List, Eye, Filter } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { DA5Registration } from '@/lib/types';

// Filter state interface
interface FilterState {
  building: string;
  locationType: string;
  block: string;
  floor: string;
  room: string;
  floorFinish: string;
  ceilingFinish: string;
  wallFinish: string;
  filledBy: string;
  officer: string;
  status: string;
}

export default function SpartPage() {
    const [activeTab, setActiveTab] = useState('da5');
    const supabase = createClient();

    // Records section state
    const [da5Records, setDa5Records] = useState<DA5Registration[]>([]);
    const [loadingRecords, setLoadingRecords] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        building: '',
        locationType: '',
        block: '',
        floor: '',
        room: '',
        floorFinish: '',
        ceilingFinish: '',
        wallFinish: '',
        filledBy: '',
        officer: '',
        status: '',
    });

    const tabs = [
        { id: 'da5', label: 'DA5', icon: FileText },
    ];

    const openDA5Form = () => {
        window.open('/sparta/da5', '_blank');
    };

    // Load DA5 records on mount
    useEffect(() => {
        loadDA5Records();
    }, []);

    const loadDA5Records = async () => {
        setLoadingRecords(true);
        try {
            const { data, error } = await supabase
                .from('da5_registrations')
                .select(`
                    *,
                    building:buildings(name)
                `)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setDa5Records(data || []);
        } catch (error) {
            console.error('Error loading DA5 records:', error);
        } finally {
            setLoadingRecords(false);
        }
    };

    // Filter handlers
    const handleFilterChange = (field: keyof FilterState, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const filteredRecords = da5Records.filter(record => {
        const buildingName = (record.building as any)?.name || '';
        
        return (
            (!filters.building || buildingName.toLowerCase().includes(filters.building.toLowerCase())) &&
            (!filters.locationType || record.location_type === filters.locationType) &&
            (!filters.block || (record.block_name || '').toLowerCase().includes(filters.block.toLowerCase())) &&
            (!filters.floor || (record.floor || '').toLowerCase().includes(filters.floor.toLowerCase())) &&
            (!filters.room || (record.room || '').toLowerCase().includes(filters.room.toLowerCase())) &&
            (!filters.floorFinish || (record.floor_finish || '').toLowerCase().includes(filters.floorFinish.toLowerCase())) &&
            (!filters.ceilingFinish || (record.ceiling_finish || '').toLowerCase().includes(filters.ceilingFinish.toLowerCase())) &&
            (!filters.wallFinish || (record.wall_finish || '').toLowerCase().includes(filters.wallFinish.toLowerCase())) &&
            (!filters.filledBy || (record.filled_by_name || '').toLowerCase().includes(filters.filledBy.toLowerCase())) &&
            (!filters.officer || (record.officer_name || '').toLowerCase().includes(filters.officer.toLowerCase())) &&
            (!filters.status || record.status === filters.status)
        );
    });

    const openRecordDetail = (recordId: string) => {
        window.open(`/sparta/da5record/${recordId}`, '_blank');
    };

    const clearFilters = () => {
        setFilters({
            building: '',
            locationType: '',
            block: '',
            floor: '',
            room: '',
            floorFinish: '',
            ceilingFinish: '',
            wallFinish: '',
            filledBy: '',
            officer: '',
            status: '',
        });
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
            <div className="mt-6 space-y-8">
                {activeTab === 'da5' && (
                    <>
                        {/* DA5 Registration Section */}
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

                        {/* DA5 Records Section */}
                        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                            <div className="bg-indigo-600 px-6 py-4">
                                <h2 className="text-lg font-semibold text-white flex items-center">
                                    <List className="h-5 w-5 mr-2" />
                                    Registered DA5 Records
                                </h2>
                            </div>
                            <div className="p-6">
                                {/* Filters */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Filter className="h-5 w-5 text-gray-600" />
                                        <h3 className="text-sm font-medium text-gray-900">Filter Records</h3>
                                        <button
                                            onClick={clearFilters}
                                            className="ml-auto text-sm text-indigo-600 hover:text-indigo-800"
                                        >
                                            Clear All Filters
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Building</label>
                                            <input
                                                type="text"
                                                value={filters.building}
                                                onChange={(e) => handleFilterChange('building', e.target.value)}
                                                placeholder="Search building..."
                                                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Location Type</label>
                                            <select
                                                value={filters.locationType}
                                                onChange={(e) => handleFilterChange('locationType', e.target.value)}
                                                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-sm"
                                            >
                                                <option value="">All Types</option>
                                                <option value="BLOCK">Block</option>
                                                <option value="EXTERNAL">External Building</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Block</label>
                                            <input
                                                type="text"
                                                value={filters.block}
                                                onChange={(e) => handleFilterChange('block', e.target.value)}
                                                placeholder="Search block..."
                                                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Floor</label>
                                            <input
                                                type="text"
                                                value={filters.floor}
                                                onChange={(e) => handleFilterChange('floor', e.target.value)}
                                                placeholder="Search floor..."
                                                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Room</label>
                                            <input
                                                type="text"
                                                value={filters.room}
                                                onChange={(e) => handleFilterChange('room', e.target.value)}
                                                placeholder="Search room..."
                                                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Floor Finish</label>
                                            <input
                                                type="text"
                                                value={filters.floorFinish}
                                                onChange={(e) => handleFilterChange('floorFinish', e.target.value)}
                                                placeholder="Search floor finish..."
                                                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Ceiling Finish</label>
                                            <input
                                                type="text"
                                                value={filters.ceilingFinish}
                                                onChange={(e) => handleFilterChange('ceilingFinish', e.target.value)}
                                                placeholder="Search ceiling finish..."
                                                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Wall Finish</label>
                                            <input
                                                type="text"
                                                value={filters.wallFinish}
                                                onChange={(e) => handleFilterChange('wallFinish', e.target.value)}
                                                placeholder="Search wall finish..."
                                                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Filled By</label>
                                            <input
                                                type="text"
                                                value={filters.filledBy}
                                                onChange={(e) => handleFilterChange('filledBy', e.target.value)}
                                                placeholder="Search filled by..."
                                                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Officer</label>
                                            <input
                                                type="text"
                                                value={filters.officer}
                                                onChange={(e) => handleFilterChange('officer', e.target.value)}
                                                placeholder="Search officer..."
                                                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                                            <select
                                                value={filters.status}
                                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-sm"
                                            >
                                                <option value="">All Status</option>
                                                <option value="draft">Draft</option>
                                                <option value="submitted">Submitted</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Records Count */}
                                <div className="mb-4 flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        Showing <span className="font-medium">{filteredRecords.length}</span> of <span className="font-medium">{da5Records.length}</span> records
                                    </p>
                                    <button
                                        onClick={loadDA5Records}
                                        disabled={loadingRecords}
                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                                    >
                                        {loadingRecords && <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-600 mr-2"></div>}
                                        Refresh
                                    </button>
                                </div>

                                {/* Records Table */}
                                <div className="overflow-x-auto border rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Building</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location Type</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Block</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Floor</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Floor Finish</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ceiling Finish</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wall Finish</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filled By</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Officer</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {loadingRecords ? (
                                                <tr>
                                                    <td colSpan={14} className="px-4 py-8 text-center text-gray-500">
                                                        <div className="flex items-center justify-center">
                                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mr-2"></div>
                                                            Loading records...
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : filteredRecords.length === 0 ? (
                                                <tr>
                                                    <td colSpan={14} className="px-4 py-8 text-center text-gray-500">
                                                        No records found. {da5Records.length > 0 && 'Try adjusting your filters.'}
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredRecords.map((record, index) => (
                                                    <tr key={record.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                            {(record.building as any)?.name || 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                                record.location_type === 'BLOCK' 
                                                                    ? 'bg-blue-100 text-blue-800' 
                                                                    : 'bg-green-100 text-green-800'
                                                            }`}>
                                                                {record.location_type}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{record.block_name || '-'}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{record.floor || '-'}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{record.room || '-'}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{record.floor_finish || '-'}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{record.ceiling_finish || '-'}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{record.wall_finish || '-'}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{record.filled_by_name}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{record.officer_name}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                                record.status === 'submitted' 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                                {record.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(record.created_at || '').toLocaleDateString()}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                            <button
                                                                onClick={() => openRecordDetail(record.id)}
                                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                            >
                                                                <Eye className="h-3 w-3 mr-1" />
                                                                View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
