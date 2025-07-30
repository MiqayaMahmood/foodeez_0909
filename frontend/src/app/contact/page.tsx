"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { Input } from "@/components/core/Input";
import { Button } from "@/components/core/Button";
import Banner from "@/components/core/Banner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Our Location",
      description: "8154 Oberglatt, Switzerland",
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Number",
      description: "+41 76 408 94 30",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Address",
      description: "info@foodeez.ch",
    },
  ];

  return (
    <div className="">
      {/* Header */}
      <Banner
        desktopSrc="/images/banners/banner1.jpeg"
        mobileSrc="/images/bannerForMobile/banner1.jpeg"
        alt="Register Your Business on Foodeez"
      />
      <div className="my-16">
        <div className="">
          <div className="text-center mb-12">
            <h1 className="main-heading"> Get in Touch</h1>
            <p className="main-heading-description">
              Have questions? We're here to help. Reach out to our team and
              we'll get back to you as soon as possible.
            </p>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  {info.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{info.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {info.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className=" border-primary bg-primary/10 border rounded-2xl p-4 lg:p-8 shadow-lg space-y-8">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-primary">
              Send us a message
            </h2>
            <p className="mt-2 text-text-main">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="John Doe"
              />
              <Input
                label="Email"
                type="email"
                name="email"  
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="john@example.com"
              />
              <Input
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                placeholder="How can we help?"
              />
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                  placeholder="Your message here..."
                  required
                />
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full flex items-center justify-center gap-2"
              >
                {!isLoading && <Send className="h-4 w-4" />}
                Send Message
              </Button>

              {isSuccess && (
                <div className="rounded-lg bg-green-50 p-4 border border-green-200">
                  <p className="text-sm text-green-800">
                    Thank you for your message. We'll get back to you soon!
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
