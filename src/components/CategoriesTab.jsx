import React, { useRef } from 'react'
import { Link } from 'react-router-dom';
import useFetch from '../utilities/useFetch';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';



function CategoriesTab({ activeTab = null, isTopCategories = false }) {
    const containerRef = useRef();
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(true);
    const { data: items } = useFetch("https://grocery-store-server-theta.vercel.app/api/items");
    const [allCategories, setAllCategories] = useState([]);
    const [topCategories, setTopCategories] = useState(['Fruits', 'Vegetables', 'Snacks', 'Beverages', 'Meat']);


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
          .slice(0, 7)
          .map(([name]) => name);
        setTopCategories(sortedCategories);
            
        setAllCategories(Object.keys(categories));
        }
      }, [items]);


      

    
    
    
      const checkScroll = () => {
        const el = containerRef.current;
        if (!el) return;

        const maxScrollLeft = el.scrollWidth - el.clientWidth;
        setCanScrollPrev(el.scrollLeft > 1);
        setCanScrollNext(el.scrollLeft < maxScrollLeft - 5); // `-5` for precision
      };
    
    
    
      // Recheck on manual scroll or resize
      useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
    
        el.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);
        checkScroll(); // Initial check
    
        return () => {
          el.removeEventListener('scroll', checkScroll);
          window.removeEventListener('resize', checkScroll);
        };
      }, []);
    
      // Function to scroll the container
      const scroll = (direction) => {
        const container = containerRef.current;
        const itemWidth = container.offsetWidth;
        
        // Scroll the container by one item width
        container.scrollBy({ left: direction * itemWidth, behavior: 'smooth' });
      };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
      
        const firstItem = container.querySelector('.Item');
        if (!firstItem) return;
      
        let itemWidth = firstItem.offsetWidth + parseFloat(getComputedStyle(firstItem).marginRight || 0);
        let currentIndex = 0;
      
        const scrollOneItem = () => {
          if (!container) return;
      
          const maxIndex = Math.floor(container.scrollWidth / itemWidth) - Math.floor(container.offsetWidth / itemWidth);
      
          if (currentIndex >= maxIndex) {
            currentIndex = 0;
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            currentIndex++;
            container.scrollTo({ left: currentIndex * itemWidth, behavior: 'smooth' });
          }
        };
      
        const intervalId = setInterval(scrollOneItem, 5000);
      
        // Optional: Listen to window resize to remeasure item width
        const handleResize = () => {
          const newFirstItem = container.querySelector('.Item');
          if (newFirstItem) {
            itemWidth = newFirstItem.offsetWidth + parseFloat(getComputedStyle(newFirstItem).marginRight || 0);
          }
        };
      
        window.addEventListener('resize', handleResize);
      
        return () => {
          clearInterval(intervalId);
          window.removeEventListener('resize', handleResize);
        };
      }, []);

  return (
    <div className="position-relative p-2 py-3 mb-2 mt-2 container" >
    { canScrollPrev && <button className="carousel-nav shadow carousel-prev" onClick={() => scroll(-1)}><ChevronLeft /></button> }
    <div ref={containerRef} className="position-relative mt-2 mb-3 d-flex gap-4 overflow-auto" style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', scrollBehavior: 'smooth'}}>
        <Link to={`/store/All Categories`} key={'all-categories'} className="text-decoration-none item d-flex p-2 flex-column justify-content-start align-items-center" style={{ width: '160px', minWidth: '160px', aspectRatio: '1/1', scrollSnapType: 'x mandatory', scrollSnapStop: 'always', border: activeTab && activeTab === 'All Categories' ? '3px solid var(--primary-color)' : '2px solid transparent', borderRadius: '8px', scrollSnapAlign: 'start'}}>
            <img src={`/media/BorderAll.png`} alt={'all-categories'} width={'100%'} className="mb-2 object-fit-cover object-position-center p-3" style={{aspectRatio: '1/1'}} />
          <div className="3 text-black">
            All Categories
          </div>
        </Link>
      {(isTopCategories ? topCategories : allCategories || topCategories).map((category, index) => (
        <Link to={`/store/${category}`} key={index} className="text-decoration-none item d-flex p-2 flex-column justify-content-start align-items-center" style={{ width: '160px', minWidth: '160px', aspectRatio: '1/1', scrollSnapType: 'x mandatory', scrollSnapStop: 'always', border: activeTab && activeTab === category ? '3px solid var(--primary-color)' : '2px solid transparent', borderRadius: '8px', scrollSnapAlign: 'start'}}>
            <img src={`${items?.find(item => item.category === category)?.gallery[0]}`} alt={category} width={'100%'} className="mb-2 object-fit-cover object-position-center p-2" style={{aspectRatio: '1/1'}} />
          <div className="3 text-black">
            {category}
          </div>
        </Link>
      ))}
    </div>
    { canScrollNext && <button className="carousel-nav shadow carousel-next" onClick={() => scroll(1)}><ChevronRight /></button> }
    </div>
  )
}

export default CategoriesTab
