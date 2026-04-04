import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import { BoxCubeIcon, ChevronDownIcon, GridIcon, HorizontaLDots, PageIcon, PieChartIcon, PlugInIcon } from "../icons";
import { useSidebar } from "../context/SidebarContext";
type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  roles?: string[]; // Allowed roles for this item
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean; roles?: string[] }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/dashboard",
    roles: ["admin", "teacher", "student"],
  },
  {
    name: "Students",
    icon: <PageIcon />,
    roles: ["admin", "teacher"],
    subItems: [
      { name: "Add Student", path: "/students/add-student", pro: false, roles: ["admin"] },
      { name: "Student List", path: "/students/student-list", pro: false },
      { name: "Enrollment / Admission", path: "/students/enrollment-admission", pro: false, roles: ["admin"] },
      { name: "Bulk Import", path: "/students/bulk-import", pro: false, roles: ["admin"] },
    ],
  },
  {
    name: "Staff",
    icon: <PageIcon />,
    roles: ["admin", "teacher"],
    subItems: [
      { name: "Add Teacher", path: "/staff/add-teacher", pro: false, roles: ["admin"] },
      { name: "Teacher List", path: "/staff/teacher-list", pro: false },
      { name: "Assign Subjects", path: "/staff/assign-subjects", pro: false, roles: ["admin"] },
      { name: "Staff Attendance", path: "/staff/staff-attendance", pro: false, roles: ["admin"] },
    ],
  },
  {
    name: "Academic",
    icon: <PageIcon />,
    roles: ["admin"],
    subItems: [
      { name: "Classes / Grades", path: "/academic/classes-grades", pro: false },
      { name: "Subjects", path: "/academic/subjects", pro: false },
      { name: "Curriculum", path: "/academic/curriculum", pro: false },
      { name: "Academic Year Setup", path: "/academic/academic-year-setup", pro: false },
    ],
  },
  {
    name: "Attendance",
    icon: <PageIcon />,
    roles: ["admin", "teacher"],
    subItems: [
      { name: "Student Attendance", path: "/attendance/student-attendance", pro: false },
      { name: "Teacher Attendance", path: "/attendance/teacher-attendance", pro: false, roles: ["admin"] },
      { name: "Attendance Reports", path: "/attendance/attendance-reports", pro: false },
    ],
  },
  {
    name: "Fees",
    icon: <PageIcon />,
    roles: ["admin"],
    subItems: [
      { name: "Fee Structure", path: "/fees/fee-structure", pro: false },
      { name: "Generate Invoices", path: "/fees/generate-invoices", pro: false },
      { name: "Payments", path: "/fees/payments", pro: false },
      { name: "Pending Fees", path: "/fees/pending-fees", pro: false },
      { name: "Receipts", path: "/fees/receipts", pro: false },
    ],
  },
  {
    name: "Exams",
    icon: <PageIcon />,
    roles: ["admin", "teacher", "student"],
    subItems: [
      { name: "Exam Schedule", path: "/exams/exam-schedule", pro: false, roles: ["admin", "teacher"] },
      { name: "Marks Entry", path: "/exams/marks-entry", pro: false, roles: ["admin", "teacher"] },
      { name: "Results", path: "/exams/results", pro: false },
      { name: "Report Cards", path: "/exams/report-cards", pro: false },
    ],
  },
  {
    name: "Timetable",
    icon: <PageIcon />,
    roles: ["admin", "teacher", "student"],
    subItems: [
      { name: "Class Timetable", path: "/timetable/class-timetable", pro: false, roles: ["admin"] },
      { name: "Teacher Timetable", path: "/timetable/teacher-timetable", pro: false, roles: ["admin", "teacher"] },
      { name: "Room Allocation", path: "/timetable/room-allocation", pro: false, roles: ["admin"] },
    ],
  },
  {
    name: "Communication",
    icon: <PageIcon />,
    roles: ["admin", "teacher"],
    subItems: [
      { name: "Notices", path: "/communication/notices", pro: false },
      { name: "Email / SMS Send", path: "/communication/email-sms-send", pro: false, roles: ["admin"] },
      { name: "Parent Messages", path: "/communication/parent-messages", pro: false },
    ],
  },
  {
    name: "Parents",
    icon: <PageIcon />,
    roles: ["admin"],
    subItems: [
      { name: "Parent List", path: "/parents/parent-list", pro: false },
      { name: "Link Student", path: "/parents/link-student", pro: false },
      { name: "Parent Portal Access", path: "/parents/parent-portal-access", pro: false },
    ],
  },
  {
    name: "Documents",
    icon: <PageIcon />,
    roles: ["admin", "teacher", "student"],
    subItems: [
      { name: "Upload Documents", path: "/documents/upload-documents", pro: false, roles: ["admin", "teacher"] },
      { name: "Certificates", path: "/documents/certificates", pro: false, roles: ["admin", "teacher"] },
      { name: "Download Center", path: "/documents/download-center", pro: false },
    ],
  },
  {
    name: "Reports",
    icon: <PageIcon />,
    roles: ["admin", "teacher"],
    subItems: [
      { name: "Attendance Reports", path: "/reports/attendance-reports", pro: false },
      { name: "Academic Reports", path: "/reports/academic-reports", pro: false },
      { name: "Financial Reports", path: "/reports/financial-reports", pro: false, roles: ["admin"] },
      { name: "Export PDF/Excel", path: "/reports/export-pdf-excel", pro: false, roles: ["admin"] },
    ],
  },
  {
    name: "Administration",
    icon: <PageIcon />,
    roles: ["admin"],
    subItems: [
      { name: "Users", path: "/administration/create-user", pro: false },
      { name: "Roles & Permissions", path: "/administration/roles-permissions", pro: false },
      { name: "System Settings", path: "/administration/system-settings", pro: false },
      { name: "Branch / School Setup", path: "/administration/branch-school-setup", pro: false },
    ],
  },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Charts",
    roles: ["admin"],
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    roles: ["admin"],
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    roles: ["admin"],
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user.role || "student"; // Default to student if not found

  // Filter items based on role - Stable references with useMemo
  const filteredNavItems = useMemo(() => 
    navItems
      .filter((item) => !item.roles || item.roles.includes(userRole))
      .map((item) => ({
        ...item,
        subItems: item.subItems?.filter((sub) => !sub.roles || sub.roles.includes(userRole)),
      })),
    [userRole]
  );

  const filteredOthersItems = useMemo(() => 
    othersItems
      .filter((item) => !item.roles || item.roles.includes(userRole))
      .map((item) => ({
        ...item,
        subItems: item.subItems?.filter((sub) => !sub.roles || sub.roles.includes(userRole)),
      })),
    [userRole]
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  useEffect(() => {
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? filteredNavItems : filteredOthersItems;
      items.forEach((nav: NavItem, index: number) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem: { path: string }) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
            }
          });
        }
      });
    });
  }, [location.pathname, isActive, filteredNavItems, filteredOthersItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu && prevOpenSubmenu.type === menuType && prevOpenSubmenu.index === index) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "menu-item-active" : "menu-item-inactive"} cursor-pointer ${
                !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link to={nav.path} className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}>
                <span className={`menu-item-icon-size ${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height: openSubmenu?.type === menuType && openSubmenu?.index === index ? `${subMenuHeight[`${menuType}-${index}`]}px` : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link to={subItem.path} className={`menu-dropdown-item ${isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`}>
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span className={`ml-auto ${isActive(subItem.path) ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"} menu-dropdown-badge`}>
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span className={`ml-auto ${isActive(subItem.path) ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"} menu-dropdown-badge`}>
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img className="dark:hidden" src="/images/logo/logo.svg" alt="Logo" width={150} height={40} />
              <img className="hidden dark:block" src="/images/logo/logo-dark.svg" alt="Logo" width={150} height={40} />
            </>
          ) : (
            <img src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
                {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots className="size-6" />}
              </h2>
              {renderMenuItems(filteredNavItems, "main")}
            </div>
            <div className="">
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
                {isExpanded || isHovered || isMobileOpen ? "Others" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(filteredOthersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
