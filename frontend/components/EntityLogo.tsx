"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

const palette = [
  "from-emerald-500/20 to-cyan-500/20 text-emerald-700",
  "from-indigo-500/20 to-sky-500/20 text-indigo-700",
  "from-pink-500/20 to-rose-500/20 text-pink-700",
  "from-amber-500/20 to-orange-500/20 text-amber-700",
  "from-violet-500/20 to-fuchsia-500/20 text-violet-700",
  "from-lime-500/20 to-teal-500/20 text-lime-700",
];

const companyIcons: Record<string, string> = {
  "OpenAI": "simple-icons:openai",
  "Google": "simple-icons:google",
  "Microsoft": "simple-icons:microsoft",
  "Meta": "simple-icons:meta",
  "NVIDIA": "simple-icons:nvidia",
  "Anthropic": "simple-icons:anthropic",
  "Hugging Face": "simple-icons:huggingface",
  "Perplexity": "simple-icons:perplexity",
  "Perplexity AI": "simple-icons:perplexity",
  "Mistral AI": "simple-icons:mistralai",
  "Mistral": "simple-icons:mistralai",
  "Cohere": "simple-icons:cohere",
  "Runway": "simple-icons:runway",
  "ElevenLabs": "simple-icons:elevenlabs",
  "GitHub": "simple-icons:github",
  "Stability AI": "simple-icons:stabilityai",
  "Scale AI": "simple-icons:scaleai",
  "DeepMind": "simple-icons:googledeepmind",
  "Google DeepMind": "simple-icons:googledeepmind",
  "Cursor": "simple-icons:cursor",
  "Vercel": "simple-icons:vercel",
  "Stripe": "simple-icons:stripe",
  "Cloudflare": "simple-icons:cloudflare",
  "Midjourney": "simple-icons:midjourney",
  "Databricks": "simple-icons:databricks",
  "Cognition AI": "simple-icons:brain",
  "Groq": "simple-icons:groq",
  "Anduril": "simple-icons:shield",
  "Figure AI": "simple-icons:robot",
  "Figure": "simple-icons:robot",
  "Suno AI": "simple-icons:music",
  "Suno": "simple-icons:music",
  "LangChain": "simple-icons:chainlink",
  "Y Combinator": "simple-icons:ycombinator",
  "Sequoia Capital": "simple-icons:sequoia",
  "Sequoia Capital China": "simple-icons:sequoia",
  "Andreessen Horowitz": "simple-icons:a16z",
  "a16z": "simple-icons:a16z",
  "Tiger Global": "simple-icons:tiger",
  "Accel": "simple-icons:accel",
  "Lightspeed Venture Partners": "simple-icons:lightbulb",
  "Index Ventures": "simple-icons:index",
  "Khosla Ventures": "simple-icons:khosla",
  "Greylock Partners": "simple-icons:greylock",
  "Benchmark": "simple-icons:benchmark",
  "General Catalyst": "simple-icons:generalcatalyst",
  "Founders Fund": "simple-icons:foundersfund",
  "SoftBank": "simple-icons:softbank",
  "SoftBank Vision Fund": "simple-icons:softbank",
  "Insight Partners": "simple-icons:insightpartners",
  "Google Ventures": "simple-icons:googleventures",
  "Elad Gil": "simple-icons:user",
  "Nat Friedman": "simple-icons:user",
  "OpenAI Startup Fund": "simple-icons:openai",
};

const localLogos: Record<string, string> = {
  "OpenAI": "/logos/openai.svg",
  "Anthropic": "/logos/anthropic.svg",
  "Google DeepMind": "/logos/google-deepmind.svg",
  "Hugging Face": "/logos/huggingface.svg",
  "Midjourney": "/logos/midjourney.svg",
  "Stability AI": "/logos/stability-ai.svg",
  "Cognition AI": "/logos/cognition-ai.svg",
  "Cursor": "/logos/cursor.svg",
  "Figure AI": "/logos/figure-ai.svg",
  "Perplexity AI": "/logos/perplexity.svg",
  "Perplexity": "/logos/perplexity.svg",
  "Suno AI": "/logos/suno.svg",
  "Suno": "/logos/suno.svg",
  "LangChain": "/logos/langchain.svg",
  "Databricks": "/logos/databricks.svg",
  "ElevenLabs": "/logos/elevenlabs.svg",
  "Groq": "/logos/groq.svg",
  "Anduril": "/logos/anduril.svg",
  "Scale AI": "/logos/scale-ai.svg",
  "Cohere": "/logos/cohere.svg",
  "Runway": "/logos/runway.svg",
  "Mistral AI": "/logos/mistral-ai.svg",
  "Sequoia Capital": "/logos/sequoia-capital.svg",
  "Andreessen Horowitz": "/logos/a16z.svg",
  "Y Combinator": "/logos/y-combinator.svg",
  "Tiger Global": "/logos/tiger-global.svg",
  "Accel": "/logos/accel.svg",
  "Lightspeed Venture Partners": "/logos/lightspeed.svg",
  "Index Ventures": "/logos/index-ventures.svg",
  "Khosla Ventures": "/logos/khosla-ventures.svg",
  "Greylock Partners": "/logos/greylock.svg",
  "Elad Gil": "/logos/elad-gil.svg",
  "Nat Friedman": "/logos/nat-friedman.svg",
  "Microsoft": "/logos/microsoft.svg",
  "Google Ventures": "/logos/google-ventures.svg",
  "OpenAI Startup Fund": "/logos/openai-startup-fund.svg",
  "Sequoia Capital China": "/logos/sequoia-china.svg",
  "Benchmark": "/logos/benchmark.svg",
  "General Catalyst": "/logos/general-catalyst.svg",
  "Founders Fund": "/logos/founders-fund.svg",
  "SoftBank Vision Fund": "/logos/softbank.svg",
  "Insight Partners": "/logos/insight-partners.svg",
};

function initialsFor(name: string) {
  const words = name
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(" ")
    .filter(Boolean);

  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function paletteFor(name: string) {
  const index =
    name.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0) %
    palette.length;

  return palette[index];
}

export default function EntityLogo({
  name,
  logoUrl,
  className = "h-12 w-12 rounded-xl",
  textClassName = "text-sm",
}: {
  name: string;
  logoUrl?: string;
  className?: string;
  textClassName?: string;
}) {
  const [iconError, setIconError] = useState(false);
  const [imageError, setImageError] = useState(false);
 const localLogo = localLogos[name];
const icon = companyIcons[name];


if (localLogo) {
  return (
    <img
      src={localLogo}
      alt={name}
      className={`${className}
        shrink-0
        object-contain
        rounded-xl
        bg-gray-100
        border border-gray-200
        p-2`}
    />
  );
}
  if (icon && !iconError) {
    return (
      <div
        className={`${className} shrink-0 flex items-center justify-center rounded-xl
        bg-gray-100 border border-gray-200
        transition-all duration-300
        hover:scale-110
        hover:border-emerald-500/50
        hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]`}
      >
        <Icon icon={icon} width={30} height={30} onError={() => setIconError(true)} />
      </div>
    );
  }

  if (logoUrl && !imageError) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className={`${className} shrink-0 object-contain rounded-xl bg-gray-100 border border-gray-200 transition-all duration-300 hover:scale-110`}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div
      className={`${className}
      shrink-0
      flex
      items-center
      justify-center
      rounded-xl
      bg-gradient-to-br
      ${paletteFor(name)}
      border border-gray-200
      transition-all duration-300
      hover:scale-110`}
    >
      <span className={`${textClassName} font-semibold`}>
        {initialsFor(name)}
      </span>
    </div>
  );
}