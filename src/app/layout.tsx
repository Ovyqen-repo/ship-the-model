export const metadata = {
  title: "Astra — Ship the Model",
  description: "Streaming chat starter from Ship the Model, 2026 edition.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
          background: "#FAF6F0",
          color: "#1C1917",
        }}
      >
        {children}
      </body>
    </html>
  );
}
