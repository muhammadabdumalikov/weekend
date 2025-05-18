"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdStar, MdFavoriteBorder } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";

async function fetchTours() {
  const API_URL = "/api/tour/list"; // Calls the Next.js proxy instead

  const res = await fetch(API_URL, {
    method: "post",
    body: JSON.stringify({}),
    headers: { "X-Lang": "uz" },
  }); // Replace with your API endpoint
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

const Tour = () => {
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["tours"],
    queryFn: fetchTours,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  const onPressHandler = (item) => {
    router.push(`/listing-details/${item.id}`);
  };

  return (
    <div className="h-96 w-[30%] xl:w-[30%] mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-scroll scroll-smooth snap-x snap-mandatory mb-8">
      {data?.data?.map((item, index) => (
        <div
          key={index}
          onClick={() => onPressHandler(item)}
          className="w-full h-10 bg-white overflow-hidden rounded-3xl cursor-pointer snap-center border flex flex-col"
        >
          {/* Image Section */}
          <div className="relative w-full h-56 flex-shrink-0 rounded-t-3xl overflow-hidden">
            <Image
              src={
                item.files?.find((f) => f.type === "extra")?.url ||
                "/placeholder.jpg"
              }
              alt={item.title}
              width={400} // Set appropriate width
              height={224} // Should match h-56 (14rem)
              className="object-cover h-full"
            />

            {/* Discount Box */}
            <p className="absolute top-3 left-3 bg-blue-500 text-rose-500 text-xs font-semibold px-3 py-1 rounded-full">
              25% OFF
            </p>

            {/* Organizer Logo */}
            <div className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Image
                src={item.organizer_logo || "/logo-placeholder.png"}
                alt="Organizer"
                width={38}
                height={38}
                className="rounded-full"
              />
            </div>

            {/* Heart Icon */}
            <div className="absolute top-3 right-3 text-white">
              <MdFavoriteBorder size={28} />
            </div>
          </div>

          {/* Info Section */}
          <div className="p-3 pb-6 flex flex-col flex-grow">
            <div className="items-center mt-1">
              <p className="text-sm text-gray-500">Cultural • Coffee</p>

              <h3 className="text-lg font-semibold text-[#050544] break-words line-clamp-2">
                {item.title}
              </h3>
            </div>

            {/* Price Section */}
            <div className="flex justify-between items-end mt-auto">
              <span className="text-gray-500 text-sm">
                <span className="text-orange-400 font-semibold">
                  {Intl.NumberFormat().format(+item.price)}
                </span>
                /person
              </span>

              {/* Rating */}
              <div className="flex items-center bg-green-500 text-white text-sm px-2 py-1 rounded-md">
                <span className="pr-1">{item.rating || 0}</span>
                <MdStar size={16} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tour;
