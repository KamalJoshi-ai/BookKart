import { notFound } from "next/navigation";
import BookDetailsClient from "./BookDetailsClient";

async function getBook(id: string) {
 try {
  const res = await fetch(
    `https://bookstore-backend-5k3s.onrender.com/api/products/${id}`,
    {
      cache: "no-store",
    }
  );
    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch {
    return null;
  }
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

const data = await getBook(id);


  if (!data?.data) {
    notFound();
  }

  return <BookDetailsClient product={data?.data} />;
};

export default Page;



//Here bookdetails client component is rendered at server only yes the client one also .It renders which can be rendered without browser apis help .