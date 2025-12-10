'use client';

const features = [
  {
    title: 'Fast Performance',
    description: 'Built with modern technologies for lightning-fast performance',
    icon: '⚡',
  },
  {
    title: 'Scalable',
    description: 'Designed to grow with your business needs',
    icon: '📈',
  },
  {
    title: 'Secure',
    description: 'Enterprise-grade security to protect your data',
    icon: '🔒',
  },
  {
    title: 'Easy to Use',
    description: 'Intuitive interface that anyone can master',
    icon: '✨',
  },
  {
    title: '24/7 Support',
    description: 'Our team is always here to help you succeed',
    icon: '💬',
  },
  {
    title: 'Analytics',
    description: 'Powerful insights to drive better decisions',
    icon: '📊',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Features</h2>
          <p className="text-xl text-gray-600">
            Everything you need to succeed
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
