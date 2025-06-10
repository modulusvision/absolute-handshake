"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Handshake } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [handshakeMessage, setHandshakeMessage] = useState("");
  const [handshakes, setHandshakes] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (user) fetchHandshakes();
  }, [user]);

  const fetchHandshakes = async () => {
    const { data, error } = await supabase
      .from("handshakes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!error) setHandshakes(data);
  };

  const handleAuth = async () => {
    const fn = isLogin ? supabase.auth.signInWithPassword : supabase.auth.signUp;
    const { data, error } = await fn({ email, password });
    if (error) return alert(error.message);
    setUser(data.user);
    alert(`${isLogin ? "Logged in" : "Signed up"} as ${email}`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setEmail("");
    setPassword("");
  };

  const handleHandshake = async () => {
    if (!handshakeMessage) return alert("Enter a handshake message.");
    const { error } = await supabase.from("handshakes").insert({
      user_id: user.id,
      message: handshakeMessage,
    });
    if (!error) {
      setHandshakeMessage("");
      fetchHandshakes();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Handshake className="text-blue-600 w-6 h-6" />
          <span className="text-xl font-bold text-gray-800">
            Absolute <span className="text-blue-600">Handshake</span>
          </span>
        </div>
        <div className="space-x-4">
          <a href="#home" className="text-gray-600 hover:text-blue-600">Home</a>
          <a href="#about" className="text-gray-600 hover:text-blue-600">About</a>
          <a href="#contact" className="text-gray-600 hover:text-blue-600">Contact</a>
        </div>
      </nav>

      {!user && (
        <section className="p-6 bg-white mt-10 rounded-lg shadow max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {isLogin ? "Login" : "Sign Up"}
          </h2>
          <div className="space-y-4">
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full" onClick={handleAuth}>
              {isLogin ? "Login" : "Sign Up"}
            </Button>
            <p className="text-center text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button className="text-blue-600 hover:underline" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </div>
        </section>
      )}

      {user && (
        <section className="p-6 bg-white mt-10 rounded-lg shadow max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome, {user.email.split("@")[0]} 👋</h2>
          <div className="space-y-4 mb-6">
            <Input placeholder="Enter handshake message..." value={handshakeMessage} onChange={(e) => setHandshakeMessage(e.target.value)} />
            <Button className="bg-green-600 hover:bg-green-700 text-white w-full" onClick={handleHandshake}>
              Send Handshake
            </Button>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Your Handshakes</h3>
            {handshakes.length > 0 ? (
              <ul className="space-y-2">
                {handshakes.map((h) => (
                  <li key={h.id} className="bg-gray-100 p-2 rounded-lg shadow text-sm">
                    {h.message} <span className="text-xs text-gray-500">({new Date(h.created_at).toLocaleString()})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No handshakes yet.</p>
            )}
          </div>
          <Button variant="outline" onClick={handleLogout}>Log Out</Button>
        </section>
      )}

      <section id="about" className="p-6 bg-white mt-10 rounded-lg shadow max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">About Us</h2>
        <p className="text-gray-600">
          Absolute Handshake is a platform built to bring integrity to digital agreements.
          We provide a trusted space for users to initiate, verify, and record commitments.
        </p>
      </section>

      <section id="contact" className="p-6 bg-white mt-10 rounded-lg shadow max-w-3xl mx-auto mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
        <p className="text-gray-600 mb-2">Email: contact@absolutehandshake.com</p>
        <p className="text-gray-600">Phone: +234 123 456 7890</p>
      </section>
    </div>
  );
}
