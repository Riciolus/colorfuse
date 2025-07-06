"use client";

import { cn } from "@/lib/utils";
import { Archive, Heart, PaintBucket, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { type ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const sidebarData = [
  {
    title: "Generator",
    path: "/",
    icon: <PaintBucket className="h-5 w-5" />,
    motto: "Smart Color generator for designer",
    desc: "Pick colors, blend gradients, and find the perfect palette for any project in seconds.",
  },
  {
    title: "Palletes",
    path: "/palletes",
    icon: <Archive className="h-5 w-5" />,
    motto: "Curated color palettes at your fingertips",
    desc: "Browse and explore beautifully crafted color palettes for every mood, theme, and project need.",
  },
  {
    title: "Favourites",
    path: "/favourites",
    icon: <Heart className="h-5 w-5" />,
    motto: "Your saved colors, all in one place",
    desc: "Easily revisit and manage your favorite palettes and gradients to speed up your design flow.",
  },
];

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();

  const activeItem = sidebarData.find((item) => item.path === pathname);
  return (
    <div className="bg-primary text-neutral-950">
      {/* Fixed Navbar */}
      <nav className="border-line bg-primary fixed top-0 right-0 left-0 z-50 flex h-14 items-center justify-between gap-40 border-b px-8">
        <Link href="/">
          <h3 className="flex-none text-xl font-semibold">Colorfuse</h3>
        </Link>
        <div className="relative mr-72 h-[65%] flex-1">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search palettes"
            className="border-line-dark/50 h-full w-full rounded-full border ps-10 text-sm outline-none"
          />
        </div>
      </nav>

      {/* Sidebar + main */}
      <div className="flex pt-14">
        {/* Fixed Left Sidebar */}
        <aside className="fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-56 p-3">
          <div className="grid gap-3">
            {sidebarData.map((page) => {
              const isActive = pathname === page.path;
              return (
                <Link key={page.title} href={page.path}>
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-xl p-3 text-neutral-700 transition-colors hover:text-neutral-900",
                      isActive && "bg-amber-200/30 text-neutral-900",
                    )}
                  >
                    {page.icon}
                    {page.title}
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Fixed Right Sidebar */}
        <aside className="border-line-dark/50 fixed top-14 right-0 h-[calc(100vh-3.5rem)] w-[20rem] border-l p-3">
          <h4 className="text-lg font-medium">{activeItem?.motto}</h4>
          <h6 className="text-sm tracking-tight">{activeItem?.desc}</h6>
        </aside>

        {/* Main Content */}
        <main className="mx-[284px] w-full">
          {/* 56px (left) + 56px (right) */}
          <div className="min-h-[200vh] p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
