import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import RegisterForm from "../../components/auth/RegisterForm";

export default function Register() {
  return (
    <div
      className="min-h-screen flex flex-col justify-between text-white selection:bg-indigo-600 selection:text-white"
      style={{
        background: "linear-gradient(135deg, #090D1F 0%, #180B2B 50%, #0F172A 100%)",
      }}
    >
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <RegisterForm />
      </div>
      <Footer />
    </div>
  );
}

