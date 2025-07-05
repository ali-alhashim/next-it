//src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { TextField } from '@fluentui/react/lib/TextField';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [badgeNumber, setBadgeNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ badgeNumber, password }),
    });

    if (res.ok) {
      router.push('/');
    } else {
      const err = await res.json();
      setError(err.message || 'Login failed');
    }
  };

  return (
    <main style={{ maxWidth: 400, margin: '80px auto', padding: 20 }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Login to Next-IT</h1>

      <TextField
        label="Badge Number"
        value={badgeNumber}
        onChange={(e, val) => setBadgeNumber(val || '')}
        required
      />
      <TextField
        label="Password"
        type="password"
        canRevealPassword
        value={password}
        onChange={(e, val) => setPassword(val || '')}
        required
      />

      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}

      <PrimaryButton
        text="Login"
        onClick={handleLogin}
        style={{ marginTop: 20 }}
      />
    </main>
  );
}
