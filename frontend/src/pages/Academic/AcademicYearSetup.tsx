import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

export default function AcademicYearSetup() {
  return (
    <div>
      <PageMeta
        title="Academic Year Setup | EduSphere"
        description="Academic Year Setup page for EduSphere"
      />
      <PageBreadcrumb pageTitle="Academic Year Setup" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Academic Year Setup
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
            Start putting content on grids or panels, you can also use different combinations of grids.
          </p>
        </div>
      </div>
    </div>
  );
}
