import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="React.js SignIn Dashboard | EduSphere - Student Management System"
        description="This is React.js SignIn Tables Dashboard page for EduSphere - Student Management System"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
