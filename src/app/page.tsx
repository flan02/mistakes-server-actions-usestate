import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto py-16 space-y-8">
      <h1 className="font-bold text-4xl text-center">Mistakes that you must avoid as a developer</h1>
      <section className="flex justify-center space-x-4">
        <Link href="/server-actions" className="w-[300px] text-xl hover:underline hover:bg-black/90 rounded-md h-40 bg-black text-white flex items-center justify-center">
          <span className="font-bold">Go to server actions</span>
        </Link>
        <Link href="/usestate" className="w-[300px] text-xl hover:underline hover:bg-black/90 rounded-md h-40 bg-black text-white flex items-center justify-center">
          <span className="font-bold">Go to useState</span>
        </Link>
      </section>
    </div>
  );
}
