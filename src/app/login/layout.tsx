
//src/app/login/layout.tsx
export default function LoginLayout({ children }: { children: React.ReactNode }) 
{
  return (
   
      <div style={{ margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        {children}
      </div>
   
  );
}
