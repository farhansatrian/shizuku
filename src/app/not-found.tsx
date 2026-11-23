import Link from "next/link";
import { UmbrellaMark } from "@/components/icons/RainMotifs";

export default function NotFound() {
  return (
    <div className="shizuku-watercolor-bg flex min-h-screen flex-col items-center justify-center px-5 py-16 text-center">
      <div className="pastel-glass max-w-md rounded-[2rem] p-8 sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7650f3] to-[#ee84b5] text-white shadow-sm">
          <UmbrellaMark className="h-7 w-7" />
        </span>
        <p className="mt-5 font-mono text-xs tracking-[0.24em] text-[#7650f3] uppercase">
          404 // LOST IN THE RAIN
        </p>
        <h1 className="mt-2 font-editorial text-4xl font-semibold text-[#1e172b]">
          Page Not Found
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#62577a]">
          The page you are looking for has drifted away with the clouds. Let’s
          head back to the main sanctuary.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-[#7650f3] px-6 py-2.5 text-xs font-medium text-white transition hover:bg-[#5e38dc]"
          >
            Back to Home
          </Link>
          <Link
            href="/projects"
            className="rounded-full border border-[#dfd4f8] bg-white px-5 py-2.5 text-xs font-medium text-[#2c214a] transition hover:border-[#7650f3] hover:text-[#7650f3]"
          >
            Explore Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
