'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-700 via-slate-600 to-slate-700">
      {/* Header/Navigation */}
      <header className="flex justify-between items-center px-8 py-4">
        <div className="flex items-center gap-2 text-white">
          <span className="text-3xl">✝</span>
          <span className="text-2xl font-bold">FDMS</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="#features" className="text-white hover:text-yellow-400 transition-colors">
            Features
          </Link>
          <Link
            href="/signin"
            className="bg-yellow-500 text-slate-800 px-6 py-2 rounded-md font-semibold hover:bg-yellow-400 transition-colors flex items-center gap-2"
          >
            <span>🔑</span>
            Sign In
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-8 py-20 flex items-center justify-between">
        <div className="max-w-2xl">
          <h1 className="text-6xl font-bold text-white mb-6">
            Funeral Director<br />
            <span className="text-yellow-400">Management System</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Streamline your funeral home operations with our comprehensive management platform.
            From case intake to final invoicing, manage everything in one place with dignity and care.
          </p>
          <div className="flex gap-4">
            <Link
              href="/signin"
              className="bg-yellow-500 text-slate-800 px-8 py-3 rounded-md font-semibold hover:bg-yellow-400 transition-colors flex items-center gap-2"
            >
              <span>🔑</span>
              Sign In
            </Link>
            <Link
              href="#features"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-slate-800 transition-colors flex items-center gap-2"
            >
              <span>ℹ️</span>
              Learn More
            </Link>
          </div>
        </div>
        <div className="text-9xl text-yellow-600 opacity-60">
          ✝
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-800 py-16">
        <div className="container mx-auto px-8 grid grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold text-yellow-400 mb-2">500+</div>
            <div className="text-slate-300">Cases Managed</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-yellow-400 mb-2">50+</div>
            <div className="text-slate-300">Staff Members</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-yellow-400 mb-2">3</div>
            <div className="text-slate-300">Branches</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-yellow-400 mb-2">98%</div>
            <div className="text-slate-300">Satisfaction</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Comprehensive Features</h2>
            <p className="text-xl text-slate-600">
              Everything you need to manage your funeral home operations
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '📁',
                title: 'Case Management',
                description: 'Track every case from intake to completion with comprehensive workflow management.'
              },
              {
                icon: '📅',
                title: 'Service Scheduling',
                description: 'Efficiently schedule services, venues, and staff with conflict detection.'
              },
              {
                icon: '📦',
                title: 'Inventory Management',
                description: 'Track stock levels, manage suppliers, and automate reordering.'
              },
              {
                icon: '🚗',
                title: 'Fleet Management',
                description: 'Manage vehicles, bookings, maintenance schedules, and trip logs.'
              },
              {
                icon: '💵',
                title: 'Financial Management',
                description: 'Generate quotes, invoices, track payments, and manage expenses.'
              },
              {
                icon: '❤️',
                title: 'Digital Memorials',
                description: 'Create beautiful memorial pages with livestreaming capabilities.'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="text-6xl mb-4 bg-slate-100 w-20 h-20 flex items-center justify-center rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-800 py-20">
        <div className="container mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join funeral homes already using our platform to streamline their operations.
          </p>
          <Link
            href="/signin"
            className="bg-yellow-500 text-slate-800 px-10 py-4 rounded-md font-semibold text-lg hover:bg-yellow-400 transition-colors inline-flex items-center gap-2"
          >
            <span>🔑</span>
            Sign In to Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-8 text-center">
          <p className="text-slate-400">
            © 2025 <span className="text-yellow-400">Funeral Director Management System</span>. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="#" className="text-slate-400 hover:text-yellow-400">Privacy Policy</Link>
            <Link href="#" className="text-slate-400 hover:text-yellow-400">Terms of Service</Link>
            <Link href="#" className="text-slate-400 hover:text-yellow-400">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
