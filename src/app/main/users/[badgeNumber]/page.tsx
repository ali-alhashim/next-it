'use client';
// src/app/main/users/[badge]/page.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { Image, ImageFit } from '@fluentui/react/lib/Image';
import { Spinner } from '@fluentui/react/lib/Spinner';

type User = {
  name: string;
  email: string;
  badgeNumber: string;
  role: string;
  photo?: string;
};

const UserDetails = () => {
  const { badgeNumber } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${badgeNumber}`, { credentials: 'include' });
        if (!res.ok) throw new Error('User not found');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (badgeNumber) {
      fetchUser();
    }
  }, [badgeNumber]);

  if (loading) return <Spinner label="Loading user..." />;
  if (!user) return <Text variant="large">User not found.</Text>;

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: 32, maxWidth: 600 } }}>
      <Text variant="xxLarge">User Details</Text>
      {user.photo && (
        <Image
          src={"/api/"+user.photo}
          width={100}
          height={100}
          imageFit={ImageFit.cover}
          styles={{ root: { borderRadius: '50%' } }}
        />
      )}
      <Text variant="large"><strong>Name:</strong> {user.name}</Text>
      <Text variant="large"><strong>Email:</strong> {user.email}</Text>
      <Text variant="large"><strong>Badge Number:</strong> {user.badgeNumber}</Text>
      <Text variant="large"><strong>Role:</strong> {user.role}</Text>
    </Stack>
  );
};

export default UserDetails;
