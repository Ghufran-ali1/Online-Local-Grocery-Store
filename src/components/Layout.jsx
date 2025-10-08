import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Header />
      <main className="flex-grow-1">
        <Outlet /> 
      </main>
      <Footer />
    </>
  );
}
