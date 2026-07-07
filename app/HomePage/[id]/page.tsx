export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `http://localhost:3000/api/add-product/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return <h1>Product Not Found</h1>;
  }

  const product = await res.json();
  console.log(product)

  return (
    <div className="container mt-5">
      <h1>Product Name: {product.name}</h1>
      <h2>Product Price: ₹{product.price}</h2>
      <p>Product Size: {product.size}</p>
      <p>Product Color: {product.color}</p>
      <p>Product Original Price: ₹{product.originalprice}</p>
      <p>Product Discount Percentage: {product.discountpercentage}%</p>
      <p>Product Discount Price: ₹{product.discountprice}</p>
      <p>Product Description: {product.description}</p>
    </div>
  );
}