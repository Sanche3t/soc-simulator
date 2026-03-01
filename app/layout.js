import '../styles/globals.css';

export const metadata = {
  title: 'SecureOps Training Platform',
  description: 'SOC Analyst Training Simulator',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
