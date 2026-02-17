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
  ClipboardList
} from 'lucide-react';

interface MenuButton {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  href: string;
  external?: boolean;
  color: string;
  bgColor: string;
  hoverColor: string;
}

export default function SpartaV2Page() {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const menuButtons: MenuButton[] = [
    {
      id: 'da5',
      label: 'DA5 Building Finishes Form',
      description: 'Building Space & Finishes Registration Form',
      icon: FileText,
      href: '/sparta/da5',
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      id: 'da6',
      label: 'DA6 Component Form',
      description: 'Equipment & Asset Registration Form',
      icon: BookOpen,
      href: '/sparta/da6',
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      hoverColor: 'hover:bg-emerald-100'
    },
    {
      id: 'da4-list',
      label: 'DA4 List - Block & External Buildings List',
      description: 'List of Blocks & External Buildings',
      icon: Building2,
      href: 'https://drive.google.com/drive/folders/1roPyt13bx6BeRdEI4nqYMnYmGgYdRyEy',
      external: true,
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100'
    },
    {
      id: 'da5-list',
      label: 'DA5 List - Floor/Room/Finishes Block & External Buildings',
      description: 'DA5 Records Dashboard',
      icon: List,
      href: '/sparta',
      color: 'text-indigo-700',
      bgColor: 'bg-indigo-50',
      hoverColor: 'hover:bg-indigo-100'
    },
    {
      id: 'da6-list',
      label: 'DA6 List - Block/External Building Components',
      description: 'DA6 Records Dashboard',
      icon: ClipboardList,
      href: '/sparta',
      color: 'text-teal-700',
      bgColor: 'bg-teal-50',
      hoverColor: 'hover:bg-teal-100'
    },
    {
      id: 'documents',
      label: 'Reference Documents',
      description: 'Reference Documents',
      icon: FolderOpen,
      href: 'https://drive.google.com/drive/folders/1-f7utQZy8f9e72oFsEM4uvclDy7VqfoY',
      external: true,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      hoverColor: 'hover:bg-amber-100'
    },
    {
      id: 'mapping',
      label: 'Asset Record Mapping Summary',
      description: 'Asset Mapping Summary',
      icon: MapPin,
      href: '/sparta',
      color: 'text-rose-700',
      bgColor: 'bg-rose-50',
      hoverColor: 'hover:bg-rose-100'
    },
    {
      id: 'register',
      label: 'First Time Registration',
      description: 'First Time Registration',
      icon: UserPlus,
      href: '/auth/signup',
      color: 'text-cyan-700',
      bgColor: 'bg-cyan-50',
      hoverColor: 'hover:bg-cyan-100'
    }
  ];

  const handleButtonClick = (button: MenuButton) => {
    window.open(button.href, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Header Section */}
      <div 
        className="relative py-16 px-4"
        style={{
          background: 'linear-gradient(135deg, #1e6c93 0%, #226e93 50%, #1a5a7a 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-20">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-wide">
            SISTEM PENDAFTARAN ASET ROL TAK ALIH
          </h1>
          <h2 className="text-2xl md:text-3xl font-light text-blue-100 mb-2">
            (SPARTA) DBKL
          </h2>
          <p className="text-blue-200 text-lg">
            Sistem pendaftaran aset untuk bangunan dan kemudahan DBKL
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-4">
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
                  w-full group relative overflow-hidden
                  ${button.bgColor} ${button.hoverColor}
                  border-2 border-gray-200 hover:border-gray-300
                  rounded-xl shadow-sm hover:shadow-md
                  transition-all duration-300 ease-in-out
                  transform hover:scale-[1.02] hover:-translate-y-1
                `}
              >
                {/* Hover Effect Overlay */}
                <div 
                  className={`
                    absolute inset-0 bg-white opacity-0 group-hover:opacity-10
                    transition-opacity duration-300
                  `}
                />
                
                {/* Content Container */}
                <div className="relative z-10 p-6 flex items-center gap-5">
                  {/* Icon Container */}
                  <div 
                    className={`
                      flex-shrink-0 w-16 h-16 rounded-xl
                      ${button.bgColor} border-2 border-gray-200
                      flex items-center justify-center
                      group-hover:scale-110 group-hover:rotate-3
                      transition-transform duration-300
                      shadow-inner
                    `}
                  >
                    <Icon 
                      className={`
                        w-8 h-8 ${button.color}
                        group-hover:scale-110
                        transition-transform duration-300
                      `} 
                    />
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex-1 text-left">
                    <h3 
                      className={`
                        text-lg font-semibold ${button.color}
                        group-hover:translate-x-1
                        transition-transform duration-300
                      `}
                    >
                      {button.label}
                    </h3>
                    {button.description && (
                      <p className="text-sm text-gray-500 mt-1 group-hover:text-gray-600">
                        {button.description}
                      </p>
                    )}
                  </div>
                  
                  {/* External Link Indicator */}
                  <div 
                    className={`
                      flex-shrink-0 opacity-0 group-hover:opacity-100
                      transition-all duration-300 transform
                      ${isHovered ? 'translate-x-0' : 'translate-x-2'}
                    `}
                  >
                    <ExternalLink className={`w-5 h-5 ${button.color}`} />
                  </div>
                </div>
                
                {/* Bottom Border Accent */}
                <div 
                  className={`
                    absolute bottom-0 left-0 h-1 ${button.color.replace('text-', 'bg-').replace('700', '500')}
                    transition-all duration-300
                    ${isHovered ? 'w-full' : 'w-0'}
                  `}
                />
              </button>
            );
          })}
        </div>
        
        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-sm border border-gray-200">
            <Building2 className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">
              Dewan Bandaraya Kuala Lumpur
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            SPARTA Version 2.0 - Sistem Pendaftaran Aset Rol Tak Alih
          </p>
        </div>
      </div>
    </div>
  );
}
