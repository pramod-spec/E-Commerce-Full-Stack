"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";

interface Product {
  id: string;
  name: string;
  discountprice: number;
  originalprice?: number;
  images: string[];
  description?: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams ? searchParams.get("q") || "" : "";

  const [searchInput, setSearchInput] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 🚀 Filters States
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");

  useEffect(() => {
    setSearchInput(query);

    if (!query || query.trim() === "") {
      setProducts([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        // Dynamic URL parameters for filters
        let url = `/api/search?q=${encodeURIComponent(query.trim())}`;
        if (minPrice) url += `&minPrice=${minPrice}`;
        if (maxPrice) url += `&maxPrice=${maxPrice}`;
        if (sortOrder) url += `&sort=${sortOrder}`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Search fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, minPrice, maxPrice, sortOrder]); // ⚡ Inme se kuch bhi badlega toh products automatically refresh ho jayenge

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim() !== "") {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSortOrder("");
  };

  return (
    <div className="container mt-5 mb-5">
      {/* SEARCH BAR INPUT */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-6 col-12">
          <form onSubmit={handleSearchSubmit}>
            <div className="input-group shadow-sm rounded-pill overflow-hidden border">
              <input
                type="text"
                className="form-control border-0 px-4 py-2"
                placeholder="Search products here..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{ fontSize: "1.05rem" }}
              />
              <button type="submit" className="btn btn-primary px-4 fw-bold"><FaSearch /></button>
            </div>
          </form>
        </div>
      </div>

      {query.trim() === "" ? (
        <div className="text-center py-5 border rounded-4 bg-light shadow-sm">
          <h4 className="text-muted">Aapne abhi tak kuch search nahi kiya hai! 🤔</h4>
        </div>
      ) : (
        <div className="row">
          
          {/* ======================================================== */}
          {/* 🛠️ SIDEBAR FILTERS SECTION                                */}
          {/* ======================================================== */}
          <div className="col-lg-3 col-md-4 col-12 mb-4">
            <div className="card p-4 shadow-sm border-0 rounded-4 sticky-top" style={{ top: "90px" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Filters ⚙️</h5>
                <button className="btn btn-link btn-sm p-0 text-decoration-none text-danger fw-bold" onClick={clearFilters}>
                  Clear All
                </button>
              </div>

              {/* Price Sort */}
              <div className="mb-4">
                <label className="form-label fw-semibold small text-secondary">Sort By Price</label>
                <select className="form-select rounded-3" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                  <option value="">Default</option>
                  <option value="lowToHigh">Price: Low to High</option>
                  <option value="highToLow">Price: High to Low</option>
                </select>
              </div>

              {/* Price Range Inputs */}
              <div className="mb-3">
                <label className="form-label fw-semibold small text-secondary">Price Range (₹)</label>
                <div className="d-flex gap-2">
                  <input
                    type="number"
                    className="form-control rounded-3"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <input
                    type="number"
                    className="form-control rounded-3"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 📦 PRODUCTS LISTING SECTION                              */}
          {/* ======================================================== */}
          <div className="col-lg-9 col-md-8 col-12">
            <h4 className="fw-bold mb-4">
              🔍 Search Results for: <span className="text-primary">"{query}"</span> 
              <span className="fs-6 text-muted ms-2">({products.length} items found)</span>
            </h4>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Applying filters...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-5 border rounded-4 bg-light shadow-sm">
                <h4 className="text-muted">In filters ke sath koi product nahi mila! 😟</h4>
                <p className="small text-secondary">Price range ya query badal kar try karein.</p>
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
                {products.map((product) => (
                  <div className="col" key={product.id}>
                    <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                      <Link href={`/add-product/${product.id}`}>
                        <img 
                          src={product.images?.[0] || "https://via.placeholder.com/250"} 
                          alt={product.name} 
                          className="card-img-top" 
                          style={{ height: "200px", objectFit: "cover" }} 
                        />
                      </Link>
                      <div className="card-body d-flex flex-column justify-content-between p-3">
                        <div>
                          <Link href={`/add-product/${product.id}`} className="text-decoration-none text-dark">
                            <h6 className="fw-bold text-truncate mb-1">{product.name}</h6>
                          </Link>
                          <p className="text-muted small text-truncate mb-2">{product.description || "No description available."}</p>
                        </div>
                        <div className="mt-2">
                          <span className="fs-5 fw-bold text-success">₹{product.discountprice}</span>
                          <Link href={`/add-product/${product.id}`} className="btn btn-outline-primary w-100 btn-sm rounded-pill fw-bold mt-2">
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="container mt-5 text-center py-5"><div className="spinner-border text-primary" role="status"></div><p className="mt-2">Loading...</p></div>}>
      <SearchContent />
    </Suspense>
  );
}