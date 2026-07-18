"use client";

import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function GoogleAuthButton() {
  const { googleLogin } = useAuth();
  const router = useRouter();

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          if (!credentialResponse.credential) {
            toast.error("Google লগইন ব্যর্থ হয়েছে");
            return;
          }
          try {
            await googleLogin(credentialResponse.credential);
            toast.success("Google দিয়ে লগইন সফল হয়েছে!");
            router.push("/dashboard");
          } catch {
            toast.error("Google লগইন করতে সমস্যা হয়েছে");
          }
        }}
        onError={() => toast.error("Google লগইন ব্যর্থ হয়েছে")}
        text="continue_with"
        shape="rectangular"
        width="320"
      />
    </div>
  );
}
