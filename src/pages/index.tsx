import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/tasks");
  }, [router]);
  return (
    <div>
      <h1 className="">Redirecting...</h1>
    </div>
  );
}
