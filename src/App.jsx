import './App.css';
import PageNotFound from './pages/PageNotFound';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Store from './pages/Store';
import Category from './pages/Category';
import Product from './pages/Product';
import Layout from './Layout';
import ProductProvider from './ProductProvider';
import AdminPage from './pages/AdminPage';
import AdminSignupPage from './pages/AdminSignupPage';
import AdminLoginPage from './pages/AdminLoginPage';
import { AdminContext } from './AdminContext';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/store" element={<Store />} />
          <Route path="/store/:category" element={<Category />} />
          <Route
            path="/store/:category/:itemStockNo"
            element={
              <ProductProvider>
                <Product />
              </ProductProvider>
            }
          />
          <Route path="/admin" element={
            <AdminContext>
              <AdminPage />
            </AdminContext>
          } />
          <Route path="/admin/signup" element={
            <AdminContext>
              <AdminSignupPage />
            </AdminContext>
          } />
          <Route path="/admin/login" element={
            <AdminContext>
              <AdminLoginPage />
            </AdminContext>
          } />
          <Route path="/*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
