
"use client";



import { useState, useEffect } from "react";

export default function Page() {
  const [name, setName] = useState("");
  // const [price, setPrice] = useState<number>(0);
  const [rating, setRating] = useState("")
  const [description, setDescription] = useState("");
  const [size,setSize] = useState("")
  const [color,setColor] = useState("")
  const [originalprice, setOriginalPrice] = useState<number>(0)
  const [discountpercentage, setDiscountPercentage] = useState<number>(0)
  const [discountprice, setDiscountPrice ] = useState<number>(0)
  const [files, setFiles] = useState<File[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [section, setSection] = useState("")

  // CREATE PRODUCT
  const createProduct = async () => {
    if (!name.trim() ) {
      alert("All fields are required");
      return;
    }

    if (files.length === 0) {
      alert("Please select images");
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    // formData.append("price", String(price));
    formData.append("rating",rating)
    formData.append("description", description);
    formData.append("size",size);
    formData.append("color",color)
    formData.append("originalprice", String(originalprice))
    formData.append("discountpercentage", String(discountpercentage))
    formData.append("discountprice", String(discountprice))
    formData.append("section", section)

    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await fetch("/api/add-product", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      console.log("RAW RESPONSE:", text);

      const data = JSON.parse(text);

      if (!res.ok) {
        alert(data.error || "Something went wrong");
        return;
      }

      console.log("SUCCESS:", data);

      setName("");
      // setPrice(0);
      setRating("")
      // setDescription("");
      setFiles([]);

      loadProducts();
    } catch (err) {
      console.log(err);
      alert("Server Error");
    }
  };

  // DELETE PRODUCT
  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch("/api/add-product/[id]", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Product Deleted");
        loadProducts();
      } else {
        alert("Delete Failed");
      }
    } catch (err) {
      console.log(err);
      alert("Delete Failed");
    }
  };

  // LOAD PRODUCTS
  const loadProducts = async () => {
    try {
      const res = await fetch("/api/add-product");

      const text = await res.text();
      console.log("PRODUCTS RAW:", text);

      const data = JSON.parse(text);

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      
      <h1>Add Product</h1>
      
      <select value={section} onChange={(e)=>setSection(e.target.value)}>
        <option value="">Select Section</option>
        <option value="Popular">Popular Product</option>
        <option value="New Arrival">New Arrival</option>
        <option value="Men">Men</option>
        <option value="Women">Women</option>
        <option value="Home & Living">Home & Living</option>
        <option value="Electronics">Electronics</option>
        <option value="Sales & Offers">Sales & Offers</option>
      </select><br /><br /><br />

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      {/* <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      />
      <br /><br /> */}


      <p>Rating</p>
      <input 
      type="text"
      placeholder="rating"
      onChange={(e)=>setRating(e.target.value)} />
      <br /><br />

      <p>Description</p>

      {<textarea placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />}

      <br /><br />
      <p>Size</p>
      <input type="text" placeholder="size" value={size} onChange={(e)=>setSize(e.target.value)} />

      <br /><br />
      <p>Color</p>
      <input type="text" placeholder="Color" value={color} onChange={(e)=>setColor(e.target.value)} />

      <br /><br />
      <p>Original Price</p>
      <input type="number" placeholder="Original Price" value={originalprice} onChange={(e)=>setOriginalPrice(Number(e.target.value))} />
      <br /><br />
      <p>Discount Percentage</p>

      <input type="number" placeholder="Discount Percentage" value={discountpercentage} onChange={(e)=>setDiscountPercentage(Number(e.target.value))} />

      <br /><br />
      <p>Discount Price</p>

      <input type="number" placeholder="Discount Price" value={discountprice} onChange={(e)=>setDiscountPrice(Number(e.target.value))} />


      <p>Images</p>
      <input
        type="file"
        multiple
        onChange={(e) =>
          setFiles(Array.from(e.target.files || []))
        }
      />
      <br /><br />

      <button onClick={createProduct}>
        Add Product
      </button>

      <hr />

      <h2>Products</h2>

      {products.map((p) => (
        <div key={p.id} style={{ marginBottom: "20px" }}>
          <h3>{p.name}</h3>
          <p>{p.price}</p>
          {/* <p>{p.description}</p> */}

          {p.images?.map((img: string, i: number) => (
            <img
              key={i}
              src={img}
              width={120}
              style={{ marginRight: "10px" }}
              alt="product"
            />
          ))}

          <br />
          <br />

          <button onClick={() => deleteProduct(p.id)}>
            Delete Product
          </button>
        </div>
      ))}
    </div>
  );
}