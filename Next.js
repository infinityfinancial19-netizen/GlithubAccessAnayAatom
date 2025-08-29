// HumminGhome Frontend (Next.js + Tailwind)

// package.json
{
  "name": "humminghome-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.4",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "axios": "1.6.8"
  },
  "devDependencies": {
    "autoprefixer": "10.4.19",
    "postcss": "8.4.38",
    "tailwindcss": "3.4.4"
  }
}

// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};
module.exports = nextConfig;

// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

// styles/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

body { @apply bg-slate-50 text-slate-900; }

// lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

export const createRequest = async (payload) => {
  const { data } = await api.post("/requests", payload);
  return data;
};

export const listRequests = async () => {
  const { data } = await api.get("/requests");
  return data;
};

// components/Navbar.jsx
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-indigo-600">HumminGhome</Link>
        <nav className="flex gap-4 text-sm">
          <Link className="hover:text-indigo-600" href="/">Home</Link>
          <Link className="hover:text-indigo-600" href="/create-request">Create Request</Link>
          <Link className="hover:text-indigo-600" href="/requests">View Requests</Link>
        </nav>
      </div>
    </header>
  );
}

// components/RequestCard.jsx
export default function RequestCard({ customer, appliance, details, hash }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{customer || "Anonymous"}</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">{appliance || "—"}</span>
      </div>
      <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{details}</p>
      {hash && (
        <p className="mt-3 text-[11px] text-slate-500 break-all">Hash: {hash}</p>
      )}
    </div>
  );
}

// pages/_app.js
import "../styles/globals.css";
import Navbar from "../components/Navbar";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Component {...pageProps} />
      </main>
    </>
  );
}

// pages/index.js
import Link from "next/link";

export default function Home() {
  return (
    <section className="text-center">
      <h1 className="text-4xl font-bold tracking-tight">Home Appliance Service Requests</h1>
      <p className="mt-3 text-slate-600">Create and track service requests for repairs, installations, and maintenance.</p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Link href="/create-request" className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">Create Request</Link>
        <Link href="/requests" className="inline-flex items-center justify-center rounded-xl border px-4 py-2 hover:bg-slate-100">View Requests</Link>
      </div>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border bg-white p-4 text-left">
          <h3 className="font-semibold">Repairs</h3>
          <p className="text-sm text-slate-600">Washing machines, refrigerators, ACs, and more.</p>
        </div>
        <div className="rounded-2xl border bg-white p-4 text-left">
          <h3 className="font-semibold">Installations</h3>
          <p className="text-sm text-slate-600">New appliances installed safely and quickly.</p>
        </div>
        <div className="rounded-2xl border bg-white p-4 text-left">
          <h3 className="font-semibold">Maintenance</h3>
          <p className="text-sm text-slate-600">Annual service plans to extend appliance life.</p>
        </div>
      </div>
    </section>
  );
}

// pages/create-request.js
import { useState } from "react";
import { createRequest } from "../lib/api";

export default function CreateRequest() {
  const [customer, setCustomer] = useState("");
  const [appliance, setAppliance] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await createRequest({ customer, appliance, details });
      setSuccess(`Request submitted. Hash: ${res.hash || ""}`);
      setCustomer("");
      setAppliance("");
      setDetails("");
    } catch (err) {
      setError("Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold">Create Service Request</h1>
      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium">Customer Name</label>
          <input className="mt-1 w-full rounded-xl border px-3 py-2" value={customer} onChange={(e)=>setCustomer(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium">Appliance Type</label>
          <input className="mt-1 w-full rounded-xl border px-3 py-2" value={appliance} onChange={(e)=>setAppliance(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium">Request Details</label>
          <textarea className="mt-1 w-full rounded-xl border px-3 py-2 h-32" value={details} onChange={(e)=>setDetails(e.target.value)} required />
        </div>
        <button disabled={loading} className="rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50">{loading ? "Submitting..." : "Submit"}</button>
      </form>
      {success && <p className="mt-4 text-green-600 text-sm">{success}</p>}
      {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
    </section>
  );
}

// pages/requests.js
import useSWR from "swr";
import { listRequests } from "../lib/api";
import RequestCard from "../components/RequestCard";

const fetcher = async () => await listRequests();

export default function Requests() {
  const { data, error, isLoading, mutate } = useSWR("/requests", fetcher, { refreshInterval: 10000 });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Failed to load requests</p>;

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">All Requests</h1>
        <button onClick={()=>mutate()} className="rounded-xl border px-3 py-2 hover:bg-slate-100">Refresh</button>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {(data || []).map((r, idx) => (
          <RequestCard key={r.hash || idx} customer={r.customer} appliance={r.appliance} details={r.details} hash={r.hash} />
        ))}
      </div>
    </section>
  );
}

// .env.local (create in project root)
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
