// Layout.jsx
import { Outlet, useLocation } from 'react-router-dom';
import AppBreadcrumbs from './components/Breadcrumbs';
import Header from './components/Header';
import Footer from './components/Footer';

export default function Layout() {
  const { pathname } = useLocation();

  // Hide breadcrumb on home page
  const hideBreadcrumb = pathname === '/';

  return (
    <>
      <Header />
      <div>
        {!hideBreadcrumb && <AppBreadcrumbs />}
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
