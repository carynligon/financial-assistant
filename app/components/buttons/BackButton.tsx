import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  return (
    <Link
      className="flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-gray-700 transition-colors dark:text-gray-300 md:w-[158px]"
      href="/"
    >
      <ArrowLeft className="w-5 h-5" />
      Back
    </Link>
  );
}
