import { ReactNode } from "react";
import { NavBar } from "./_components/Navbar";


export default function DashboardLayout({children} : { children : ReactNode}){

    return <div className="bg-accent/5 min-h-screen ">
        <NavBar/>
        {children}
    </div>
}