import { FormEvent, useState } from "react";
import { apiRequest } from "../lib/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const data = await apiRequest<{ token: string; user: { name: string } }>("/auth/register", {
        method: "POST",
        body: { name, email, password }
      });
      localStorage.setItem("token", data.token);
      setMessage(`Account created for ${data.user.name}.`);
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  return (
    <section className="card" style={{ maxWidth: 420 }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Name"
          required
        />
        <input
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          required
        />
        <input
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          required
        />
        <button className="btn" type="submit">
          Register
        </button>
      </form>
      {message && <p>{message}</p>}
    </section>
  );
}
