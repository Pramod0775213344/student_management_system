import { Link } from "react-router";

// Breadcrumb eke path ekata ona data tika 
interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  pageTitle: string;
  items?: BreadcrumbItem[]; // Optional items list eka multi-level breadcrumbs walata
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle, items = [] }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        {pageTitle}
      </h2>
      <nav>
        <ol className="flex items-center gap-1.5 text-sm">
          {/* Default Home link eka */}
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-gray-500 hover:text-brand-500 transition-colors dark:text-gray-400 dark:hover:text-brand-400"
              to="/"
            >
              Home
              <svg
                className="stroke-current"
                width="16"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>

          {/* Additional items (e.g. Student List) multi-level breadcrumbs walata */}
          {items.map((item, index) => (
            <li key={index}>
              {item.path ? (
                <Link
                  className="inline-flex items-center gap-1.5 text-gray-500 hover:text-brand-500 transition-colors dark:text-gray-400 dark:hover:text-brand-400"
                  to={item.path}
                >
                  {item.label}
                  <svg
                    className="stroke-current"
                    width="16"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                  >
                    <path
                      d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
              )}
            </li>
          ))}

          {/* Current page title eka anthimata pennawa */}
          <li className="font-bold text-gray-900 dark:text-white">
            {pageTitle}
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
