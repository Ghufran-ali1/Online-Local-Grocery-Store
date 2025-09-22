import { Badge, Collapse, IconButton, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import useFetch from '../utilities/useFetch';
import { useEffect, useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import List from '@mui/material/List';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CloseIcon from '@mui/icons-material/Close';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import { HomeOutlined } from '@mui/icons-material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import CategoryIcon from '@mui/icons-material/Category';





const style = {
  position: 'absolute',
  top: '100px',
  left: '50%',
  transform: 'translate(-50%)',
  width: '100%',
  maxWidth: 700,
  bgcolor: 'background.paper',
  boxShadow: 0,
  borderRadius: 4,
  p: 2,
};

function Header() {
    const [open, setOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [searching, setSearching] = useState(false);
    const [openWatchlist, setOpenWatchlist] = useState(false);
    const [openFavorites, setOpenFavorites] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const { data: items } = useFetch("https://grocery-store-server-theta.vercel.app/api/items");
    const [allCategories, setAllCategories] = useState([]);
    const [topCategories, setTopCategories] = useState(['Fruits', 'Vegetables', 'Snacks', 'Beverages', 'Meat']);
    const [searchResults, setSearchResults] = useState([]);
    const [search, setSearch] = useState("");
    const [watchlist, setWatchlist] = useState([]);
    const [favorites, setFavorites] = useState([]);


    useEffect(() => {
        const storedWatchlistItemsStockNumbers = JSON.parse(localStorage.getItem('watchlist')) || ['STK476591134199'];
        const mywatchlist = items?.filter(item => storedWatchlistItemsStockNumbers.includes(item.store_no));

        setWatchlist(mywatchlist || []);


        const storedFavoriteItemsStockNumbers = JSON.parse(localStorage.getItem('favorites')) || ['STK645723076665', 'STK476591134199'];
        const favorites = items?.filter(item =>
            storedFavoriteItemsStockNumbers.includes(item.store_no)
          );

        setFavorites(favorites);
    }, [items, localStorage.getItem('watchlist'), localStorage.getItem('favorites')]);
    

  useEffect(() => {
    if (items) {
      const categories = items
        ?.map(item => item.category)
        .reduce((acc, category) => {
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});
        const sortedCategories = Object.entries(categories)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name]) => name);
    setTopCategories(sortedCategories);
    setAllCategories(Object.keys(categories));
    }
  }, [items]);


  useEffect(() => {
    setSearching(true);

    if (search.trim() !== "" && items) {
      const searchResults = items.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase())
        || item.category.toLowerCase().includes(search.toLowerCase())
        || item.description.toLowerCase().includes(search.toLowerCase())
        || item.store_no.toLowerCase().includes(search.toLowerCase())
      );
      setTimeout(() => {
        setSearching(false);
        setSearchResults(searchResults);
      }, 1000);
    } else {
          setSearching(false);
          setSearchResults([]);
    }
  }, [search]);





const DrawerList = (
    <Box sx={{ width: 500 }} role="presentation">
      <List className='p-0'>
      <div className="d-flex border-bottom p-3 position-sticky bg-white justify-content-between align-items-center mb-2" style={{top: 0, zIndex: 10}}>
        <h5 className="mb-0 fw-bold">Watchlist</h5>
        <IconButton onClick={()=> setOpenWatchlist(false)} aria-label='close'>
          <CloseIcon />
        </IconButton>
      </div>

        {watchlist?.map((item) => (
          <ListItem key={item.id} className='px-3'>
              <div className='w-100 position-relative p-2 border rounded-3 mb-2 d-flex gap-2 align-items-center'>
                <img src={item.gallery[0]} alt={item.name} className='object-fit-cover me-2 object-position-center' style={{width: '150px', aspectRatio: '1/1'}} />
                <div className='w-100'>
                    <p className='fs-6 mb-0'>{item.name}</p>
                    <small style={{color: 'var(--text-light)'}}>{item.description} | {item.quantity} Remaining </small>
                    <div className='d-flex pt-2 small'>{item.stock && <span className='text-light rounded-3 p-1 px-3 small' style={{backgroundColor: 'green'}}>In stock &nbsp; <i className='bi bi-check-circle'></i></span>}</div>
                    <div className='d-flex gap-2 align-items-center'>
                        <button className='text-light w-100 rounded-3 p-1 px-3 bg-danger border-0 small'>Remove</button>
                        <IconButton className='position-relative rounded-pill' aria-label='favorites'>
                            <i className='bi bi-heart' style={{ lineHeight: '0' }}></i>
                        </IconButton>
                    </div>
                </div>
              </div>
          </ListItem>
        ))}
      </List>
      <p className='text-center py-3'>{watchlist?.length || 0} items found.</p>
    </Box>
  );
  
const FavoritesDrawerList = (
    <Box sx={{ width: 500 }} role="presentation">
      <List className='p-0'>
      <div className="d-flex border-bottom p-3 position-sticky bg-white justify-content-between align-items-center mb-2" style={{top: 0, zIndex: 10}}>
        <h5 className="mb-0 fw-bold">Favorites</h5>
        <IconButton onClick={()=> setOpenFavorites(false)} aria-label='close'>
          <CloseIcon />
        </IconButton>
      </div>

        {favorites?.map((item) => (
          <ListItem key={item.id} className='px-3'>
              <div className='w-100 position-relative p-2 border rounded-3 mb-2 d-flex gap-2 align-items-center'>
                <img src={item.gallery[0]} alt={item.name} className='object-fit-cover me-2 object-position-center' style={{width: '150px', aspectRatio: '1/1'}} />
                <div className='w-100'>
                    <p className='fs-6 mb-0'>{item.name}</p>
                    <small style={{color: 'var(--text-light)'}}>{item.description} | {item.quantity} Remaining </small>
                    <div className='d-flex pt-2 small'>{item.stock && <span className='text-light rounded-3 p-1 px-3 small' style={{backgroundColor: 'green'}}>In stock &nbsp; <i className='bi bi-check-circle'></i></span>}</div>
                    <div className='d-flex gap-2 align-items-center'>
                        <button className='text-light w-100 rounded-3 p-1 px-3 bg-danger border-0 small'>Remove</button>
                        <IconButton className='position-relative rounded-pill' aria-label='favorites'>
                            <i className='bi bi-eye' style={{ lineHeight: '0' }}></i>
                        </IconButton>
                    </div>
                </div>
              </div>
          </ListItem>
        ))}
      </List>
      <p className='text-center py-3'>{favorites?.length || 0} items found.</p>
    </Box>
  );

const menuDrawerList = (
    <Box sx={{ width: 400 }} role="presentation">
      <List className='p-0'>
      <div className="d-flex border-bottom p-3 position-sticky bg-white justify-content-between align-items-center mb-2" style={{top: 0, zIndex: 10}}>
        <h5 className="mb-0 fw-bold">Menu</h5>
        <IconButton onClick={()=> setOpenMenu(false)} aria-label='close'>
          <CloseIcon />
        </IconButton>
      </div>

    <Link onClick={() => setOpenMenu(false)} to="/" key={'home'} className='text-decoration-none'>
      <ListItemButton>
        <ListItemIcon>
          <HomeOutlined />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItemButton>
    </Link>

    <Link onClick={() => setOpenMenu(false)} to="/store" key={'store'} className='text-decoration-none'>
      <ListItemButton>
        <ListItemIcon>
          <ShoppingCartCheckoutIcon color='inherit'/>
        </ListItemIcon>
        <ListItemText primary="Store" />
      </ListItemButton>
    </Link>

      <ListItemButton onClick={() => setOpenDropdown(!openDropdown)}>
        <ListItemIcon>
          <FormatListBulletedIcon />
        </ListItemIcon>
        <ListItemText primary="Categories" />
        {openDropdown ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openDropdown} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>

            <Link to={`/store/all-categories`} key={'All Categories'} >
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <CategoryIcon />
                </ListItemIcon>
                <ListItemText primary={'All Categories'} />
              </ListItemButton>
            </Link>
          {
            allCategories.map((category) => (
            <Link onClick={() => setOpenMenu(false)} to={`/store/${category.toLowerCase().replace(/\s+/g, '-')}`} key={category} >
              <ListItemButton sx={{ pl: 4 }} key={category}>
                <ListItemIcon>
                  <CategoryIcon />
                </ListItemIcon>
                <ListItemText primary={category} />
              </ListItemButton>
            </Link>
            ))
          }
        </List>
      </Collapse>
      </List>
      <p className='text-center py-3'>&copy; All rights reserved 2025</p>
    </Box>
  );



  return (
    <div className="p-2 header position-sticky top-0 mb-2" style={{zIndex: 1000}}>
    <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>

          <form onSubmit={(e) => e.preventDefault()} id="subscription-form" className='d-flex gap-2 align-items-center justify-content-between border-bottom mb-3'>
            <i className='bi bi-search fs-5' style={{ lineHeight: '0' }}></i>
            <TextField
              autoFocus
              id="search"
              value={search}
                onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder='Search for products...'
              className='p-2 pt-1 border-0 outline-0'
              fullWidth
              variant="standard"
              InputProps={{
                disableUnderline: true,
            }}
            />
            <i role='button' onClick={() => setOpen(false)} className='bi bi-x-lg text-danger fs-5' style={{ lineHeight: '0' }}></i>
          </form>
          <div className='p-3 pt-2 border rounded-2' style={{ maxHeight: '700px', overflowY: 'auto' }}>
            {search.trim() !== "" && <h6 className='m-0' style={{color: 'var(--primary-light)'}}>Search results for <strong>"{search}"</strong></h6>}
            <div>

                        { searching ? [...Array(6)].map((_, index) => (
                                <div key={index} className='border-bottom w-100 rounded-3 mb-2 p-1 px-2 mt-0'>
                                        <p className="m-0 mb-1 fw-semibold"><span className="placeholder rounded-2 col-4 placeholder-glow"></span></p>
                                        <small  style={{color: 'var(--text-light)'}}><span className="placeholder rounded-1 col-3 placeholder-glow"></span> | <span className="placeholder rounded-1 col-2 placeholder-glow"></span> | <span className="placeholder rounded-1 col-2 placeholder-glow"></span></small>
                                </div>
                            )) : searchResults && searchResults.length > 0 ? (
                            Object.entries(
                                searchResults.reduce((acc, item) => {
                                    acc[item.category] = acc[item.category] || [];
                                    acc[item.category].push(item);
                                    return acc;
                                }, {})
                            ).map(([category, items]) => (
                                <div key={category} className="mb-3">
                                    <strong className="d-block mb-1 mt-3 text-uppercase" style={{color: 'var(--text-light)'}}>{category}</strong>
                                    {items.map(item => (
                                    <Link to={`/store/${item.category.toLowerCase().replace(/\s+/g, '-')}/${item.store_no}`} key={item.id} >
                                        <div className='border-bottom w-100 rounded-3 searchhover mb-2 p-1 px-2 mt-0'>
                                            <p className='m-0 mb-1 fw-semibold'>{item.name}</p>
                                            <small style={{color: 'var(--text-light)'}}>{item.description} | {item.quantity} Remaining | {item.stock && <span className='text-success'>In stock <i className='bi bi-check-circle'></i></span>}</small>
                                        </div>
                                    </Link>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <p className='text-center p-3 text-danger'>No results found!</p>
                        )}
            </div>

          </div>
          </Box>
        </Fade>
    </Modal>


      <SwipeableDrawer open={openMenu} anchor='right' onClose={() => setOpenMenu(false)}>
        {menuDrawerList}
      </SwipeableDrawer>

      <SwipeableDrawer open={openWatchlist} anchor='right' onClose={() => setOpenWatchlist(false)}>
        {DrawerList}
      </SwipeableDrawer>

      <SwipeableDrawer open={openFavorites} anchor='right' onClose={() => setOpenFavorites(false)}>
        {FavoritesDrawerList}
      </SwipeableDrawer>

        <nav className="container d-flex justify-content-between align-items-center mx-auto">
          <Link to="/">
            <img src="/media/logo.png" alt="Logo" height={35} />
          </Link>

          <ul className="list-unstyled mb-0 gap-3 d-none d-md-flex">
            <li><Link to="/store">Store</Link></li>
            <li><Link to="/store/all-categories">All Categories</Link></li>
            {
              topCategories?.map((category) => (
                <li key={category}>
                  <Link to={`/store/${category.toLowerCase().replace(/\s+/g, '-')}`}>{category.charAt(0).toUpperCase() + category.slice(1)}</Link>
                </li>
              ))
            }
          </ul>
          <div className='d-flex gap-2'>
            <IconButton onClick={() => setOpen(true)} className='position-relative rounded-pill' aria-label='favorites'>
              <i className='bi bi-search' style={{ lineHeight: '0' }}></i>
            </IconButton>
            <IconButton onClick={() => setOpenWatchlist(true)} className='position-relative rounded-pill' aria-label='watchlist'>
              <Badge badgeContent={watchlist?.length || 0} color="error" overlap="circular">
                <i className='bi bi-eye' style={{ lineHeight: '0' }}></i>
              </Badge>
            </IconButton>
            <IconButton onClick={() => setOpenFavorites(true)} className='position-relative rounded-pill' aria-label='favorites'>
              <Badge badgeContent={favorites?.length || 0} color="error" overlap="circular">
                <i className='bi bi-heart' style={{ lineHeight: '0' }}></i>
              </Badge>
            </IconButton>
            <IconButton onClick={() => setOpenMenu(true)} className='position-relative rounded-pill' aria-label='menu'>
              <i className='bi bi-list' style={{ lineHeight: '0' }}></i>
            </IconButton>
          </div>
        </nav>
    </div>
  );
}

export default Header;