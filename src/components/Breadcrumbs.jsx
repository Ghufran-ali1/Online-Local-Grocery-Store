// src/components/Breadcrumbs.jsx
import { useLocation, Link as RouterLink, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { ProductContext } from '../ProductContext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import useFetch from '../utilities/useFetch';



export default function AppBreadcrumbs() {
    const { itemStockNo } = useParams();
    const { data, loading, error } = useFetch(
      `https://grocery-store-server-theta.vercel.app/api/items${itemStockNo ? `/${itemStockNo}` : ''}`
    );
  const location = useLocation();
  const productName = useContext(ProductContext);

  const pathnames = location.pathname.split('/').filter(Boolean);

  const crumbs = pathnames.map((_, idx) => {
    const to = '/' + pathnames.slice(0, idx + 1).join('/');

    // Capitalise the segment as a fallback label
    let label = decodeURIComponent(pathnames[idx])
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());

    // If final segment and we have a product, override label
    if (idx === pathnames.length - 1 && productName) {
      label = productName;
    }
    if (label.startsWith('STK')) {
      label = <span style={{color: 'var(--text-light)'}}>{data?.name || 'Loading...'}</span>;
    }
    
    if (label === 'Login' || label === 'Signup') {
      label = <span style={{color: 'var(--text-light)'}}>{label}</span>;
    }
    if (label === ('Admin')) {
      label = 'Store Administrator';
    }

    return { to, label };
  });

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon  fontSize="small" />}
      aria-label="breadcrumb"
      className='container m-auto py-2 mb-2'
      sx={{ my: 1 }}
    >
      <Link
        component={RouterLink}
        className='text-decoration-none'
        color='rgb(var(--text-color))'
        to="/"
      >
        Home
      </Link>

      {crumbs.map((c, idx) =>
        idx === crumbs.length - 1 ? (
          <Typography color='rgb(var(--text-color))' key={c.to}>
            {c.label}
          </Typography>
        ) : (
          <Link
            component={RouterLink}
            className='text-decoration-none'
            color='rgb(var(--text-color))'
            to={c.to}
            key={c.to}
          >
            {c.label}
          </Link>
        )
      )}
    </Breadcrumbs>
  );
}
