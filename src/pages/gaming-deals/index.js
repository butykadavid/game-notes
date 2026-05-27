import { useEffect, useState } from 'react';
import Head from 'next/head';
import { getGamePassData } from '@/public/APIHandler';
import Loader from '@/components/LoaderComponent';
import DealsGridCardComponent from '@/components/DealsGridCardComponent';
import pageStyles from '@/styles/gamingDeals.module.css';
import gridStyles from '@/styles/gaming-deals-grid.module.css';

const TAB_OPTIONS = [
  { key: 'recent', label: 'Recent' },
  { key: 'popular', label: 'Popular' },
  { key: 'eaplay', label: 'EA Play' },
  { key: 'uplay', label: 'Uplay+' },
];

export default function GamingDealsPage() {
  const [selectedCategory, setSelectedCategory] = useState('recent');
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getGamePassData(selectedCategory);
        setDeals(data || []);
      } catch (error) {
        console.error('Error fetching deals:', error);
        setDeals([]);
        setError('We could not load deals for that category right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [selectedCategory]);

  return (
    <>
      <Head>
        <title>Gaming Deals</title>
      </Head>
      <div className={pageStyles.container}>
        <div className={pageStyles.header}>
          <h1>Gaming Deals</h1>
          <p>Browse category-based Game Pass deals with quick actions for each title.</p>
        </div>

        <div className={pageStyles.tabBar} role="tablist" aria-label="Gaming deal categories">
          {TAB_OPTIONS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={selectedCategory === tab.key}
              className={`${pageStyles.tabButton} ${selectedCategory === tab.key ? pageStyles.activeTab : ''}`}
              onClick={() => setSelectedCategory(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={pageStyles.content}>
          {loading ? (
            <Loader />
          ) : error ? (
            <div className={pageStyles.stateBox}>{error}</div>
          ) : deals.length === 0 ? (
            <div className={pageStyles.stateBox}>No deals are available in this category yet.</div>
          ) : (
            <div className={gridStyles.gridContainer}>
              {deals.map((deal) => (
                <DealsGridCardComponent key={deal.title} game={deal} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
