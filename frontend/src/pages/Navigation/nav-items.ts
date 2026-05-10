import DashboardIcon from "bootstrap-icons/icons/window-fullscreen.svg?react";
import ProductsIcon from "bootstrap-icons/icons/box.svg?react";
import CartIcon from "bootstrap-icons/icons/cart3.svg?react";

export default [
  { name: "Dashboard", icon: DashboardIcon, link: "/" },
  { name: "Samochody", icon: ProductsIcon, link: "/cars" },
  { name: "Zamówienia", icon: CartIcon, link: "/orders" },
];
