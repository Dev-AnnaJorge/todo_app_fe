import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/tasks");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 border-4 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
