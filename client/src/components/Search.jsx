import React, { useEffect, useState } from "react";
import ListingItem from "./ListingItem";

export const Search = () => {
  let [search, setSearch] = useState("");
  let [listings, setListings] = useState([]);
 
  let handleChange = (e) => {
    try {
      setSearch(() => e.target.value);
      console.log(e.target.value);
    } catch (error) {}
  };
  const handleGetData = async () => {
    try {
      const res = await fetch("/api/user/allsearch");
      const data = await res.json();
      setListings(data);
    } catch (error) {}
  };
  let handleSearch = async (search) => {
    try {
      if (!search) {
        handleGetData();
      } else {
        const res = await fetch(`/api/user/search/${search}`);
        const data = await res.json();
        setListings(data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7  border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8">
          <div className="flex items-center ">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={search}
              onChange={handleChange}
            />
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              handleSearch(search);
            }}
            className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
          >
            Search
          </button>
        </form>

        <div className="p-7 flex flex-wrap gap-2">
          {listings.map((listing) => (
            <ListingItem  key={listing._id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
};
