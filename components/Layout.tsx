import React, { ReactNode } from "react";
import Head from "next/head";
import NavBar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = "LabCoin" }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <main>
        <div className="min-h-screen bg-gradient-to-br from-dark via-midBlue to-darkBlue text-white flex flex-col items-center justify-between overflow-auto">
          {children}
          <NavBar />
        </div>
      </main>
    </div>
  );
};

export default Layout;
