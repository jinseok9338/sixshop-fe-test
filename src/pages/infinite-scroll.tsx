import Link from 'next/link';
import type { NextPage } from 'next';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import ProductList from '../components/ProductList';

import useFetch from '../hooks/useScroll';
import { useRouter } from 'next/router';

interface InfiniteScrollPageProps {
  page: string;
}

const InfiniteScrollPage: NextPage<InfiniteScrollPageProps> = () => {
  const [page, setPage] = useState(1);
  const { loading, error, products } = useFetch(16, page);

  const loader = useRef(null);

  const handleObserver = useCallback((entries: any) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, []);

  //on popstate event, add event listener to the back button

  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // if the url is /products/[id], persists the page number
      if (url.includes('/products/')) {
      }
    };
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, []);

  return (
    <>
      <Container>
        <ProductList products={products} />
        <div ref={loader} />
      </Container>
    </>
  );
};

export default InfiniteScrollPage;

const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px 40px;
`;
