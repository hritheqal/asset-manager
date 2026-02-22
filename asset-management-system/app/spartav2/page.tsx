'use client';

import { useState } from 'react';
import { 
  FileText, 
  BookOpen, 
  List, 
  FolderOpen, 
  MapPin, 
  UserPlus,
  ExternalLink, 
  Building2,
  Package,
  ClipboardList,
  ArrowRight,
  Sparkles,
  Shield,
  Clock
} from 'lucide-react';

interface MenuButton {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  href: string;
  external?: boolean;
  gradient: string;
  borderColor: string;
  iconBg: string;
  iconColor: string;
}

export default function SpartaV2Page() {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const menuButtons: MenuButton[] = [
    {
      id: 'assets',
      label: 'Assets',
      description: 'Manage and view all registered assets',
      icon: Package,
      href: '/assets',
      gradient: 'from-orange-500 to-orange-600',
      borderColor: 'border-orange-200',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      id: 'buildings',
      label: 'Buildings',
      description: 'Manage and view all registered buildings',
      icon: Building2,
      href: '/buildings',
      gradient: 'from-slate-500 to-slate-600',
      borderColor: 'border-slate-200',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600'
    },
    {
      id: 'da5',
      label: 'DA5 Building Finishes Form',
      description: 'Building Space & Finishes Registration Form',
      icon: FileText,
      href: '/sparta/da5',
      gradient: 'from-blue-500 to-blue-600',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 'da6',
      label: 'DA6 Component Form',
      description: 'Equipment & Asset Registration Form',
      icon: BookOpen,
      href: '/sparta/da6',
      gradient: 'from-emerald-500 to-emerald-600',
      borderColor: 'border-emerald-200',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    },
    {
      id: 'da4-list',
      label: 'DA4 List - Block & External Buildings',
      description: 'List of Blocks & External Buildings',
      icon: Building2,
      href: 'https://drive.google.com/drive/folders/1roPyt13bx6BeRdEI4nqYMnYmGgYdRyEy',
      external: true,
      gradient: 'from-purple-500 to-purple-600',
      borderColor: 'border-purple-200',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      id: 'da5-list',
      label: 'DA5 List - Floor/Room/Finishes Records',
      description: 'DA5 Records Dashboard',
      icon: List,
      href: '/sparta',
      gradient: 'from-indigo-500 to-indigo-600',
      borderColor: 'border-indigo-200',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    },
    {
      id: 'da6-list',
      label: 'DA6 List - Building Components',
      description: 'DA6 Records Dashboard',
      icon: ClipboardList,
      href: '/sparta?tab=da6',
      gradient: 'from-teal-500 to-teal-600',
      borderColor: 'border-teal-200',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600'
    },
    {
      id: 'documents',
      label: 'Reference Documents',
      description: 'Reference Documents & Guidelines',
      icon: FolderOpen,
      href: 'https://drive.google.com/drive/folders/1-f7utQZy8f9e72oFsEM4uvclDy7VqfoY',
      external: true,
      gradient: 'from-amber-500 to-amber-600',
      borderColor: 'border-amber-200',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600'
    },
    {
      id: 'mapping',
      label: 'Asset Record Mapping Summary',
      description: 'Asset Mapping Summary & Reports',
      icon: MapPin,
      href: '/dashboard',
      gradient: 'from-rose-500 to-rose-600',
      borderColor: 'border-rose-200',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600'
    },
    {
      id: 'register',
      label: 'First Time Registration',
      description: 'Create new user account',
      icon: UserPlus,
      href: '/auth/signup',
      gradient: 'from-cyan-500 to-cyan-600',
      borderColor: 'border-cyan-200',
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600'
    }
  ];

  const handleButtonClick = (button: MenuButton) => {
    if (button.external) {
      window.open(button.href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = button.href;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e6c93] via-[#2d8ab8] to-[#1a5a7a] shadow-2xl mb-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        
        <div className="relative px-6 py-12 sm:px-12 sm:py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Version 2.0 - Now Available</span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              SISTEM PENDAFTARAN
              <span className="block mt-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                ASET ROL TAK ALIH
              </span>
            </h1>
            
            <h2 className="text-3xl sm:text-4xl font-light text-blue-100 mb-6">
              (SPARTA) DBKL
            </h2>
            
            <p className="text-blue-100/80 text-lg max-w-2xl mx-auto mb-8">
              Comprehensive asset management system for tracking and managing 
              government building assets across Dewan Bandaraya Kuala Lumpur
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm">
                <Shield className="h-4 w-4" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm">
                <Clock className="h-4 w-4" />
                <span>24/7 Available</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm">
                <Building2 className="h-4 w-4" />
                <span>DBKL Official</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menuButtons.map((button) => {
          const Icon = button.icon;
          const isHovered = hoveredButton === button.id;
          
          return (
            <button
              key={button.id}
              onClick={() => handleButtonClick(button)}
              onMouseEnter={() => setHoveredButton(button.id)}
              onMouseLeave={() => setHoveredButton(null)}
              className={`
                group relative overflow-hidden
                bg-white rounded-xl border-2 ${button.borderColor}
                p-6 text-left
                transition-all duration-300 ease-out
                hover:shadow-xl hover:-translate-y-1
                ${isHovered ? 'ring-2 ring-offset-2 ring-blue-500/20' : ''}
              `}
            >
              {/* Hover Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${button.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <div className="relative flex items-start gap-4">
                {/* Icon */}
                <div className={`
                  flex-shrink-0 w-14 h-14 rounded-xl ${button.iconBg}
                  flex items-center justify-center shadow-sm
                  group-hover:scale-110 group-hover:rotate-3
                  transition-all duration-300
                `}>
                  <Icon className={`w-7 h-7 ${button.iconColor}`} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-800">
                    {button.label}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {button.description}
                  </p>
                </div>
                
                {/* Arrow */}
                <div className={`
                  flex-shrink-0 transition-all duration-300
                  ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
                `}>
                  {button.external ? (
                    <ExternalLink className={`w-5 h-5 ${button.iconColor}`} />
                  ) : (
                    <ArrowRight className={`w-5 h-5 ${button.iconColor}`} />
                  )}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className={`
                absolute bottom-0 left-0 h-1 bg-gradient-to-r ${button.gradient}
                transition-all duration-500 ease-out
                ${isHovered ? 'w-full' : 'w-0'}
              `} />
            </button>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Registration Forms', value: '2', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'System Uptime', value: '99.9%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Data Security', value: '256-bit', color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Support', value: '24/7', color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-md border border-gray-200">
          <Building2 className="w-6 h-6 text-[#1e6c93]" />
          <div className="text-left">
            <div className="text-sm font-semibold text-gray-900">Dewan Bandaraya Kuala Lumpur</div>
            <div className="text-xs text-gray-500">Government Asset Management Division</div>
          </div>
        </div>
        
        <p className="text-xs text-gray-400 mt-4">
          SPARTA Version 2.0 | &copy; {new Date().getFullYear()} DBKL. All rights reserved.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Need help? Contact{' '}
          <a href="mailto:support@dbkl.gov.my" className="text-[#1e6c93] hover:underline">
            support@dbkl.gov.my
          </a>
        </p>
      </div>
    </div>
  );
}
