export const metadata = {
  title: '審查會議流程自動化系統',
  description: 'Single Source of Truth 雲端全自動化工作站',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
