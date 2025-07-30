"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Banner from "@/components/core/Banner";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  publishedAt: string;
  coverImage?: {
    formats?: {
      medium?: {
        url: string;
      };
    };
  };
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("http://localhost:1337/api/blogs?populate=*");
        const data = await res.json();
        setBlogs(data.data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <p className="text-center mt-10 text-text-main">Loading blogs...</p>;

  return (
    <div className="">
      <Banner
        desktopSrc="/images/banners/banner1.jpeg"
        mobileSrc="/images/bannerForMobile/banner1.jpeg"
        alt={`Banner`}
      />
      <div className="text-center my-12">
        <h1 className="main-heading">Foodeez Blogs</h1>
        <p className="main-heading-description">Here you can read many blogs of Foodeez</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
        {blogs.map((blog) => (
          <Link href={`/blog/${blog.slug}`} key={blog.id}>
            <div className="bg-background-card rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden h-full flex flex-col">
              {blog.coverImage && (
                <div className="w-full h-48 relative">
                  <Image
                    src={`http://localhost:1337${blog.coverImage.formats?.medium?.url}`}
                    alt={blog.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col justify-between flex-grow">
                <h2 className="text-xl font-semibold text-text-main mb-2 leading-tight">
                  {blog.title}
                </h2>
                <p className="text-sm text-text-muted mb-4">
                  Published: {new Date(blog.publishedAt).toLocaleDateString()}
                </p>
                <p className="text-text-main text-base line-clamp-3 mb-4">
                  {blog.content.substring(0, 150)}...
                </p>
                <span className="text-primary-DEFAULT font-medium hover:underline mt-auto">Read More &rarr;</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 