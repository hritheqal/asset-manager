import Link from 'next/link';
import { 
  Building2, 
  Package, 
  ArrowRight, 
  ClipboardList,
  TrendingUp,
  MapPin,
  Users,
  FileText,
  Sparkles,
  BarChart3
} from 'lucide-react';

export default function Home() {
  const stats = [
    { label: 'Total Assets', value: '1,234', icon: Package, color: 'bg-blue-500' },
    { label: 'Buildings', value: '45', icon: Building2, color: 'bg-indigo-500' },
    { label: 'Active Users', value: '89', icon: Users, color: 'bg-emerald-500' },
    { label: 'Registrations', value: '567', icon: FileText, color: 'bg-purple-500' },
  ];

  const menuItems = [
    {
      title: 'SPARTA System',
      description: 'Sistem Pendaftaran Aset Rol Tak Alih - Asset registration and management',
      icon: ClipboardList,
      href: '/spartav2',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Manage Assets',
      description: 'View, update, and track all asset inventory across departments',
      icon: Package,
      href: '/assets',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      iconColor: 'text-emerald-600'
    },
    {
      title: 'Manage Buildings',
      description: 'Locations, facilities, and building information management',
      icon: Building2,
      href: '/buildings',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      iconColor: 'text-indigo-600'
    },
    {
      title: 'DA5 Registration',
      description: 'Building finishes and space registration form',
      icon: FileText,
      href: '/sparta/da5',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      title: 'DA6 Registration',
      description: 'Equipment and asset component registration form',
      icon: MapPin,
      href: '/sparta/da6',
      color: 'from-rose-500 to-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      iconColor: 'text-rose-600'
    },
    {
      title: 'Reports & Analytics',
      description: 'View statistics, reports, and asset analytics dashboard',
      icon: BarChart3,
      href: '/sparta',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      iconColor: 'text-amber-600'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e6c93] via-[#2d8ab8] to-[#1a5a7a] shadow-xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative px-6 py-10 sm:px-10 sm:py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>Version 2.0</span>
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Welcome to SPARTA DBKL
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Sistem Pendaftaran Aset Rol Tak Alih - Comprehensive asset management 
            system for Dewan Bandaraya Kuala Lumpur
          </p>
          
          <div className="mt-6 flex flex-wrap gap-3">
            <Link 
              href="/spartav2"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#1e6c93] rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-lg"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              href="/assets"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-white/30 transition-colors border border-white/30"
            >
              View Assets
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.label}
              className="glass-card rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm text-emerald-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+12% this month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Menu Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          Quick Access
          <div className="h-px flex-1 bg-gray-200 ml-4" />
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className={`
                  group relative overflow-hidden rounded-xl border-2 ${item.borderColor} 
                  ${item.bgColor} p-6 transition-all duration-300
                  hover:shadow-lg hover:-translate-y-1 hover:border-opacity-50
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className="relative flex items-start gap-4">
                  <div className={`
                    flex-shrink-0 w-12 h-12 rounded-xl ${item.bgColor} 
                    flex items-center justify-center shadow-sm
                    group-hover:scale-110 transition-transform duration-300
                  `}>
                    <Icon className={`h-6 w-6 ${item.iconColor}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className={`h-5 w-5 ${item.iconColor}`} />
                  </div>
                </div>
                
                {/* Bottom Accent Line */}
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${item.color} w-0 group-hover:w-full transition-all duration-500`} />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <ClipboardList className="h-4 w-4 text-blue-600" />
            </div>
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[
              { text: 'New DA5 registration submitted', time: '2 minutes ago', type: 'success' },
              { text: 'Asset #1234 updated', time: '1 hour ago', type: 'info' },
              { text: 'Building Menara DBKL modified', time: '3 hours ago', type: 'warning' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-600">{activity.text}</span>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            System Status
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Storage Usage</span>
                <span className="text-gray-900 font-medium">75%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Database Records</span>
                <span className="text-gray-900 font-medium">12.5k</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" />
              </div>
            </div>
            <div className="pt-2 flex items-center gap-2 text-sm text-emerald-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              All systems operational
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
