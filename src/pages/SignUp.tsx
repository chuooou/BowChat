import SignupForm from "@/features/signup/ui/SignupForm";

const SignUp = () => {
  return (
    <section className="bg-background flex h-full w-full flex-col items-center justify-center">
      <div className="mx-auto w-full max-w-xl">
        <h2 className="text-[2rem] font-bold">회원가입</h2>

        <SignupForm />
      </div>
    </section>
  );
};

export default SignUp;
