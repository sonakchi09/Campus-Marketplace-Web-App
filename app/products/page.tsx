import ProductCard from "../products/ProductCard";

const products = [
  {
    image: "/laptop.jpg",
    title: "Laptop",
    price: "20,000",
    category: "Electronic",
    isNew: false,
  },
  {
    image: "/calculator.jpg",
    title: "Calculator",
    price: "500",
    category: "Stationary",
    isNew: false,
  },
  {
    image: "/textbook.jpg",
    title: "TextBook",
    price: "600",
    category: "Books",
    isNew: true,
  },
  {
    image: "/usbdriver.jpg",
    title: "Usb Driver",
    price: "800",
    category: "Electronic",
    isNew: true,
  },
  {
    image: "/chair.png",
    title: "Chair",
    price: "300",
    category: "furniture",
    isNew: true,
  },
  {
    image: "/camera.png",
    title: "Camera",
    price: "20,000",
    category: "Electronic",
    isNew: true,
  },
  {
    image: "/table.png",
    title: "Table",
    price: "200",
    category: "furniture",
    isNew: false,
  },
  {
    image: "/charger.png",
    title: "Charger",
    price: "1800",
    category: "Electronic",
    isNew: false,
  },
  {
    image: "/bag.png",
    title: "Bag",
    price: "500",
    category: "Stationary",
    isNew: true,
  },
  {
    image: "/bottle.png",
    title: "Bottle",
    price: "300",
    category: "",
    isNew: false,
  },
];

export default function ProductSection() {
  return (
    <main className="p-6">
      <section id="products" className="scroll-mt-16">

      {/* Heading */}
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold text-yellow-400">
          Products on Campus
        </h2>
        <p className="mt-2 text-gray-600">
          Everything students need — bought, sold, and serviced right on campus
        </p>
      </div>

      {/* Products grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
      </section>
    </main>
  );
}
