"use client";

import { useState } from "react";
import { Plus, Minus, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import SEO from "@/components/seo/SEO";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "What is Foodeez?",
    answer:
      "Foodeez is a food discovery platform designed to connect local restaurants, cafés, and takeaways in Switzerland with tourists and food lovers actively searching for places to eat. We help your business get discovered — online and in person.",
  },
  {
    question: "Who can join Foodeez?",
    answer:
      "Any food business in Switzerland — including restaurants, takeaways, cafés, food trucks, bakeries, or specialty stores — is welcome to join, whether you're well-known or just starting out.",
  },
  {
    question: "Why should I register my business on Foodeez?",
    answer:
      `<ul class='list-disc pl-5 space-y-1'>
        <li>Get discovered on our map and food app</li>
        <li>Reach tourists in your area</li>
        <li>Improve your online visibility (Google, Instagram, etc.)</li>
        <li>Access free and premium marketing services</li>
      </ul>`
  },
  {
    question: "Do I need to be on Google or Instagram to join?",
    answer:
      "No — in fact, Foodeez helps you get there! If you're not yet visible online, our Premium plan includes setup for Google My Business and social media accounts, at no extra cost during your first year.",
  },
  {
    question: "Can Foodeez help set up Google Maps and Instagram for my restaurant?",
    answer:
    `<p>Yes, we can help Digitalize your Business as:</p>
      <ul class='list-disc pl-5 space-y-1'>
        <li>Google My Business creation or optimization</li>
        <li>Instagram and Facebook setup or refresh</li>
        <li>Help creating your first social media posts or reels <a href="/contact" target="_blank" class="hover:underline font-bold text-secondary">Contact Us.</a></li>
      </ul>
      `
  },
  {
    question: "How will Foodeez help bring more customers?",
    answer:
      `<ul class='list-disc pl-5 space-y-1'>
        <li>Tourists searching nearby</li>
        <li>Visitors browsing by cuisine or location</li>
        <li>People looking on our app, social media, and website</li>
        <li>With Premium, you also get exposure through ads, recommendations, and features.</li>
      </ul>`
  },
  {
    question: "How do I sign up?",
    answer:
      `You can register your business in just a few minutes at <a href='https://www.foodeez.ch/business/register' class='text-primary underline' target='_blank'>www.foodeez.ch/business/register</a><br/>Or email us at <a href='mailto:hello@foodeez.ch' class='text-primary underline'>hello@foodeez.ch</a> and we'll help you onboard.`
  },
  {
    question: "Is there support if I need help?",
    answer:
      "Yes! Our team is available by email, chat, or WhatsApp. Premium users receive priority support for setup, promotions, and technical help.",
  },
  {
    question: "Can I edit my listing later?",
    answer:
      "Absolutely. You can log in anytime to update your photos, menu, hours, or promotions.",
  },
  {
    question: "How does advertising work on Foodeez?",
    answer:
      `<ul class='list-disc pl-5 space-y-1'>
        <li>Reserve ad spots near your location</li>
        <li>Run limited-time offers or seasonal promotions</li>
        <li>Get featured in tourist-relevant searches</li>
        <li>Appear in Foodeez newsletters and social posts</li>
      </ul>
      <p>You choose the message, and we help you broadcast it to the right audience.</p>`
  },
  {
    question: "Do you offer digital marketing services?",
    answer:
      `<ul class='list-disc pl-5 space-y-1'>
        <li>Local SEO setup</li>
        <li>Social media content creation</li>
        <li>Email promotions</li>
        <li>Blog features and influencer partnerships</li>
      </ul>
      <p>We do the heavy lifting, so you can focus on food.</p>`
  },
  {
    question: "Can Foodeez promote my blog or food story?",
    answer:
      `<p>Yes — if you have a great story, chef background, or recipe blog, we'd love to feature it! We promote standout stories on:</p>
      <ul class='list-disc pl-5 space-y-1'>
        <li>Foodeez Blog</li>
        <li>Our Instagram / Facebook</li>
        <li>Partner tourism content platforms</li>
      </ul>
      <p>Reach out to us to collaborate!</p>`
  },
  {
    question: "Is there a place to ask questions or share ideas with others?",
    answer:
      `<p>Yes! We're building a Foodeez Business Forum, where restaurant owners, chefs, and marketers can:</p>
      <ul class='list-disc pl-5 space-y-1'>
        <li>Ask questions</li>
        <li>Share success stories</li>
        <li>Get tips on food tourism & digital marketing</li>
      </ul>`
  },
  {
    question: "Can I list my product on Foodeez even if I don't have a restaurant?",
    answer:
      `<p>Yes! If you're a:</p>
      <ul class='list-disc pl-5 space-y-1'>
        <li>Cheesemaker</li>
        <li>Chocolate artisan</li>
        <li>Specialty food seller</li>
        <li>Wine producer</li>
        <li>Local farmer or spice maker</li>
      </ul>
      <p>...you can create a producer listing and promote your goods to tourists and food lovers. <a href="/contact" target="_blank" class="hover:underline font-bold text-secondary">Contact Us</a></p>`
  },
  {
    question: "How can I promote my products through Foodeez?",
    answer:
      `<ul class='list-disc pl-5 space-y-1'>
        <li>Local product listings with photos & descriptions</li>
        <li>Tourist discovery tools: so they can find and visit you</li>
        <li>Online promotion via blog, Instagram, and food forums</li>
        <li>The option to run Foodeez Ads to reach more visitors</li>
      </ul>`
  },
  {
    question: "Do I need a physical shop to list my product?",
    answer:
      `<p>Not at all. You can list a:</p>
      <ul class='list-disc pl-5 space-y-1'>
        <li>Farm or workshop location</li>
        <li>Market stall</li>
        <li>Online store with local delivery or pickup</li>
      </ul>
      <p>Just make sure foodeez can reach you (physically or digitally), and we'll help them find you.</p>`
  },
  {
    question: "Can I share my story or product journey?",
    answer:
      `<p>Absolutely! We love showcasing local producers. Your story can be featured in:</p>
      <ul class='list-disc pl-5 space-y-1'>
        <li>Blog articles</li>
        <li>Local tasting guides</li>
        <li>Our social media</li>
        <li>Foodeez Food Trails (coming soon)</li>
      </ul>`
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="py-16 px-2 md:px-0">
      <SEO
        title="Frequently Asked Questions"
        description="Find answers about Foodeez: how it works, who can join, pricing, visibility, and support."
        url={typeof window !== 'undefined' ? window.location.href : 'https://foodeez.ch/faq'}
        canonical={typeof window !== 'undefined' ? window.location.href : undefined}
        type="website"
        breadcrumbs={[{ name: 'Home', url: 'https://foodeez.ch' }, { name: 'FAQ', url: 'https://foodeez.ch/faq' }]}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }}
      />
      <div className="">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">Frequently Asked Questions</h1>
          <p className="text-lg md:text-xl text-accent-dark max-w-2xl mx-auto">
            Everything you need to know about using Foodeez as a business or food lover.
          </p>
        </div>

        <div className="space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-accent rounded-2xl bg-white/80 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-lg md:text-xl text-primary focus:outline-none hover:bg-primary/5 transition-colors"
              >
                <span>{faq.question}</span>
                <span
                  className={`transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
                >
                  {openIndex === index ? (
                    <Minus size={28} className="text-primary" />
                  ) : (
                    <Plus size={28} className="text-primary" />
                  )}
                </span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className="px-6 pb-6 pt-0 border-t border-gray-100 text-text-main text-base md:text-lg bg-white"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center space-y-4">
          <Link href="/contact">
            <button className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-white hover:bg-primary-700 transition-colors text-lg md:text-xl font-semibold shadow-md">
              <span>Still have questions? Contact Us</span>
              <ArrowRight size={24} />
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}