import React from "react";

const services = [
  {
    id: 1,
    title: "General Consultation",
    description:
      "Book an appointment with our qualified doctors for general health checkups.",
    icon: "🩺",
  },
  {
    id: 2,
    title: "Laboratory Tests",
    description: "Access a variety of lab tests with fast and accurate results.",
    icon: "🧪",
  },
  {
    id: 3,
    title: "Vaccinations",
    description: "Get your vaccines for seasonal and routine immunization.",
    icon: "💉",
  },
  {
    id: 4,
    title: "Emergency Care",
    description: "24/7 emergency medical support for urgent cases.",
    icon: "🚑",
  },
  {
    id: 5,
    title: "Physiotherapy",
    description: "Professional physiotherapy services for recovery and wellness.",
    icon: "🤸‍♂️",
  },
  {
    id: 6,
    title: "Mental Health Support",
    description:
      "Get counseling and mental health support from our specialists.",
    icon: "🧠",
  },
];

const ServicePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-green-600 text-white py-20">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our Medical Services
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Providing quality healthcare services to MBSTU students, staff, and
            faculty. Explore our services and book your appointments online.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl hover:scale-105 transition-transform duration-300"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
                <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-green-50 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
        <p className="mb-6 text-gray-700">
          Contact our support team or book an appointment online.
        </p>
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
          Contact Us
        </button>
      </section>
    </div>
  );
};

export default ServicePage;
