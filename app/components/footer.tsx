"use client";

import React from "react";
import {
  FaXTwitter,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";
import { TbMailFilled } from "react-icons/tb";
import { metaData, socialLinks } from "app/lib/config";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const YEAR = new Date().getFullYear();

function SocialLink({ href, icon: Icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-blue-500 transition-colors text-sm"
    >
      <Icon className="w-4 h-4" /> {/* smaller icons */}
    </a>
  );
}

function SocialLinks() {
  return (
    <div className="flex justify-center gap-4 my-2 text-sm">
      <SocialLink href={socialLinks.twitter} icon={FaXTwitter} />
      <SocialLink href={socialLinks.github} icon={FaGithub} />
      <SocialLink href={socialLinks.instagram} icon={FaInstagram} />
      <SocialLink href={socialLinks.linkedin} icon={FaLinkedinIn} />
      <SocialLink href={socialLinks.email} icon={TbMailFilled} />
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 lg:mt-24 text-center text-xs text-[#1C1C1C] dark:text-[#D4D4D4]">
      {/* Copyright */}
      <div className="mb-2">
        <time>© {YEAR}</time>{" "}
        <a
          className="no-underline"
          href={socialLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
        >
          {metaData.title}
        </a>
        <span> | Theme inspired from </span>{" "}
        <a
          className="underline"
          href="https://github.com/3p5ilon/Nextfolio"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nextfolio
        </a>
      </div>

      {/* Social Links */}
      <SocialLinks />

      {/* ML Signature */}
      <div className="mt-2 text-xs">
        <BlockMath
          math={`\\hat{y} = f_{\\theta}(x), \\quad \\theta^{*} = \\arg\\min_{\\theta} \\, \\mathbb{E}_{(x,y) \\sim \\mathcal{D}} \\, \\mathcal{L}(f_{\\theta}(x), y)`}
        />
      </div>

      {/* Quote */}
      <div className="mt-3 text-[10px] italic text-neutral-600 dark:text-neutral-400">
        Be passionate about the territory, not the map
      </div>
    </footer>
  );
}
