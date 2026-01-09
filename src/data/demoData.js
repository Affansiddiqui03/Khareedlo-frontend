// Assets import
import product1 from "../assets/product1.jpg";
import product2 from "../assets/product2.jpg";
import product3 from "../assets/product3.jpg";

import brand3 from "../assets/brand3.png";
import brand4 from "../assets/brand4.png";
import banner1 from "../assets/banner1.webp";
import banner2 from "../assets/banner2.webp";

export const brands = [
  {
    _id: "b1",
    name: "Khaadi",
    city: "Karachi",
    category: "Men",
    logo: brand4,
    banner: banner1,
    description: "Premium eastern wear",
    website: "https://www.khaadi.com",

  },
  {
    _id: "b2",
    name: "J. by Junaid Jamshed",
    city: "Karachi",
    category: "All Categories",
    logo: brand3,
    banner: banner2,
    description: "Modern traditional wear",
    website: "https://www.junaidjamshed.com",
  },
];

export const products = [
  {
    _id: "p1",
    title: "Printed Lawn Suit",
    price: 9500,
    image: product2,   // ✅ Printed Lawn Suit = product3.jpg
    brand: "b1",
    trending: true,
    category:"Women",
  },
  {
    _id: "p2",
    title: "Summer Kurta",
    price: 17599,
    image: product1,   // ✅ Summer Kurta = product1.jpg
    brand: "b2",
    trending: true,
    category: "Men",
  },
  {
    _id: "p3",
    title: "Kids Dress",
    price: 5900,
    image: product3,   // ✅ Kids Dress = product2.jpg
    brand: "b1",
    category: "Kids",
  },
];
