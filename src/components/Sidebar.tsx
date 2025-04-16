// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import {
//   KeyboardArrowUpRounded,
//   KeyboardArrowDownRounded,
//   MenuOpenRounded,
//   MenuRounded,
//   AdjustRounded,
// } from "@mui/icons-material";

// interface MenuItem {
//   Id: string;
//   Uri: string;
//   Name: string;
//   Icon?: string | null;
//   ChildAccessLabels?: MenuItem[] | null;
//   Dropdowns?: MenuItem[] | null;
// }

// const Sidebar = () => {
//   const [authKey, setAuthKey] = useState<string | null>(null);
//   const [menuItems, setMenuItems] = useState<MenuItem[] | null>(null);
//   const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
//   const [expandedSection, setExpandedSection] = useState<string | null>(null);
//   const [ClientName, setClientName] = useState<string | null>(null);
//   const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
//   const [isVerified, setIsVerified] = useState<boolean | null>(null);
//   const [emailaddress, setEmailAddress] = useState<string | null>(null);
//   const [roleCode, setRoleCode] = useState<string | null>(null);

//   const pathname = usePathname();
//   const router = useRouter();

//   useEffect(() => {
//     const key = localStorage.getItem("authKey") as string;
//     const name = localStorage.getItem("ClientName") as string;
//     const verified = localStorage.getItem("IsVerified") === "true";
//     const emailaddress = localStorage.getItem("EmailAddress") as string;
//     const RoleCode = localStorage.getItem("RoleCode");
//     setRoleCode(RoleCode);
//     setAuthKey(key);
//     setClientName(name);
//     setIsVerified(verified);
//     setEmailAddress(emailaddress);
//   }, []);

//   useEffect(() => {
//     const menuItemsFromStorage = localStorage.getItem("menuItems");
//     if (menuItemsFromStorage) {
//       try {
//         const parsedMenuItems = JSON.parse(menuItemsFromStorage);
//         setMenuItems(parsedMenuItems);
//       } catch (error) {
//         console.error("Failed to parse menuItems from localStorage:", error);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const checkScreenSize = () => {
//       setIsSmallScreen(window.innerWidth <= 1600);
//       setSidebarOpen(window.innerWidth > 1600);
//     };

//     checkScreenSize();
//     window.addEventListener("resize", checkScreenSize);

//     return () => window.removeEventListener("resize", checkScreenSize);
//   }, []);

//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

//   const toggleSection = (sectionId: string) => {
//     setExpandedSection(expandedSection === sectionId ? null : sectionId);
//   };

//   const renderChildDropdowns = (
//     childAccessLabels: MenuItem[] | null | undefined,
//     parentId: string
//   ) => {
//     if (!childAccessLabels) return null;
//     return (
//       <ul
//         className={`text-sm text-secondary ${
//           expandedSection === parentId ? "pl-16" : "hidden"
//         } ${isSmallScreen ? "pl-6" : "bg-surface"}`}
//       >
//         {childAccessLabels.map((child) => (
//           <li
//             key={child.Id}
//             className={`py-2 text-text hover:text-success ${
//               pathname.includes(child.Uri) ? "text-primary" : ""
//             }`}
//           >
//             <Link href={child.Uri} className="flex items-center">
//               <h1>{child.Name}</h1>
//             </Link>
//           </li>
//         ))}
//       </ul>
//     );
//   };

//   const getIcon = (iconName: string | null | undefined) => {
//     if (!iconName) return null;
//     const IconComponent =
//       iconName as keyof typeof import("@mui/icons-material");
//     const Icon = require("@mui/icons-material")[IconComponent];
//     return Icon ? <Icon /> : null;
//   };

//   const handleSectionClick = (section: MenuItem) => {
//     if (!isVerified) return;
//     if (section.ChildAccessLabels || section.Dropdowns) {
//       toggleSection(section.Id);
//     } else {
//       router.push(section.Uri);
//     }
//   };

//   const sectionItems = menuItems?.map((section) => (
//     <li
//       key={section.Id}
//       className={`w-full ${
//         pathname.includes(section.Uri) ? "text-primary" : ""
//       }`}
//     >
//       <div
//         className={`w-full flex items-center py-4 px-4 text-secondary hover:opacity-40 cursor-pointer ${
//           !isVerified ? "pointer-events-none opacity-50" : ""
//         }`}
//         onClick={() => handleSectionClick(section)}
//       >
//         <span className={`${sidebarOpen ? "mr-4 ml-8" : "mx-auto"}`}>
//           {getIcon(section.Icon)}
//         </span>
//         <h1 className={`${sidebarOpen ? "" : "hidden"}`}>{section.Name}</h1>
//         {(section.ChildAccessLabels || section.Dropdowns) && (
//           <span className="ml-auto">
//             {expandedSection === section.Id ? (
//               <KeyboardArrowUpRounded />
//             ) : (
//               <KeyboardArrowDownRounded />
//             )}
//           </span>
//         )}
//       </div>

//       {expandedSection === section.Id && isVerified && (
//         <>
//           {renderChildDropdowns(section.ChildAccessLabels, section.Id)}
//           {renderChildDropdowns(section.Dropdowns, section.Id)}
//         </>
//       )}

//       <hr
//         className={`w-5/6 mx-auto ${
//           pathname.includes(section.Uri) ? "border-primary" : "border-text"
//         }`}
//       />
//     </li>
//   ));

//   return (
//     <nav
//       className={`fixed md:static h-screen flex flex-col items-center justify-center z-40 text-text
//         ${sidebarOpen ? "w-64" : "w-32"}
//         ${!isVerified ? "pointer-events-none opacity-50" : ""}
//         transition-all duration-150 ease-linear`}
//     >
//       <div
//         className={`${
//           sidebarOpen ? "flex-row" : "flex-col"
//         } w-full mt-4 flex px-2 justify-between items-center`}
//       >
//         <div className="Logo flex-1">
//           {sidebarOpen ? (
//             <Link href="/dashboard">
//               <div className="flex gap-2 justify-center items-center mx-auto">
//                 <AdjustRounded className="text-primary text-4xl" />
//                 <h1 className="text-3xl font-black text-primary">FOCUS</h1>
//               </div>
//               {roleCode !== "USERROLE_SYSTEMADMIN" && (
//                 <div className="flex gap-2 justify-end pl-6 mt-4">
//                   <p className="text-xl text-primary font-bold">
//                     {ClientName || "NA"}
//                   </p>
//                 </div>
//               )}
//             </Link>
//           ) : (
//             <Link href="/dashboard">
//               <div className="flex gap-2 justify-center items-center mx-auto">
//                 <h1 className="text-3xl font-black text-primary"></h1>
//               </div>
//             </Link>
//           )}
//         </div>
//         <div
//           className={`hamburger ${
//             sidebarOpen ? "justify-end" : "justify-center"
//           }`}
//         >
//           <button
//             onClick={toggleSidebar}
//             className="cursor-pointer hover:text-secondary"
//           >
//             {sidebarOpen ? (
//               <MenuOpenRounded fontSize="large" />
//             ) : (
//               <MenuRounded fontSize="large" />
//             )}
//           </button>
//         </div>
//       </div>

//       <div className="contentDiv w-full flex-1 flex flex-col justify-between mt-20 mb-12">
//         <div className="w-full">
//           <ul>{sectionItems}</ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Sidebar;

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  KeyboardArrowUpRounded,
  KeyboardArrowDownRounded,
  MenuOpenRounded,
  MenuRounded,
  AdjustRounded,
} from "@mui/icons-material";

interface MenuItem {
  Id: string;
  Uri: string;
  Name: string;
  Icon?: string | null;
  SideBarDropdowns?: MenuItem[] | null;
  Dropdowns?: MenuItem[] | null;
}

const Sidebar = () => {
  const [authKey, setAuthKey] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[] | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [ClientName, setClientName] = useState<string | null>(null);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [emailaddress, setEmailAddress] = useState<string | null>(null);
  const [roleCode, setRoleCode] = useState<string | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const key = localStorage.getItem("authKey") as string;
    const name = localStorage.getItem("ClientName") as string;
    const verified = localStorage.getItem("IsVerified") === "true";
    const emailaddress = localStorage.getItem("EmailAddress") as string;
    const RoleCode = localStorage.getItem("RoleCode");
    setRoleCode(RoleCode);
    setAuthKey(key);
    setClientName(name);
    setIsVerified(verified);
    setEmailAddress(emailaddress);
  }, []);

  useEffect(() => {
    const menuItemsFromStorage = localStorage.getItem("menuItems");
    if (menuItemsFromStorage) {
      try {
        const parsedMenuItems = JSON.parse(menuItemsFromStorage);
        setMenuItems(parsedMenuItems);
      } catch (error) {
        console.error("Failed to parse menuItems from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 1600);
      setSidebarOpen(window.innerWidth > 1600);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const renderChildDropdowns = (
    childAccessLabels: MenuItem[] | null | undefined,
    parentId: string
  ) => {
    if (!childAccessLabels) return null;
    return (
      <ul
        className={`text-sm text-secondary ${
          expandedSection === parentId ? "pl-16" : "hidden"
        } ${isSmallScreen ? "pl-6" : "bg-surface"}`}
      >
        {childAccessLabels.map((child) => (
          <li
            key={child.Id}
            className={`py-2 text-text hover:text-success ${
              pathname.includes(child.Uri) ? "text-primary" : ""
            }`}
          >
            <Link href={child.Uri} className="flex items-center">
              <h1>{child.Name}</h1>
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  const getIcon = (iconName: string | null | undefined) => {
    if (!iconName) return null;
    const IconComponent =
      iconName as keyof typeof import("@mui/icons-material");
    const Icon = require("@mui/icons-material")[IconComponent];
    return Icon ? <Icon /> : null;
  };

  const handleSectionClick = (section: MenuItem) => {
    if (!isVerified) return;
    if (section.SideBarDropdowns || section.Dropdowns) {
      toggleSection(section.Id);
    } else {
      router.push(section.Uri);
    }
  };

  const sectionItems = menuItems?.map((section) => (
    <li
      key={section.Id}
      className={`w-full ${
        pathname.includes(section.Uri) ? "text-primary" : ""
      }`}
    >
      <div
        className={`w-full flex items-center py-4 px-4 text-secondary hover:opacity-40 cursor-pointer ${
          !isVerified ? "pointer-events-none opacity-50" : ""
        }`}
        onClick={() => handleSectionClick(section)}
      >
        <span className={`${sidebarOpen ? "mr-4 ml-8" : "mx-auto"}`}>
          {getIcon(section.Icon)}
        </span>
        <h1 className={`${sidebarOpen ? "" : "hidden"}`}>{section.Name}</h1>
        {(section.SideBarDropdowns || section.Dropdowns) && (
          <span className="ml-auto">
            {expandedSection === section.Id ? (
              <KeyboardArrowUpRounded />
            ) : (
              <KeyboardArrowDownRounded />
            )}
          </span>
        )}
      </div>

      {expandedSection === section.Id && isVerified && (
        <>
          {renderChildDropdowns(section.SideBarDropdowns, section.Id)}
          {renderChildDropdowns(section.Dropdowns, section.Id)}
        </>
      )}

      <hr
        className={`w-5/6 mx-auto ${
          pathname.includes(section.Uri) ? "border-primary" : "border-text"
        }`}
      />
    </li>
  ));

  return (
    <nav
      className={`fixed md:static h-screen flex flex-col items-center justify-center z-40 text-text
        ${sidebarOpen ? "w-64" : "w-32"}
        ${!isVerified ? "pointer-events-none opacity-50" : ""}
        transition-all duration-150 ease-linear`}
    >
      <div
        className={`${
          sidebarOpen ? "flex-row" : "flex-col"
        } w-full mt-4 flex px-2 justify-between items-center`}
      >
        <div className="Logo flex-1">
          {sidebarOpen ? (
            <Link href="/dashboard">
              <div className="flex gap-2 justify-center items-center mx-auto">
                <AdjustRounded className="text-primary text-4xl" />
                <h1 className="text-3xl font-black text-primary">FOCUS</h1>
              </div>
              {roleCode !== "USERROLE_SYSTEMADMIN" && (
                <div className="flex gap-2 justify-end pl-6 mt-4">
                  <p className="text-xl text-primary font-bold">
                    {ClientName || "NA"}
                  </p>
                </div>
              )}
            </Link>
          ) : (
            <Link href="/dashboard">
              <div className="flex gap-2 justify-center items-center mx-auto">
                <h1 className="text-3xl font-black text-primary"></h1>
              </div>
            </Link>
          )}
        </div>
        <div
          className={`hamburger ${
            sidebarOpen ? "justify-end" : "justify-center"
          }`}
        >
          <button
            onClick={toggleSidebar}
            className="cursor-pointer hover:text-secondary"
          >
            {sidebarOpen ? (
              <MenuOpenRounded fontSize="large" />
            ) : (
              <MenuRounded fontSize="large" />
            )}
          </button>
        </div>
      </div>

      <div className="contentDiv w-full flex-1 flex flex-col justify-between mt-20 mb-12">
        <div className="w-full">
          <ul>{sectionItems}</ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
