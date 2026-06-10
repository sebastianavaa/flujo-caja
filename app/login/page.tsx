import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { loginWithGoogle } from "@/app/actions/auth";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div style={{
      minHeight: "100vh",
      background: "#09090b",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', system-ui, sans-serif",
    }}>
      <div style={{
        background: "#141416",
        border: "1px solid rgba(163,128,245,0.14)",
        borderRadius: 20,
        padding: "40px 36px",
        width: "100%",
        maxWidth: 360,
        textAlign: "center",
      }}>
        <div style={{ fontSize: 36, marginBottom: 16 }}>💳</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f4f4f5", marginBottom: 6, letterSpacing: "-0.03em" }}>
          Flujo de Caja
        </h1>
        <p style={{ fontSize: 13, color: "rgba(244,244,245,0.45)", marginBottom: 32 }}>
          Dashboard financiero personal
        </p>

        <form action={loginWithGoogle}>
          <button type="submit" style={{
            width: "100%",
            background: "#a380f5",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "14px 20px",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            letterSpacing: "-0.01em",
          }}>
            <GoogleIcon />
            Continuar con Google
          </button>
        </form>

        <p style={{ fontSize: 11, color: "rgba(244,244,245,0.2)", marginTop: 24 }}>
          Acceso restringido · solo uso personal
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#fff" fillOpacity=".9"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#fff" fillOpacity=".75"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#fff" fillOpacity=".6"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#fff" fillOpacity=".85"/>
    </svg>
  );
}
