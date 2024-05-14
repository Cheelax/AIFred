// Layout.tsx
import React from "react";
import Link from "next/link";

const Layout: React.FC = ({ children }: any) => {
  return (
    <div>
      <header>
        <Link href="/">
          <a>Retour à l accueil</a>
        </Link>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
