import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./layout/TopBar";
import LeftSideBar from "./layout/LeftSideBar";
import ButtomBar from "./layout/ButtomBar";

const RootLayout = () => {
  return (
    <div className="w-full md:flex">
      <TopBar />
      <LeftSideBar />
      <section className="flex flex-1 h-full">
        <Outlet />
      </section>
      <ButtomBar />
    </div>
  );
};

export default RootLayout;
