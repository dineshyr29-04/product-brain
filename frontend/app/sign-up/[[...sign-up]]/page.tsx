import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F3] flex flex-col justify-center items-center p-6 text-[#37322F]">
      <div className="mb-6 text-center">
        <Link href="/" className="inline-block">
          <div className="text-2xl font-extrabold tracking-tight text-[#37322F]">
            ProductBrain
          </div>
          <span className="text-[11px] font-mono font-medium px-2 py-0.5 bg-[#eae7e3] text-[#605a57] rounded border border-[#d8d5d0] mt-1 inline-block">
            Enterprise v1.0
          </span>
        </Link>
        <p className="text-xs text-[#605a57] mt-2">
          Create an enterprise account for ProductBrain
        </p>
      </div>

      <div className="w-full max-w-md bg-white p-2 rounded-2xl shadow-sm border border-[#e0dedb]">
        <SignUp routing="path" path="/sign-up" />
      </div>

      <div className="mt-6 text-xs text-[#828387]">
        <Link href="/" className="hover:text-[#37322F] underline">
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
