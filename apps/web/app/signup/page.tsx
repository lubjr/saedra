import { SignUpForm } from "../../components/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="relative bg-zinc-900 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 flex w-full max-w-sm flex-col gap-6">
        <SignUpForm />
      </div>
    </div>
  );
}
