'use client';

import { useState, useId } from 'react';
import { TextField } from '@fluentui/react/lib/TextField';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [badgeNumber, setBadgeNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const badgeId = useId();
  const passId = useId();
  const router = useRouter();

  const handleLogin = async () => {
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
     
      badgeNumber: badgeNumber, 
      password,
    });

     console.log('signIn response:', res);

    if (res?.error) {
      setError(res.error);
    } else if (res?.ok) {
      router.push('/main');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '90vh',
        minWidth: '90vw',
        background: '#f3f2f1',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: 'white',
          padding: 32,
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          maxWidth: 400,
          width: '100%',
        }}
      >
        <h1 style={{ fontSize: 24, marginBottom: 20, textAlign: 'center' }}>
          Login to Next-IT
        </h1>

        <Stack tokens={{ childrenGap: 15 }}>
          <TextField
            id={badgeId}
            label="Badge Number"
            value={badgeNumber}
            onChange={(e, val) => setBadgeNumber(val || '')}
            required
          />
          <TextField
            id={passId}
            label="Password"
            type="password"
            canRevealPassword
            value={password}
            onChange={(e, val) => setPassword(val || '')}
            required
          />

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <PrimaryButton text="Login" onClick={handleLogin} />
        </Stack>
      </div>
    </div>
  );
}
