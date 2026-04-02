const fs = require('fs');
const path = require('path');

const menu = {
  Students: ['Add Student', 'Student List', 'Student Profile', 'Enrollment / Admission', 'Bulk Import'],
  Staff: ['Add Teacher', 'Teacher List', 'Assign Subjects', 'Staff Attendance'],
  Academic: ['Classes / Grades', 'Subjects', 'Curriculum', 'Academic Year Setup'],
  Attendance: ['Student Attendance', 'Teacher Attendance', 'Attendance Reports'],
  Fees: ['Fee Structure', 'Generate Invoices', 'Payments', 'Pending Fees', 'Receipts'],
  Exams: ['Exam Schedule', 'Marks Entry', 'Results', 'Report Cards'],
  Timetable: ['Class Timetable', 'Teacher Timetable', 'Room Allocation'],
  Communication: ['Notices', 'Email / SMS Send', 'Parent Messages'],
  Parents: ['Parent List', 'Link Student', 'Parent Portal Access'],
  Documents: ['Upload Documents', 'Certificates', 'Download Center'],
  Reports: ['Attendance Reports', 'Academic Reports', 'Financial Reports', 'Export PDF/Excel'],
  Administration: ['Users', 'Roles & Permissions', 'System Settings', 'Branch / School Setup']
};

const toCamelCase = str => str.replace(/[^A-Za-z0-9]/g, ' ').split(' ').filter(p => p).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
const toPath = str => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const basePath = path.join('frontend', 'src', 'pages');

let importsCode = '';
let routesCode = '';

let navItemsCode = 'const navItems: NavItem[] = [\n';
navItemsCode += '  {\n    icon: <GridIcon />,\n    name: "Dashboard",\n    subItems: [{ name: "Home", path: "/dashboard", pro: false }],\n  },\n';

for (const [folder, items] of Object.entries(menu)) {
  const folderName = toCamelCase(folder);
  const fullFolderPath = path.join(basePath, folderName);
  
  if (!fs.existsSync(fullFolderPath)) fs.mkdirSync(fullFolderPath, { recursive: true });
  
  navItemsCode += '  { name: "' + folder + '", icon: <PageIcon />, subItems: [\n';

  for (const item of items) {
    let compName = toCamelCase(item);
    if (folder === 'Reports' && item === 'Attendance Reports') compName = 'Reports' + compName; 

    const itemPath = '/' + toPath(folder) + '/' + toPath(item);
    const fullFilePath = path.join(fullFolderPath, compName + '.tsx');
    
    // Blank.tsx matching template
    const compCode = `import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

export default function ${compName}() {
  return (
    <div>
      <PageMeta
        title="${item} | Student Management System"
        description="${item} page for Student Management System"
      />
      <PageBreadcrumb pageTitle="${item}" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            ${item}
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
            Start putting content on grids or panels, you can also use different combinations of grids.
          </p>
        </div>
      </div>
    </div>
  );
}
`;

    fs.writeFileSync(fullFilePath, compCode);

    importsCode += 'import ' + compName + ' from \'./pages/' + folderName + '/' + compName + '\';\n';
    routesCode += '            <Route path=\"' + itemPath + '\" element={<' + compName + ' />} />\n';
    navItemsCode += '    { name: "' + item + '", path: "' + itemPath + '", pro: false },\n';
  }
  
  navItemsCode += '  ]},\n';
}

navItemsCode += '];\n';

fs.writeFileSync('generated_routes_output.txt', importsCode + '\n===== ROUTES =====\n' + routesCode + '\n===== NAV ITEMS =====\n' + navItemsCode);
console.log('Folders and Custom Blank Templates Created Successfully! Open generated_routes_output.txt for the code.');
