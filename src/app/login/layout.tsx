
//src/app/login/layout.tsx
export default function LoginLayout({ children }: { children: React.ReactNode }) 
{
  return (
    <html lang="en">
      <body style={{ margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        {children}
      </body>
    </html>
  );
}
